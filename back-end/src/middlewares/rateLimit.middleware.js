
let initialTimeUntilReset = 1 * 60 * 1000; // initial block time (1 minute)
let maxRequests = 1000; // total requests allowed in initialTimeUntilReset
let maxTimeUntilReset = 15 * 60 * 1000; // maximum block time (15 minutes)
let userRequestData = {};

function rateLimiter(req, res, next) {
    const userIP = req.ip;
    const currentTime = Date.now();

    if (!userRequestData[userIP]) {
        userRequestData[userIP] = {
            lastRequestTime: currentTime,
            blockTime: initialTimeUntilReset,
            requestCount: 0,
        };
    }

    let userData = userRequestData[userIP];

    // Check if the user is still in the blocked period
    if (currentTime - userData.lastRequestTime < userData.blockTime) {
        userData.requestCount++;
        if (userData.requestCount > maxRequests) {
            userData.blockTime = Math.min(userData.blockTime * 1.5, maxTimeUntilReset);
            userData.lastRequestTime = currentTime; // update last request time
            res.status(429).json({
                "rate_limit": `${userData.blockTime / 1000}s.`,
                "message": "Too many requests, please try again later."
            });
            return;
        }
    } else {
        // Reset the request count and block time if outside blocked period
        userData.requestCount = 1;
        userData.blockTime = initialTimeUntilReset;
    }

    userData.lastRequestTime = currentTime; // update last request time
    next();
}

module.exports = rateLimiter;