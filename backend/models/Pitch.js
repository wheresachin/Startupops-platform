const mongoose = require('mongoose');

const pitchSchema = new mongoose.Schema({
    startup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Startup',
        required: true,
    },
    script: {
        type: String,
        required: true,
    },
    presentation: {
        type: Object, // Stores slide-by-slide structure
        default: {},
    },
    qaPrep: {
        type: Array, // Array of Q&A objects
        default: [],
    },
    generatedBy: {
        type: String,
        default: 'Gemini AI',
    },
}, { timestamps: true });

const Pitch = mongoose.model('Pitch', pitchSchema);

module.exports = Pitch;
