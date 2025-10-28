import { getConnection } from '@/lib/database'
import { getCurrentYear } from '@/app/lib/year'
import EncounterStatus from '@/constants/EncounterStatus'
import { doesEncounterHaveNoPlayer, getRankChanges } from '@/lib/encounter'
import {
  getSideIndex,
  getSidesCapitalized,
  maxEncounters,
  minEncounters,
  SIDE_LEFT,
  SIDE_RIGHT
} from '@/constants/encounter'
import lodash from 'lodash'
import { playerGetMany } from '@/repository/player'
const TRACE_RANK_CHANGES = false

const logRankChange = (...args) => {
  if (TRACE_RANK_CHANGES) {
    console.debug('TRACE_RANK_CHANGES', ...args)
  }
}

export const getPlayerRanks = async (connection, yearId, encounterStruct) => {
  const playerIds = lodash.uniq(getPlayerIdsFromEncounterStruct(encounterStruct))
  const players = await playerGetMany(connection, yearId, playerIds)

  if (players.length !== playerIds.length) {
    throw new Error('Unable to find all involved players.')
  }

  // Create a map of player ranks for easy access
  const playerRanks = {}
  players.forEach((player) => {
    playerRanks[parseInt(player.id)] = player.rank
  })

  return playerRanks
}

export const getPlayerIdsFromEncounterStruct = (encounterStruct) => {
  return lodash.filter([
      encounterStruct[0].playerIdLeft,
      encounterStruct[2].playerIdLeft,
      encounterStruct[1].playerIdLeft,
      encounterStruct[1].playerIdRight,
      encounterStruct[0].playerIdRight,
      encounterStruct[2].playerIdRight,
  ], value => value !== 0)
}

async function rollBackFixture (currentYearId, fixtureId, playerRanks = null) {
  const connection = await getConnection()

  // Find the existing encounters for this fixture
  const [existingEncounters] = await connection.execute(`
        SELECT
            id,
            playerIdLeft,
            playerIdRight,
            playerRankChangeLeft,
            playerRankChangeRight,
            scoreLeft,
            scoreRight,
            status
        FROM tennisEncounter
        WHERE yearId = :yearId
          and fixtureId = :fixtureId
    `, {
    yearId: currentYearId,
    fixtureId
  })

  // reverse the order of encounters
  existingEncounters.reverse()

  // roll back the rank changes
  existingEncounters.map(async (encounter) => {
    for (const sideCapitalized of getSidesCapitalized()) {
      const playerId = parseInt(encounter[`playerId${sideCapitalized}`])

      if (!doesEncounterHaveNoPlayer(encounter)) {
        const playerRank = playerRanks[playerId]
        const playerRankChange = encounter[`playerRankChange${sideCapitalized}`]
        playerRanks[playerId] = playerRank - playerRankChange

        logRankChange('rolling back rank change:', playerRankChange, playerRanks)
      }
    }
  })

  const encounterIdsSql = existingEncounters.map(encounter => encounter.id).join(',')

  await connection.execute(`
        DELETE FROM tennisEncounter
        WHERE yearId = :yearId
          and id in(${encounterIdsSql})
    `, {
    yearId: currentYearId,
    encounterIdsSql
  })

  connection.release()
}

