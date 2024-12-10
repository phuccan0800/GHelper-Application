const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    job_id: { type: String, required: true },
    options: { type: Object, required: true },
    workerFindingStatus: { type: String, enum: ['searching', 'found', 'failed'], default: 'searching' },
    transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true },
    address: { type: String, required: true },
    location: { type: Object, required: true },
    accept: { type: Boolean, default: false },
    timeCreated: { type: Date, default: Date.now },
    timeStart: { type: Date },
    timeEnd: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
