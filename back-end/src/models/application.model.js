const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    helper: { type: mongoose.Schema.Types.ObjectId, ref: 'Helper', required: true },
    status: { type: String, enum: ['applied', 'accepted', 'rejected'], default: 'applied' },
    applicationDate: { type: Date, default: Date.now },
});

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
