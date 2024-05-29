require('dotenv').config();
const mysql = require('mysql2');
const express = require('express');
const app = express();
const host = process.env.HOST || 3000;
const port = process.env.PORT || "localhost";
const configViewEngine = require('./config/viewEngine');
const webRoute = require('./src/routes/web');
const connection = mysql.createConnection({
    host: "115.146.126.73",
    user: "GHelper",
    password: "5GdpfZsmHbXeGXJH",
    database: "ghelper"
})
configViewEngine(app);
app.use('/', webRoute);


app.listen(port, host, () => {
    console.log(`Example app listening on http://${host}:${port}`);
});