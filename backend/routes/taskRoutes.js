const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask, createMilestone, getMilestones } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// Task Routes
router.route('/').post(protect, createTask).get(protect, getTasks);
router.route('/:id').put(protect, updateTask).delete(protect, deleteTask);

// Milestone Routes (For simplicity, nested here or separate? Keep simple)
router.post('/milestones', protect, createMilestone);
router.get('/milestones/all', protect, getMilestones); // Changed path to avoid conflict with :id if needed

module.exports = router;
