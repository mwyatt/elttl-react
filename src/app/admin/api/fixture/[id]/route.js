import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import { getCurrentYear } from '@/app/lib/year'
import {
  getSideCapitalized,
  getSideIndex,
  getSides,
  getSidesCapitalized,
  SIDE_LEFT,
  SIDE_RIGHT
} from '@/constants/encounter'
import { getRankChanges } from '@/lib/encounter'
import EncounterStatus from '@/constants/EncounterStatus'

export async function GET (request, { params }) {
  const connection = await getConnection()
  const currentYear = await getCurrentYear()
  const { id } = await params

  const [fixtures] = await connection.execute(`
      SELECT 
          tf.id,
          td.name as divisionName,
          ttl.id as teamLeftId,
          ttl.name as teamLeftName,
          ttr.name as teamRightName,
          ttr.id as teamRightId,
          tf.timeFulfilled
      FROM tennisFixture tf
      LEFT JOIN tennisTeam ttl ON ttl.id = tf.teamIdLeft and ttl.yearId = :yearId
      LEFT JOIN tennisTeam ttr ON ttr.id = tf.teamIdRight and ttr.yearId = :yearId
      LEFT JOIN tennisDivision td ON td.id = ttl.divisionId and td.yearId = :yearId
        WHERE tf.yearId = :yearId
      and tf.id = :fixtureId
  `, {
    fixtureId: id,
    yearId: currentYear.id
  })

  const fixture = fixtures[0]

  const [players] = await connection.execute(`
      SELECT
          id,
          concat(nameFirst, ' ', nameLast) AS name,
          slug,
          tp.rank,
          teamId
      FROM tennisPlayer tp
      WHERE yearId = :yearId
  `, {
    yearId: currentYear.id
  })

  const [encounters] = await connection.execute(`
      SELECT
          id,
          playerIdLeft,
          playerIdRight,
          scoreLeft,
          scoreRight,
          playerRankChangeLeft,
          playerRankChangeRight,
          playerRankChangeRight,
          status
      FROM tennisEncounter
      WHERE yearId = :yearId and fixtureId = :fixtureId
  `, {
    yearId: currentYear.id,
    fixtureId: id
  })

  return NextResponse.json({
    fixture,
    encounters,
    players
  }, { status: 200 })
}

