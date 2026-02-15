import { NextResponse } from 'next/server'
import { getYearDivisionId } from '@/app/lib/year'
import { StatusCodes } from 'http-status-codes'
import { getRankMeritEncountersByDivisionId } from '@/repository/encounter'
import { getOriginalRankChangeRowKeyFromRankChanges } from '@/lib/encounter'
import {
  getOtherSide,
  getSideIndex,
  getSidesCapitalized,
  rankChangeMap, rankMeritChangeMap,
  SIDE_LEFT,
  SIDE_RIGHT
} from '@/constants/encounter'
import { getConnection } from '@/lib/database'
import { playerGetMany } from '@/repository/player'
import { getTeamsByDivisionId } from '@/repository/team'

export async function GET (request, { params }) {
  const { year, division } = await params
  const yearDivisionId = await getYearDivisionId(year, division)
  const connection = await getConnection()

  if (!yearDivisionId) {
    return NextResponse.json(`Unable to find division with year name '${year}' and slug '${division}'`, { status: StatusCodes.NOT_FOUND })
  }

  const encounters = await getRankMeritEncountersByDivisionId(yearDivisionId.yearId, yearDivisionId.divisionId)
  const playerIds = []

  // extract encounters playerIdLeft and playerIdRight unique
  encounters.forEach(encounter => {
    playerIds.push(encounter.playerIdLeft)
    playerIds.push(encounter.playerIdRight)
  })

  const players = await playerGetMany(connection, yearDivisionId.yearId, playerIds)
  const playerMerits = {}
  const sidesCapitalised = getSidesCapitalized()

  connection.release()

  // @todo the structure of the objects should outline all the information
  encounters.forEach((encounter) => {
    const rankChangeRowKey = getOriginalRankChangeRowKeyFromRankChanges(encounter.playerRankChangeLeft, encounter.playerRankChangeRight)
    const rankChangeRow = rankChangeMap[rankChangeRowKey]
    const rankMeritChangeRow = rankMeritChangeMap[rankChangeRowKey]
    const encounterPlayers = []
    encounterPlayers[SIDE_LEFT] = players.find(player => player.id === encounter.playerIdLeft)
    encounterPlayers[SIDE_RIGHT] = players.find(player => player.id === encounter.playerIdRight)

    sidesCapitalised.forEach((sideCapitalised) => {
      const playerId = encounter[`playerId${sideCapitalised}`]
      const playerRankChange = encounter[`playerRankChange${sideCapitalised}`]
      const playerScore = encounter[`score${sideCapitalised}`]

      if (!(playerId in playerMerits)) {
        playerMerits[playerId] = []
      }

      // Did the player win the encounter?
      // Winning player just gets the merit they earned
      if (playerScore === 3) {
        let winRankChange = 0

        if (rankChangeRow[getSideIndex(SIDE_LEFT)][getSideIndex(SIDE_LEFT)] === playerRankChange) {
          winRankChange = rankMeritChangeRow[getSideIndex(SIDE_LEFT)][getSideIndex(SIDE_LEFT)]
        } else {
          winRankChange = rankMeritChangeRow[getSideIndex(SIDE_RIGHT)][getSideIndex(SIDE_LEFT)]
        }

        playerMerits[playerId].push({
          // encounter,
          rankChangeRowKey,
          merit: winRankChange,
          description: `Won vs ${encounterPlayers[getOtherSide(sideCapitalised)].name}`
        })
      } else {
        // Losing player gets a fraction of the merit they would have got if they had won
        // Need to look at the rank change row to understand what that would be
        // We need the left side of the opposite key of the winning player to calculate the merit earned

        // Check if they picked up any points
        // @todo do we want to award some merit for just facing a tough opponent, what signifies tough?
        if (playerScore > 0) {
          let lossRankChange = 0

          if (rankChangeRow[getSideIndex(SIDE_LEFT)][getSideIndex(SIDE_LEFT)] === playerRankChange) {
            lossRankChange = rankMeritChangeRow[getSideIndex(SIDE_RIGHT)][getSideIndex(SIDE_LEFT)]
          } else {
            lossRankChange = rankMeritChangeRow[getSideIndex(SIDE_LEFT)][getSideIndex(SIDE_LEFT)]
          }

          // 3 being total possible games to win, rounded to 2 decimal places
          // @todo 40 is the division metric but why is this decided
          const lossRankChangeChunk = Math.round((lossRankChange / 6) * 100) / 100

          // Loss rank change could still be 0
          if (lossRankChangeChunk > 0) {
            // @todo, add a 'type' to explain what type of loss this was
            playerMerits[playerId].push({
              // encounter,
              rankChangeRowKey,
              merit: lossRankChangeChunk * playerScore,
              description: `Lost vs ${encounterPlayers[getOtherSide(sideCapitalised)].name} and picked up ${playerScore} points`
            })
          }
        }
      }
    })
  })

  // @todo Award some points to players who face high ranked opponents?

  // @todo exclude players who have played up and do not belong in this division
  // This can be achieved by brining in all the teams in this division, then removing all players who dont have a team set
  const teams = await getTeamsByDivisionId(yearDivisionId.yearId, yearDivisionId.divisionId)
  const playerMeritsWithTeams = {}

  // Assign all players to teams
  Object.keys(playerMerits).forEach(playerId => {
    const player = players.find(player => player.id === parseInt(playerId))
    const team = teams.find(team => team.id === player.teamId)

    if (team === undefined) {
      return
    }

    playerMeritsWithTeams[playerId] = {
      player,
      team,
      merits: playerMerits[playerId]
    }
  })

  // total up merits for each player and sort by total merit
  Object.keys(playerMeritsWithTeams).forEach(playerId => {
    const totalMerit = playerMeritsWithTeams[playerId].merits.reduce((total, merit) => total + merit.merit, 0)
    playerMeritsWithTeams[playerId].totalMerit = totalMerit
  })

  // Sort by total merit
  const sortedPlayerMeritsWithTeams = Object.values(playerMeritsWithTeams).sort((a, b) => b.totalMerit - a.totalMerit)

  // Sort internal merit score rows
  sortedPlayerMeritsWithTeams.forEach(playerMeritWithTeam => {
    playerMeritWithTeam.merits.sort((a, b) => b.merit - a.merit)
  })

  // const playerNames = sortedPlayerMeritsWithTeams.map(pm => {
  //   return {playerName: pm.player.name, totalMerit: pm.totalMerit}
  // })


  return NextResponse.json({
    // playerNames,
    stats: sortedPlayerMeritsWithTeams
  }, { status: StatusCodes.OK })
}
