const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userRoleSchema = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, required: true },
    status: { type: Boolean, required: true, default: true },
    createDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now }
});

// Update modifiedDate before saving
userRoleSchema.pre('save', function (next) {
    this.modifiedDate = new Date();
    if (!this.createDate) {
        this.createDate = new Date();
    }
    next();
});

// Update modifiedDate before updating
userRoleSchema.pre('findOneAndUpdate', function (next) {
    this._update.modifiedDate = new Date();
    next();
});

module.exports = mongoose.model('UserRole', userRoleSchema);
