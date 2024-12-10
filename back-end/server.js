require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const WebSocket = require('ws');
const configViewEngine = require('./src/config/viewEngine');
const apiRoute = require('./src/routes/api');
const connection = require('./src/config/database');
const redis = require('./src/config/redis');
const redisClient = require('./src/config/redis').client;
const rateLimiter = require('./src/middlewares/rateLimit.middleware');
const blockUnknownDevices = require('./src/middlewares/blockUnknownDevices.middleware');
const { setupWebSocket } = require('./src/config/websocket');
const startReviewAggregationCron = require('./src/cron/aggregateReview.cron');
const startBalanceAllocationCron = require('./src/cron/allocateBalance.cron');


const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
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

setupWebSocket(wss);
startReviewAggregationCron();
startBalanceAllocationCron();

server.listen(port, host, () => {
    console.log(`Example app listening on http://${host}:${port}`);
});