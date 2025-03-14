import mysql from 'mysql2/promise';

let connection = null;

const getConnection = async () => {
    if (connection) {
      console.log('returning existing connection')
      return connection
    }
    console.log('creating new connection')
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOSTNAME,
      user: 'root',
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.MYSQL_DATABASE
    });
    connection.config.namedPlaceholders = true
    return connection
}

export {getConnection}