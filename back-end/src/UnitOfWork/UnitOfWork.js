const mongoose = require('mongoose');

const redis = require('../config/redis');
const userRepository = require('../repositories/users.repository');
const userRoleRepository = require('../repositories/userRole.repository')

class UnitOfWork {
    constructor() {
        this.session = null;
        this.redis = redis;
        this.repositories = {
            userRepository: userRepository,
            userRoleRepository: userRoleRepository
        };
    }

    async start() {
        this.session = await mongoose.startSession();
        this.session.startTransaction();

        for (let repoKey in this.repositories) {
            this.repositories[repoKey].setSession(this.session);
        }
    }

    async commit() {
        await this.session.commitTransaction();
        this.session.endSession();
    }

    async rollback() {
        await this.session.abortTransaction();
        this.session.endSession();
    }

    async getUserSessionByToken(token) {
        const session = await this.redis.client.get(token);
        return JSON.parse(session);
    }

    async saveUSerSession(userId, token) {
        await this.redis.client.rPush(userId.toString(), token);
    }

    async getSessionTokens(userId) {
        return await this.redis.client.lRange(userId.toString(), 0, -1);
    }

    async removeSessionToken(userId, token) {
        await this.redis.client.lRem(userId.toString(), 0, token);
    }

    async removeDeviceToken(token) {
        await this.redis.client.del(token);
    }
}

module.exports = UnitOfWork;
