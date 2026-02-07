const express = require('express');
const router = express.Router();
const { createStartup, getStartup, updateStartup, addTeamMember, getMyStartup } = require('../controllers/startupController');
const { protect, founderOnly } = require('../middleware/authMiddleware');

router.get('/my-startup', protect, getMyStartup);
router.post('/', protect, founderOnly, createStartup);
router.get('/:id', protect, getStartup);
router.put('/:id', protect, founderOnly, updateStartup);
router.post('/:id/members', protect, founderOnly, addTeamMember);

module.exports = router;

