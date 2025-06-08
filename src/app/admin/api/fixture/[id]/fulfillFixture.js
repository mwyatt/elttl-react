import { getConnection } from '@/lib/database'
import { getCurrentYear } from '@/app/lib/year'
import EncounterStatus from '@/constants/EncounterStatus'
import { getRankChanges } from '@/lib/encounter'
import { getSideIndex, getSidesCapitalized, SIDE_LEFT, SIDE_RIGHT } from '@/constants/encounter'

const maxEncounters = 10
const minEncounters = 3

// @todo could use scorecardStructure to infer this
const getPlayerStructFromEncounterStruct = (encounterStruct) => {
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

export async function rollBackFixture (currentYearId, fixtureId) {
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
  for (const encounter of existingEncounters) {
    for (const sideCapitalized of getSidesCapitalized()) {
      const playerId = encounter[`playerId${sideCapitalized}`]

      const updatePlayerData = {
        yearId: currentYearId,
        playerId,
        rankChange: encounter[`playerRankChange${sideCapitalized}`]
      }

      await connection.execute(`
            UPDATE tennisPlayer tp
            SET tp.rank = tp.rank - :rankChange
            WHERE yearId = :yearId
              and id = :playerId
        `, updatePlayerData)
    }

    const deleteEncounterData = {
      yearId: currentYearId,
      encounterId: encounter.id
    }

    // Remove the encounters
    await connection.execute(`
          DELETE FROM tennisEncounter
          WHERE yearId = :yearId
            and id = :encounterId
      `, deleteEncounterData)
  }
}

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
    console.debug(`Rolling back fixture with ID ${fixtureId} for year ${currentYear.id} before applying new encounters.`)
    await rollBackFixture(currentYear.id, fixtureId)
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
        const playerRank = playerRanks[encounter[`playerId${sideCapitalized}`]] + rankChanges[sideIndex]
        const updateData = {
          yearId: currentYear.id,
          playerId: encounter[`playerId${sideCapitalized}`],
          rank: playerRank
        }

        await connection.execute(`
            UPDATE tennisPlayer tp
            SET tp.rank = :rank
            WHERE yearId = :yearId
              and id = :playerId
        `, updateData)
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

  // await connection.commit()
}
