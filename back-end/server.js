require('dotenv').config();
const mysql = require('mysql2');
const express = require('express');
const app = express();
const host = process.env.HOST || 3000;
const port = process.env.PORT || "localhost";
const configViewEngine = require('./config/viewEngine');
const webRoute = require('./src/routes/web');
const connection = mysql.createConnection({
    host: process.env.HOST_DATABASE,
    user: process.env.USER_DATABASE,
    password: process.env.PASSWORD_DATABASE,
    database: process.env.DATABASE
})
connection.query(
    'SELECT username FROM users WHERE ID = 1;',
    function (err, results, fields) {
        console.log(results)
    }
);

configViewEngine(app);
app.use('/', webRoute);


app.listen(port, host, () => {
    console.log(`Example app listening on http://${host}:${port}`);
});