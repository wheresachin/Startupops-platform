const Feedback = require('../models/Feedback');

// @desc    Submit feedback (Public)
// @route   POST /api/feedback
// @access  Public
exports.createFeedback = async (req, res) => {
    const { user, rating, comment, startupId } = req.body;

    try {
        const feedback = new Feedback({
            user,
            rating,
            comment,
            startup: startupId,
        });

        const createdFeedback = await feedback.save();
        res.status(201).json(createdFeedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get feedback for startup
// @route   GET /api/feedback
// @access  Private
exports.getFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find({ startup: req.user.startup }).sort({ createdAt: -1 });
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
            if (feedback.startup.toString() !== req.user.startup.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
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
