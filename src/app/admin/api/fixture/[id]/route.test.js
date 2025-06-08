import '@testing-library/jest-dom'

import { getConnection } from '@/lib/database'
import fulfillFixture, { rollBackFixture } from '@/app/admin/api/fixture/[id]/fulfillFixture'
import EncounterStatus from '@/constants/EncounterStatus'

const currentYearId = 12

const basicEncounterStruct = [
  { playerIdLeft: 1, playerIdRight: 5, scoreLeft: 1, scoreRight: 3, status: '' },
  { playerIdLeft: 3, playerIdRight: 4, scoreLeft: 2, scoreRight: 3, status: '' },
  { playerIdLeft: 2, playerIdRight: 6, scoreLeft: 3, scoreRight: 0, status: '' },
  { playerIdLeft: 3, playerIdRight: 5, scoreLeft: 2, scoreRight: 3, status: '' },
  { playerIdLeft: 1, playerIdRight: 6, scoreLeft: 3, scoreRight: 0, status: '' },
  { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 3, scoreRight: 1, status: EncounterStatus.DOUBLES },
  { playerIdLeft: 2, playerIdRight: 4, scoreLeft: 3, scoreRight: 1, status: '' },
  { playerIdLeft: 3, playerIdRight: 6, scoreLeft: 2, scoreRight: 3, status: '' },
  { playerIdLeft: 2, playerIdRight: 5, scoreLeft: 3, scoreRight: 1, status: '' },
  { playerIdLeft: 1, playerIdRight: 4, scoreLeft: 2, scoreRight: 3, status: '' }
]

const checkEncountersFulfilledAccordingToStruct = (encounters, encounterStruct, fixtureId) => {
  encounterStruct.forEach((encounterStructRow) => {
    expect(encounters.some(encounter => {
      return encounter.playerIdLeft === encounterStructRow.playerIdLeft &&
             encounter.playerIdRight === encounterStructRow.playerIdRight &&
             encounter.scoreLeft === encounterStructRow.scoreLeft &&
             encounter.scoreRight === encounterStructRow.scoreRight &&
             encounter.status === encounterStructRow.status &&
             encounter.fixtureId === fixtureId &&
             encounter.yearId === currentYearId
    })).toBeTruthy()
  })
}

test('it can fulfill a fixture and store the correct information', async () => {
  const connection = await getConnection()
  const fixtureId = 3721
  const encounterStruct = basicEncounterStruct

  const [beforeEncounters] = await connection.execute(`
    SELECT * FROM tennisEncounter
  `)
  expect(beforeEncounters.length).toBe(0)

  await fulfillFixture(fixtureId, encounterStruct)

  const [encounters] = await connection.execute(`
    SELECT * FROM tennisEncounter
    WHERE fixtureId = :fixtureId
  `, { fixtureId })

  expect(encounters.length).toBe(10)

  checkEncountersFulfilledAccordingToStruct(encounters, encounterStruct, fixtureId)
})

test('it can fulfill a fixture with absent players', async () => {
  const connection = await getConnection()
  const fixtureId = 3720
  const encounterStruct = [
    { playerIdLeft: 0, playerIdRight: 5, scoreLeft: 1, scoreRight: 3, status: '' },
    { playerIdLeft: 3, playerIdRight: 4, scoreLeft: 2, scoreRight: 3, status: '' },
    { playerIdLeft: 2, playerIdRight: 6, scoreLeft: 3, scoreRight: 0, status: '' },
    { playerIdLeft: 3, playerIdRight: 5, scoreLeft: 2, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 6, scoreLeft: 3, scoreRight: 0, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 3, scoreRight: 1, status: EncounterStatus.DOUBLES },
    { playerIdLeft: 2, playerIdRight: 4, scoreLeft: 3, scoreRight: 1, status: '' },
    { playerIdLeft: 3, playerIdRight: 6, scoreLeft: 2, scoreRight: 3, status: '' },
    { playerIdLeft: 2, playerIdRight: 5, scoreLeft: 3, scoreRight: 1, status: '' },
    { playerIdLeft: 0, playerIdRight: 4, scoreLeft: 2, scoreRight: 3, status: '' }
  ]

  const [beforeEncounters] = await connection.execute(`
    SELECT * FROM tennisEncounter
  `)
  expect(beforeEncounters.length).toBe(10)

  await fulfillFixture(fixtureId, encounterStruct)

  const [encounters] = await connection.execute(`
    SELECT * FROM tennisEncounter
    WHERE fixtureId = :fixtureId
  `, { fixtureId })

  expect(encounters.length).toBe(10)

  checkEncountersFulfilledAccordingToStruct(encounters, encounterStruct, fixtureId)

  expect(encounters[0].playerRankChangeLeft).toEqual(0)
  expect(encounters[0].playerRankChangeRight).toEqual(0)
  expect(encounters[4].playerRankChangeLeft).toEqual(0)
  expect(encounters[4].playerRankChangeRight).toEqual(0)
  expect(encounters[9].playerRankChangeLeft).toEqual(0)
  expect(encounters[9].playerRankChangeRight).toEqual(0)
})

