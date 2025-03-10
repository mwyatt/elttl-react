import mysql from 'mysql2/promise';

let connection = null;

const getConnection = async () => {
    if (connection) {
      console.log('returning existing connection')
      return connection
    }
    console.log('creating new connection')
    connection = await mysql.createConnection({
      host: 'elttl_react_mysql',
      user: 'root',
      password: '123',
      database: 'elttl'
    });
    connection.config.namedPlaceholders = true
    return connection
}

export {getConnection}