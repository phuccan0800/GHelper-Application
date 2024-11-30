const File = require('../models/file.model');
// Cấu hình multer để lưu trữ file theo loại


exports.uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload a file.' });
    }

    try {
        const file = new File({
            file_name: req.file.originalname,
            file_path: req.file.path, // Đường dẫn file trên server
            file_type: req.file.mimetype // Lưu loại file
        });
        const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path}`.replace(/\\/g, '/');
        await file.save();

        res.status(200).json({ message: 'File uploaded successfully.', link: fileUrl });
    } catch (saveError) {
        console.error("Error saving file:", saveError);
        res.status(500).json({ message: 'Error saving file information.' });
    }
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
