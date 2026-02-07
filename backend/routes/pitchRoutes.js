const express = require('express');
const router = express.Router();
const { generateScript, generatePresentation, generateQA, getPitch } = require('../controllers/pitchController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected (require authentication)
router.post('/generate-script', protect, generateScript);
router.post('/generate-presentation', protect, generatePresentation);
router.post('/generate-qa', protect, generateQA);
router.get('/', protect, getPitch);

module.exports = router;
