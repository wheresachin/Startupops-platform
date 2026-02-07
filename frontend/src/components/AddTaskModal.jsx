import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AddTaskModal = ({ isOpen, onClose, onAdd, onUpdate, initialData }) => {
    const [title, setTitle] = useState('');
    const [assignee, setAssignee] = useState('');
    const [status, setStatus] = useState('Todo');
    const [priority, setPriority] = useState('Medium');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && initialData) {
            setTitle(initialData.title);
            setAssignee(initialData.assignee);
            setStatus(initialData.status);
            setPriority(initialData.priority);
        } else if (isOpen) {
            // Reset for new task
            setTitle('');
            setAssignee('');
            setStatus('Todo');
            setPriority('Medium');
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!title.trim() || !assignee.trim()) {
            setError('Title and Assignee are required.');
            return;
        }

        const taskData = { title, assignee, status, priority };

        if (initialData) {
            onUpdate({ ...initialData, ...taskData });
        } else {
            onAdd(taskData);
        }

        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-6 border-b border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900">
                        {initialData ? 'Edit Task' : 'Add New Task'}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-500 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <div className="text-red-500 text-sm">{error}</div>}

                    <div>
                        <label htmlFor="taskTitle" className="block text-sm font-medium text-slate-700 mb-1">
                            Task Title
                        </label>
                        <input
                            type="text"
                            id="taskTitle"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g. Fix login bug"
                        />
                    </div>

                    <div>
                        <label htmlFor="taskAssignee" className="block text-sm font-medium text-slate-700 mb-1">
                            Assignee
                        </label>
                        <input
                            type="text"
                            id="taskAssignee"
                            value={assignee}
                            onChange={(e) => setAssignee(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g. John Doe"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="taskStatus" className="block text-sm font-medium text-slate-700 mb-1">
                                Status
                            </label>
                            <select
                                id="taskStatus"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="Todo">Todo</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="taskPriority" className="block text-sm font-medium text-slate-700 mb-1">
                                Priority
                            </label>
                            <select
                                id="taskPriority"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            {initialData ? 'Save Changes' : 'Add Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTaskModal;
