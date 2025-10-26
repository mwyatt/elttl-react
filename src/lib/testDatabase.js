import { getConnection, getConnectionNoTable, pool } from '@/lib/database'
import setupTables from '@/lib/database/setupTables'
const fs = require('fs')
const path = require('path')

const testDatabaseName = process.env.MYSQL_TEST_DATABASE

const setup = async () => {
  const connection = await getConnectionNoTable()

  await connection.execute(`DROP DATABASE IF EXISTS ${testDatabaseName};`)
  await connection.execute(`CREATE DATABASE IF NOT EXISTS ${testDatabaseName};`)
  await connection.query(`USE ${testDatabaseName};`)

  await setupTables(connection)

  return connection
}

const tearDown = async () => {
  const connection = await getConnectionNoTable()

  await connection.execute(`DROP DATABASE IF EXISTS ${testDatabaseName};`)

  connection.close()
  pool.end()
}

export { setup, tearDown }
