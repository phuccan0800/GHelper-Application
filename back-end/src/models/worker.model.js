const mongoose = require('mongoose');

const helperSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    online_status: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    job_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    application_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
});

const Helper = mongoose.model('Helper', helperSchema);
module.exports = Helper;
