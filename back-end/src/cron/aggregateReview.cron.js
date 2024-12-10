const cron = require('node-cron');
const Worker = require('../models/worker.model');
const Review = require('../models/review.model');
const BookingWorker = require('../models/bookingWorker.model');

// Hàm tổng hợp đánh giá
const aggregateReviews = async () => {
    try {
        console.log('Starting review aggregation job...');
        const workers = await Worker.find();
        for (const worker of workers) {
            const bookingWorkerRelations = await BookingWorker.find({ workerId: worker._id });

            // Lấy danh sách bookingId liên quan
            const bookingIds = bookingWorkerRelations.map((rel) => rel.bookingId);

            // Tìm tất cả reviews liên quan đến các booking
            const reviews = await Review.find({ booking_id: { $in: bookingIds } });

            if (reviews.length > 0) {
                // Tính trung bình rating
                const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
                const averageRating = totalRating / reviews.length;

                // Cập nhật rating cho worker
                await Worker.findByIdAndUpdate(worker._id, { rating: averageRating }, { new: true });
                console.log(`Updated rating for Worker ID ${worker._id}: ${averageRating}`);
            } else {
                console.log(`No reviews found for Worker ID ${worker._id}`);
            }
        }

        console.log('Review aggregation job completed.');
    } catch (error) {
        console.error('Error in review aggregation job:', error.message);
    }
};

// Định nghĩa cron job chạy mỗi 5 phút
const startReviewAggregationCron = () => {
    cron.schedule('*/5 * * * *', aggregateReviews);
};

module.exports = startReviewAggregationCron;
