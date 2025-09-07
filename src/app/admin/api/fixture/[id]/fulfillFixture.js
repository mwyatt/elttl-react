import { getConnection } from '@/lib/database'
import { getCurrentYear } from '@/app/lib/year'
import EncounterStatus from '@/constants/EncounterStatus'
import { getRankChanges } from '@/lib/encounter'
import {
  getSideIndex,
  getSidesCapitalized,
  maxEncounters,
  minEncounters,
  SIDE_LEFT,
  SIDE_RIGHT
} from '@/constants/encounter'

// @todo could use scorecardStructure to infer this
export const getPlayerStructFromEncounterStruct = (encounterStruct) => {
  if (encounterStruct.length < minEncounters) {
    throw new Error('Encounter structure must contain at least 3 encounters to infer the player positions.')
  }

  return [
    {
      1: encounterStruct[0].playerIdLeft,
      2: encounterStruct[2].playerIdLeft,
      3: encounterStruct[1].playerIdLeft
    },
    {
      1: encounterStruct[1].playerIdRight,
      2: encounterStruct[0].playerIdRight,
      3: encounterStruct[2].playerIdRight
    }
  ]
}

export async function rollBackFixture (currentYearId, fixtureId, playerRanks) {
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
      const playerRank = playerRanks[playerId]
      const playerRankChange = encounter[`playerRankChange${sideCapitalized}`]
      playerRanks[playerId] = playerRank - playerRankChange
    }

    const deleteEncounterData = {
      yearId: currentYearId,
      encounterId: encounter.id
    }

    await connection.execute(`
            DELETE FROM tennisEncounter
            WHERE yearId = :yearId
              and id = :encounterId
        `, deleteEncounterData)
  })

  connection.release()
}

// @todo validation routine for the encounters to check that there is a 3 within each encounter row (winner)
export default async function (fixtureId, encounterStruct) {
  if (encounterStruct.length > maxEncounters) {
    throw new Error(`Encounter structure exceeds maximum of ${maxEncounters} encounters. Received ${encounterStruct.length}.`)
  }

  const connection = await getConnection()
  const playerStruct = getPlayerStructFromEncounterStruct(encounterStruct)

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

  // @todo throw an error if any players are not found that should be

  // Create a map of player ranks for easy access
  const playerRanks = {}
  players.forEach((player) => {
    playerRanks[parseInt(player.id)] = player.rank
  })

  if (fixture.timeFulfilled) {
    await rollBackFixture(currentYear.id, fixtureId, playerRanks)
  }

  // Apply the new rank changes
  // @todo can we split this off?
  for (const encounter of encounterStruct) {
    let rankChanges = [0, 0]

    if (
      encounter.status === EncounterStatus.DOUBLES ||
      encounter.playerIdLeft === null ||
      encounter.playerIdRight === null ||
      encounter.playerIdLeft === 0 ||
      encounter.playerIdRight === 0
    ) {
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

  const nowEpoch = Date.now().toString()

  // Update the fixture time fulfilled
  const updateFixtureData = {
    yearId: currentYear.id,
    fixtureId,
    timeFulfilled: nowEpoch.substring(0, nowEpoch.length - 3)
  }

  await connection.execute(`
      UPDATE tennisFixture tf
      SET tf.timeFulfilled = :timeFulfilled
      WHERE tf.yearId = :yearId
        and id = :fixtureId
  `, updateFixtureData)

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
