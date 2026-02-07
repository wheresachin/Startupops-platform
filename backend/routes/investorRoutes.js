const express = require('express');
const router = express.Router();
const { protect, checkRole } = require('../middleware/authMiddleware');
const {
    getInvestorDashboard,
    getInvestorStartups,
    submitInvestorFeedback
} = require('../controllers/investorDashboardController');

// All routes require authentication and Investor role
router.use(protect);
router.use(checkRole(['Investor']));

router.get('/startups', getInvestorStartups);
router.get('/dashboard/:startupId', getInvestorDashboard);
router.post('/feedback', submitInvestorFeedback);

module.exports = router;
