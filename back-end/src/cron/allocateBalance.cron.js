const cron = require('node-cron');
const Booking = require('../models/booking.model');
const BookingWorker = require('../models/bookingWorker.model');
const Worker = require('../models/worker.model');

const allocateBalance = async () => {
    try {
        console.log('Starting balance allocation job...');
        const pendingBookings = await Booking.find({ accept: false, allocateBalance, workerFindingStatus: 'found' });

        for (const booking of pendingBookings) {
            const bookingWorker = await BookingWorker.findOne({
                bookingId: booking._id,
                status: 'completed',
            });

            if (bookingWorker) {
                const workerId = bookingWorker.workerId;
                const worker = await Worker.findById(workerId);
                if (worker) {
                    const amount = booking.options.price || 0;
                    worker.balance += amount;
                    worker.totalEarnings += amount;
                    await worker.save();
                    booking.accept = true;
                    await booking.save();
                    console.log(`Allocated ${amount} to Worker ID ${workerId}`);
                }
            }
        }

        console.log('Balance allocation job completed.');
    } catch (error) {
        console.error('Error in balance allocation job:', error.message);
    }
};

const startBalanceAllocationCron = () => {
    cron.schedule('*/5 * * * *', allocateBalance);
};

module.exports = startBalanceAllocationCron;
