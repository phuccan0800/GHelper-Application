// websocket.js
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

const workerStatus = new Map();

function setupWebSocket(wss) {
    wss.on('connection', (ws) => {
        console.log('Worker connected');

        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message);
                // Kiểm tra xem token có tồn tại trong dữ liệu không
                if (!data.token) {
                    console.log('Error: JWT token is missing');
                    return ws.send(JSON.stringify({ error: 'JWT token is missing' }));
                }

                const decoded = jwt.verify(data.token, process.env.JWT_SECRET);
                const user_id = decoded.userId;

                // Cập nhật trạng thái online của worker
                if (data.online !== undefined) {
                    if (data.online) {
                        workerStatus.set(user_id, { ws, online: true, lat: null, long: null });
                        console.log(`Worker ${user_id} is online.`);
                    } else {
                        workerStatus.delete(user_id);
                        console.log(`Worker ${user_id} is offline.`);
                    }

                    // Gửi danh sách worker đang online cho tất cả client
                    const onlineWorkerIds = Array.from(workerStatus.keys()).filter(id => workerStatus.get(id).online);
                    wss.clients.forEach(client => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({ onlineWorkers: onlineWorkerIds }));
                        }
                    });
                }

                // Cập nhật tọa độ của worker
                if (data.lat && data.long && user_id) {
                    if (workerStatus.has(user_id)) {
                        workerStatus.get(user_id).lat = data.lat;
                        workerStatus.get(user_id).long = data.long;
                        console.log(`Updated location for worker ${user_id}: lat=${data.lat}, long=${data.long}`);
                    }
                }

            } catch (error) {
                console.log('Error processing message:', error);
                ws.send(JSON.stringify({ error: 'Invalid token or message format' }));
                ws.close();
            }
        });

        ws.on('close', () => {

            workerStatus.forEach((workerData, workerId) => {
                if (workerData.ws === ws) {
                    workerStatus.delete(workerId);
                    console.log(`Worker ${workerId} disconnected`);
                }
            });

            // Gửi lại danh sách online cho tất cả client
            const onlineWorkerIds = Array.from(workerStatus.keys()).filter(id => workerStatus.get(id).online);
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ onlineWorkers: onlineWorkerIds }));
                }
            });
        });
    });
}

module.exports = setupWebSocket;
