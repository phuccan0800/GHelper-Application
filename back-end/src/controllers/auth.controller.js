const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/users.model');
const userRole = require('../models/userRole.model')

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
        res.status(500).json({ message: error.message });
    }
};

module.exports = { register, login };
