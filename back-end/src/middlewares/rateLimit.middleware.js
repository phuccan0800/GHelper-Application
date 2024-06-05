const rateLimit = require('express-rate-limit');

let timeUntilReset = 1 * 60 * 1000; // time 
let maxRequests = 1; // total request can send in timeUntilReset
const maxTimeUntilReset = 15 * 60 * 1000; // time max block request


// Middleware rate limiting option
const limiter = rateLimit({
    windowMs: timeUntilReset,
    max: maxRequests,
    message: {
        "rate_limit": `s.`
    }

});
module.exports = {
    limiter
};
