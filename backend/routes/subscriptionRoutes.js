const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getSubscription } = require('../controllers/subscriptionController');
const { protect, founderOnly } = require('../middleware/authMiddleware');

router.post('/create-order', protect, founderOnly, createOrder);
router.post('/verify', protect, founderOnly, verifyPayment);
router.get('/current', protect, founderOnly, getSubscription);

module.exports = router;
