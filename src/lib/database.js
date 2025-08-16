import mysql from 'mysql2/promise'

let connection = null

const getConnection = async () => {
  if (connection) {
    return connection
  }
  connection = getNewConnection()
  return connection
}

const getNewConnection = async () => {
  const isTest = process.env.NODE_ENV === 'test'

  const pool = mysql.createPool({
    host: process.env.MYSQL_HOSTNAME,
    user: process.env.MYSQL_ROOT_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: isTest ? process.env.MYSQL_TEST_DATABASE : process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000
  })
  connection = await pool.getConnection()
  connection.config.namedPlaceholders = true

  return connection
}

export { getConnection, getNewConnection }
