import '@testing-library/jest-dom'
import { test, beforeAll, beforeEach, afterAll, afterEach, expect } from '@jest/globals'
import { setup, tearDown } from '@/lib/testDatabase'
import { getConnection } from '@/lib/database'
import { playerGetMany } from '@/repository/player'

test('it gets many players', async () => {
  const connection = await getConnection()

  const players = await playerGetMany(connection, 12, [1, 2, 3])

  expect(players).toHaveLength(3)

  connection.release()
})

beforeAll(async () => {
  const connection = await setup()
  connection.close()
})

beforeEach(async () => {
  const connection = await getConnection()

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

  connection.release()
})

afterEach(async () => {
  const connection = await getConnection()

  await connection.execute('DELETE FROM tennisPlayer;')

  connection.release()
})

afterAll(tearDown)
