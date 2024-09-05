const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    file_name: { type: String, required: true },
    file_path: { type: String, required: true },
    file_type: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', fileSchema);
