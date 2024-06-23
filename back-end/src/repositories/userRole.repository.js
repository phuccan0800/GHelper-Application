const BaseRepository = require('./base.repository');
const UserRole = require('../models/userRole.model');

class UserRoleRepository extends BaseRepository {
    constructor() {
        super(UserRole);
    }

    async findByUserId(userId) {
        return await this.model.find({ userID: userId });
    }
}

module.exports = new UserRoleRepository();
