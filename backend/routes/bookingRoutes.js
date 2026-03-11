const express = require('express');
const router = express.Router();
const {
  createBooking,
  getAllBookings,
  getMyBookings 
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me', protect, getMyBookings); 

router.post('/', protect, createBooking);
router.get('/', getAllBookings);

module.exports = router;