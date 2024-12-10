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
        "title": "Cleaning",
        "id": "cleaning",
        "description": "Clean the whole house or each room. Can include living room, kitchen, bathroom and other rooms.",
        "status": "active",
        "options": {
            "cleaningType": [
                {
                    "type": "All rooms",
                    "priceDefault": 400000,  // Giá cho toàn bộ nhà
                    "estimatedTime": 4       // Thời gian ước lượng hoàn thành (giờ)
                },
                {
                    "type": "Living room",
                    "priceDefault": 120000,  // Giá cho phòng khách
                    "estimatedTime": 1.5     // Thời gian ước lượng (giờ)
                },
                {
                    "type": "Kitchen",
                    "priceDefault": 100000,  // Giá cho phòng bếp
                    "estimatedTime": 1.5     // Thời gian ước lượng (giờ)
                },
                {
                    "type": "Bathroom",
                    "priceDefault": 80000,   // Giá cho phòng tắm
                    "estimatedTime": 1       // Thời gian ước lượng (giờ)
                },
                {
                    "type": "Bedroom",
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
                "description": "Provide cleaning supplies (brush, floor cleaner, cloth, etc.)",
                "priceAdjustment": 50000 // Increase price if the renter requests cleaning supplies
            }
        },
        "createDate": new Date(),
        "modifiedDate": new Date()
    },
    {
        title: 'Vehicle Repair',
        id: 'vehicleRepair',
        description: 'Repair, fix car',
        status: 'active',
        options: {
            workersNeeded: [1, 2, 3],
            vehicleType: ['Motorcycle', 'Car'],
            repairType: ['Tire repair', 'Tire replacement', 'Engine repair']
        },
        createDate: new Date(),
        modifiedDate: new Date()
    },
    {
        title: 'Plumbing Repair',
        id: 'plumbing',
        description: 'Repair plumbing in the building, public place',
        status: 'active',
        options: {
            repairType: ['Leak', 'Replace pipe', 'New installation'],
            estimatedRepairTime: [1, 2, 3],
            additionalService: ['Check water system']
        },
        createDate: new Date(),
        modifiedDate: new Date()
    },
    {
        title: 'Electrical Repair',
        id: 'electricalRepair',
        description: 'Repair electrical in the building',
        status: 'active',
        options: {
            repairType: ['Switch replacement', 'Light repair', 'New installation'],
            repairDuration: [1, 2, 3],
            additionalService: ['Check electrical system']
        },
        createDate: new Date(),
        modifiedDate: new Date()
    },
    {
        title: 'Cooking',
        id: 'cooking',
        description: 'Cook lunch, breakfast, dinner. Can cook for many people',
        status: 'active',
        options: {
            mealType: ['Breakfast', 'Lunch', 'Dinner'],
            peopleCount: [1, 2, 3, 4],
            prepTime: [1, 2, 3],
            specialRequests: ['Diet', 'Specific meal']
        },
        createDate: new Date(),
        modifiedDate: new Date()
    },
    {
        title: 'Laundry',
        id: 'laundry',
        description: 'Wash and dry clothes',
        status: 'active',
        options: {
            clothingType: ['Dry', 'Wet', 'Large clothes'],
            washDuration: [1, 2],
            additionalService: ['Dry clothes', 'Hand wash']
        },
        createDate: new Date(),
        modifiedDate: new Date()
    },
    {
        title: 'Pet Care',
        id: 'petCare',
        description: 'Feed, watch, spa for pets',
        status: 'active',
        options: {
            petType: ['Dog', 'Cat', 'Other'],
            careDuration: [1, 2],
            additionalService: ['Feed', 'Bath', 'Walk']
        },
        createDate: new Date(),
        modifiedDate: new Date()
    },
    {
        title: 'Drive help',
        id: 'driver',
        description: 'Drive help',
        status: 'active',
        options: {
            vehicleType: ['Car', 'Truck'],
            driveDuration: [1, 2, 3],
            destination: ['Location 1', 'Location 2'],
            additionalService: ['Drive for event', 'Travel']
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
