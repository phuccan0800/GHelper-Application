const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const connection = require('../config/database');
const jobSchema = new Schema({
    title: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    options: { type: Schema.Types.Mixed },
    createDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now }
});

const defaultJobs = [
    {
        "title": "Dọn dẹp",
        "id": "cleaning",
        "description": "Dọn dẹp toàn bộ nhà cửa hoặc từng phòng riêng lẻ. Có thể bao gồm phòng khách, phòng bếp, phòng tắm và các phòng khác.",
        "status": "active",
        "options": {
            "cleaningType": [
                {
                    "type": "Toàn bộ nhà",
                    "priceDefault": 400000,  // Giá cho toàn bộ nhà
                    "estimatedTime": 4       // Thời gian ước lượng hoàn thành (giờ)
                },
                {
                    "type": "Phòng khách",
                    "priceDefault": 120000,  // Giá cho phòng khách
                    "estimatedTime": 1.5     // Thời gian ước lượng (giờ)
                },
                {
                    "type": "Phòng bếp",
                    "priceDefault": 100000,  // Giá cho phòng bếp
                    "estimatedTime": 1.5     // Thời gian ước lượng (giờ)
                },
                {
                    "type": "Phòng tắm",
                    "priceDefault": 80000,   // Giá cho phòng tắm
                    "estimatedTime": 1       // Thời gian ước lượng (giờ)
                },
                {
                    "type": "Phòng ngủ",
                    "priceDefault": 100000,  // Giá cho phòng ngủ
                    "estimatedTime": 1.5     // Thời gian ước lượng (giờ)
                }
            ],
            "workersNeeded": [1, 2, 3, 4],  // Số lượng nhân viên có thể thuê
            "workerPrices": [
                {
                    "workerCount": 1,
                    "price": 500000 // Giá cho 1 worker
                },
                {
                    "workerCount": 2,
                    "price": 900000 // Giá cho 2 workers
                },
                {
                    "workerCount": 3,
                    "price": 1200000 // Giá cho 3 workers
                },
                {
                    "workerCount": 4,
                    "price": 1500000 // Giá cho 4 workers
                }
            ],
            "roomsToClean": [
                {
                    "roomCount": 1,
                    "priceAdjustment": 0      // Không tăng thêm nếu chỉ dọn 1 phòng
                },
                {
                    "roomCount": 2,
                    "priceAdjustment": 20000  // Tăng giá thêm 20.000đ nếu dọn 2 phòng
                },
                {
                    "roomCount": 3,
                    "priceAdjustment": 40000  // Tăng giá thêm 40.000đ nếu dọn 3 phòng
                },
                {
                    "roomCount": 4,
                    "priceAdjustment": 60000  // Tăng giá thêm 60.000đ nếu dọn 4 phòng
                }
            ],
            "suppliesNeeded": {
                "required": true,
                "description": "Cung cấp dụng cụ làm sạch (chổi, nước lau sàn, khăn lau, v.v.)",
                "priceAdjustment": 50000 // Tăng giá thêm nếu người thuê yêu cầu cung cấp dụng cụ làm sạch
            }
        },
        "createDate": new Date(),
        "modifiedDate": new Date()
    },
    {
        title: 'Sửa xe',
        id: 'vehicleRepair',
        description: 'Sửa chữa, vá xe',
        status: 'active',
        options: {
            workersNeeded: [1, 2, 3],
            vehicleType: ['Xe máy', 'Ô tô'],
            repairType: ['Vá lốp', 'Thay lốp', 'Sửa động cơ']
        },
        createDate: new Date(),
        modifiedDate: new Date()
    },
    {
        title: 'Sửa ống nước',
        id: 'plumbing',
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
        id: 'electricalRepair',
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
        id: 'cooking',
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
        id: 'laundry',
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
        id: 'petCare',
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
        id: 'driver',
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
