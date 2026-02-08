const mongoose = require('mongoose');

const pitchSchema = mongoose.Schema({
    startup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Startup',
        required: true
    },
    script: {
        type: String
    },
    presentation: {
        slides: [{
            number: Number,
            title: String,
            content: [String],
            visuals: String,
            notes: String
        }]
    },
    qaPrep: [{
        question: String,
        answer: String,
        keyPoints: [String]
    }],
    lastGenerated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Pitch', pitchSchema);
