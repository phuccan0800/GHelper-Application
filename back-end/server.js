require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const configViewEngine = require('./src/config/viewEngine');
const apiRoute = require('./src/routes/api');
const connection = require('./src/config/database');
const redis = require('./src/config/redis');
const rateLimiter = require('./src/middlewares/rateLimit.middleware');
const blockUnknownDevices = require('./src/middlewares/blockUnknownDevices.middleware');

const app = express();
const host = process.env.HOST || "localhost";
const port = process.env.PORT || 3000;

connection();
redis.connectRedis();

configViewEngine(app);
app.use(blockUnknownDevices);
app.use(rateLimiter);
app.use(express.json());
app.use('/api', apiRoute);
app.use(bodyParser.json());




app.listen(port, host, () => {
    console.log(`Example app listening on http://${host}:${port}`);
});