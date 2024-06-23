const jwt = require('jsonwebtoken');
const UnitOfWork = require('../UnitOfWork/UnitOfWork');

const authenticateJWT = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Access token is missing or invalid' });
    }
    const unitOfWork = new UnitOfWork();
    await unitOfWork.start();
    try {
        const session = await unitOfWork.getUserSessionByToken(token);
        if (!session) {
            return error;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Authenticate failed", message: 'Invalid token' });
    }
};

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            const token = req.header('Authorization');
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            const userRoles = req.user.role;

            if (!userRoles.some(role => allowedRoles.includes(role))) {
                return res.status(403).json({ message: 'You do not have permission to perform this action' });
            }
            next();
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    };
};

module.exports = { authenticateJWT, authorizeRoles };
