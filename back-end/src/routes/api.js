const express = require('express');
const { authenticateJWT, workerAuthenticate } = require('../middlewares/auth.middleware');
const { GetHomePage, GetTTP } = require('../controllers/HomeController');
const userController = require('../controllers/User.controller');
const userRoleController = require('../controllers/userRole.controller');
const authController = require('../controllers/auth.controller')
const workerController = require('../controllers/worker.controller');
const jobController = require('../controllers/job.controller');
const paymentMethodController = require('../controllers/paymentMethod.controller');
const transactionController = require('../controllers/transaction.controller');
const bookingController = require('../controllers/booking.controller');
const reviewController = require('../controllers/review.controller');
const router = express.Router();

// Home routes
router.get('/', GetHomePage);
router.get('/GetTTP', GetTTP);

// User Routes 
router.post('/register', userController.register);
router.get('/logout', authenticateJWT, userController.logout);
router.post('/changeAvatar', authenticateJWT, userController.changeAvatar);
router.post('/editProfile', authenticateJWT, userController.editProfile);
router.get('/@me', authenticateJWT, userController.getUser);
router.get('/logoutAll', authenticateJWT, userController.logoutAll);
router.get('/users/sesssions', authenticateJWT, userController.getUserSessions);
router.get('/users', authenticateJWT, userController.getUsers);
router.get('/users/:id', authenticateJWT, userController.getUserById);
router.put('/users/:id', authenticateJWT, userController.updateUser);
router.delete('/users/:id', authenticateJWT, userController.deleteUser);

// User Role Routes
router.post('/userRoles', authenticateJWT, userRoleController.createUserRole);
router.get('/userRoles', authenticateJWT, userRoleController.getUserRoles);
router.get('/userRoles/:id', authenticateJWT, userRoleController.getUserRoleById);
router.put('/userRoles/:id', authenticateJWT, userRoleController.updateUserRole);
router.delete('/userRoles/:id', authenticateJWT, userRoleController.deleteUserRole);


// Auth Routes
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/reset', authController.confirmResetPassword);

// Worker Routes
router.post('/loginWorker', workerController.loginWorker);
router.get('/checkWorkerRegistration', authenticateJWT, workerController.checkWorkerRegistration);
router.post('/registerWorker', authenticateJWT, workerController.registerWorker);
router.get('/getWorkerInfo', authenticateJWT, workerController.getWorkerInfo);
router.post('/findAndAssignWorker', authenticateJWT, workerController.findAndAssignWorker);
router.get('/location', authenticateJWT, workerController.getWorkerLocationApi);
router.get('/worker-status', authenticateJWT, workerController.getWorkerStatus);

//Job routes
router.get('/jobs', authenticateJWT, jobController.getAllJobs);
router.get('/jobs/available', authenticateJWT, jobController.getAvailableJobs);
router.post('/checkJobPrice', authenticateJWT, jobController.checkJobPrice);

// Payment Method Routes
router.get('/allPaymentMethods', authenticateJWT, paymentMethodController.getPaymentMethods);
router.post('/addPaymentMethod', authenticateJWT, paymentMethodController.addPaymentMethod);
router.get('/paymentMethods/:id', authenticateJWT, paymentMethodController.getPaymentMethodById);
router.put('/setIsDefault/:id', authenticateJWT, paymentMethodController.setDefaultPaymentMethod);
router.delete('/paymentMethods/:id', authenticateJWT, paymentMethodController.deletePaymentMethod);

// Transaction Routes
router.post('/createTransaction', authenticateJWT, transactionController.createTransaction);
router.post('/refundTransaction', authenticateJWT, transactionController.refundTransaction);
router.get('/transactions', authenticateJWT, transactionController.getTransactions);

// Booking Routes
router.get('/bookings/', authenticateJWT, bookingController.getAllBookings);
router.get('/bookings/:id', authenticateJWT, bookingController.getBookingById);
router.get('/bookings/user/:userId', authenticateJWT, bookingController.getUserBookings);

// Review Routes
router.post('/reviews', authenticateJWT, reviewController.AddReview);
module.exports = router;
