const express = require('express');
const router = express.Router();
const fileController = require('../controllers/file.controller');
// const authMiddleware = require('../middlewares/');

router.post('/upload', fileController.uploadFile);
router.get('/download/:fileId', fileController.downloadFile);

module.exports = router;
