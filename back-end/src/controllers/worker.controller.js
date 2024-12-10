const Worker = require('../models/worker.model');
const User = require('../models/users.model');
const Job = require('../models/job.model');
const Booking = require('../models/booking.model');
const BookingWorker = require('../models/bookingWorker.model');
const Transaction = require('../models/transaction.model');
const jwt = require('jsonwebtoken');
const redis = require('../config/redis');
const redisClient = require('../config/redis').client;
const stripeService = require('../services/stripe.service');
const bcrypt = require('bcrypt');
const analyzeUser = require('../utils/analyzeUser');
const { sendJobRequest, getWorkerLocation } = require('../config/websocket');
const withdrawnModel = require('../models/withdrawn.model');

const createWorker = async (req, res) => {
    try {
        const { name, skills, availability, location, hourlyRate } = req.body;
        const worker = new Worker({ name, skills, availability, location, hourlyRate });
        await worker.save();
        res.status(201).json(worker);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllWorkers = async (req, res) => {
    try {
        const workers = await Worker.find();
        res.status(200).json(workers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getWorkerById = async (req, res) => {
    try {
        const worker = await Worker.findById(req.params.id);
        if (!worker) {
            return res.status(404).json({ message: 'Worker not found' });
        }
        res.status(200).json(worker);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateWorkerById = async (req, res) => {
    try {
        const worker = await Worker.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!worker) {
            return res.status(404).json({ message: 'Worker not found' });
        }
        res.status(200).json(worker);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteWorkerById = async (req, res) => {
    try {
        const worker = await Worker.findByIdAndDelete(req.params.id);
        if (!worker) {
            return res.status(404).json({ message: 'Worker not found' });
        }
        res.status(200).json({ message: 'Worker deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const checkWorkerRegistration = async (req, res) => {
    try {
        token = req.header('Authorization');
        const user_id = jwt.verify(token, process.env.JWT_SECRET).userId;
        const worker = await Worker.findOne({ user_id: user_id });
        if (!worker) {
            return res.status(404).json({ message: 'Worker not found' });
        }
        res.status(200).json({ message: 'Worker found', worker: worker });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

const loginWorker = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found, Please register in G-Helper first' });
        }
        const worker = await Worker.findOne({ user_id: user._id });
        if (!worker) {
            return res.status(404).json({ message: 'Worker not found' });
        }
        if (worker.accepted === false) {
            return res.status(400).json({ message: 'Worker not accepted yet' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const deviceInfor = analyzeUser(req);
        const workerId = worker._id;
        const token = jwt.sign({ workerId: workerId._id }, process.env.JWT_SECRET, { expiresIn: '9000h' });
        await redis.client.rPush(workerId.toString(), token);
        await redis.client.set(token, JSON.stringify(deviceInfor), 'EX', 9000 * 3600);
        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const registerWorker = async (req, res) => {
    try {
        const token = req.header('Authorization');
        const data = req.body;
        const user_id = jwt.verify(token, process.env.JWT_SECRET).userId;
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const existingWorker = await Worker.findOne({ user_id: user_id });
        if (existingWorker) {
            return res.status(400).json({ message: 'Worker already registered' });
        }
        const job_id = data.job_id;
        if (!job_id) {
            return res.status(400).json({ message: 'job_id is required' });
        }
        const job = await Job.findOne({ id: job_id });
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        await User.findByIdAndUpdate(user_id, data, { new: true });

        const newWorker = new Worker({ user_id: user_id, job_id: job._id });
        await newWorker.save();

        return res.status(201).json({ message: 'Worker registered successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};

const logOutWorker = async (req, res) => {
    try {
        const token = req.header('Authorization');
        await redis.client.del(token);
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getWorkerInfo = async (req, res) => {
    try {
        const token = req.header('Authorization');
        const workerId = jwt.verify(token, process.env.JWT_SECRET).workerId;
        const worker = await Worker.findById(workerId);
        if (!worker) {
            return res.status(404).json({ message: 'Worker not found' });
        }
        const user = await User.findById(worker.user_id);
        if (!user) {
            return res.status(404).json({ message: 'User associated with worker not found' });
        }

        const workerInfo = {
            ...worker._doc,
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                region: user.region,
                avtImg: user.avtImg
            }
        };

        res.status(200).json(workerInfo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const findAndAssignWorker = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        const transaction = await Transaction.findById(booking.transactionId);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        const workerEarnings = transaction.workerEarnings;

        const bookingWorker = await BookingWorker.findOne({ bookingId: bookingId });
        if (bookingWorker) {
            if (bookingWorker.status === 'waiting') {
                return res.status(400).json({ message: 'Waiting for worker response' });
            }
            if (bookingWorker.status === 'accepted') {
                await Booking.findByIdAndUpdate(bookingId, { workerFindingStatus: 'found' });
                const worker = await Worker.findById(bookingWorker.workerId);
                const workerInfo = await User.findById(worker.user_id);
                const workerData = {
                    id: worker._id,
                    name: workerInfo.name,
                    phone: workerInfo.phone,
                    region: workerInfo.region,
                    avtImg: workerInfo.avtImg,
                    rating: worker.rating
                }
                return res.status(200).json({ message: 'Successfully assigned worker', worker: workerData });
            }
            if (bookingWorker.status === 'declined') {
                await Booking.findByIdAndUpdate(bookingId, { workerFindingStatus: 'failed' });
                await stripeService.refundPaymentIntent(transaction.stripePaymentIntentId);
                return res.status(404).json({ message: 'Worker declined the job' });
            }
        }

        const keys = await redisClient.keys('worker:*');
        const workers = [];
        for (const key of keys) {
            const workerData = JSON.parse(await redisClient.get(key));
            if (workerData.online && workerData.status === 'available') {
                workers.push({ id: key.split(':')[1], ...workerData });
            }
        }

        if (workers.length === 0) {
            booking.workerFindingStatus = 'failed';
            await booking.save();
            await stripeService.refundPaymentIntent(transaction.stripePaymentIntentId);
            return res.status(404).json({ message: 'No workers available at this time' });
        }

        // Sắp xếp Worker theo khoảng cách
        const sortedWorkers = workers.sort((a, b) => {
            const distanceA = Math.sqrt(
                Math.pow(a.lat - booking.location.lat, 2) + Math.pow(a.long - booking.location.long, 2)
            );
            const distanceB = Math.sqrt(
                Math.pow(b.lat - booking.location.lat, 2) + Math.pow(b.long - booking.location.long, 2)
            );
            return distanceA - distanceB;
        });



        const selectedWorker = sortedWorkers[0];
        const workerId = selectedWorker.id;
        sendJobRequest(workerId, {
            bookingId: bookingId,
            location: booking.location,
            address: booking.address,
            earnings: workerEarnings
        });
        await BookingWorker.create({
            bookingId: booking._id,
            workerId,
        });
        res.status(400).json({ message: 'Waiting for worker response' });

    } catch (error) {
        console.error('Error finding and assigning worker:', error);
        res.status(500).json({ message: error.message });
    }
};

const getWorkerLocationApi = async (req, res) => {
    const token = req.header('Authorization');
    const user_id = jwt.verify(token, process.env.JWT_SECRET).userId;
    const { workerId } = req.query;
    if (!workerId) {
        return res.status(400).json({ message: 'Worker ID is required' });
    }
    const user = await User.findById(user_id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const location = await getWorkerLocation(workerId);
    if (!location) {
        return res.status(404).json({ message: 'Worker not found' });
    }
    res.status(200).json(location);
};

const getWorkerStatus = async (req, res) => {
    const token = req.header('Authorization');
    const workerId = jwt.verify(token, process.env.JWT_SECRET).workerId;
    const worker = await Worker.findById(workerId);
    if (!worker) {
        return res.status(404).json({ message: 'Worker not found' });
    }
    const workerData = await redisClient.get(`worker:${workerId}`) || {};

    res.status(200).json(JSON.parse(workerData));
};

const withdrawBalance = async (req, res) => {
    const token = req.header('Authorization');
    const workerId = jwt.verify(token, process.env.JWT_SECRET).workerId;
    const amount = req.body.amount;
    if (!amount) {
        return res.status(400).json({ message: 'Amount is required' });
    }
    if (!workerId) {
        return res.status(404).json({ message: 'Worker not found' });
    }
    const worker = await Worker.findById(workerId);
    if (worker.balance < amount) {
        return res.status(400).json({ message: 'Not enough balance' });
    }
    const newWithdrawn = new withdrawnModel({ worker_id: workerId, amount });
    await newWithdrawn.save();
    worker.balance -= amount;
    await worker.save();
    res.status(200).json({ message: 'Withdrawn successfully, please wait Admin confirm!' });

}

module.exports = {
    createWorker,
    getAllWorkers,
    getWorkerById,
    updateWorkerById,
    deleteWorkerById,
    checkWorkerRegistration,
    registerWorker,
    loginWorker,
    getWorkerInfo,
    findAndAssignWorker,
    getWorkerLocationApi,
    getWorkerStatus,
    withdrawBalance,
    logOutWorker
};
