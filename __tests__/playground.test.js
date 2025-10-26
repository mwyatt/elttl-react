import '@testing-library/jest-dom'

import { getConnection } from '@/lib/database'
import { setup, tearDown } from '@/lib/testDatabase'

test('it can set up the database and tear it down', async () => {
  const connection = await getConnection()

  const [rows] = await connection.execute(`
    SELECT * FROM tennisYear;
  `)
  expect(rows.length).toBe(1)

  connection.release()
})

beforeAll(async () => {
  const connection = await setup()

  await connection.execute('INSERT INTO tennisYear (id, name, value) VALUES (11, \'2023\', \'\');')

  connection.close()
})

afterAll(tearDown)
