import '@testing-library/jest-dom'

import { getConnection } from '@/lib/database'
import createNewSeason from '@/app/admin/api/season/createNewSeason'

test('it can create a new season with a copy of the previous years data', async () => {
  const connection = await getConnection()

  const [yearsBefore] = await connection.execute('SELECT * FROM tennisYear')
  expect(yearsBefore.length).toBe(2)
  const [divisionsBefore] = await connection.execute('SELECT * FROM tennisDivision')
  expect(divisionsBefore.length).toBe(4)
  const [playersBefore] = await connection.execute('SELECT * FROM tennisPlayer')
  expect(playersBefore.length).toBe(2)
  const [teamsBefore] = await connection.execute('SELECT * FROM tennisTeam')
  expect(teamsBefore.length).toBe(2)
  const [venuesBefore] = await connection.execute('SELECT * FROM tennisVenue')
  expect(venuesBefore.length).toBe(2)

  await createNewSeason()

  const [yearsAfter] = await connection.execute('SELECT * FROM tennisYear')
  expect(yearsAfter.length).toBe(3)
  const [divisionsAfter] = await connection.execute('SELECT * FROM tennisDivision')
  expect(divisionsAfter.length).toBe(6)
  const [teamsAfter] = await connection.execute('SELECT * FROM tennisTeam')
  expect(teamsAfter.length).toBe(3)
  const [playersAfter] = await connection.execute('SELECT * FROM tennisPlayer')
  expect(playersAfter.length).toBe(3)
  const [venuesAfter] = await connection.execute('SELECT * FROM tennisVenue')
  expect(venuesAfter.length).toBe(3)

  const [options] = await connection.execute('SELECT * FROM options WHERE name = \'year_id\'')
  expect(options.length).toBe(1)
  expect(options[0].value).toBe('13')

    connection.release()
})

beforeAll(async () => {
  const connection = await getConnection()

  await connection.execute('INSERT INTO tennisYear (id, name, value) VALUES (11, \'2023\', \'\');')
  await connection.execute('INSERT INTO tennisYear (id, name, value) VALUES (12, \'2024\', \'\');')
  await connection.execute('INSERT INTO options (id, name, value) VALUES (20, \'year_id\', \'12\');')

  await connection.execute(`
    INSERT INTO tennisDivision (id, yearId, name) VALUES (1, 11, 'Premier');
  `)
  await connection.execute(`
    INSERT INTO tennisDivision (id, yearId, name) VALUES (2, 11, 'First');
  `)
  await connection.execute(`
    INSERT INTO tennisDivision (id, yearId, name) VALUES (1, 12, 'Premier');
  `)
  await connection.execute(`
    INSERT INTO tennisDivision (id, yearId, name) VALUES (2, 12, 'First');
  `)

  await connection.execute(`
    INSERT INTO tennisPlayer (id, yearId, nameLast, \`rank\`) VALUES (1, 11, 'Ryan', 1960);
  `)
  await connection.execute(`
    INSERT INTO tennisPlayer (id, yearId, nameLast, \`rank\`) VALUES (2, 12, 'Dylan', 1457);
  `)

  await connection.execute(`
  INSERT INTO tennisTeam (id, yearId, name, slug, homeWeekday, secretaryId, venueId, divisionId) VALUES (2, 11, 'HTTC', 'httc', 2, 610, 5, 2);
  `)
  await connection.execute(`
INSERT INTO tennisTeam (id, yearId, name, slug, homeWeekday, secretaryId, venueId, divisionId) VALUES (7, 12, 'Rovers', 'rovers', 1, 42, 5, 1);
  `)

  await connection.execute(`  
  INSERT INTO tennisVenue (id, yearId, name, slug, location) VALUES (2, 11, 'Ramsbottom Cricket Club', 'ramsbottom-cricket-club', 'https://maps.app.goo.gl/Y6n2uF1T3vEC5Vc27');
  `)
  await connection.execute(`
INSERT INTO tennisVenue (id, yearId, name, slug, location) VALUES (1, 12, 'Burnley Boys Club', 'burnley-boys-club', 'https://maps.app.goo.gl/z3BZEWqnFK9PPwoK7');
  `)

    connection.release()
})

afterAll(async () => {
  const connection = await getConnection()

  await connection.execute('DELETE FROM tennisYear;')
  await connection.execute('DELETE FROM options;')
  await connection.execute('DELETE FROM tennisDivision;')
  await connection.execute('DELETE FROM tennisTeam;')
  await connection.execute('DELETE FROM tennisVenue;')
  await connection.execute('DELETE FROM tennisPlayer;')

  connection.release()
})
