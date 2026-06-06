const express = require('express');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Review routes will be implemented
router.post('/', authenticate, (req, res) => {
  res.json({ message: 'Add review' });
});

router.get('/worker/:id', (req, res) => {
  res.json({ message: 'Get worker reviews' });
});

router.put('/:id', authenticate, (req, res) => {
  res.json({ message: 'Update review' });
});

router.delete('/:id', authenticate, (req, res) => {
  res.json({ message: 'Delete review' });
});

module.exports = router;
