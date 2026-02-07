import React, { useState, useEffect } from 'react';
import { getTasks, getKPIs } from '../services/mockData';
import { Plus, MoreVertical, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [milestones, setMilestones] = useState(null);

    useEffect(() => {
        getTasks().then(setTasks);
        getKPIs().then(data => setMilestones(data.milestones));
    }, []);

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
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
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
                                            className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer group"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                                                    {task.priority}
                                                </span>
                                                <button className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <h4 className="font-medium text-slate-900 mb-1">{task.title}</h4>
                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center -space-x-2">
                                                    <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] text-blue-700 font-bold">
                                                        {task.assignee.charAt(0)}
                                                    </div>
                                                </div>
                                                <div className="flex items-center text-slate-400 text-xs">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    <span>2d</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                <button className="w-full py-2 text-sm text-slate-500 hover:bg-slate-200/50 rounded-lg dashed border border-transparent hover:border-slate-300 transition-colors flex items-center justify-center">
                                    <Plus className="w-4 h-4 mr-1" /> Add Task
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Tasks;
