const express = require('express');
const router = express.Router();
const { createFeedback, getFeedback, updateFeedbackStatus } = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', createFeedback);
router.get('/', protect, getFeedback);
router.put('/:id', protect, updateFeedbackStatus);

module.exports = router;
