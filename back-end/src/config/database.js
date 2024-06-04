const mysql = require('mysql2');
const connection = mysql.createPool({
    host: process.env.HOST_DATABASE,
    user: process.env.USER_DATABASE,
    password: process.env.PASSWORD_DATABASE,
    database: process.env.DATABASE,
    connectionLimit: 50,
    queueLimit: 1000
})

module.exports = connection;