const Feedback = require('../models/Feedback');
const Startup = require('../models/Startup');

// @desc    Give feedback (Public)
// @route   POST /api/feedback
// @access  Public
exports.createFeedback = async (req, res) => {
    const { startupId, user, rating, comment } = req.body;

    try {
        const startup = await Startup.findById(startupId);
        if (!startup) {
            return res.status(404).json({ message: 'Startup not found' });
        }

        const feedback = await Feedback.create({
            startup: startupId,
            user,
            rating,
            comment,
        });

        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get feedback for startup
// @route   GET /api/feedback/:startupId
// @access  Private
exports.getFeedback = async (req, res) => {
    try {
        // Ensure user belongs to the startup they are fetching feedback for
        if (req.user.startup.toString() !== req.params.startupId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const feedback = await Feedback.find({ startup: req.params.startupId }).sort({ createdAt: -1 });
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update feedback status
// @route   PUT /api/feedback/:id
// @access  Private
exports.updateFeedbackStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const feedback = await Feedback.findById(req.params.id);

        if (feedback) {
            // Verify ownership via startup check
            if (feedback.startup.toString() !== req.user.startup.toString()) {
                return res.status(403).json({ message: 'Not authorized' });
            }

            feedback.status = status || feedback.status;
            const updatedFeedback = await feedback.save();
            res.json(updatedFeedback);
        } else {
            res.status(404).json({ message: 'Feedback not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private
exports.deleteFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);

        if (feedback) {
            if (feedback.startup.toString() !== req.user.startup.toString()) {
                return res.status(403).json({ message: 'Not authorized' });
            }
            await feedback.deleteOne();
            res.json({ message: 'Feedback removed' });
        } else {
            res.status(404).json({ message: 'Feedback not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
