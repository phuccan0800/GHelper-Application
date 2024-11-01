const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PaymentMethodSchema = new Schema({
    type: { type: String, required: true, enum: ['Credit Card', 'PayPal', 'Bank Transfer'] },
    cardType: { type: String, enum: ['Visa', 'Mastercard', 'Amex', 'Discover', 'Maestro'], default: null },
    last4Digits: { type: String, required: true },
    expiryMonth: { type: Number, required: true },
    expiryYear: { type: Number, required: true },
    cardholderName: { type: String, required: true },
    token: { type: String, required: false },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isDefault: { type: Boolean, default: false },
}, {
    timestamps: true
});

module.exports = mongoose.model('PaymentMethod', PaymentMethodSchema);
