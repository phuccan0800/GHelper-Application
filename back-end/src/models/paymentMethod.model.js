const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PaymentMethodSchema = new Schema({
    type: { type: String, required: true, enum: ['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer'] },
    provider: { type: String, required: true },
    accountNumber: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isDefault: { type: Boolean, default: false },
}, {
    timestamps: true
});

module.exports = mongoose.model('PaymentMethod', PaymentMethodSchema);