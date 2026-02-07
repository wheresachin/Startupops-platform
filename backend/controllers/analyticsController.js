const Task = require('../models/Task');
const Feedback = require('../models/Feedback');

// @desc    Get analytics data
// @route   GET /api/analytics
// @access  Private
exports.getAnalytics = async (req, res) => {
    try {
        const startupId = req.user.startup;

        // 1. Task Statistics
        const tasks = await Task.find({ startup: startupId });

        const taskStats = [
            { name: 'Todo', value: tasks.filter(t => t.status === 'Todo').length },
            { name: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length },
            { name: 'Done', value: tasks.filter(t => t.status === 'Done').length },
        ];

        // 2. Task Velocity (Simulated/Simplified for now: Tasks by Priority)
        // Ideally this would be tasks completed over time, but we need createdAt/updatedAt aggregation.
        // Let's do Tasks by Priority for the "Area Chart" or similar.
        const tasksByPriority = [
            { name: 'Low', tasks: tasks.filter(t => t.priority === 'Low').length },
            { name: 'Medium', tasks: tasks.filter(t => t.priority === 'Medium').length },
            { name: 'High', tasks: tasks.filter(t => t.priority === 'High').length },
        ];

        // 3. Feedback Statistics
        const feedback = await Feedback.find({ startup: startupId });

        const feedbackStats = [
            { name: '5 Stars', feedback: feedback.filter(f => f.rating === 5).length },
            { name: '4 Stars', feedback: feedback.filter(f => f.rating === 4).length },
            { name: '3 Stars', feedback: feedback.filter(f => f.rating === 3).length },
            { name: '2 Stars', feedback: feedback.filter(f => f.rating === 2).length },
            { name: '1 Star', feedback: feedback.filter(f => f.rating === 1).length },
        ];

        // Reshape data to match Recharts expected format in frontend if needed
        // Frontend expects a single array `data` for charts?
        // Let's look at frontend:
        // AreaChart data keys: 'name', 'tasks' -> used for Task Velocity. 
        // BarChart data keys: 'name', 'feedback' -> used for Feedback Trend.

        // We can send multiple datasets or a combined one. 
        // The frontend `Analytics.jsx` uses `data` for BOTH charts. This implies the `data` array has objects with BOTH keys?
        // AreaChart uses `dataKey="tasks"`
        // BarChart uses `dataKey="feedback"`
        // XAxis uses `dataKey="name"` for both.

        // This means the `data` array must share the same `name` (X-axis labels).
        // BUT Task Velocity and Feedback Trend usually have different X-axes (Time vs Rating).
        // The current frontend mock data likely shares "Jan", "Feb", etc.
        // Since I can't easily change the frontend charts structure deeply without breaking styling, I should try to adapt the backend to provide meaningful data that FITS the existing chart components, OR update the frontend to use separate data sources.

        // DECISION: Update Frontend to use `taskData` and `feedbackData` separately is cleaner.
        // So I will send an object `{ taskData, feedbackData }`.

        // Let's prepare meaningful data:
        // Task Data (Priority Distribution seems good for "Task Velocity" spot if we rename it, but let's stick to "Tasks" count)
        // Actually, let's use the `tasksByPriority` for the first chart.
        // And `feedbackStats` for the second chart.

        res.json({
            taskData: tasksByPriority,
            feedbackData: feedbackStats
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
