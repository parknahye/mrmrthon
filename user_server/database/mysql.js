// mysql 연결
const mysql = require('mysql');

// Create the connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  connectionLimit: 10, // Adjust the limit as per your needs
});

module.exports = pool;
