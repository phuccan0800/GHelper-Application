const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userRole = require('./userRole.model');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true, trim: true, },
  password: { type: String, required: true, minlength: 8 },
  email: { type: String, required: true, unique: true, trim: true, },
  phone: { type: String, default: null, trim: true, },
  gender: { type: String, default: null, trim: true, },
  birthDate: { type: Date, default: null, trim: true, },
  IDCard: { type: String, default: null, trim: true, },
  avtImg: { type: String, default: null, trim: true, },
  region: { type: String, default: null, trim: true, },
  createDate: { type: Date, default: Date.now },
  modifiedDate: { type: Date, default: Date.now },
  status: { type: Boolean, default: false, },
  roles: { type: mongoose.Schema.Types.ObjectId, ref: 'UserRole' },
  stripeCustomerId: { type: String, default: null }
});


// middleware

userSchema.pre('save', async function (next) {
  const currentDate = new Date();
  this.modifiedDate = currentDate;
  if (!this.createDate) {
    this.createDate = currentDate;
  }

  if (!this.roles) {
    this.roles = await userRole.findOne({ role_name: 'customer' });
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

userSchema.pre('findOneAndUpdate', function (next) {
  this._update.modifiedDate = new Date();
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
