const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userRoleSchema = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, required: true },
    status: { type: Boolean, required: true }
});

userRoleSchema.pre('save', function (next) {
    const currentDate = new Date();
    this.ModifiedDate = currentDate;
    if (!this.CreateDate) {
        this.CreateDate = currentDate;
    }
    next();
});

userRoleSchema.pre('findOneAndUpdate', function (next) {
    this._update.ModifiedDate = new Date();
    next();
});

module.exports = mongoose.model('UserRole', userRoleSchema);
