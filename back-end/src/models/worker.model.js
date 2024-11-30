const mongoose = require('mongoose');

const helperSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, },
    rating: { type: Number, default: 0 },
    job_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    accepted: { type: Boolean, default: false },
    balance: { type: Number, default: 0 },

});

const Helper = mongoose.model('Worker', helperSchema);
module.exports = Helper;
