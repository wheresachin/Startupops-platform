const express = require('express');
const router = express.Router();
const { getPitch, generateScript, generatePresentation, generateQA } = require('../controllers/pitchController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getPitch);
router.post('/generate-script', protect, generateScript);
router.post('/generate-presentation', protect, generatePresentation);
router.post('/generate-qa', protect, generateQA);

module.exports = router;
