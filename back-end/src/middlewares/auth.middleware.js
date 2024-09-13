const jwt = require('jsonwebtoken');
const redis = require('../config/redis');

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


module.exports = { authenticateJWT };
