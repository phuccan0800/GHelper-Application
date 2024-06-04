const userRepository = require('../repositories/users.repository');
const User = require('../models/users.model');
const UserDTO = require('../dtos/users.dto');

// Create User
const createUser = async (req, res) => {
  try {
    const { username, email, phone, region, city, firstname, lastname } = req.body;
    const newUser = await userRepository.create({ username, email, phone, region, city, firstname, lastname });
    const userDTO = new UserDTO(newUser.toObject());
    res.status(201).json({ message: 'User created successfully', user: userDTO });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get User List
const getUsers = async (req, res) => {
  try {
    const users = await userRepository.findAll();
    const usersDTO = users.map(user => new UserDTO(user.toObject()));
    res.json(usersDTO);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Information
const getUserById = async (req, res) => {
  try {
    const user = await userRepository.findById(req.params.id);
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
    const { username, email, phone, region, city, firstname, lastname } = req.body;
    const user = await userRepository.update(req.params.id, { username, email, phone, region, city, firstname, lastname });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userDTO = new UserDTO(user.toObject());
    res.json({ message: 'User updated successfully', user: userDTO });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa người dùng
const deleteUser = async (req, res) => {
  try {
    const user = await userRepository.delete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status500.json({ message: error.message });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
