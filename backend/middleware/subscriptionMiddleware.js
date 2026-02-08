const User = require('../models/User');

// Middleware to check if user has an active Pro subscription
exports.requirePro = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if subscription has expired
        const now = new Date();
        if (user.subscription.endDate && now > user.subscription.endDate) {
            user.subscription.status = 'expired';
            user.subscription.plan = 'Free';
            await user.save();
        }

        // Check if user has Pro plan
        if (user.subscription.plan !== 'Pro' || user.subscription.status !== 'active') {
            return res.status(403).json({
                message: 'This feature requires a Pro subscription',
                currentPlan: user.subscription.plan,
                upgradeRequired: true
            });
        }

        next();
    } catch (error) {
        console.error('Subscription check error:', error);
        res.status(500).json({ message: 'Error checking subscription status' });
    }
};

// Middleware to check task limits for Free plan
exports.checkTaskLimit = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Pro users have unlimited tasks
        if (user.subscription.plan === 'Pro' && user.subscription.status === 'active') {
            return next();
        }

        // For Free plan, check task count
        const Task = require('../models/Task');
        const taskCount = await Task.countDocuments({ createdBy: req.user._id });

        if (taskCount >= 10) {
            return res.status(403).json({
                message: 'Free plan is limited to 10 tasks. Upgrade to Pro for unlimited tasks.',
                currentPlan: 'Free',
                upgradeRequired: true,
                limit: 10,
                current: taskCount
            });
        }

        next();
    } catch (error) {
        console.error('Task limit check error:', error);
        res.status(500).json({ message: 'Error checking task limit' });
    }
};
