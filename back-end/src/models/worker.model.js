const mongoose = require('mongoose');

const helperSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    rating: { type: Number, default: 0 },
    job_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    totalEarnings: { type: Number, default: 0 },
    balance: { type: Number, default: 0 }, // Số dư chưa trả
}, { timestamps: true });

module.exports = mongoose.model('Worker', helperSchema);
