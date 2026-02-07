const express = require('express');
const router = express.Router();
const { createFeedback, getFeedback, updateFeedbackStatus, deleteFeedback } = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');

// Public route to submit feedback (no protect middleware, but we need startupId)
router.post('/', createFeedback);

// Private routes for founders to managing feedback
router.get('/:startupId', protect, getFeedback);
router.put('/:id', protect, updateFeedbackStatus);
router.delete('/:id', protect, deleteFeedback);

module.exports = router;
