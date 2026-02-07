import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, MoreVertical, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

import AddTaskModal from '../components/AddTaskModal';

const Tasks = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [milestones, setMilestones] = useState({ completed: 0, total: 0 });
    const [team, setTeam] = useState([]);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [activeMenuTaskId, setActiveMenuTaskId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user?.startup) {
            fetchData();
        } else {
            setIsLoading(false);
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const [tasksRes, milestonesRes, startupRes] = await Promise.all([
                axios.get('/api/tasks', { headers: { Authorization: `Bearer ${user.token}` } }),
                axios.get('/api/tasks/milestones/all', { headers: { Authorization: `Bearer ${user.token}` } }), // Corrected endpoint
                axios.get(`/api/startups/${user.startup}`, { headers: { Authorization: `Bearer ${user.token}` } })
            ]);

            setTasks(tasksRes.data);

            // Calculate milestone progress
            // If milestonesRes.data is array of milestones
            const milestonesData = milestonesRes.data || [];
            const completed = milestonesData.filter(m => m.status === 'Completed').length;
            setMilestones({ completed, total: milestonesData.length });

            setTeam(startupRes.data.team || []);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load tasks data');
        } finally {
            setIsLoading(false);
        }
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveMenuTaskId(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleAddTask = async (newTask) => {
        try {
            const { data } = await axios.post('/api/tasks', newTask, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setTasks([...tasks, data]);
            setIsAddTaskModalOpen(false);
            toast.success('Task added successfully');
            // Re-fetch to normalize data if needed, or simply append. 
            // The backend returns the created task. 
            // If we need populated assignee, we might need to fetch again or manually add assignee object from team list.
            // For now, let's just re-fetch to be safe and simple
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add task');
        }
    };

    const handleUpdateTask = async (updatedTask) => {
        try {
            // First update task details
            const { data } = await axios.put(`/api/tasks/${updatedTask._id}`, updatedTask, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            // If there's a new comment coming from the modal state (passed inside updatedTask for convenience)
            if (updatedTask.newComment) {
                await axios.post(`/api/tasks/${updatedTask._id}/comments`, { text: updatedTask.newComment }, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
            }

            // We need to fetch data again to get the populated comments
            fetchData();

            setIsAddTaskModalOpen(false);
            setTaskToEdit(null);
            toast.success('Task updated successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update task');
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await axios.delete(`/api/tasks/${taskId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setTasks(tasks.filter(t => t._id !== taskId));
            setActiveMenuTaskId(null);
            toast.success('Task deleted');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete task');
        }
    };

    const openEditModal = (task) => {
        // Need to format task for modal if necessary. 
        // Modal expects assignee as ID. Backend task has assignee as Object (populated).
        const formattedTask = {
            ...task,
            assignee: task.assignee?._id || task.assignee // handle populated or unpopulated
        };
        setTaskToEdit(formattedTask);
        setIsAddTaskModalOpen(true);
        setActiveMenuTaskId(null);
    };

    const openAddModal = () => {
        setTaskToEdit(null);
        setIsAddTaskModalOpen(true);
    };

    if (isLoading) return <div>Loading...</div>;

    const columns = ['Todo', 'In Progress', 'Done'];

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-red-100 text-red-700';
            case 'Medium': return 'bg-amber-100 text-amber-700';
            case 'Low': return 'bg-green-100 text-green-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            {/* Header & Milestones */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Tasks & Milestones</h1>
                    <p className="text-slate-500">Track execution and product progress.</p>
                </div>
                <div className="flex items-center space-x-4 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                    <span className="text-sm font-medium text-slate-700">Milestone Progress:</span>
                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${milestones.total > 0 ? (milestones.completed / milestones.total) * 100 : 0}%` }}
                        ></div>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{milestones.completed}/{milestones.total}</span>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus className="w-4 h-4 mr-2" /> New Task
                </button>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto">
                <div className="flex space-x-6 min-w-max h-full pb-4">
                    {columns.map(status => (
                        <div key={status} className="w-80 flex flex-col bg-slate-100/50 rounded-xl border border-slate-200/60 p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-slate-700">{status}</h3>
                                <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-medium">
                                    {tasks.filter(t => t.status === status).length}
                                </span>
                            </div>

                            <div className="space-y-3 flex-1 overflow-y-auto">
                                <AnimatePresence>
                                    {tasks.filter(t => t.status === status).map(task => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            key={task._id}
                                            className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer group relative"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                                                    {task.priority}
                                                </span>
                                                <div className="relative">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveMenuTaskId(activeMenuTaskId === task._id ? null : task._id);
                                                        }}
                                                        className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                    {activeMenuTaskId === task._id && (
                                                        <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-slate-200 z-10 py-1">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    openEditModal(task);
                                                                }}
                                                                className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteTask(task._id);
                                                                }}
                                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <h4 className="font-medium text-slate-900 mb-1">{task.title}</h4>
                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] text-blue-700 font-bold">
                                                        {task.assignee?.name ? task.assignee.name.charAt(0).toUpperCase() : '?'}
                                                    </div>
                                                    <span className="text-xs text-slate-600 font-medium">
                                                        {task.assignee?.name || 'Unassigned'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-slate-400 text-xs">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    {/* Placeholder for date/deadline */}
                                                    <span>Today</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                <button
                                    onClick={openAddModal}
                                    className="w-full py-2 text-sm text-slate-500 hover:bg-slate-200/50 rounded-lg dashed border border-transparent hover:border-slate-300 transition-colors flex items-center justify-center"
                                >
                                    <Plus className="w-4 h-4 mr-1" /> Add Task
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add/Edit Task Modal */}
            <AddTaskModal
                isOpen={isAddTaskModalOpen}
                onClose={() => setIsAddTaskModalOpen(false)}
                onAdd={handleAddTask}
                onUpdate={handleUpdateTask}
                initialData={taskToEdit}
                team={team}
            />
        </div>
    );
};

export default Tasks;
