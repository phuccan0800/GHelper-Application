const UserDTO = require('../dtos/users.dto');
const UnitOfWork = require('../UnitOfWork/UnitOfWork');
const jwt = require('jsonwebtoken');

// Create User
const createUser = async (req, res) => {

  const unitOfWork = new UnitOfWork();
  await unitOfWork.start();

  try {
    const { username, email, phone, password, region, city, firstname, lastname } = req.body;
    const newUser = await unitOfWork.repositories.userRepository.create({ username, email, phone, password, region, city, firstname, lastname });
    const userDTO = new UserDTO(newUser.toObject());
    await unitOfWork.commit();
    res.status(201).json({ message: 'User created successfully', user: userDTO });
  } catch (error) {
    await unitOfWork.rollback();
    if (error.code === 11000) {
      if (error.keyPattern && error.keyPattern.username) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      else if (error.keyPattern && error.keyPattern.email) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      else {
        return res.status(400).json({ message: error.message });
      }
    }
  }

};

// Get User Information
const getUser = async (req, res) => {
  const unitOfWork = new UnitOfWork();
  await unitOfWork.start();
  const token = req.header('Authorization');
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.userId;
  try {
    const user = await unitOfWork.repositories.userRepository.findById(userId);
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
    const { username, email, phone, region, city, firstname, lastname, password } = req.body;
    const user = await unitOfWork.repositories.userRepository.update(req.params.id, { username, email, phone, password, region, city, firstname, lastname });
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
    const user = await unitOfWork.repositories.userRepository.update(req.params.id, { status: false });
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

const logout = async (req, res) => {
  const unitOfWork = new UnitOfWork();
  await unitOfWork.start();
  try {
    const token = req.header('Authorization');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    await unitOfWork.removeDeviceToken(token);
    await unitOfWork.removeSessionToken(userId, token);
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logoutAll = async (req, res) => {
  const unitOfWork = new UnitOfWork();
  await unitOfWork.start();
  try {
    const userToken = req.headers.authorization;
    const userId = jwt.verify(userToken, process.env.JWT_SECRET).userId;
    const tokens = await unitOfWork.getSessionTokens(userId);
    if (tokens.length > 0) {
      await Promise.all(tokens.map(async token => {
        await unitOfWork.removeDeviceToken(token);
        await unitOfWork.removeSessionToken(userId, token);
      }));
    }
    await unitOfWork.commit();
    res.status(200).json({ message: 'Logged out from all devices successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const register = async (req, res) => {
  const unitOfWork = new UnitOfWork();
  await unitOfWork.start();
  try {
    const { username, email, password, firstname, lastname } = req.body;
    await unitOfWork.repositories.userRepository.create({ username, email, password, firstname, lastname });
    await unitOfWork.commit();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern && error.keyPattern.username) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      else if (error.keyPattern && error.keyPattern.email) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      else {
        return res.status(400).json({ message: error.message });
      }
    }
    res.status(500).json({ message: error.message });
    await unitOfWork.rollback();
  }
};

const getUserSessions = async (req, res) => {
  const unitOfWork = new UnitOfWork();
  await unitOfWork.start();
  try {

    const userToken = req.headers.authorization;
    const user = jwt.verify(userToken, process.env.JWT_SECRET);
    if (!user) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    const tokens = await unitOfWork.getSessionTokens(user.userId);

    const userSessions = await Promise.all((tokens || []).map(async token => {
      return await unitOfWork.getUserSessionByToken(token);
    }));
    console.log(userSessions);
    res.json(userSessions);

  } catch (error) {
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
  getUser
};
