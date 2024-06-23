const User = require('../models/users.model');
const BaseRepository = require('./base.repository');

class UserRepository extends BaseRepository {
  constructor() {
    super(User)
  }

  async findOneByEmail(email) {
    return await this.model.findOne({ email });
  }
}

module.exports = new UserRepository();
