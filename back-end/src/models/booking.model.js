const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    job_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    timeCreated: { type: Date, default: Date.now, required: true },
    timeStart: { type: Date, required: false },
    timeEnd: { type: Date, required: false },
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);