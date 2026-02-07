const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: ['Todo', 'In Progress', 'Done'],
        default: 'Todo',
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium',
    },
    startup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Startup',
        required: true,
    },
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    milestone: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Milestone',
    },
    comments: [{
        user: { type: String, required: true }, // Store name for simplicity
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
