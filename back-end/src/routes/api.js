const express = require('express');
const { authenticateJWT } = require('../middlewares/auth.middleware');
const { GetHomePage, GetTTP } = require('../controllers/HomeController');
const userController = require('../controllers/User.controller');
const userRoleController = require('../controllers/userRole.controller');
const authController = require('../controllers/auth.controller')
const router = express.Router();
const multer = require('multer');

// Thiết lập nơi lưu trữ tạm thời
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Home routes
router.get('/', GetHomePage);
router.get('/GetTTP', GetTTP);

// User Routes 
router.post('/register', userController.register);
router.get('/logout', authenticateJWT, userController.logout);
router.post('/changeAvatar', authenticateJWT, upload.single('avatar'), userController.changeAvatar);
router.post('/editProfile', authenticateJWT, userController.editProfile);
router.get('/@me', authenticateJWT, userController.getUser);
router.get('/logoutAll', authenticateJWT, userController.logoutAll);
router.get('/users/sesssions', authenticateJWT,  userController.getUserSessions);
router.get('/users', authenticateJWT, userController.getUsers);
router.get('/users/:id', authenticateJWT, userController.getUserById);
router.put('/users/:id', authenticateJWT, userController.updateUser);
router.delete('/users/:id', authenticateJWT, userController.deleteUser);

// User Role Routes
router.post('/userRoles', authenticateJWT, userRoleController.createUserRole);
router.get('/userRoles', authenticateJWT,  userRoleController.getUserRoles);
router.get('/userRoles/:id', authenticateJWT,  userRoleController.getUserRoleById);
router.put('/userRoles/:id', authenticateJWT,  userRoleController.updateUserRole);
router.delete('/userRoles/:id', authenticateJWT,  userRoleController.deleteUserRole);


// Auth Routes
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/reset', authController.confirmResetPassword);


module.exports = router;