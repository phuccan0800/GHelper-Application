const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

// Định nghĩa schema cho người dùng
const UserSchema = new Schema({
  id: {
    type: Number,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  phone: {
    type: String,
    default: null,
    trim: true,
  },
  region: {
    type: String,
    default: null,
    trim: true,
  },
  city: {
    type: String,
    default: null,
    trim: true,
  },
  firstname: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
});

// Tạo model từ schema và xuất ra
UserSchema.plugin(AutoIncrement, { id: 'user_id_counter', inc_field: 'id' });

const User = mongoose.model('User', UserSchema);

module.exports = User;
