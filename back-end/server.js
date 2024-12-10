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

// const checkWorkerStatus = async () => {
//     try {
//         const keys = await redisClient.keys('worker:*');
//         const now = Date.now();

//         for (const key of keys) {
//             const workerData = JSON.parse(await redisClient.get(key));
//             if (workerData && now - workerData.lastUpdated > 60000) { // 60 giây không gửi heartbeat
//                 await redisClient.del(key);
//                 console.log(`Worker automatically marked offline: ${key}`);
//             }
//         }
//     } catch (error) {
//         console.error('Error in worker status check:', error);
//     }
// };

// // Thiết lập cron job chạy mỗi 30 giây
// setInterval(checkWorkerStatus, 30000);

server.listen(port, host, () => {
    console.log(`Example app listening on http://${host}:${port}`);
});