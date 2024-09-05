const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const fileController = require('../controllers/file.controller');
// const authMiddleware = require('../middlewares/');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const fileType = file.mimetype.split('/')[0];
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

const upload = multer({ storage: storage })

router.post('/upload', upload.single('avatar'), fileController.uploadFile);
router.get('/download/:fileId', fileController.downloadFile);

module.exports = router;
