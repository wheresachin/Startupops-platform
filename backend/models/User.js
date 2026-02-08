const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Founder', 'Team', 'Investor', 'Mentor'],
        default: 'Founder',
    },
    startup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Startup',
    },
    subscription: {
        plan: {
            type: String,
            enum: ['Free', 'Pro'],
            default: 'Free',
        },
        razorpaySubscriptionId: {
            type: String,
        },
        razorpayCustomerId: {
            type: String,
        },
        razorpayPaymentId: {
            type: String,
        },
        status: {
            type: String, // active, expired, cancelled
            enum: ['active', 'expired', 'cancelled'],
            default: 'active',
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
    },
}, { timestamps: true });

// Encrypt password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