test('it can fulfill a fixture with status set', async () => {
  const connection = await getConnection()
  const fixtureId = 3719
  const encounterStruct = [
    { playerIdLeft: 3, playerIdRight: 4, scoreLeft: 2, scoreRight: 3, status: EncounterStatus.EXCLUDE },
    { playerIdLeft: 2, playerIdRight: 6, scoreLeft: 3, scoreRight: 0, status: EncounterStatus.EXCLUDE },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 3, scoreRight: 1, status: '' }
  ]

  const [beforeEncounters] = await connection.execute(`
    SELECT * FROM tennisEncounter
  `)
  expect(beforeEncounters.length).toBe(20)

  await fulfillFixture(fixtureId, encounterStruct)

  const [encounters] = await connection.execute(`
    SELECT * FROM tennisEncounter
    WHERE fixtureId = :fixtureId
  `, { fixtureId })

  expect(encounters.length).toBe(3)

  checkEncountersFulfilledAccordingToStruct(encounters, encounterStruct, fixtureId)

  expect(encounters[0].status).toEqual(EncounterStatus.EXCLUDE)
  expect(encounters[1].status).toEqual(EncounterStatus.EXCLUDE)
  expect(encounters[2].status).toEqual(EncounterStatus.NONE)
})

test('it can rollback and fulfil the same fixture', async () => {
  const connection = await getConnection()
  const fixtureId = 3721
  const encounterStruct = [
    { playerIdLeft: 0, playerIdRight: 5, scoreLeft: 1, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 5, scoreLeft: 1, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 5, scoreLeft: 1, scoreRight: 3, status: '' }
  ]

  const [beforeEncounters] = await connection.execute(`
    SELECT * FROM tennisEncounter
    WHERE fixtureId = :fixtureId
  `, { fixtureId })
  expect(beforeEncounters.length).toBe(10)

  await fulfillFixture(fixtureId, encounterStruct)

  const [encounters] = await connection.execute(`
    SELECT * FROM tennisEncounter
    WHERE fixtureId = :fixtureId
  `, { fixtureId })

  expect(encounters.length).toBe(3)

  checkEncountersFulfilledAccordingToStruct(encounters, encounterStruct, fixtureId)
})

test('it can rollback a fixture when it is already fulfilled', async () => {
  const connection = await getConnection()
  const fixtureId = 3721

  const [beforeEncounters] = await connection.execute(`
    SELECT * FROM tennisEncounter
    WHERE fixtureId = :fixtureId
  `, { fixtureId })
  expect(beforeEncounters.length).toBe(3)

  await rollBackFixture(currentYearId, fixtureId)

  const [encounters] = await connection.execute(`
    SELECT * FROM tennisEncounter
    WHERE fixtureId = :fixtureId
  `, { fixtureId })

  expect(encounters.length).toBe(0)
})

