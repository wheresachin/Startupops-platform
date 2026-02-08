const Pitch = require('../models/Pitch');
const Startup = require('../models/Startup');
const { generatePitchScript, generatePresentationOutline, generateQAPrep } = require('../services/geminiService');

// @desc    Get saved pitch
// @route   GET /api/pitch
// @access  Private (Founder only)
exports.getPitch = async (req, res) => {
    try {
        const startup = await Startup.findOne({ team: req.user._id });

        if (!startup) {
            return res.status(404).json({ message: 'Startup not found' });
        }

        const pitch = await Pitch.findOne({ startup: startup._id });

        if (!pitch) {
            return res.status(404).json({ message: 'No pitch found' });
        }

        res.json(pitch);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Generate pitch script
// @route   POST /api/pitch/generate-script
// @access  Private (Founder only)
exports.generateScript = async (req, res) => {
    try {
        const { customPrompt } = req.body;
        const startup = await Startup.findOne({ team: req.user._id });

        if (!startup) {
            return res.status(404).json({ message: 'Startup not found. Please create your startup profile first.' });
        }

        const script = await generatePitchScript(startup, customPrompt);

        let pitch = await Pitch.findOne({ startup: startup._id });

        if (!pitch) {
            pitch = new Pitch({ startup: startup._id, script });
        } else {
            pitch.script = script;
            pitch.lastGenerated = Date.now();
        }

        await pitch.save();

        res.json({ script });
    } catch (error) {
        console.error('Error generating script:', error);
        res.status(500).json({ message: error.message || 'Failed to generate pitch script' });
    }
};

// @desc    Generate presentation outline
// @route   POST /api/pitch/generate-presentation
// @access  Private (Founder only)
exports.generatePresentation = async (req, res) => {
    try {
        const startup = await Startup.findOne({ team: req.user._id });

        if (!startup) {
            return res.status(404).json({ message: 'Startup not found' });
        }

        const presentation = await generatePresentationOutline(startup);

        let pitch = await Pitch.findOne({ startup: startup._id });

        if (!pitch) {
            pitch = new Pitch({ startup: startup._id, presentation });
        } else {
            pitch.presentation = presentation;
            pitch.lastGenerated = Date.now();
        }

        await pitch.save();

        res.json({ presentation });
    } catch (error) {
        console.error('Error generating presentation:', error);
        res.status(500).json({ message: error.message || 'Failed to generate presentation' });
    }
};

// @desc    Generate Q&A preparation
// @route   POST /api/pitch/generate-qa
// @access  Private (Founder only)
exports.generateQA = async (req, res) => {
    try {
        const startup = await Startup.findOne({ team: req.user._id });

        if (!startup) {
            return res.status(404).json({ message: 'Startup not found' });
        }

        const qaPrep = await generateQAPrep(startup);

        let pitch = await Pitch.findOne({ startup: startup._id });

        if (!pitch) {
            pitch = new Pitch({ startup: startup._id, qaPrep });
        } else {
            pitch.qaPrep = qaPrep;
            pitch.lastGenerated = Date.now();
        }

        await pitch.save();

        res.json({ qaPrep });
    } catch (error) {
        console.error('Error generating Q&A:', error);
        res.status(500).json({ message: error.message || 'Failed to generate Q&A preparation' });
    }
};
