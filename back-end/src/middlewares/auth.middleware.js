const jwt = require('jsonwebtoken');
const redis = require('../config/redis');
const Worker = require('../models/worker.model');

// Middleware to authenticate JWT and check if the token is whitelisted in Redis
const authenticateJWT = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Access token is missing or invalid' });
    }

    try {
        const session = await redis.client.get(token);
        if (!session) {
            return res.status(401).json({ message: 'Session not found or token expired' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

const workerAuthenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const userId = jwt.verify(token, process.env.JWT_SECRET).userId;
        const worker = await Worker.findOne({ user_id: userId });
        if (!worker) {
            return res.status(404).json({ message: 'Worker not found' });
        }
        if (!worker.accepted) {
            return res.status(400).json({ message: 'Worker not accepted' });
        }
        res.status(200).json({ message: 'Worker accepted' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



module.exports = { authenticateJWT, workerAuthenticate };
