const Job = require('../models/job.model');
const Worker = require('../models/worker.model');
const JobDTO = require('../dtos/jobs.dto');

// Create a job
const createJob = async (req, res) => {
    try {
        const { title, id, description, location, payRate, userId } = req.body;
        const job = new Job({ title, id, description, location, payRate, userId });
        await job.save();
        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all jobs
const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        const jobsDTO = jobs.map(job => new JobDTO(job.toObject()));
        res.status(200).json(jobsDTO);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAvailableJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ status: 'active' });
        if (jobs.length === 0) {
            return res.status(404).json({ message: 'No available jobs found' });
        }
        const jobsDTO = jobs.map(job => new JobDTO(job.toObject()));
        res.status(200).json(jobsDTO);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get job by ID
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update job by ID
const updateJobById = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete job by ID
const deleteJobById = async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const checkJobPrice = async (req, res) => {
    try {
        const job = await Job.findOne({ id: req.body.id });
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        const options = req.body.options;
        switch (req.body.id) {
            case "cleaning":
                const cleaningType = job.options.cleaningType.find(type => type.type === options.cleaningType);
                if (!cleaningType) {
                    return res.status(400).json({ message: 'Invalid cleaning type' });
                }

                let realPrice = cleaningType.priceDefault;

                const roomOption = job.options.roomsToClean.find(room => room.roomCount === options.numberOfRooms);
                if (roomOption) {
                    realPrice += roomOption.priceAdjustment;
                }

                const workerOption = job.options.workerPrices.find(worker => worker.workerCount === options.numberOfWorkers);
                if (workerOption) {
                    realPrice += workerOption.price;
                }

                if (options.suppliesNeeded && job.options.suppliesNeeded.required) {
                    realPrice += job.options.suppliesNeeded.priceAdjustment;
                }
                console.log("Real price: ", realPrice);
                res.status(200).json({ realPrice, options });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createJob,
    getAllJobs,
    getAvailableJobs,
    getJobById,
    updateJobById,
    deleteJobById,
    checkJobPrice
};
