const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PaymentMethodSchema = new Schema({
    stripePaymentMethodId: { type: String, required: true }, // ID từ Stripe
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true,
});

module.exports = mongoose.model('PaymentMethod', PaymentMethodSchema);
