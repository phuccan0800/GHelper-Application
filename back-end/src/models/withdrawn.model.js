const mongoose = require('mongoose');

const withdrawnSchema = new mongoose.Schema({
    worker_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    amount: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Withdrawn', withdrawnSchema);