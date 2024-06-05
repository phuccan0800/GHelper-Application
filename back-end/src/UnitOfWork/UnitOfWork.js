const mongoose = require('mongoose');
const userRepository = require('../repositories/users.repository');
const userRoleRepository = require('../repositories/userRole.repository')

class UnitOfWork {
    constructor() {
        this.session = null;
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
}

module.exports = UnitOfWork;
