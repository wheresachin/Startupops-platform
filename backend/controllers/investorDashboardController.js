const Startup = require('../models/Startup');
const Task = require('../models/Task');
const InvestorAccess = require('../models/InvestorAccess');

// @desc    Get investor dashboard data
// @route   GET /api/investor/dashboard/:startupId
// @access  Private (Investor only)
exports.getInvestorDashboard = async (req, res) => {
    try {
        const startupId = req.params.startupId;

        // Verify access
        const access = await InvestorAccess.findOne({
            investor: req.user._id,
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

        // Get task statistics
        const totalTasks = await Task.countDocuments({ startup: startupId });
        const completedTasks = await Task.countDocuments({
            startup: startupId,
            status: 'Done'
        });

        const taskCompletionRate = totalTasks > 0
            ? ((completedTasks / totalTasks) * 100).toFixed(1)
            : 0;

        // Get milestone data
        const milestones = await Task.find({
            startup: startupId,
            priority: 'High'
        })
            .select('title status dueDate assignedTo')
            .populate('assignedTo', 'name')
            .sort({ dueDate: 1 })
            .limit(10);

        // Calculate completion percentage by status
        const tasksByStatus = await Task.aggregate([
            { $match: { startup: startup._id } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const statusBreakdown = {
            todo: 0,
            inProgress: 0,
            done: 0
        };

        tasksByStatus.forEach(item => {
            if (item._id === 'Todo') statusBreakdown.todo = item.count;
            if (item._id === 'In Progress') statusBreakdown.inProgress = item.count;
            if (item._id === 'Done') statusBreakdown.done = item.count;
        });

        res.json({
            startup: {
                name: startup.name,
                problem: startup.problem,
                solution: startup.solution,
                stage: startup.stage,
                market: startup.market,
                progress: startup.progress
            },
            analytics: {
                totalTasks,
                completedTasks,
                taskCompletionRate,
                statusBreakdown
            },
            milestones: milestones.map(m => ({
                title: m.title,
                status: m.status,
                dueDate: m.dueDate,
                assignedTo: m.assignedTo?.name
            }))
        });

    } catch (error) {
        console.error('Investor dashboard error:', error);
        res.status(500).json({ message: 'Server error fetching investor dashboard' });
    }
};

// @desc    Get list of startups investor has access to
// @route   GET /api/investor/startups
// @access  Private (Investor only)
exports.getInvestorStartups = async (req, res) => {
    try {
        const accessRecords = await InvestorAccess.find({ investor: req.user._id })
            .populate('startup', 'name stage progress')
            .sort({ grantedAt: -1 });

        const startups = accessRecords.map(record => ({
            id: record.startup._id,
            name: record.startup.name,
            stage: record.startup.stage,
            progress: record.startup.progress,
            accessGrantedAt: record.grantedAt
        }));

        res.json({ startups });

    } catch (error) {
        console.error('Get investor startups error:', error);
        res.status(500).json({ message: 'Server error fetching startups' });
    }
};

// @desc    Submit investor feedback
// @route   POST /api/investor/feedback
// @access  Private (Investor only)
exports.submitInvestorFeedback = async (req, res) => {
    try {
        const { startupId, rating, comment } = req.body;

        // Verify access
        const access = await InvestorAccess.findOne({
            investor: req.user._id,
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
        console.error('Submit investor feedback error:', error);
        res.status(500).json({ message: 'Server error submitting feedback' });
    }
};
