import mysql from 'mysql2/promise'

let connection = null

const getConnection = async () => {
  if (connection) {
    console.log('database: ', 'returning existing connection')
    return connection
  }
  connection = getNewConnection()
  return connection
}

const getNewConnection = async (connectPool = true) => {
  if (connectPool) {
    console.log('database: ', 'creating new pool connection')
    const pool = mysql.createPool({
      host: process.env.MYSQL_HOSTNAME,
      user: process.env.MYSQL_ROOT_USER,
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
      idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
    connection = await pool.getConnection()
    connection.config.namedPlaceholders = true
    return connection
  } else {
    console.log('database: ', 'creating new connection')
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOSTNAME,
      user: process.env.MYSQL_ROOT_USER,
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.MYSQL_DATABASE
    })
    connection.config.namedPlaceholders = true
  }
  return connection
}



export { getConnection, getNewConnection }
