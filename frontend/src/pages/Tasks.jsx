import React, { useState, useEffect } from 'react';
import { getTasks, getKPIs, createTask, updateTask, deleteTask } from '../services/api';
import { Plus, MoreVertical, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import AddTaskModal from '../components/AddTaskModal';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [milestones, setMilestones] = useState({ total: 0, completed: 0 }); // Initialize with default structure
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [activeMenuTaskId, setActiveMenuTaskId] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [tasksData, kpiData] = await Promise.all([getTasks(), getKPIs()]);
            setTasks(tasksData);
            setMilestones(kpiData.milestones);
        } catch (error) {
            console.error("Failed to fetch data:", error);
            toast.error("Failed to load tasks.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveMenuTaskId(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleAddTask = async (newTask) => {
        try {
            const createdTask = await createTask(newTask);
            setTasks([...tasks, createdTask]);
            setIsAddTaskModalOpen(false);
            toast.success("Task created successfully");
            fetchData(); // Refresh KPIs
        } catch (error) {
            console.error("Failed to create task:", error);
            toast.error("Failed to create task");
        }
    };

    const handleUpdateTask = async (updatedTask) => {
        try {
            // Optimistic update
            const oldTasks = [...tasks];
            setTasks(tasks.map(t => t._id === updatedTask._id ? { ...t, ...updatedTask } : t));

            await updateTask(updatedTask._id, updatedTask);
            setIsAddTaskModalOpen(false);
            setTaskToEdit(null);
            toast.success("Task updated successfully");
            fetchData(); // Refresh to ensure sync and KPIs
        } catch (error) {
            console.error("Failed to update task:", error);
            toast.error("Failed to update task");
            fetchData(); // Revert on error
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        try {
            await deleteTask(taskId);
            setTasks(tasks.filter(t => t._id !== taskId));
            setActiveMenuTaskId(null);
            toast.success("Task deleted");
            fetchData(); // Refresh KPIs
        } catch (error) {
            console.error("Failed to delete task:", error);
            toast.error("Failed to delete task");
        }
    };

    const openEditModal = (task) => {
        setTaskToEdit(task);
        setIsAddTaskModalOpen(true);
        setActiveMenuTaskId(null);
    };

    const openAddModal = () => {
        setTaskToEdit(null);
        setIsAddTaskModalOpen(true);
    };

    if (!tasks || !milestones) return <div>Loading...</div>;

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
                            style={{ width: `${(milestones.completed / milestones.total) * 100}%` }}
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
                                            key={task.id}
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
                                                            setActiveMenuTaskId(activeMenuTaskId === task.id ? null : task.id);
                                                        }}
                                                        className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                    {activeMenuTaskId === task.id && (
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
                                                                    handleDeleteTask(task.id);
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
                                                        {task.assignee ? task.assignee.charAt(0).toUpperCase() : '?'}
                                                    </div>
                                                    <span className="text-xs text-slate-600 font-medium">
                                                        {task.assignee || 'Unassigned'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-slate-400 text-xs">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    <span>2d</span>
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
            />
        </div>
    );
};

export default Tasks;
