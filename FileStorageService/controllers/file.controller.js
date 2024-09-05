const multer = require('multer');
const path = require('path');
const fs = require('fs');
const File = require('../models/File.model');

// Cấu hình multer để lưu trữ file theo loại
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const fileType = file.mimetype.split('/')[0];

        // Xác định thư mục lưu trữ dựa trên loại file
        let dir = 'uploads/';
        if (fileType === 'image') {
            dir += 'images/';
        } else if (fileType === 'application/pdf') {
            dir += 'pdfs/';
        } else if (fileType === 'application/msword' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            dir += 'docs/';
        } else {
            return cb(new Error('Unsupported file type'), null);
        }

        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).single('file');

exports.uploadFile = async (req, res) => {
    upload(req, res, async (err) => {
        if (!req.file) {
            console.log(req.file);
            return res.status(400).json({ message: 'Please upload a file.' });
        }
        if (err) {
            return res.status(500).json({ message: 'Error uploading file.' });
        }

        const file = new File({
            file_name: req.file.originalname,
            file_path: req.file.path, // Đường dẫn file trên server
            file_type: req.file.mimetype // Lưu loại file
        });
        const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path}`;
        await file.save();
        res.status(200).json({ message: 'File uploaded successfully.', link: fileUrl });
    });
};

exports.downloadFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.fileId);
        if (!file || file.uploaded_by.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You do not have permission to download this file.' });
        }

        res.download(file.file_path); // Tải file từ đường dẫn trên server
    } catch (err) {
        res.status(500).json({ error: 'Error downloading file.' });
    }
};
