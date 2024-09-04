const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    worker_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
    job_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    status: { type: String, enum: ['applied', 'accepted', 'rejected'], default: 'applied' },
    applicationDate: { type: Date, default: Date.now },
});

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
