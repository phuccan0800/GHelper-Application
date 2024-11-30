
const PaymentMethod = require('../models/paymentMethod.model');
const jwt = require('jsonwebtoken');
const cardType = require('credit-card-type');

// Create a new payment method
exports.addPaymentMethod = async (req, res) => {
    try {
        const { cardNumber, expiryMonth, expiryYear, cardholderName } = req.body;
        if (!cardNumber || !expiryMonth || !expiryYear || !cardholderName) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const user_id = jwt.verify(req.header('Authorization'), process.env.JWT_SECRET).userId;
        if (!user_id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const cardInfo = cardType(cardNumber.replace(/\s/g, ''))[0];
        if (!cardInfo) {
            return res.status(400).json({ message: 'The Card invalid' });
        }
        let isDefault = req.body.isDefault || false;
        const allPaymentMethods = (await PaymentMethod.find({ userId: user_id })).filter(method => method.isDefault === true);
        if (allPaymentMethods.length === 0) {
            isDefault = true;
        }

        const cardTypeName = cardInfo.niceType;
        const userId = user_id;
        const last4Digits = cardNumber.slice(-4);

        const newPaymentMethod = new PaymentMethod({
            type: 'Credit Card',
            cardType: cardTypeName,
            last4Digits,
            expiryMonth,
            expiryYear,
            cardholderName: cardholderName.toUpperCase(),
            userId,
            isDefault: isDefault
        });
        await newPaymentMethod.save();
        return res.status(201).json({
            message: 'Payment method added successfully',
            paymentMethod: {
                id: newPaymentMethod._id,
                cardType: newPaymentMethod.cardType,
                last4Digits: newPaymentMethod.last4Digits,
                expiryMonth: newPaymentMethod.expiryMonth,
                expiryYear: newPaymentMethod.expiryYear,
                cardholderName: newPaymentMethod.cardholderName
            }
        });
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
        res.status(200).json(paymentMethods.map(method => ({
            id: method._id,
            cardType: method.cardType,
            last4Digits: method.last4Digits,
            expiryMonth: method.expiryMonth,
            expiryYear: method.expiryYear,
            cardholderName: method.cardholderName,
            isDefault: method.isDefault
        })));

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a single payment method by ID
exports.getPaymentMethodById = async (req, res) => {
    try {

        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'ID parameter is required' });
        }
        const paymentMethod = await PaymentMethod.findById(id);
        if (!paymentMethod) {
            return res.status(404).json({ message: 'Payment method not found' });
        }
        res.status(200).json({
            id: paymentMethod._id,
            cardType: paymentMethod.cardType,
            last4Digits: paymentMethod.last4Digits,
            expiryMonth: paymentMethod.expiryMonth,
            expiryYear: paymentMethod.expiryYear,
            cardholderName: paymentMethod.cardholderName,
            isDefault: paymentMethod.isDefault
        });
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
        const { id } = req.params;
        const paymentMethod = await PaymentMethod.findById(id);
        if (!paymentMethod) {
            return res.status(404).json({ message: 'Payment method not found' });
        }
        await PaymentMethod.findByIdAndDelete(id);
        res.status(200).json({ message: 'Payment method deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.setIsDefault = async (req, res) => {
    const { id } = req.params;
    const user_id = jwt.verify(req.header('Authorization'), process.env.JWT_SECRET).userId;
    if (!user_id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const PaymentMethodsOld = (await PaymentMethod.find({ userId: user_id })).filter(method => method.isDefault === true);
    if (PaymentMethodsOld.length > 0) {
        await PaymentMethod.updateMany({ userId: user_id }, { isDefault: false });

    }
    const paymentMethod = await PaymentMethod.findById(id);
    if (!paymentMethod) {
        return res.status(404).json({ message: 'Payment method not found' });
    }
    await PaymentMethod.updateOne({ _id: id }, { isDefault: !paymentMethod.isDefault });
    res.status(200).json({ message: 'Default payment method updated' });
};