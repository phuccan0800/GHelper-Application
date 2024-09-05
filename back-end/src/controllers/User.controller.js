const User = require('../models/users.model');
const UserDTO = require('../dtos/users.dto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const redis = require('../config/redis');

// Create User
const createUser = async (req, res) => {
  try {
    const { username, email, phone, password, region, city, firstname, lastname } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, phone, password: hashedPassword, region, city, firstname, lastname });
    await newUser.save();
    const userDTO = new UserDTO(newUser.toObject());
    res.status(201).json({ message: 'User created successfully', user: userDTO });
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern && error.keyPattern.username) {
        return res.status(400).json({ message: 'Username already exists' });
      } else if (error.keyPattern && error.keyPattern.email) {
        return res.status(400).json({ message: 'Email already exists' });
      } else {
        return res.status(400).json({ message: error.message });
      }
    }
    res.status(500).json({ message: error.message });
  }
};

// Get User Information
const getUser = async (req, res) => {
  const token = req.header('Authorization');
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userDTO = new UserDTO(user.toObject());
    res.json(userDTO);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User List
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    const usersDTO = users.map(user => new UserDTO(user.toObject()));
    res.json(usersDTO);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Information by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userDTO = new UserDTO(user.toObject());
    res.json(userDTO);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update User Information
const updateUser = async (req, res) => {
  try {
    const { email, phone, region, city, name, password } = req.body;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const updateData = { email, phone, region, city, name, password: hashedPassword };
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userDTO = new UserDTO(user.toObject());
    res.json({ message: 'User updated successfully', user: userDTO });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: false }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    const token = req.header('Authorization');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    await redis.client.del(token);
    await redis.client.lRem(userId.toString(), 0, token);
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout all devices
const logoutAll = async (req, res) => {
  try {
    const userToken = req.headers.authorization;
    const userId = jwt.verify(userToken, process.env.JWT_SECRET).userId;
    const tokens = await redis.client.lRange(userId.toString(), 0, -1);
    if (tokens.length > 0) {
      await Promise.all(tokens.map(async token => {
        await redis.client.del(token);
      }));
      await redis.client.del(userId.toString());
    }
    res.status(200).json({ message: 'Logged out from all devices successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register user
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const newUser = new User({ email, password: password, name });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern && error.keyPattern.email) {
        return res.status(400).json({ message: 'Email already exists' });
      } else {
        return res.status(400).json({ message: error.message });
      }
    }
    res.status(500).json({ message: error.message });
  }
};

// Get User Sessions
const getUserSessions = async (req, res) => {
  try {
    const userToken = req.headers.authorization;
    const user = jwt.verify(userToken, process.env.JWT_SECRET);
    if (!user) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    const tokens = await redis.client.lRange(user.userId.toString(), 0, -1);
    const userSessions = await Promise.all(tokens.map(async token => {
      const session = await redis.client.get(token);
      return JSON.parse(session);
    }));
    res.json(userSessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const changeAvatar = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const fileData = req.file;
    const uploadResponse = await fileStorageService.uploadAvatar(fileData);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    console.log(userId);
    // Cập nhật đường dẫn avatar trong cơ sở dữ liệu
    await User.findOneAndUpdate(userId, { avtImg: uploadResponse.link }, { new: true });

    res.status(200).json({ message: 'Avatar uploaded successfully', data: uploadResponse });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  register,
  logout,
  logoutAll,
  getUserSessions,
  getUser,
  changeAvatar
};
