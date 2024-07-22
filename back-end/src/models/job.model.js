const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now }
});

jobSchema.pre('save', function (next) {
    this.modifiedDate = new Date();
    if (!this.createDate) {
        this.createDate = new Date();
    }
    next();
});

jobSchema.pre('findOneAndUpdate', function (next) {
    this._update.modifiedDate = new Date();
    next();
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
