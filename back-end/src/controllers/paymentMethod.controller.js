
const PaymentMethod = require('../models/paymentMethod.model');
const jwt = require('jsonwebtoken');

// Create a new payment method
exports.createPaymentMethod = async (req, res) => {
    try {
        const paymentMethod = new PaymentMethod(req.body);
        await paymentMethod.save();
        res.status(201).json(paymentMethod);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getDefaultPaymentMethod = async (req, res) => {
    try {
        const user_id = jwt.verify(req.header('Authorization'), process.env.JWT_SECRET).userId;
        if (!user_id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const paymentMethod = await PaymentMethod.findOne({ userId: user_id, isDefault: true });
        if (!paymentMethod) {
            return res.status(404).json({ message: 'Default payment method not found' });
        }
        res.status(200).json(paymentMethod);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all payment methods for a user
exports.getPaymentMethods = async (req, res) => {
    try {
        const user_id = jwt.verify(req.header('Authorization'), process.env.JWT_SECRET).userId;
        if (!user_id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const paymentMethods = await PaymentMethod.find({ userId: user_id });
        res.status(200).json(paymentMethods);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a single payment method by ID
exports.getPaymentMethodById = async (req, res) => {
    try {
        const paymentMethod = await PaymentMethod.findById(req.params.id);
        if (!paymentMethod) {
            return res.status(404).json({ message: 'Payment method not found' });
        }
        res.status(200).json(paymentMethod);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a payment method by ID
exports.updatePaymentMethod = async (req, res) => {
    try {
        const paymentMethod = await PaymentMethod.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!paymentMethod) {
            return res.status(404).json({ message: 'Payment method not found' });
        }
        res.status(200).json(paymentMethod);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a payment method by ID
exports.deletePaymentMethod = async (req, res) => {
    try {
        const paymentMethod = await PaymentMethod.findByIdAndDelete(req.params.id);
        if (!paymentMethod) {
            return res.status(404).json({ message: 'Payment method not found' });
        }
        res.status(200).json({ message: 'Payment method deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};