const redis = require('redis');

const client = redis.createClient({
    url: process.env.REDIS_URL,
});

client.on('connect', () => {
});

client.on('error', (error) => {
    console.error('Error connecting to Redis:', error);
});

const connectRedis = async () => {
    try {
        await client.connect();
        console.log('Connected to Redis successfully');
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
        process.exit(1);
    }
};

module.exports = { client, connectRedis };