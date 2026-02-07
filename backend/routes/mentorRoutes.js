const express = require('express');
const router = express.Router();
const { protect, checkRole } = require('../middleware/authMiddleware');
const {
    getMentorDashboard,
    getMentorStartups,
    submitMentorFeedback
} = require('../controllers/mentorDashboardController');

// All routes require authentication and Mentor role
router.use(protect);
router.use(checkRole(['Mentor']));

router.get('/startups', getMentorStartups);
router.get('/dashboard/:startupId', getMentorDashboard);
router.post('/feedback', submitMentorFeedback);

module.exports = router;
