import mysql from 'mysql2/promise'

const isTest = process.env.NODE_ENV === 'test'

const pool = mysql.createPool({
  host: process.env.MYSQL_HOSTNAME,
  user: process.env.MYSQL_ROOT_USER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: isTest ? process.env.MYSQL_TEST_DATABASE : process.env.MYSQL_DATABASE
})

console.log('Pool was created - keep track of when this happens')

const getConnection = async () => {
  const connection = await pool.getConnection()

  // Configure the connection to allow :named placeholders.
  connection.config.namedPlaceholders = true

  return connection
}

export { getConnection }
