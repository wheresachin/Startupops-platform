const Startup = require('../models/Startup');
const Task = require('../models/Task');
const MentorAccess = require('../models/MentorAccess');

// @desc    Get mentor dashboard data
// @route   GET /api/mentor/dashboard/:startupId
// @access  Private (Mentor only)
exports.getMentorDashboard = async (req, res) => {
    try {
        const startupId = req.params.startupId;

        // Verify access
        const access = await MentorAccess.findOne({
            mentor: req.user._id,
            startup: startupId
        });

        if (!access) {
            return res.status(403).json({ message: 'No access to this startup' });
        }

        // Fetch startup details
        const startup = await Startup.findById(startupId).select('-__v');

        if (!startup) {
            return res.status(404).json({ message: 'Startup not found' });
        }

        // Get all tasks
        const tasks = await Task.find({ startup: startupId })
            .select('title status priority dueDate assignedTo')
            .populate('assignedTo', 'name')
            .sort({ createdAt: -1 });

        // Task statistics
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === 'Done').length;
        const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
        const todoTasks = tasks.filter(t => t.status === 'Todo').length;

        // Weekly progress (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const weeklyCompleted = await Task.countDocuments({
            startup: startupId,
            status: 'Done',
            updatedAt: { $gte: sevenDaysAgo }
        });

        // Priority breakdown
        const tasksByPriority = await Task.aggregate([
            { $match: { startup: startup._id } },
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 }
                }
            }
        ]);

        const priorityBreakdown = {
            high: 0,
            medium: 0,
            low: 0
        };

        tasksByPriority.forEach(item => {
            if (item._id === 'High') priorityBreakdown.high = item.count;
            if (item._id === 'Medium') priorityBreakdown.medium = item.count;
            if (item._id === 'Low') priorityBreakdown.low = item.count;
        });

        res.json({
            startup: {
                name: startup.name,
                problem: startup.problem,
                solution: startup.solution,
                stage: startup.stage
            },
            executionMetrics: {
                totalTasks,
                completedTasks,
                inProgressTasks,
                todoTasks,
                completionRate: totalTasks > 0
                    ? ((completedTasks / totalTasks) * 100).toFixed(1)
                    : 0,
                weeklyCompleted,
                priorityBreakdown
            },
            tasks: tasks.map(t => ({
                id: t._id,
                title: t.title,
                status: t.status,
                priority: t.priority,
                dueDate: t.dueDate,
                assignedTo: t.assignedTo?.name
            }))
        });

    } catch (error) {
        console.error('Mentor dashboard error:', error);
        res.status(500).json({ message: 'Server error fetching mentor dashboard' });
    }
};

// @desc    Get list of startups mentor has access to
// @route   GET /api/mentor/startups
// @access  Private (Mentor only)
exports.getMentorStartups = async (req, res) => {
    try {
        const accessRecords = await MentorAccess.find({ mentor: req.user._id })
            .populate('startup', 'name stage')
            .sort({ grantedAt: -1 });

        const startups = accessRecords.map(record => ({
            id: record.startup._id,
            name: record.startup.name,
            stage: record.startup.stage,
            accessGrantedAt: record.grantedAt
        }));

        res.json({ startups });

    } catch (error) {
        console.error('Get mentor startups error:', error);
        res.status(500).json({ message: 'Server error fetching startups' });
    }
};

// @desc    Submit mentor feedback
// @route   POST /api/mentor/feedback
// @access  Private (Mentor only)
exports.submitMentorFeedback = async (req, res) => {
    try {
        const { startupId, rating, comment } = req.body;

        // Verify access
        const access = await MentorAccess.findOne({
            mentor: req.user._id,
            startup: startupId
        });

        if (!access) {
            return res.status(403).json({ message: 'No access to this startup' });
        }

        const Feedback = require('../models/Feedback');

        const feedback = await Feedback.create({
            startup: startupId,
            user: req.user._id,
            rating,
            comment,
            status: 'New'
        });

        res.status(201).json({
            message: 'Feedback submitted successfully',
            feedback
        });

    } catch (error) {
        console.error('Submit mentor feedback error:', error);
        res.status(500).json({ message: 'Server error submitting feedback' });
    }
};
