const stripeService = require('../services/stripe.service');
const Transaction = require('../models/transaction.model');
const User = require('../models/users.model');
const Booking = require('../models/booking.model');
const jwt = require('jsonwebtoken');

exports.createTransaction = async (req, res) => {
    try {
        const { amount, paymentMethodId, jobId, options, address, location } = req.body;
        const token = req.header('Authorization');
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);

        if (!amount || !paymentMethodId) {
            return res.status(400).json({ message: 'Amount and paymentMethodId are required' });
        }

        const user = await User.findById(userId);
        if (!user || !user.stripeCustomerId) {
            return res.status(404).json({ message: 'User or Stripe customer not found' });
        }

        const paymentIntent = await stripeService.createPaymentIntent(user.stripeCustomerId, amount, paymentMethodId);
        const transaction = new Transaction({
            user_id: userId,
            stripePaymentIntentId: paymentIntent.id,
            totalAmount: amount,
            adminCommission: amount * 0.1,
            workerEarnings: amount * 0.9,
        });
        await transaction.save();
        try {
            const booking = new Booking({
                job_id: jobId,
                user_id: userId,
                options,
                transactionId: transaction._id,
                workerFindingStatus: 'searching',
                timeCreated: new Date(),
                status: 'pending',
                address: address,
                location: location
            });
            await booking.save();
            res.status(201).json({ message: 'Transaction and Booking created successfully', booking_id: booking._id });
        } catch (error) {
            await Transaction.findByIdAndDelete(transaction._id);
            await stripeService.refundPaymentIntent(paymentIntent.id);
            res.status(400).json({ message: error.message });

        }

    } catch (error) {

        console.error('Error creating transaction and booking:', error);
        res.status(400).json({ message: error.message });
    }
};

exports.getTransactions = async (req, res) => {
    let transactions = [];
    const { userId } = jwt.verify(req.header('Authorization'), process.env.JWT_SECRET);
    const transactionsAll = await Transaction.find({ user_id: userId });
    for (const transaction of transactionsAll) {
        const stripePaymentIntent = await stripeService.getPaymentIntent(transaction.stripePaymentIntentId);
        const paymentMethod = await stripeService.getPaymentMethodById(stripePaymentIntent.paymentIntent.payment_method);
        let status = "Succeeded";
        if (stripePaymentIntent.charge.refunded === true) {
            status = "Refunded";
        }
        transactions.push({
            stripePaymentIntentId: transaction.stripePaymentIntentId,
            totalAmount: transaction.totalAmount,
            receiver: "GHelper Service",
            currency: stripePaymentIntent.paymentIntent.currency,
            paymentMethod: paymentMethod,
            status: status,
            createdAt: transaction.createdAt


        });
    }
    res.status(200).json(transactions);
};

exports.refundTransaction = async (req, res) => {
    try {
        const { transactionId } = req.body;
        await stripeService.refundPaymentIntent(transactionId);
        res.status(200).json({ message: 'Transaction refunded successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
