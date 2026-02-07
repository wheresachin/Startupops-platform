const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    user: {
        type: String, // Name or identifier of the person giving feedback
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
    startup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Startup',
        required: true,
    },
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
