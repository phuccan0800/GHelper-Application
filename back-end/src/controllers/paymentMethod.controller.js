const PaymentMethod = require('../models/paymentMethod.model');
const jwt = require('jsonwebtoken');
const stripeService = require('../services/stripe.service');
const User = require('../models/users.model');

// Thêm thẻ mới
exports.addPaymentMethod = async (req, res) => {
    try {
        const { stripePaymentMethodId } = req.body;

        if (!stripePaymentMethodId) {
            return res.status(400).json({ message: 'stripePaymentMethodId is required' });
        }

        const token = req.header('Authorization');
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.stripeCustomerId) {
            const stripeCustomer = await stripeService.createCustomer(user.email, user.name);
            user.stripeCustomerId = stripeCustomer.id;
            await user.save();
        }

        await stripeService.attachPaymentMethod(stripePaymentMethodId, user.stripeCustomerId);
        await stripeService.updateCustomerDefaultPaymentMethod(user.stripeCustomerId, stripePaymentMethodId);

        const newPaymentMethod = new PaymentMethod({
            stripePaymentMethodId,
            userId,
        });

        await newPaymentMethod.save();
        return res.status(201).json({ message: 'Payment method added successfully' });
    } catch (error) {
        console.error('Error adding payment method:', error);
        res.status(400).json({ message: error.message });
    }
};

// Lấy danh sách thẻ
exports.getPaymentMethods = async (req, res) => {
    try {
        const token = req.header('Authorization');
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(userId);
        if (!user || !user.stripeCustomerId) {
            return res.status(404).json({ message: 'User or Stripe customer not found' });
        }

        const paymentMethods = await stripeService.getCustomerPaymentMethods(user.stripeCustomerId);
        res.status(200).json(paymentMethods);
    } catch (error) {
        console.error('Error fetching payment methods:', error);
        res.status(400).json({ message: error.message });
    }
};

// Xóa thẻ
exports.deletePaymentMethod = async (req, res) => {
    try {
        const paymentMethodId = req.params.id;

        await stripeService.detachPaymentMethod(paymentMethodId);
        await PaymentMethod.findOneAndDelete({ stripePaymentMethodId: paymentMethodId });

        res.status(200).json({ message: 'Payment method deleted successfully' });
    } catch (error) {
        console.error('Error deleting payment method:', error);
        res.status(400).json({ message: error.message });
    }
};

exports.setDefaultPaymentMethod = async (req, res) => {
    try {
        const paymentMethodId = req.params.id;
        console.log(paymentMethodId);
        if (!paymentMethodId) {
            return res.status(400).json({ message: 'paymentMethodId is required' });
        }

        const token = req.header('Authorization');
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(userId);
        if (!user || !user.stripeCustomerId) {
            return res.status(404).json({ message: 'User or Stripe customer not found' });
        }

        // Đặt paymentMethodId làm mặc định trên Stripe
        const result = await stripeService.setDefaultPaymentMethod(paymentMethodId);

        res.status(200).json({ message: 'Default payment method updated successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getPaymentMethodById = async (req, res) => {
    const { id } = req.params;
    const paymentMethod = await PaymentMethod.findOne({ stripePaymentMethodId: id });
    if (!paymentMethod) {
        return res.status(404).json({ message: 'Payment method not found' });
    }
    const stripePaymentMethod = await stripeService.getPaymentMethodById(paymentMethod.stripePaymentMethodId);
    res.status(200).json(stripePaymentMethod);
};