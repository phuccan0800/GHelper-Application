const WebSocket = require('ws');
const jwt = require('jsonwebtoken');


const onlineWorkers = new Map();

function setupWebSocket(wss) {
    wss.on('connection', (ws) => {
        console.log('Worker connected');

        ws.on('message', (message) => {
            const data = JSON.parse(message);
            if (data.online !== undefined) {
                const workerToken = data.token;
                const user_id = jwt.verify(workerToken, process.env.JWT_SECRET).userId;
                if (data.online) {
                    onlineWorkers.set(user_id, ws);
                    console.log(`Worker ${user_id} is online.`);
                } else {
                    onlineWorkers.delete(user_id);
                    console.log(`Worker ${user_id} is offline.`);
                }

                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ onlineWorkers: Array.from(onlineWorkers.keys()) }));
                    }
                });
            }
        });

        ws.on('close', () => {
            onlineWorkers.forEach((wsClient, workerId) => {
                if (wsClient === ws) {
                    onlineWorkers.delete(workerId);
                    console.log(`Worker ${workerId} disconnected`);
                }
            });
        });
    });
}

module.exports = setupWebSocket;
