const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const User = require('../models/users.model');
const userRole = require('../models/userRole.model')
const emailService = require('../services/email.service');
const redis = require('../config/redis');
const { encrypt, decrypt, } = require('../utils/cryption');
const analyzeUser = require('../utils/analyzeUser');
const UnitOfWork = require('../UnitOfWork/UnitOfWork');

const login = async (req, res) => {
    const unitOfWork = new UnitOfWork();
    await unitOfWork.start();
    try {
        const { email, password } = req.body;
        const user = await unitOfWork.repositories.userRepository.findOneByEmail(email);

        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const deviceInfor = analyzeUser(req);
        //Generate Role
        const userId = user._id;
        const roles = await unitOfWork.repositories.userRoleRepository.findByUserId(userId);
        const userRoles = [];
        for (let i = 0; i < roles.length; i++) {
            userRoles.push(roles[i].role);
        }

        //Generate Token
        const token = jwt.sign({ userId: user._id, role: userRoles }, process.env.JWT_SECRET, { expiresIn: '9000h' });
        // Add token in Redis list
        await redis.client.rPush(userId.toString(), token);
        await redis.client.set(token, JSON.stringify(deviceInfor), 'EX', 9000 * 3600);

        res.json({ token });
    } catch (error) {
        // if (error.message.includes('Cannot read proper')) {
        //     return res.status(400).json({ message: 'Invalid email or password' });
        // }
        await unitOfWork.rollback();
        res.status(500).json({ message: error.message });

    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (user) {
            await redis.client.del(email);
            const code = Math.floor(100000 + Math.random() * 900000);
            const ttl = 300;
            emailService.resetPassword(email, code);
            const emailencrypt = encrypt(email);
            await redis.client.set(emailencrypt, code, 'EX', ttl);
            const token = crypto.randomBytes(35).toString('hex').toUpperCase();
            await redis.client.set(token, emailencrypt, 'EX', ttl);
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
    // try {
    const { token, code, password } = req.body;

    const emailInRedis = await redis.client.get(token);
    if (!emailInRedis) {
        return res.status(400).json({ message: 'Invalid token reset or code' });
    }
    const emailDecrypt = decrypt(emailInRedis);
    const codeInRedis = await redis.client.get(emailInRedis);

    if (code === codeInRedis) {
        await redis.client.del(emailInRedis);
        await redis.client.del(token);
    }
    else {
        return res.status(400).json({ message: 'Invalid code' });
    }

    const user = await User.findOne({ email: emailDecrypt });
    if (user) {
        user.password = password;
        await user.save();
        res.status(200).json({ message: 'Password reset successfully' });
    }
    else {
        return res.status(400).json({ message: 'Email does not exist' });
    }
    // }
    // catch (error) {
    //     res.status(500).json({ message: error.message });
    // }
}

module.exports = { login, forgotPassword, confirmResetPassword };
