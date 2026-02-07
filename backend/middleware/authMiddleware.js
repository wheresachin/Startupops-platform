const jwt = require('jsonwebtoken');
const User = require('../models/User');
const InvestorAccess = require('../models/InvestorAccess');
const MentorAccess = require('../models/MentorAccess');

exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

exports.founderOnly = (req, res, next) => {
    if (req.user && req.user.role === 'Founder') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as a founder' });
    }
};

// Role-based access control middleware
exports.checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        if (allowedRoles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).json({
                message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
            });
        }
    };
};

// Check if investor has access to specific startup
exports.checkInvestorAccess = async (req, res, next) => {
    try {
        const startupId = req.params.startupId || req.body.startupId || req.query.startupId;

        if (!startupId) {
            return res.status(400).json({ message: 'Startup ID required' });
        }

        const access = await InvestorAccess.findOne({
            investor: req.user._id,
            startup: startupId
        });

        if (!access) {
            return res.status(403).json({ message: 'No access to this startup' });
        }

        req.startupId = startupId;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error checking investor access' });
    }
};

// Check if mentor has access to specific startup
exports.checkMentorAccess = async (req, res, next) => {
    try {
        const startupId = req.params.startupId || req.body.startupId || req.query.startupId;

        if (!startupId) {
            return res.status(400).json({ message: 'Startup ID required' });
        }

        const access = await MentorAccess.findOne({
            mentor: req.user._id,
            startup: startupId
        });

        if (!access) {
            return res.status(403).json({ message: 'No access to this startup' });
        }

        req.startupId = startupId;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error checking mentor access' });
    }
};
