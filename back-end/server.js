require('dotenv').config();
const express = require('express');
const app = express();
const host = process.env.HOST || "localhost";
const port = process.env.PORT || 3000;
const configViewEngine = require('./src/config/viewEngine');
const apiRoute = require('./src/routes/api');
const connection = require('./src/config/database');

connection();
configViewEngine(app);
app.use(express.json());
app.use('/api', apiRoute);




app.listen(port, host, () => {
    console.log(`Example app listening on http://${host}:${port}`);
});