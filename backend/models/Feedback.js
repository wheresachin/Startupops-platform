const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    startup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Startup',
        required: true,
    },
    user: {
        type: String, // Name or Email of the person giving feedback
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['New', 'Reviewed', 'Implemented'],
        default: 'New',
    },
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
