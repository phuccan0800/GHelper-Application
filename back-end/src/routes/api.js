const express = require('express');
const { GetHomePage, GetTTP } = require('../controllers/HomeController');
const userController = require('../controllers/User.controller');
const router = express.Router();

router.get('/', GetHomePage);
router.get('/GetTTP', GetTTP);

// User Routes 
router.post('/register', userController.createUser);
router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);
module.exports = router;