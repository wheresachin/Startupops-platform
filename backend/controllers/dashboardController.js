const Startup = require('../models/Startup');
const Task = require('../models/Task');
const Feedback = require('../models/Feedback');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
    try {
        const startupId = req.user.startup;

        if (!startupId) {
            return res.status(400).json({ message: 'No startup associated with this user' });
        }

        // Fetch startup details
        const startup = await Startup.findById(startupId).populate('team.user', 'name email');

        if (!startup) {
            return res.status(404).json({ message: 'Startup not found' });
        }

        // Count total tasks
        const totalTasks = await Task.countDocuments({ startup: startupId });

        // Count completed tasks
        const completedTasks = await Task.countDocuments({
            startup: startupId,
            status: 'Done'
        });

        // Get team members count
        const teamMembers = startup.team.length;

        // Get feedback stats
        const feedbackCount = await Feedback.countDocuments({ startup: startupId });

        // Calculate average rating
        const feedbackStats = await Feedback.aggregate([
            { $match: { startup: startup._id } },
            {
                $group: {
                    _id: null,
                    avgRating: { $avg: '$rating' },
                    totalFeedback: { $sum: 1 }
                }
            }
        ]);

        const avgRating = feedbackStats.length > 0
            ? feedbackStats[0].avgRating.toFixed(1)
            : '0.0';

        // Get weekly analytics (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const weeklyTasks = await Task.aggregate([
            {
                $match: {
                    startup: startup._id,
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dayOfWeek: '$createdAt' },
                    count: { $sum: 1 }
                }
            }
        ]);

        const weeklyFeedback = await Feedback.aggregate([
            {
                $match: {
                    startup: startup._id,
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dayOfWeek: '$createdAt' },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Format weekly data for chart
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const analytics = days.map((day, index) => {
            const taskData = weeklyTasks.find(t => t._id === index + 1);
            const feedbackData = weeklyFeedback.find(f => f._id === index + 1);

            return {
                name: day,
                tasks: taskData ? taskData.count : 0,
                feedback: feedbackData ? feedbackData.count : 0
            };
        });

        // Get recent feedback (last 5)
        const recentFeedback = await Feedback.find({ startup: startupId })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name email')
            .select('comment rating createdAt user');

        res.json({
            kpis: {
                totalTasks,
                completedTasks,
                pendingFeedback: feedbackCount,
                teamMembers,
                avgRating
            },
            analytics,
            recentFeedback: recentFeedback.map(f => ({
                user: f.user?.name || 'Anonymous',
                comment: f.comment,
                rating: f.rating,
                time: getTimeAgo(f.createdAt)
            }))
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ message: 'Server error fetching dashboard stats' });
    }
};

// Helper function to format time ago
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + 'd ago';

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + 'd ago';

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + 'h ago';

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + 'm ago';

    return 'Just now';
}
