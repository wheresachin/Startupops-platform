const mongoose = require('mongoose');

const investorAccessSchema = new mongoose.Schema({
    investor: {
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

// Ensure unique investor-startup pairs
investorAccessSchema.index({ investor: 1, startup: 1 }, { unique: true });

const InvestorAccess = mongoose.model('InvestorAccess', investorAccessSchema);
module.exports = InvestorAccess;
