import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import { getCurrentYear } from '@/app/lib/year'
import { StatusCodes } from 'http-status-codes'
import { lodash } from 'lodash'
import { getSideIndex, SIDE_LEFT, SIDE_RIGHT } from '@/constants/encounter'

export async function GET () {
  const connection = await getConnection()
  const currentYear = await getCurrentYear()

  const [teamPlayers] = await connection.execute(`
    SELECT
      tt.id,
      tp.id as playerId
      FROM tennisTeam tt
      left join tennisPlayer tp on tt.id = tp.teamId and tp.yearId = :yearId
        WHERE tt.yearId = :yearId
  `, {
    yearId: currentYear.id
  })

  let playerIdsByTeamId = lodash.groupBy(teamPlayers, 'id')
  playerIdsByTeamId = lodash.mapValues(playerIdsByTeamId, function (value) {
    return lodash.map(value, 'playerId')
  })

  const [encounterFixtures] = await connection.execute(`
    SELECT
      te.fixtureId,
               tf.teamIdLeft,
               tf.teamIdRight,
        te.playerIdLeft,
    te.playerIdRight
      FROM tennisEncounter te
      left join tennisFixture tf on te.fixtureId = tf.id and tf.yearId = :yearId
        WHERE te.yearId = :yearId
  `, {
    yearId: currentYear.id
  })

  if (!encounterFixtures) {
    return NextResponse.json({
      players: []
    }, { status: StatusCodes.OK })
  }

  const encountersByFixture = lodash.groupBy(encounterFixtures, 'fixtureId')

  const playerIdsByFixtureId = lodash.mapValues(encountersByFixture, function (encounters) {
    const playerIdsLeft = lodash.map(encounters, 'playerIdLeft').filter(function (value) {
      return value !== null
    })
    const playerIdsRight = lodash.map(encounters, 'playerIdRight').filter(function (value) {
      return value !== null
    })
    return [
      lodash.uniq(playerIdsLeft),
      lodash.uniq(playerIdsRight)
    ]
  })

  const teamIdsByFixtureId = lodash.mapValues(encountersByFixture, function (value) {
    return [value[0].teamIdLeft, value[0].teamIdRight]
  })

  // Filter out all encounters leaving only players who are not registered to that team.
  const playingUp = []
  const absentPlayerId = 0

  lodash.each(playerIdsByFixtureId, function (players, fixtureId) {
    [getSideIndex(SIDE_LEFT), getSideIndex(SIDE_RIGHT)].forEach(function (sideIndex) {
      const leftTeamId = teamIdsByFixtureId[fixtureId][sideIndex]
      const playerIdsPlayingUp = lodash.difference(
        players[sideIndex],
        playerIdsByTeamId[leftTeamId]
      )
      if (playerIdsPlayingUp.length > 0) {
        playerIdsPlayingUp.forEach(function (playerId) {
          if (playerId > absentPlayerId) {
            playingUp.push({
              fixtureId,
              playerId,
              teamId: leftTeamId
            })
          }
        })
      }
    })
  })

  const playerIds = lodash
    .uniqBy(playingUp, 'playerId')
    .map(row => lodash.get(row, 'playerId'))
  const playerIdsQuery = playerIds.join(', ')

  const [players] = await connection.execute(`
    SELECT
      id,
      concat(nameFirst, ' ', nameLast) AS name,
      slug
      FROM tennisPlayer
        WHERE yearId = :yearId
        and id in (${playerIdsQuery})
  `, {
    yearId: currentYear.id
  })

  const teamIds = lodash
    .uniqBy(playingUp, 'teamId')
    .map(row => lodash.get(row, 'teamId'))
  const teamIdsQuery = teamIds.join(', ')

  const [teams] = await connection.execute(`
    SELECT
      id,
      name,
      slug
      FROM tennisTeam
        WHERE yearId = :yearId
        and id in (${teamIdsQuery})
  `, {
    yearId: currentYear.id
  })

  connection.release()

  let playersPlayingUp = []

  playingUp.forEach(function (row) {
    const player = lodash.find(players, { id: row.playerId })
    const team = lodash.find(teams, { id: row.teamId })
    playersPlayingUp.push({
      fixtureId: row.fixtureId,
      player,
      team
    })
  })

  playersPlayingUp = lodash.sortBy(playersPlayingUp, ['player.name'])

  return NextResponse.json({
    playingUps: playersPlayingUp,
    yearName: currentYear.name
  }, { status: StatusCodes.OK })
}
