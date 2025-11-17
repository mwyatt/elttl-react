import mysql from 'mysql2/promise'

const isTest = process.env.NODE_ENV === 'test'

const connectionConfig = {
  host: process.env.MYSQL_HOSTNAME,
  user: process.env.MYSQL_ROOT_USER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: isTest ? process.env.MYSQL_TEST_DATABASE : process.env.MYSQL_DATABASE
}

const pool = mysql.createPool(connectionConfig)

console.log('Connecting to database:', connectionConfig)

const setupConnectionConfig = (connection) => {
  // Configure the connection to allow :named placeholders.
  connection.config.namedPlaceholders = true
}

const getConnection = async () => {
  const connection = await pool.getConnection()

  setupConnectionConfig(connection)

  return connection
}

const getConnectionNoTable = async () => {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOSTNAME,
    user: process.env.MYSQL_ROOT_USER,
    password: process.env.MYSQL_ROOT_PASSWORD
  })

  setupConnectionConfig(connection)

  return connection
}

export { getConnection, getConnectionNoTable, pool }
