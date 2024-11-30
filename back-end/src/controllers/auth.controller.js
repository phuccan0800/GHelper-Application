const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const User = require('../models/users.model');
const UserRole = require('../models/userRole.model');
const emailService = require('../services/email.service');
const redis = require('../config/redis');
const { encrypt, decrypt } = require('../utils/cryption');
const analyzeUser = require('../utils/analyzeUser');
const e = require('express');

// Login
const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email.toLowerCase();
        console.log(email);

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const deviceInfor = analyzeUser(req);
        const userId = user._id;
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '9000h' });
        await redis.client.rPush(userId.toString(), token);
        await redis.client.set(token, JSON.stringify(deviceInfor), 'EX', 9000 * 3600);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Forgot Password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        const user = await User.findOne({
        });
        if (user) {
            const code = String(Math.floor(100000 + Math.random() * 900000));
            const ttl = 300;
            emailService.resetPassword(email, code);

            const token = crypto.randomBytes(35).toString('hex').toUpperCase();
            await redis.client.set(code, email, {
                EX: ttl
            });
            await redis.client.set(token, code, {
                EX: ttl
            });
            res.status(200).json({ message: 'Successful send email', token: token });
        } else {
            return res.status(400).json({ message: 'Email does not exist' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Confirm Reset Password
const confirmResetPassword = async (req, res) => {
    try {
        const { token, code, password } = req.body;

        const codeInRedis = await redis.client.get(token);
        if (!codeInRedis) {
            return res.status(400).json({ message: 'Invalid token reset' });
        }
        const emailInRedis = await redis.client.get(codeInRedis);
        console.log(emailInRedis,
            codeInRedis,
            code,
        );
        if (!emailInRedis || codeInRedis !== String(code)) {
            return res.status(400).json({ message: 'Invalid token reset or code' });
        }
        if (String(code) === codeInRedis && emailInRedis) {
            await redis.client.del(token);
            await redis.client.del(codeInRedis);
        } else {
            return res.status(400).json({ message: 'Invalid code' });
        }

        const user = await User.findOne({ email: emailInRedis });
        if (user) {
            user.password = password;
            await user.save();
            res.status(200).json({ message: 'Password reset successfully' });
        } else {
            return res.status(400).json({ message: 'Email does not exist' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { login, forgotPassword, confirmResetPassword };
