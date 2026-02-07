const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String, // e.g., 'task_assigned', 'startup_invite'
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId, // ID of the related resource (e.g., Task ID)
    },
    read: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
