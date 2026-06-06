const express = require('express');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Payment routes will be implemented
router.post('/create-intent', authenticate, (req, res) => {
  res.json({ message: 'Create payment intent' });
});

router.post('/confirm', authenticate, (req, res) => {
  res.json({ message: 'Confirm payment' });
});

router.get('/history', authenticate, (req, res) => {
  res.json({ message: 'Get payment history' });
});

module.exports = router;
