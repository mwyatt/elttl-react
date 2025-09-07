import mysql from 'mysql2/promise'

const isTest = process.env.NODE_ENV === 'test'

const pool = mysql.createPool({
  host: process.env.MYSQL_HOSTNAME,
  user: process.env.MYSQL_ROOT_USER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: isTest ? process.env.MYSQL_TEST_DATABASE : process.env.MYSQL_DATABASE,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 20000, // 20 seconds for an idle connection to become free again.
  waitForConnections: true
})

console.log('database: pool created, dont forget to close me!!')

const getConnection = async () => {
  const connection = await pool.getConnection()

  // Configure the connection to allow :named placeholders.
  connection.config.namedPlaceholders = true

  console.log('database: getConnection, dont forget to release me!')

  return connection
}

export { getConnection }
