const InvestorAccess = require('../models/InvestorAccess');
const MentorAccess = require('../models/MentorAccess');
const User = require('../models/User');
const Startup = require('../models/Startup');

// @desc    Grant investor access to startup
// @route   POST /api/access/grant-investor
// @access  Private (Founder only)
// @desc    Grant investor access to startup
// @route   POST /api/access/grant-investor
// @access  Private (Founder only)
exports.grantInvestorAccess = async (req, res) => {
    try {
        const { investorEmail, startupId } = req.body;

        // Verify user is founder of this startup
        const startup = await Startup.findById(startupId);
        if (!startup) {
            return res.status(404).json({ message: 'Startup not found' });
        }

        // Check if requester is the founder
        if (startup.founder.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to grant access' });
        }

        // Find investor by email
        const investor = await User.findOne({ email: investorEmail });
        if (!investor) {
            return res.status(404).json({ message: 'Investor not found' });
        }

        if (investor.role !== 'Investor') {
            return res.status(400).json({ message: 'User is not an investor' });
        }

        // Check if access already exists
        const existingAccess = await InvestorAccess.findOne({
            investor: investor._id,
            startup: startupId
        });

        if (existingAccess) {
            return res.status(400).json({ message: 'Access already granted' });
        }

        // Grant access
        const access = await InvestorAccess.create({
            investor: investor._id,
            startup: startupId,
            accessGrantedBy: req.user._id
        });

        res.status(201).json({
            message: 'Investor access granted successfully',
            access
        });

    } catch (error) {
        console.error('Grant investor access error:', error);
        res.status(500).json({ message: 'Server error granting access' });
    }
};

// @desc    Grant mentor access to startup
// @route   POST /api/access/grant-mentor
// @access  Private (Founder only)
exports.grantMentorAccess = async (req, res) => {
    try {
        const { mentorEmail, startupId } = req.body;

        // Verify user is founder of this startup
        const startup = await Startup.findById(startupId);
        if (!startup) {
            return res.status(404).json({ message: 'Startup not found' });
        }

        // Check if requester is the founder
        if (startup.founder.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to grant access' });
        }

        // Find mentor by email
        const mentor = await User.findOne({ email: mentorEmail });
        if (!mentor) {
            return res.status(404).json({ message: 'Mentor not found' });
        }

        if (mentor.role !== 'Mentor') {
            return res.status(400).json({ message: 'User is not a mentor' });
        }

        // Check if access already exists
        const existingAccess = await MentorAccess.findOne({
            mentor: mentor._id,
            startup: startupId
        });

        if (existingAccess) {
            return res.status(400).json({ message: 'Access already granted' });
        }

        // Grant access
        const access = await MentorAccess.create({
            mentor: mentor._id,
            startup: startupId,
            accessGrantedBy: req.user._id
        });

        res.status(201).json({
            message: 'Mentor access granted successfully',
            access
        });

    } catch (error) {
        console.error('Grant mentor access error:', error);
        res.status(500).json({ message: 'Server error granting access' });
    }
};

// @desc    Revoke access (works for both investor and mentor)
// @route   DELETE /api/access/revoke/:accessId/:type
// @access  Private (Founder only)
exports.revokeAccess = async (req, res) => {
    try {
        const { accessId, type } = req.params;

        const AccessModel = type === 'investor' ? InvestorAccess : MentorAccess;

        const access = await AccessModel.findById(accessId);
        if (!access) {
            return res.status(404).json({ message: 'Access record not found' });
        }

        // Verify authorization
        const startup = await Startup.findById(access.startup);

        if (startup.founder.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to revoke access' });
        }

        await AccessModel.findByIdAndDelete(accessId);

        res.json({ message: 'Access revoked successfully' });

    } catch (error) {
        console.error('Revoke access error:', error);
        res.status(500).json({ message: 'Server error revoking access' });
    }
};
