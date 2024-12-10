const Booking = require('../models/booking.model');
const jwt = require('jsonwebtoken');
const bookingWorkerModel = require('../models/bookingWorker.model');
const Job = require('../models/job.model');
const User = require('../models/users.model');
const UserDTO = require('../dtos/users.dto');
const Review = require('../models/review.model');

// Get all bookings
exports.getAllBookings = async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);
        const bookings = await Booking.find({ user_id: userId })
            .populate('user_id')
            .populate('transactionId');
        if (!bookings.length) {
            return res.status(404).json({ message: 'No bookings found' });
        }
        const bookingsFixed = await Promise.all(
            bookings.map(async (booking) => {
                const bookingWorker = await bookingWorkerModel.findOne({ bookingId: booking._id });
                const job = await Job.findOne({ id: booking.job_id });
                if (!job) {
                    return null; // Loại bỏ các kết quả không hợp lệ
                }
                return {
                    id: booking._id,
                    address: booking.address,
                    timeCreated: booking.timeCreated,
                    jobName: job.title,
                    status: bookingWorker?.status || 'No Worker',
                    totalAmount: booking.transactionId.totalAmount,
                };

            })
        );

        // Lọc bỏ các giá trị null
        const filteredBookings = bookingsFixed.filter((booking) => booking !== null);

        res.status(200).json(filteredBookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const booking = await Booking.findById(req.params.id).populate('transactionId');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Fetch worker linked to the booking
        const worker = await bookingWorkerModel
            .findOne({ bookingId: booking._id, status: { $ne: 'declined' } }) // Chỉ tìm worker không bị declined
            .populate('workerId');

        let updatedWorker = null;

        if (worker && worker.workerId) {
            const workerInfo = await User.findById(worker.workerId.user_id);
            if (workerInfo) {
                updatedWorker = {
                    ...worker.toObject(),
                    workerId: {
                        ...worker.workerId.toObject(),
                        user_id: new UserDTO(workerInfo.toObject()), // Thêm dữ liệu DTO
                    },
                };
            }
        }

        // Fetch user's review for this booking
        const review = await Review.findOne({
            booking_id: booking._id,
            reviewed_by: userId,
        });

        return res.status(200).json({ booking, worker: updatedWorker, review });
    } catch (error) {
        console.error('Error getting booking by ID:', error);
        return res.status(500).json({ message: error.message });
    }
};





// Update booking status
exports.updateBookingStatus = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { workerFindingStatus: req.body.status },
            { new: true }
        );
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user's bookings
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user_id: req.params.userId })
            .populate('user_id')
            .populate('transactionId');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};