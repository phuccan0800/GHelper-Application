const mongoose = require('mongoose');

const helperSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    experience: { type: String, required: true },
    skills: [String],
    availability: { type: Boolean, default: true },
    ratings: { type: Number, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
});

const Helper = mongoose.model('Helper', helperSchema);
module.exports = Helper;
