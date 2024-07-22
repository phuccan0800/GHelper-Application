const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    jobID: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookingDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);