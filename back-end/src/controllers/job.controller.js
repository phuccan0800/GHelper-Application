const Job = require('../models/job.model');
const Worker = require('../models/worker.model');
const JobDTO = require('../dtos/jobs.dto');

// Create a job
const createJob = async (req, res) => {
    try {
        const { title, description, location, payRate, userId } = req.body;
        const job = new Job({ title, description, location, payRate, userId });
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

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    updateJobById,
    deleteJobById,
};
