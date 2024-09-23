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
    {
        title: 'Dọn dẹp',
        description: 'Dọn dẹp nhà cửa, văn phòng',
        status: 'active',
        options: {
            workersNeeded: [1, 2, 3, 4],
            hireDuration: [1, 2, 3, 4, 5],
            roomsToClean: [1, 2, 3, 4]
        },
        createDate: new Date(),
        modifiedDate: new Date()
    },
    {
        title: 'Vá xe',
        description: 'Sửa chữa, vá xe',
        status: 'active',
        options: {
            vehicleType: ['Xe máy', 'Ô tô'],
            repairDuration: [1, 2, 3],
            additionalService: ['Thay lốp', 'Sửa động cơ']
        },
        createDate: new Date(),
        modifiedDate: new Date()
    },
    {
        title: 'Sửa ống nước',
        description: 'Sửa chữa ống nước trong tòa nhà, nơi công cộng',
        status: 'active',
        options: {
            repairType: ['Rò rỉ', 'Thay ống', 'Lắp đặt mới'],
            estimatedRepairTime: [1, 2, 3],
            additionalService: ['Kiểm tra hệ thống nước']
        },
        createDate: new Date(),
        modifiedDate: new Date()
    },
    {
        title: 'Sửa điện',
        description: 'Sửa điện trong tòa nhà',
        status: 'active',
        options: {
            repairType: ['Thay công tắc', 'Sửa đèn', 'Lắp đặt mới'],
            repairDuration: [1, 2, 3],
            additionalService: ['Kiểm tra hệ thống điện']
        },
        createDate: new Date(),
        modifiedDate: new Date()
    },
    {
        title: 'Nấu ăn',
        description: 'Nấu bữa trưa, bữa sáng, bữa tối. Có thể nấu cho nhiều người',
        status: 'active',
        options: {
            mealType: ['Sáng', 'Trưa', 'Tối'],
            peopleCount: [1, 2, 3, 4],
            prepTime: [1, 2, 3],
            specialRequests: ['Chế độ ăn kiêng', 'Món ăn cụ thể']
        },
        createDate: new Date(),
        modifiedDate: new Date()
    },
    {
        title: 'Giặt ủi',
        description: 'Giặt và ủi quần áo',
        status: 'active',
        options: {
            clothingType: ['Khô', 'Ướt', 'Đồ lớn'],
            washDuration: [1, 2],
            additionalService: ['Ủi đồ', 'Giặt tay']
        },
        createDate: new Date(),
        modifiedDate: new Date()
    },
    {
        title: 'Chăm sóc thú cưng',
        description: 'Cho thú cưng ăn, trông hộ, spa cho thú cưng',
        status: 'active',
        options: {
            petType: ['Chó', 'Mèo', 'Động vật khác'],
            careDuration: [1, 2],
            additionalService: ['Cho ăn', 'Tắm rửa', 'Dắt đi dạo']
        },
        createDate: new Date(),
        modifiedDate: new Date()
    },
    {
        title: 'Lái xe giúp',
        description: 'Lái xe giúp',
        status: 'active',
        options: {
            vehicleType: ['Xe hơi', 'Xe tải'],
            driveDuration: [1, 2, 3],
            destination: ['Địa điểm 1', 'Địa điểm 2'],
            additionalService: ['Lái xe cho sự kiện', 'Đi du lịch']
        },
        createDate: new Date(),
        modifiedDate: new Date()
    },
];

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