export async function PUT (request, { params }) {
  const connection = await getConnection()
  const { id } = await params
  const { encounterStruct, playerStruct } = await request.json()

  console.info({
    'Fulfilling fixture': id,
    encounterStruct,
    playerStruct
  })

  // await connection.beginTransaction()

  const currentYear = await getCurrentYear()

  const [players] = await connection.execute(`
      SELECT
          id,
          tp.rank
      FROM tennisPlayer tp
      WHERE yearId = :yearId
      and id = :playerIdLeftOne
      or id = :playerIdLeftTwo
      or id = :playerIdLeftThree
      or id = :playerIdRightOne
      or id = :playerIdRightTwo
      or id = :playerIdRightThree
  `, {
    yearId: currentYear.id,
    playerIdLeftOne: playerStruct[0][1],
    playerIdLeftTwo: playerStruct[0][2],
    playerIdLeftThree: playerStruct[0][3],
    playerIdRightOne: playerStruct[1][1],
    playerIdRightTwo: playerStruct[1][2],
    playerIdRightThree: playerStruct[1][3]
  })

  const playerRanks = players.reduce((acc, player) => {
    acc[player.id] = player.rank
    return acc
  })

  const [fixtures] = await connection.execute(`
      SELECT 
          tf.id,
          tf.timeFulfilled
      FROM tennisFixture tf
        WHERE tf.yearId = :yearId
      and tf.id = :fixtureId
  `, {
    fixtureId: id,
    yearId: currentYear.id
  })

  const fixture = fixtures[0]

  if (fixture.timeFulfilled) {
    console.info('Fixture already fulfilled, rolling back rank changes before applying new ones.')

    // reverse the order of encounterStruct
    encounterStruct.reverse()

    // roll back the rank changes
    for (const encounter of encounterStruct) {
      for (const sideCapitalized of getSidesCapitalized()) {
        const playerId = encounter[`playerId${sideCapitalized}`]

        const updatePlayerData = {
          yearId: currentYear.id,
          playerId,
          rankChange: encounter[`playerRankChange${sideCapitalized}`]
        }

        if (playerId == null || encounter.status === EncounterStatus.DOUBLES) {
          // @todo will exclude also work like this for rank changes?
          console.info('Rolling back skip as cant find player or is doubles', updatePlayerData)
        } else {
          console.info('Rolling back rank for player', updatePlayerData)

          await connection.execute(`
              UPDATE tennisPlayer tp
              SET tp.rank = tp.rank - :rankChange
              WHERE yearId = :yearId
                and id = :playerId
          `, updatePlayerData)
        }
      }

      const deleteEncounterData = {
        yearId: currentYear.id,
        encounterId: encounter.id
      }

      console.info('Deleting encounter', deleteEncounterData)

      // Remove the encounters
      await connection.execute(`
          DELETE FROM tennisEncounter
          WHERE yearId = :yearId
            and id = :encounterId
      `, deleteEncounterData)
    }
  }

  // Apply the new rank changes
  for (const encounter of encounterStruct) {
    let rankChanges = [0, 0]

    if (encounter.status === EncounterStatus.DOUBLES || encounter.playerIdLeft == null || encounter.playerIdRight == null) {
      console.info('Skipping apply rank changes for doubles or missing player', encounter)
    } else {
      rankChanges = getRankChanges(
        encounter.scoreLeft,
        encounter.scoreRight,
        playerRanks[encounter.playerIdLeft],
        playerRanks[encounter.playerIdRight]
      )

      console.info('Rank changes generated', rankChanges)

      for (const sideCapitalized of getSidesCapitalized()) {
        const sideIndex = getSideIndex(sideCapitalized)
        const updateData = {
          yearId: currentYear.id,
          playerId: encounter[`playerId${sideCapitalized}`],
          rankChange: rankChanges[sideIndex]
        }

        console.info('Updating rank for player', {
          updateData,
          sideIndex
        })

        await connection.execute(`
            UPDATE tennisPlayer tp
            SET tp.rank = tp.rank + :rankChange
            WHERE yearId = :yearId
              and id = :playerId
        `, updateData)
      }
    }

    const insertData = {
      yearId: currentYear.id,
      fixtureId: id,
      playerIdLeft: encounter.playerIdLeft,
      playerIdRight: encounter.playerIdRight,
      playerRankChangeLeft: rankChanges[getSideIndex(SIDE_LEFT)],
      playerRankChangeRight: rankChanges[getSideIndex(SIDE_RIGHT)],
      scoreLeft: encounter.scoreLeft,
      scoreRight: encounter.scoreRight,
      status: encounter.status
    }

    console.info('Inserting encounter', insertData)

    await connection.execute(`
          INSERT INTO tennisEncounter
          (yearId, fixtureId, playerIdLeft, playerIdRight, scoreLeft, scoreRight, status)
          VALUES (:yearId, :fixtureId, :playerIdLeft, :playerIdRight, :scoreLeft, :scoreRight, :status)
      `, insertData)
  }

  const nowEpoch = Date.now().toString()

  // Update the fixture time fulfilled
  const updateFixtureData = {
    yearId: currentYear.id,
    fixtureId: id,
    timeFulfilled: nowEpoch.substring(0, nowEpoch.length - 3)
  }

  console.info('Updating fixture', updateFixtureData)

  await connection.execute(`
      UPDATE tennisFixture tf
      SET tf.timeFulfilled = :timeFulfilled
      WHERE tf.yearId = :yearId
        and id = :fixtureId
  `, updateFixtureData)

  // await connection.commit()

  return NextResponse.json({
    message: `Fixture ${id} fulfilled successfully, probably!`
  }, { status: 200 })
}
