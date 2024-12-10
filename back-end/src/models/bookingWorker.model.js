const mongoose = require('mongoose');

const bookingWorkerSchema = new mongoose.Schema({
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
    status: { type: String, enum: ['waiting', 'accepted', 'declined', 'completed'], default: 'waiting' },
}, { timestamps: true });

module.exports = mongoose.model('BookingWorker', bookingWorkerSchema);
