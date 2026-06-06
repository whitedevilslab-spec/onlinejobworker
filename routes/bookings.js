const express = require('express');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Booking routes will be implemented
router.post('/', authenticate, (req, res) => {
  res.json({ message: 'Create booking' });
});

router.get('/:id', authenticate, (req, res) => {
  res.json({ message: 'Get booking details' });
});

router.put('/:id', authenticate, (req, res) => {
  res.json({ message: 'Update booking' });
});

router.delete('/:id', authenticate, (req, res) => {
  res.json({ message: 'Delete booking' });
});

module.exports = router;
