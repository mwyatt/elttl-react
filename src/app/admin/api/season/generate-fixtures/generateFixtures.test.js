import '@testing-library/jest-dom'

import { getConnection } from '@/lib/database'
import generateFixtures from '@/app/admin/api/season/generate-fixtures/generateFixtures'
import EncounterStatus from '@/constants/EncounterStatus'

const yearId = 12
const teamCount = 3

test('it can generate fixtures for all the teams in all the divisions for the year', async () => {
  const connection = await getConnection()

  const [fixturesBefore] = await connection.execute('SELECT * FROM tennisFixture')
  expect(fixturesBefore.length).toBe(0)

  await generateFixtures(yearId)

  const [teams] = await connection.execute('SELECT * FROM tennisTeam WHERE yearId = :yearId', { yearId })
  expect(teams.length).toBe(teamCount)

  const [fixturesAfter] = await connection.execute('SELECT * FROM tennisFixture')
  expect(fixturesAfter.length).toBe(teamCount * (teamCount - 1)) // Each team plays every other team once
})

test('it will throw an error if the year does not exist', async () => {
  await generateFixtures().catch((error) => {
    expect(error.message).toBe('yearId is required')
  })
  await generateFixtures(9999).catch((error) => {
    expect(error.message).toBe('Year with ID 9999 does not exist')
  })
})

test('it will throw an error if there are fixtures already', async () => {
  const connection = await getConnection()

  const [fixturesBefore] = await connection.execute('SELECT * FROM tennisFixture')
  expect(fixturesBefore.length).toBe(teamCount * (teamCount - 1)) // Each team plays every other team once

  await generateFixtures(yearId).catch((error) => {
    expect(error.message).toBe(`Year with ID ${yearId} already has fixtures. Use 'ignoreExistingFixtures' to bypass this check.`)
  })
})

test('it can remove existing fixtures and encounters when forced to', async () => {
  const connection = await getConnection()

  const [fixturesBefore] = await connection.execute('SELECT * FROM tennisFixture')
  expect(fixturesBefore.length).toBe(teamCount * (teamCount - 1)) // Each team plays every other team once

  await connection.execute(`
          INSERT INTO tennisEncounter
          (yearId, fixtureId, playerIdLeft, playerIdRight, playerRankChangeLeft, playerRankChangeRight, scoreLeft, scoreRight, status)
          VALUES (:yearId, :fixtureId, :playerIdLeft, :playerIdRight, :playerRankChangeLeft, :playerRankChangeRight, :scoreLeft, :scoreRight, :status)
      `, {
    yearId,
    fixtureId: fixturesBefore[0].id,
    playerIdLeft: 1,
    playerIdRight: 2,
    playerRankChangeLeft: 0,
    playerRankChangeRight: 0,
    scoreLeft: 3,
    scoreRight: 0,
    status: EncounterStatus.NONE
  })

  const [encountersBefore] = await connection.execute('SELECT * FROM tennisEncounter')
  expect(encountersBefore.length).toBe(1)

  await connection.execute(`
INSERT INTO tennisTeam (id, yearId, name, slug, homeWeekday, secretaryId, venueId, divisionId) VALUES (4, 12, 'Late Comers', 'late-comers', 1, 42, 5, 1);
  `)
  const newTeamCount = teamCount + 1

  await generateFixtures(yearId, true)

  const [fixturesAfter] = await connection.execute('SELECT * FROM tennisFixture')
  expect(fixturesAfter.length).toBe(newTeamCount * (newTeamCount - 1)) // Each team plays every other team once

  const [encountersAfter] = await connection.execute('SELECT * FROM tennisEncounter')
  expect(encountersAfter.length).toBe(0)
})

test('it will not remove fixture or encounter data from other years', async () => {
  const connection = await getConnection()

  // Create a fixture and encounter for a different year
  await connection.execute(`
    INSERT INTO tennisFixture (yearId, teamIdLeft, teamIdRight)
    VALUES (11, 1, 2)
  `)

  await connection.execute(`
    INSERT INTO tennisEncounter
    (yearId, fixtureId, playerIdLeft, playerIdRight, playerRankChangeLeft, playerRankChangeRight, scoreLeft, scoreRight, status)
    VALUES (11, LAST_INSERT_ID(), 1, 2, 0, 0, 3, 0, 'NONE')
  `)

  const [fixturesBefore] = await connection.execute('SELECT * FROM tennisFixture WHERE yearId = 11')
  expect(fixturesBefore.length).toBe(1)

  const [encountersBefore] = await connection.execute('SELECT * FROM tennisEncounter WHERE yearId = 11')
  expect(encountersBefore.length).toBe(1)

  // Generate fixtures for the current year
  await generateFixtures(yearId, true)

  const [fixturesAfter] = await connection.execute('SELECT * FROM tennisFixture WHERE yearId = 11')
  expect(fixturesAfter.length).toBe(1)

  const [encountersAfter] = await connection.execute('SELECT * FROM tennisEncounter WHERE yearId = 11')
  expect(encountersAfter.length).toBe(1)
})

beforeAll(async () => {
  const connection = await getConnection()

  await connection.execute('INSERT INTO tennisYear (id, name, value) VALUES (12, \'2024\', \'\');')
  await connection.execute('INSERT INTO options (id, name, value) VALUES (20, \'year_id\', \'12\');')

  await connection.execute(`
    INSERT INTO tennisDivision (id, yearId, name) VALUES (1, 12, 'Premier');
  `)
  await connection.execute(`
    INSERT INTO tennisDivision (id, yearId, name) VALUES (2, 12, 'First');
  `)

  await connection.execute(`
  INSERT INTO tennisTeam (id, yearId, name, slug, homeWeekday, secretaryId, venueId, divisionId) VALUES (1, 12, 'HTTC', 'httc', 2, 610, 5, 1);
  `)
  await connection.execute(`
INSERT INTO tennisTeam (id, yearId, name, slug, homeWeekday, secretaryId, venueId, divisionId) VALUES (2, 12, 'Rovers', 'rovers', 1, 42, 5, 1);
  `)
  await connection.execute(`
INSERT INTO tennisTeam (id, yearId, name, slug, homeWeekday, secretaryId, venueId, divisionId) VALUES (3, 12, 'Super Spins', 'super-spins', 1, 42, 5, 1);
  `)
})

afterAll(async () => {
  const connection = await getConnection()

  await connection.execute('DELETE FROM tennisYear;')
  await connection.execute('DELETE FROM options;')
  await connection.execute('DELETE FROM tennisDivision;')
  await connection.execute('DELETE FROM tennisTeam;')
  await connection.execute('DELETE FROM tennisFixture;')
  await connection.execute('DELETE FROM tennisEncounter;')

  await connection.close()
})
