const analyzeUser = require('../utils/analyzeUser');

const blockUnknownDevices = (req, res, next) => {

    const userAgent = req.headers["user-agent"];
    if (!userAgent) {
        return res.status(400).json({ message: 'User-Agent header is required' });
    }
    const deviceInfo = analyzeUser(req);
    if (!deviceInfo) {
        return res.status(403).json({ message: 'Access denied.' });
    }
    next();
};

module.exports = blockUnknownDevices;
