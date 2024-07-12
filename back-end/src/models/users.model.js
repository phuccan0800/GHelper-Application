const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const userRole = require('./userRole.model');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: { type: Number, unique: true, },
  username: { type: String, required: true, unique: true, trim: true, },
  email: { type: String, required: true, unique: true, trim: true, },
  phone: { type: String, default: null, trim: true, },
  password: { type: String, required: true, length: 8 },
  region: { type: String, default: null, trim: true, },
  city: { type: String, default: null, trim: true, },
  firstname: { type: String, required: true, trim: true, },
  lastname: { type: String, required: true, trim: true, },
  createDate: { type: Date, default: Date.now },
  modifiedDate: { type: Date, default: Date.now },
  status: { type: Boolean, default: false, }
});


// middleware

userSchema.pre('save', async function (next) {
  const currentDate = new Date();
  this.modifiedDate = currentDate;
  if (!this.createDate) {
    this.createDate = currentDate;
  }

  if (this.isModified('password') || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      return next(error.message);
    }
  }

  next();
});

// Create User Role after user created
userSchema.post('save', async function (doc, next) {
  try {
    await userRole.create({ userID: doc._id, role: 'Customer', status: true });
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.pre('findOneAndUpdate', function (next) {
  this._update.modifiedDate = new Date();
  next();
});


// Tạo model từ schema và xuất ra
userSchema.plugin(AutoIncrement, { id: 'user_id_counter', inc_field: 'id' });

const User = mongoose.model('User', userSchema);

module.exports = User;
