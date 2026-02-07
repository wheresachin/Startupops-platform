const Task = require('../models/Task');
const Milestone = require('../models/Milestone');

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
    const { title, description, status, priority, assignee, milestone } = req.body;

    try {
        const task = new Task({
            title,
            description,
            status,
            priority,
            startup: req.user.startup,
            assignee,
            milestone,
        });

        const createdTask = await task.save();
        res.status(201).json(createdTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all tasks for the startup
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ startup: req.user.startup }).populate('assignee', 'name email');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (task) {
            if (task.startup.toString() !== req.user.startup.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            task.title = req.body.title || task.title;
            task.description = req.body.description || task.description;
            task.status = req.body.status || task.status;
            task.priority = req.body.priority || task.priority;
            task.assignee = req.body.assignee || task.assignee;
            task.milestone = req.body.milestone || task.milestone;

            const updatedTask = await task.save();
            res.json(updatedTask);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (task) {
            if (task.startup.toString() !== req.user.startup.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }
            await task.deleteOne();
            res.json({ message: 'Task removed' });
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a milestone
// @route   POST /api/milestones
// @access  Private bounder/team? Let's say anyone in team
exports.createMilestone = async (req, res) => {
    const { title, description } = req.body;

    try {
        const milestone = new Milestone({
            title,
            description,
            startup: req.user.startup,
        });

        const createdMilestone = await milestone.save();
        res.status(201).json(createdMilestone);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get milestones
// @route   GET /api/milestones
// @access  Private
exports.getMilestones = async (req, res) => {
    try {
        const milestones = await Milestone.find({ startup: req.user.startup });
        res.json(milestones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
