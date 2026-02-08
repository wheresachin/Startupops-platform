const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getSubscriptionStatus } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/subscription', protect, getSubscriptionStatus);

module.exports = router;
