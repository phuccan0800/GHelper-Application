const Review = require('../models/review.model');
const Booking = require('../models/booking.model'); // Đảm bảo import Booking nếu cần kiểm tra tồn tại booking
const jwt = require('jsonwebtoken');

exports.AddReview = async (req, res) => {
    try {
        const { bookingId, rating, comment } = req.body;
        const token = req.header('Authorization').replace('Bearer ', '');
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        const existingReview = await Review.findOne({ booking_id: bookingId, reviewed_by: userId });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this booking' });
        }
        const review = new Review({
            booking_id: bookingId,
            reviewed_by: userId,
            rating,
            comment,
        });

        await review.save();
        res.status(201).json({ message: 'Review added successfully', review });
    } catch (error) {
        console.error('Error adding review:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};
