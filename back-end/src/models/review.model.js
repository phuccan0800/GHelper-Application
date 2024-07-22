const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    helper: { type: mongoose.Schema.Types.ObjectId, ref: 'Helper', required: true },
    rating: { type: Number, required: true },
    comment: { type: String },
    reviewDate: { type: Date, default: Date.now },
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
