const { client: redisClient } = require('../config/redis');
const bookingModel = require('../models/booking.model');
const BookingWorker = require('../models/bookingWorker.model');
const Message = require('../models/message.model');
const Room = require('../models/room.model');
const jwt = require('jsonwebtoken');

const workerSockets = new Map(); // Lưu kết nối WebSocket theo workerId

// ** Helper functions **
const authenticateWorker = (token) => {
    if (!token) throw new Error('JWT token missing');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.workerId;
};

const updateWorkerData = async (workerId, updates) => {
    const workerData = JSON.parse(await redisClient.get(`worker:${workerId}`)) || {};
    Object.assign(workerData, updates, { lastUpdated: Date.now() });
    await redisClient.set(`worker:${workerId}`, JSON.stringify(workerData));
    return workerData;
};

const handleJobAction = async (type, workerId, bookingId) => {
    if (!bookingId) throw new Error('Booking ID missing');
    console.log(`Worker ${workerId} performed action: ${type} on job ${bookingId}`);
};

const broadcastToWorker = (workerId, payload) => {
    const workerSocket = workerSockets.get(workerId);
    if (workerSocket) {
        workerSocket.send(JSON.stringify(payload));
        console.log(`Message sent to Worker ${payload.type}:`,);
    } else {
        console.error(`Worker ${workerId} is not connected`);
    }
};

const getWorkerLocation = async (workerId) => {
    const workerData = JSON.parse(await redisClient.get(`worker:${workerId}`)) || {};
    return workerData;
};

// ** WebSocket Handlers **
const handleConnection = (ws) => {
    console.log('WebSocket connection established.');

    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message);
            const workerId = authenticateWorker(data.token);
            workerSockets.set(workerId, ws);
            switch (data.type) {
                case 'TOGGLE_ONLINE_STATUS':
                    await updateWorkerData(workerId, { online: data.online, status: data.status });
                    console.log(`Worker ${workerId} status updated: ${data.status}`);
                    break;

                case 'JOB_ACCEPT':
                    await handleJobAction('accept', workerId, data.bookingId);
                    await updateWorkerData(workerId, { status: 'working', bookingId: data.bookingId });
                    await BookingWorker.updateOne({ bookingId: data.bookingId, workerId: workerId }, { status: 'accepted' });
                    break;

                case 'JOB_DECLINE':
                    await handleJobAction('decline', workerId, data.bookingId);
                    await updateWorkerData(workerId, { status: 'available' });
                    const booking = await bookingModel.findById(data.bookingId);
                    if (booking) {
                        if (booking.workerFindingStatus === 'waiting') {
                            await BookingWorker.updateOne({ bookingId: data.bookingId, workerId: workerId }, { status: 'declined' });
                        }
                    }
                    await BookingWorker.updateOne({ bookingId: data.bookingId, workerId: workerId }, { status: 'declined' });
                    break;

                case 'JOB_COMPLETE':
                    await handleJobAction('complete', workerId, data.bookingId);
                    await updateWorkerData(workerId, { status: 'available' });
                    const bookingWorker = await BookingWorker.findOne({ bookingId: data.bookingId, workerId: workerId });
                    if (bookingWorker) {
                        if (bookingWorker.status === 'accepted') {
                            await BookingWorker.updateOne({ bookingId: data.bookingId, workerId: workerId }, { status: 'completed' });
                        }
                    }
                    break;

                case 'UPDATE_LOCATION':
                    if (data.lat && data.long) {
                        await updateWorkerData(workerId, { lat: data.lat, long: data.long });
                    }
                    break;

                default:
                    console.error(`Unknown message type: ${data.type}`);
            }
        } catch (error) {
            console.error('WebSocket error:', error.message);
            ws.send(JSON.stringify({ error: error.message }));
        }
    });

    ws.on('close', async () => {
        for (const [workerId, socket] of workerSockets.entries()) {
            if (socket === ws) {
                await updateWorkerData(workerId, { online: false });
                console.log(`Worker ${workerId} disconnected.`);
                break;
            }
        }
    });
};

// ** Main setup function **
const setupWebSocket = (wss) => {
    wss.on('connection', handleConnection);
};

// ** Send Job Request **
const sendJobRequest = (workerId, jobDetails) => {
    broadcastToWorker(workerId, { type: 'JOB_REQUEST', jobDetails });
};

module.exports = { setupWebSocket, sendJobRequest, getWorkerLocation };
