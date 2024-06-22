const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/users.model');
const userRole = require('../models/userRole.model')
const emailService = require('../services/email.service');

const { encrypt, decrypt, } = require('../utils/cryption');

const register = async (req, res) => {
    try {
        const { username, email, password, firstname, lastname } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const newUser = new User({ username, email, password, firstname, lastname });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        userId = user._id;
        const roles = await userRole.find({ userID: userId });
        const userRoles = [];


        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        for (let i = 0; i < roles.length; i++) {
            userRoles.push(roles[i].role);
        }
        const token = jwt.sign({ userId: user._id, role: userRoles }, process.env.JWT_SECRET, { expiresIn: '9000h' });
        res.json({ token });
    } catch (error) {
        if (error.message.includes('Cannot read proper')) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        res.status(500).json({ message: error.message });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (user) {
            emailService.resetPassword(email);
            const emailencrypt = encrypt(email);
            token = jwt.sign({ email: emailencrypt }, process.env.JWT_SECRET, { expiresIn: '5m' });
            res.status(200).json({ message: 'Successful send email', token: token });
        }
        else {
            return res.status(400).json({ message: 'Email does not exist' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const confirmResetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decrypt(decoded.email);
        const user = await User.findOne({ email });

        if (user) {
            user.password = password;
            await user.save();
            res.status(200).json({ message: 'Password reset successfully' });
        }
        else {
            return res.status(400).json({ message: 'Email does not exist' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const logout = async (req, res) => {
    try {
        const token = req.header('Authorization');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const expiration = decoded.exp - Math.floor(Date.now() / 1000);

        await redisClient.set(token, 'true', 'EX', expiration);
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = { register, login, forgotPassword, confirmResetPassword, logout };