export default async function (fixtureId, encounterStruct, rollbackOnly = false) {
  const sidesCapitalized = getSidesCapitalized()

  if (encounterStruct.length > maxEncounters) {
    throw new Error(`Encounter structure exceeds maximum of ${maxEncounters} encounters. Received ${encounterStruct.length}.`)
  }

  const hasEncounterWithoutWinner = encounterStruct.some((encounter) => {
    return encounter[`score${sidesCapitalized[0]}`] !== 3 && encounter[`score${sidesCapitalized[1]}`] !== 3
  })

  if (hasEncounterWithoutWinner) {
    throw new Error('All encounters must have a winner with a score of 3.')
  }

  const connection = await getConnection()

  // @todo experiment with transaction, simulate failure part way through and check to see if db rolled back
  // await connection.beginTransaction()

  const currentYear = await getCurrentYear()

  const [fixtures] = await connection.execute(`
      SELECT 
          tf.id,
          tf.timeFulfilled
      FROM tennisFixture tf
        WHERE tf.yearId = :yearId
      and tf.id = :fixtureId
  `, {
    fixtureId,
    yearId: currentYear.id
  })

  const fixture = fixtures[0]

  if (!fixture) {
    connection.release()
    throw new Error(`Fixture with ID ${fixtureId} not found for year ${currentYear.id}.`)
  }

  if (!fixture.timeFulfilled && rollbackOnly) {
    connection.release()
    throw new Error('Cannot rollback a fixture that has not been fulfilled.')
  }

  const nowEpoch = Date.now().toString()

  // Update the fixture time fulfilled
  const updateFixtureData = {
    yearId: currentYear.id,
    fixtureId,
    timeFulfilled: rollbackOnly ? 0 : nowEpoch.substring(0, nowEpoch.length - 3)
  }

  if (encounterStruct.length < minEncounters) {
    throw new Error('Encounter structure must contain at least 3 encounters to infer the player positions.')
  }

  const playerRanks = await getPlayerRanks(connection, currentYear.id, encounterStruct)

  if (fixture.timeFulfilled) {
    await rollBackFixture(currentYear.id, fixtureId, playerRanks)
  }

  // Apply the new rank changes
  if (!rollbackOnly) {
    for (const encounter of encounterStruct) {
      let rankChanges = [0, 0]

      if (doesEncounterHaveNoPlayer(encounter)) {
        // 'Skipping apply rank changes for doubles or missing player'
      } else {
        rankChanges = getRankChanges(
          encounter.scoreLeft,
          encounter.scoreRight,
          playerRanks[encounter.playerIdLeft],
          playerRanks[encounter.playerIdRight]
        )

        for (const sideCapitalized of getSidesCapitalized()) {
          const sideIndex = getSideIndex(sideCapitalized)
          playerRanks[encounter[`playerId${sideCapitalized}`]] = playerRanks[encounter[`playerId${sideCapitalized}`]] + rankChanges[sideIndex]
        }

        logRankChange('applying new rank changes:', rankChanges, playerRanks)
      }

      const insertData = {
        yearId: currentYear.id,
        fixtureId,
        playerIdLeft: encounter.playerIdLeft,
        playerIdRight: encounter.playerIdRight,
        playerRankChangeLeft: rankChanges[getSideIndex(SIDE_LEFT)],
        playerRankChangeRight: rankChanges[getSideIndex(SIDE_RIGHT)],
        scoreLeft: encounter.scoreLeft,
        scoreRight: encounter.scoreRight,
        status: encounter.status
      }

      await connection.execute(`
            INSERT INTO tennisEncounter
            (yearId, fixtureId, playerIdLeft, playerIdRight, playerRankChangeLeft, playerRankChangeRight, scoreLeft, scoreRight, status)
            VALUES (:yearId, :fixtureId, :playerIdLeft, :playerIdRight, :playerRankChangeLeft, :playerRankChangeRight, :scoreLeft, :scoreRight, :status)
        `, insertData)
    }
  }

  await connection.execute(`
      UPDATE tennisFixture tf
      SET tf.timeFulfilled = :timeFulfilled
      WHERE tf.yearId = :yearId
        and id = :fixtureId
  `, updateFixtureData)

  logRankChange('player ranks before update:', playerRanks)

  // Update player ranks in memory
  for (const playerId in playerRanks) {
    const playerRank = playerRanks[playerId]
    await connection.execute(`
          UPDATE tennisPlayer tp
          SET tp.rank = :rank
          WHERE yearId = :yearId
            and id = :playerId
      `, {
      yearId: currentYear.id,
      playerId: parseInt(playerId),
      rank: playerRank
    })
  }

  connection.release()
  // await connection.commit()
}
