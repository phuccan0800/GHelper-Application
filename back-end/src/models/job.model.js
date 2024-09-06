const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const connection = require('../config/database');
const jobSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now }
});

const defaultJobs = [
    { title: 'Dọp dẹp', description: 'Dọn dẹp nhà cửa, văn phòng', status: 'active', createDate: new Date(), modifiedDate: new Date() },
    { title: 'Vá xe', description: 'Sửa chữa, vấ xe', status: 'active', createDate: new Date(), modifiedDate: new Date() },
    { title: 'Sửa ống nước', description: 'Sửa chữa ống nước trong tòa nhà, nơi công cộng', status: 'active', createDate: new Date(), modifiedDate: new Date() },
    { title: 'Sửa điện', description: 'Sửa điện trong tòa nhà', status: 'active', createDate: new Date(), modifiedDate: new Date() },
    { title: 'Nấu ăn', description: 'Nấu bữa trưa, bữa sáng, bữa tối. Có thể nấu cho nhiều người', status: 'active', createDate: new Date(), modifiedDate: new Date() },
    { title: 'Giặt ủi', description: 'Giặt và ủi quần áo', status: 'active', createDate: new Date(), modifiedDate: new Date() },
    { title: 'Chăm sóc thú cưng', description: 'Cho thú cưng ăn, trông hộ, spa cho thú cưng', status: 'active', createDate: new Date(), modifiedDate: new Date() },
    { title: 'Lái xe giúp', description: 'Lái xe giúp', status: 'active', createDate: new Date(), modifiedDate: new Date() },
]
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

const insertDefaultJobs = async () => {
    try {
        for (const job of defaultJobs) {
            const existingJob = await Job.findOne({ title: job.title });
            if (!existingJob) {
                await Job.create(job);
                console.log(`Đã thêm công việc: ${job.title}`);
            }
        }
    } catch (error) {
        console.error('Lỗi khi thêm công việc mặc định:', error);
    }
};

insertDefaultJobs();
module.exports = Job;
