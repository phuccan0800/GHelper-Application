const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const fileController = require('../controllers/file.controller');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const fileType = file.mimetype.split('/')[0];
        let dir = 'uploads/';

        // Xác định thư mục dựa trên loại file
        if (fileType === 'image') {
            dir += 'images/';
        } else if (file.mimetype === 'application/pdf') {
            dir += 'pdfs/';
        } else if (
            file.mimetype === 'application/msword' ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
            dir += 'docs/';
        } else {
            return cb(new Error('Unsupported file type'), null);
        }

        // Tạo thư mục nếu chưa tồn tại
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Cấu hình Multer với giới hạn kích thước tệp và thông báo lỗi
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn kích thước tệp 5MB
}).single('file');

// Route upload file
router.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: 'Multer error: ' + err.message });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }
        fileController.uploadFile(req, res);
    });
});

// Route tải file
router.get('/download/:fileId', fileController.downloadFile);

module.exports = router;
