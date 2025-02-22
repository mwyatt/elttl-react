import mysql from 'mysql2/promise';

const database = {
  connection: null,
  async getConnection() {
    if (this.connection) {
      console.log('returning existing connection')
      return this.connection
    }
    console.log('creating new connection')
    this.connection = await mysql.createConnection({
      host: process.env.MYSQL_HOSTNAME,
      user: 'root',
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.MYSQL_DATABASE
    });
    this.connection.config.namedPlaceholders = true
    return this.connection
  }
}

export default database