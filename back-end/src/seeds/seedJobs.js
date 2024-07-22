const mongoose = require('mongoose');
const Job = require('./models/job.model');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to MongoDB');
        await seedJobs();
        mongoose.disconnect();
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
        mongoose.disconnect();
    });

const seedJobs = async () => {
    try {
        const jobs = [
            { title: 'Software Developer', description: 'Develop software solutions.', status: 'active' },
            { title: 'Project Manager', description: 'Manage software projects.', status: 'active' },
            { title: 'Data Scientist', description: 'Analyze data to gain insights.', status: 'active' },
            { title: 'UX Designer', description: 'Design user experiences.', status: 'active' }
        ];

        await Job.insertMany(jobs);
        console.log('Jobs seeded successfully');
    } catch (err) {
        console.error('Error seeding jobs', err);
    }
};
