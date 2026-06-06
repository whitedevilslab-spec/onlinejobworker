const express = require('express');
const { authenticate, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Admin routes will be implemented
router.get('/dashboard', authenticate, adminAuth, (req, res) => {
  res.json({ message: 'Admin dashboard' });
});

router.get('/workers', authenticate, adminAuth, (req, res) => {
  res.json({ message: 'Manage workers' });
});

router.post('/workers/:id/approve', authenticate, adminAuth, (req, res) => {
  res.json({ message: 'Approve worker' });
});

router.get('/bookings', authenticate, adminAuth, (req, res) => {
  res.json({ message: 'Monitor bookings' });
});

router.get('/reports', authenticate, adminAuth, (req, res) => {
  res.json({ message: 'Generate reports' });
});

module.exports = router;