// @todo flesh out with concurrent rank changes
test('it will produce the right rank changes when fulfilling', async () => {
  const connection = await getConnection()
  const fixtureId = 3718

  await connection.execute('UPDATE tennisPlayer SET \`rank\` = 2500 WHERE id = 1;')
  await connection.execute('UPDATE tennisPlayer SET \`rank\` = 2600 WHERE id = 4;')

  const encounterStruct = [
    { playerIdLeft: 1, playerIdRight: 4, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' }
  ]

  await fulfillFixture(fixtureId, encounterStruct)

  const [encounters] = await connection.execute(`SELECT * FROM tennisEncounter WHERE fixtureId = :fixtureId
  `, { fixtureId })

  expect(encounters[0].playerRankChangeLeft).toEqual(-5)
  expect(encounters[0].playerRankChangeRight).toEqual(8)

  const [players] = await connection.execute(`
      SELECT id, \`rank\`
      FROM tennisPlayer
      WHERE id = :playerIdLeft OR id = :playerIdRight
  `, { playerIdLeft: 1, playerIdRight: 4 })

  expect(players[0].rank).toEqual(2495)
  expect(players[1].rank).toEqual(2608)
})

// @todo flesh out with concurrent rank changes
test('it will produce the right rank changes when rolling back', async () => {
  const connection = await getConnection()
  const fixtureId = 3718

  const [beforeEncounters] = await connection.execute(`
    SELECT * FROM tennisEncounter
    WHERE fixtureId = :fixtureId
  `, { fixtureId })
  expect(beforeEncounters.length).toBe(3)

  await rollBackFixture(currentYearId, fixtureId)

  const [encounters] = await connection.execute(`
    SELECT * FROM tennisEncounter
    WHERE fixtureId = :fixtureId
  `, { fixtureId })

  expect(encounters.length).toBe(0)

  const [players] = await connection.execute(`
    SELECT id, \`rank\`
    FROM tennisPlayer
    WHERE id = :playerIdLeft OR id = :playerIdRight
  `, { playerIdLeft: 1, playerIdRight: 4 })

  expect(players[0].rank).toEqual(2500)
  expect(players[1].rank).toEqual(2600)
})

test('it will throw an error if there are not enough / too many encounters submitted', async () => {
  const fixtureId = 3718
  const encounterStruct = [
    { playerIdLeft: 1, playerIdRight: 4, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' }
  ]

  await expect(fulfillFixture(fixtureId, encounterStruct)).rejects.toThrow(
    'Encounter structure must contain at least 3 encounters to infer the player positions.'
  )

  const tooManyEncounters = [
    { playerIdLeft: 1, playerIdRight: 4, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' }
  ]
  await expect(fulfillFixture(fixtureId, tooManyEncounters)).rejects.toThrow(
    'Encounter structure exceeds maximum of 10 encounters. Received 11.'
  )
})

test('it will throw an error if the fixture could not be found', async () => {
  const fixtureId = 9999 // Non-existing fixture ID
  const encounterStruct = [
    { playerIdLeft: 1, playerIdRight: 4, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' },
    { playerIdLeft: 0, playerIdRight: 0, scoreLeft: 0, scoreRight: 3, status: '' }
  ]

  await expect(fulfillFixture(fixtureId, encounterStruct)).rejects.toThrow(
    'Fixture with ID 9999 not found for year 12.'
  )
})

test('it keeps previous / existing encounter data intact during fulfillment and rollback', async () => {
  const connection = await getConnection()
  const fixtureId = 3721

  const [existingEncounters] = await connection.execute(`
    SELECT * FROM tennisEncounter
  `)

  await fulfillFixture(fixtureId, basicEncounterStruct)

  const [encountersAfterAFulfillment] = await connection.execute(`
    SELECT * FROM tennisEncounter
    WHERE fixtureId != :fixtureId
  `, { fixtureId })

  expect(encountersAfterAFulfillment).toEqual(existingEncounters)

  // Rollback the fixture
  await fulfillFixture(fixtureId, basicEncounterStruct)

  const [encountersAfterRollback] = await connection.execute(`
    SELECT * FROM tennisEncounter
    WHERE fixtureId != :fixtureId
  `, { fixtureId })

  expect(encountersAfterRollback).toEqual(existingEncounters)
})

beforeAll(async () => {
  const connection = await getConnection()

  await connection.execute('INSERT INTO tennisYear (id, name, value) VALUES (12, \'2024\', \'\');')
  await connection.execute('INSERT INTO options (id, name, value) VALUES (20, \'year_id\', \'12\');')

  await connection.execute(`
    INSERT INTO tennisFixture (id, yearId, teamIdLeft, teamIdRight, timeFulfilled)
    VALUES (3721, 12, 1, 2, 0);
  `)
  await connection.execute(`
    INSERT INTO tennisFixture (id, yearId, teamIdLeft, teamIdRight, timeFulfilled)
    VALUES (3720, 12, 1, 2, 0);
  `)
  await connection.execute(`
    INSERT INTO tennisFixture (id, yearId, teamIdLeft, teamIdRight, timeFulfilled)
    VALUES (3719, 12, 1, 2, 0);
  `)
  await connection.execute(`
    INSERT INTO tennisFixture (id, yearId, teamIdLeft, teamIdRight, timeFulfilled)
    VALUES (3718, 12, 1, 2, 0);
  `)

  await connection.execute(`
    INSERT INTO tennisPlayer (id, yearId, nameLast, \`rank\`) VALUES (1, 12, 'Ryan', 1960);
  `)
  await connection.execute(`
    INSERT INTO tennisPlayer (id, yearId, nameLast, \`rank\`) VALUES (2, 12, 'Dylan', 1457);
  `)
  await connection.execute(`
    INSERT INTO tennisPlayer (id, yearId, nameLast, \`rank\`) VALUES (3, 12, 'Scott', 1895);
  `)

  await connection.execute(`
    INSERT INTO tennisPlayer (id, yearId, nameLast, \`rank\`) VALUES (4, 12, 'Dan', 2012);
  `)
  await connection.execute(`
    INSERT INTO tennisPlayer (id, yearId, nameLast, \`rank\`) VALUES (5, 12, 'Ian', 1829);
  `)
  await connection.execute(`
    INSERT INTO tennisPlayer (id, yearId, nameLast, \`rank\`) VALUES (6, 12, 'Francis', 2029);
  `)
})

afterAll(async () => {
  const connection = await getConnection()

  await connection.execute('DELETE FROM tennisEncounter;')
  await connection.execute('DELETE FROM tennisPlayer;')
  await connection.execute('DELETE FROM tennisFixture;')
  await connection.execute('DELETE FROM options;')
  await connection.execute('DELETE FROM tennisYear;')
})
