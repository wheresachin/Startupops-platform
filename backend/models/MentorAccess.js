const mongoose = require('mongoose');

const mentorAccessSchema = new mongoose.Schema({
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Startup',
        required: true
    },
    accessGrantedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    grantedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Ensure unique mentor-startup pairs
mentorAccessSchema.index({ mentor: 1, startup: 1 }, { unique: true });

const MentorAccess = mongoose.model('MentorAccess', mentorAccessSchema);
module.exports = MentorAccess;
