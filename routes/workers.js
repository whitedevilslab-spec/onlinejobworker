const express = require('express');
const workerController = require('../controllers/workerController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/register', authenticate, workerController.registerWorker);
router.get('/', workerController.getWorkers);
router.get('/search', workerController.searchWorkers);
router.get('/:id', workerController.getWorkerDetails);
router.put('/profile/:id', authenticate, workerController.updateWorkerProfile);

module.exports = router;
