const Task = require('../models/Task');
const Milestone = require('../models/Milestone');
const Feedback = require('../models/Feedback');

// @desc    Get analytics overview
// @route   GET /api/analytics/overview
// @access  Private
exports.getAnalyticsOverview = async (req, res) => {
    const startupId = req.user.startup;

    if (!startupId) {
        return res.status(400).json({ message: 'User does not belong to a startup' });
    }

    try {
        // Task Analytics
        const totalTasks = await Task.countDocuments({ startup: startupId });
        const completedTasks = await Task.countDocuments({ startup: startupId, status: 'Done' });

        // Milestone Analytics
        const totalMilestones = await Milestone.countDocuments({ startup: startupId });
        const completedMilestones = await Milestone.countDocuments({ startup: startupId, status: 'Completed' });

        // Feedback Analytics
        const totalFeedback = await Feedback.countDocuments({ startup: startupId });
        const feedbackAvg = await Feedback.aggregate([
            { $match: { startup: startupId } },
            { $group: { _id: null, avgRating: { $avg: "$rating" } } }
        ]);
        const avgRating = feedbackAvg.length > 0 ? feedbackAvg[0].avgRating.toFixed(1) : 0;

        res.json({
            tasks: {
                total: totalTasks,
                completed: completedTasks,
                pending: totalTasks - completedTasks,
                completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
            },
            milestones: {
                total: totalMilestones,
                completed: completedMilestones,
            },
            feedback: {
                total: totalFeedback,
                avgRating,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
