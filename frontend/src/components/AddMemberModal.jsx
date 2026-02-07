import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddMemberModal = ({ isOpen, onClose, onAdd }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim()) {
            setError('Email is required.');
            return;
        }

        onAdd({ email });
        setEmail('');
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
                    <h3 className="text-lg font-semibold text-slate-900">Add Team Member</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-500 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <div className="text-red-500 text-sm">{error}</div>}

                    <div>
                        <label htmlFor="memberEmail" className="block text-sm font-medium text-slate-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="memberEmail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="colleague@example.com"
                        />
                        <p className="mt-1 text-xs text-slate-500">
                            Enter the email address of the registered user you want to add.
                        </p>
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
                            Add Member
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMemberModal;
