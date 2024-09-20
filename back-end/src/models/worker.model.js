const mongoose = require('mongoose');

const helperSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, },
    online_status: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    job_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    application_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
    accepted: { type: Boolean, default: false },
});

const Helper = mongoose.model('Worker', helperSchema);
module.exports = Helper;
