const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userRoleSchema = new Schema({
    role_name: { type: String, required: true, trim: true },
});

// Update modifiedDate before saving
userRoleSchema.pre('save', function (next) {
    next();
});

// Update modifiedDate before updating
userRoleSchema.pre('findOneAndUpdate', function (next) {
    this._update.modifiedDate = new Date();
    next();
});

module.exports = mongoose.model('UserRole', userRoleSchema);
