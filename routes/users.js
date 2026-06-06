const express = require('express');
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, userController.updateProfile);
router.get('/bookings', authenticate, userController.getBookings);
router.get('/bookings/:id', authenticate, userController.getBookingDetails);
router.put('/bookings/:id/cancel', authenticate, userController.cancelBooking);

module.exports = router;
