require('dotenv').config();
const express = require('express');
const app = express();
const host = process.env.HOST || 3000;
const port = process.env.PORT || "localhost";
const configViewEngine = require('./config/viewEngine');
const webRoute = require('./src/routes/web');
configViewEngine(app);

app.use('/', webRoute);


app.listen(port, host, () => {
    console.log(`Example app listening on http://${host}:${port}`);
});