const User = require('../models/users.model');
const UserDTO = require('../dtos/users.dto');
const UnitOfWork = require('../UnitOfWork/UnitOfWork');

// Create User
const createUser = async (req, res) => {

  const unitOfWork = new UnitOfWork();
  await unitOfWork.start();

  try {
    const { username, email, phone, region, city, firstname, lastname } = req.body;
    const newUser = await unitOfWork.repositories.userRepository.create({ username, email, phone, region, city, firstname, lastname });
    const userDTO = new UserDTO(newUser.toObject());
    await unitOfWork.commit();
    res.status(201).json({ message: 'User created successfully', user: userDTO });
  } catch (error) {
    await unitOfWork.rollback();
    res.status(400).json({ message: error.message });
  }

};

// Get User List
const getUsers = async (req, res) => {
  try {
    const unitOfWork = new UnitOfWork();
    await unitOfWork.start();
    const users = await unitOfWork.repositories.userRepository.findAll();
    const usersDTO = users.map(user => new UserDTO(user.toObject()));
    res.json(usersDTO);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Information
const getUserById = async (req, res) => {
  try {
    const unitOfWork = new UnitOfWork();
    await unitOfWork.start();
    const user = await unitOfWork.repositories.userRepository.findById(req.params.id);
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
  const unitOfWork = new UnitOfWork();
  await unitOfWork.start();

  try {
    const { username, email, phone, region, city, firstname, lastname } = req.body;
    const objectId = await unitOfWork.repositories.userRepository.findById(req.params.id);
    console.log(objectId);
    const user = await unitOfWork.repositories.userRepository.update(objectId, { username, email, phone, region, city, firstname, lastname });
    if (!user) {
      await unitOfWork.rollback();
      return res.status(404).json({ message: 'User not found' });
    }
    const userDTO = new UserDTO(user.toObject());
    await unitOfWork.commit();
    res.json({ message: 'User updated successfully', user: userDTO });
  } catch (error) {
    await unitOfWork.rollback();
    res.status(400).json({ message: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const unitOfWork = new UnitOfWork();
  await unitOfWork.start();
  try {
    const user = await unitOfWork.repositories.userRepository.delete(req.params.id);
    if (!user) {
      await unitOfWork.rollback();
      return res.status(404).json({ message: 'User not found' });
    }
    await unitOfWork.commit();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    await unitOfWork.rollback();
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
