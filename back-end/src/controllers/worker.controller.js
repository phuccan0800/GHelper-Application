const Worker = require('../models/worker.model');
const User = require('../models/users.model');
const jwt = require('jsonwebtoken');

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
        const worker = await Worker.findOne({ userId: user._id });
        if (!worker) {
            return res.status(404).json({ message: 'Worker not found' });
        }
        res.status(200).json(worker);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const registerWorker = async (req, res) => {
    try {
        token = req.header('Authorization');
        data = req.body;
        const user_id = jwt.verify(token, process.env.JWT_SECRET).userId;
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const worker = await Worker.findOne({ user_id: user_id });
        if (worker) {
            return res.status(400).json({ message: 'Worker already registered' });
        }
        await User.findByIdAndUpdate(user_id, data, { new: true });
        const newWorker = new Worker({ user_id: user_id });
        await newWorker.save();
        return res.status(201).json({ message: 'Worker registered successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createWorker,
    getAllWorkers,
    getWorkerById,
    updateWorkerById,
    deleteWorkerById,
    checkWorkerRegistration,
    registerWorker
};
