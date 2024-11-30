const Worker = require('../models/worker.model');
const User = require('../models/users.model');
const Job = require('../models/job.model');
const jwt = require('jsonwebtoken');
const redis = require('../config/redis');
const bcrypt = require('bcrypt');
const analyzeUser = require('../utils/analyzeUser');

// Create a worker
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

// Get all workers
const getAllWorkers = async (req, res) => {
    try {
        const workers = await Worker.find();
        res.status(200).json(workers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get worker by ID
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

// Update worker by ID
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

// Delete worker by ID
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

        // Combine worker and user information
        const workerInfo = {
            ...worker._doc,
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                region: user.region,
                // Thêm các thuộc tính khác nếu cần thiết
            }
        };

        res.status(200).json(workerInfo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    createWorker,
    getAllWorkers,
    getWorkerById,
    updateWorkerById,
    deleteWorkerById,
    checkWorkerRegistration,
    registerWorker,
    loginWorker,
    getWorkerInfo
};
