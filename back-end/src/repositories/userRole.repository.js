const BaseRepository = require('./base.repository');
const UserRole = require('../models/userRole.model');

class UserRoleRepository extends BaseRepository {
    constructor() {
        super(UserRole);
    }
}

module.exports = new UserRoleRepository();
