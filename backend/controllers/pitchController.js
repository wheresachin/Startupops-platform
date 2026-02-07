const Pitch = require('../models/Pitch');
const Startup = require('../models/Startup');
const { generatePitchScript, generatePresentationOutline, generateQAPrep } = require('../services/geminiService');

// @desc    Generate AI pitch script
// @route   POST /api/pitch/generate-script
// @access  Private
exports.generateScript = async (req, res) => {
    try {
        const startup = await Startup.findById(req.user.startup);
        if (!startup) {
            return res.status(404).json({ message: 'Startup not found' });
        }

        // Generate pitch script using Gemini AI
        const script = await generatePitchScript({
            name: startup.name,
            description: startup.description,
            problem: startup.problem,
            solution: startup.solution,
            market: startup.market,
            stage: startup.stage,
        });

        // Check if pitch already exists
        let pitch = await Pitch.findOne({ startup: req.user.startup });

        if (pitch) {
            pitch.script = script;
            await pitch.save();
        } else {
            pitch = await Pitch.create({
                startup: req.user.startup,
                script,
            });
        }

        res.json({ script, pitchId: pitch._id });
    } catch (error) {
        console.error('Error generating script:', error);
        res.status(500).json({ message: error.message || 'Failed to generate pitch script' });
    }
};

// @desc    Generate AI presentation outline
// @route   POST /api/pitch/generate-presentation
// @access  Private
exports.generatePresentation = async (req, res) => {
    try {
        const startup = await Startup.findById(req.user.startup);
        if (!startup) {
            return res.status(404).json({ message: 'Startup not found' });
        }

        const presentation = await generatePresentationOutline({
            name: startup.name,
            description: startup.description,
            problem: startup.problem,
            solution: startup.solution,
            market: startup.market,
            stage: startup.stage,
        });

        let pitch = await Pitch.findOne({ startup: req.user.startup });

        if (pitch) {
            pitch.presentation = presentation;
            await pitch.save();
        } else {
            pitch = await Pitch.create({
                startup: req.user.startup,
                script: '',
                presentation,
            });
        }

        res.json({ presentation, pitchId: pitch._id });
    } catch (error) {
        console.error('Error generating presentation:', error);
        res.status(500).json({ message: error.message || 'Failed to generate presentation' });
    }
};

// @desc    Generate Q&A preparation
// @route   POST /api/pitch/generate-qa
// @access  Private
exports.generateQA = async (req, res) => {
    try {
        const startup = await Startup.findById(req.user.startup);
        if (!startup) {
            return res.status(404).json({ message: 'Startup not found' });
        }

        const qaPrep = await generateQAPrep({
            name: startup.name,
            description: startup.description,
            problem: startup.problem,
            solution: startup.solution,
            market: startup.market,
            stage: startup.stage,
        });

        let pitch = await Pitch.findOne({ startup: req.user.startup });

        if (pitch) {
            pitch.qaPrep = qaPrep.qa || [];
            await pitch.save();
        } else {
            pitch = await Pitch.create({
                startup: req.user.startup,
                script: '',
                qaPrep: qaPrep.qa || [],
            });
        }

        res.json({ qaPrep: qaPrep.qa, pitchId: pitch._id });
    } catch (error) {
        console.error('Error generating Q&A:', error);
        res.status(500).json({ message: error.message || 'Failed to generate Q&A preparation' });
    }
};

// @desc    Get saved pitch
// @route   GET /api/pitch
// @access  Private
exports.getPitch = async (req, res) => {
    try {
        const pitch = await Pitch.findOne({ startup: req.user.startup });
        if (!pitch) {
            return res.status(404).json({ message: 'No pitch found. Generate one first!' });
        }
        res.json(pitch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
