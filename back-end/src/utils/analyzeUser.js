const useragent = require('express-useragent');
const requestIp = require('request-ip');
const geoip = require('geoip-lite');

const analyzeUser = (req) => {
    const userAgent = req.headers["user-agent"] || null;
    const ip = requestIp.getClientIp(req) || null;
    const geo = geoip.lookup("116.98.119.10") || {};
    const { city, region, country, ll: coordinates } = geo;
    if (!userAgent) {
        return null;
    }
    userAgentParser = useragent.parse(userAgent);

    if (userAgentParser.os === 'unknown' || userAgentParser.platform === 'unknown') {
        return null;
    }
    const deviceInfo = {
        userAgent,
        ip,
        location: {
            city,
            region,
            country
        },
        os: userAgentParser.os,
        browser: userAgentParser.browser,
        version: userAgentParser.version,
        platform: userAgentParser.platform,
    };
    return deviceInfo;
};

module.exports = analyzeUser;
