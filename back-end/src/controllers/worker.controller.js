const Worker = require('../models/worker.model');

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

module.exports = {
    createWorker,
    getAllWorkers,
    getWorkerById,
    updateWorkerById,
    deleteWorkerById,
};
