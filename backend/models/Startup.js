const mongoose = require('mongoose');

const startupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    problem: {
        type: String,
        default: '',
    },
    solution: {
        type: String,
        default: '',
    },
    market: {
        type: String,
        default: '',
    },
    stage: {
        type: String,
        enum: ['Idea', 'MVP', 'Growth'],
        default: 'Idea',
    },
    founder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    team: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    subscription: {
        plan: {
            type: String,
            enum: ['Free', 'Pro', 'Enterprise'],
            default: 'Free'
        },
        status: {
            type: String,
            enum: ['active', 'expired', 'cancelled'],
            default: 'active'
        },
        startDate: {
            type: Date,
            default: Date.now
        },
        validUntil: {
            type: Date
        }
    }
}, { timestamps: true });

const Startup = mongoose.model('Startup', startupSchema);
module.exports = Startup;
