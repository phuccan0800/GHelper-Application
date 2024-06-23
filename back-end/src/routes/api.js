const express = require('express');
const { authenticateJWT, authorizeRoles } = require('../middlewares/auth.middleware');
const { GetHomePage, GetTTP } = require('../controllers/HomeController');
const userController = require('../controllers/User.controller');
const userRoleController = require('../controllers/userRole.controller');
const authController = require('../controllers/auth.controller')
const router = express.Router();

// Home routes
router.get('/', GetHomePage);
router.get('/GetTTP', GetTTP);

// User Routes 
router.post('/register', userController.register);
router.get('/logout', authenticateJWT, authorizeRoles('Customer'), userController.logout);
router.get('/logoutAll', authenticateJWT, authorizeRoles('Customer'), userController.logoutAll);
router.get('/users/sesssions', authenticateJWT, authorizeRoles('Customer'), userController.getUserSessions);
router.get('/users', authenticateJWT, authorizeRoles('Admin'), userController.getUsers);
router.get('/users/:id', authenticateJWT, authorizeRoles('Admin'), userController.getUserById);
router.put('/users/:id', authenticateJWT, authorizeRoles('Admin'), userController.updateUser);
router.delete('/users/:id', authenticateJWT, authorizeRoles('Admin'), userController.deleteUser);

// User Role Routes
router.post('/userRoles', authenticateJWT, authorizeRoles('Admin'), userRoleController.createUserRole);
router.get('/userRoles', authenticateJWT, authorizeRoles('Admin'), userRoleController.getUserRoles);
router.get('/userRoles/:id', authenticateJWT, authorizeRoles('Admin'), userRoleController.getUserRoleById);
router.put('/userRoles/:id', authenticateJWT, authorizeRoles('Admin'), userRoleController.updateUserRole);
router.delete('/userRoles/:id', authenticateJWT, authorizeRoles('Admin'), userRoleController.deleteUserRole);

// Auth Routes
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/reset', authController.confirmResetPassword);


module.exports = router;