import mysql from 'mysql2/promise';

let connection = null;

const getConnection = async () => {
    if (connection) {
      console.log('database: ', 'returning existing connection')
      return connection
    }
    console.log('database: ', 'creating new connection')
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOSTNAME,
      user: process.env.MYSQL_ROOT_USER,
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });
    connection.config.namedPlaceholders = true
    return connection
}

export {getConnection}