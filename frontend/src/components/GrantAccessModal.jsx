import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { UserPlus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const GrantAccessModal = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [email, setEmail] = useState('');
    const [accessType, setAccessType] = useState('investor');
    const [loading, setLoading] = useState(false);
    const [startupId, setStartupId] = useState(null);

    useEffect(() => {
        if (isOpen && user) {
            fetchStartupId();
        }
    }, [isOpen, user]);

    const fetchStartupId = async () => {
        try {
            const { data } = await axios.get('/api/startups/my-startup', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setStartupId(data._id);
        } catch (error) {
            console.error('Error fetching startup:', error);
            toast.error('Please create a startup profile first');
        }
    };

    const handleGrantAccess = async (e) => {
        e.preventDefault();

        if (!startupId) {
            toast.error('No startup found. Please create a startup profile first.');
            return;
        }

        setLoading(true);

        try {
            const endpoint = accessType === 'investor'
                ? '/api/access/grant-investor'
                : '/api/access/grant-mentor';

            await axios.post(endpoint, {
                [`${accessType}Email`]: email,
                startupId: startupId
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            toast.success(`${accessType === 'investor' ? 'Investor' : 'Mentor'} access granted successfully!`);
            setEmail('');
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to grant access');
            console.error('Grant access error:', error.response?.data);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-slate-800">Grant Access</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition"
                    >
                        <X className="w-5 h-5 text-slate-600" />
                    </button>
                </div>

                <form onSubmit={handleGrantAccess} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Access Type
                        </label>
                        <select
                            value={accessType}
                            onChange={(e) => setAccessType(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="investor">Investor</option>
                            <option value="mentor">Mentor</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            {accessType === 'investor' ? 'Investor' : 'Mentor'} Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="investor@example.com"
                            required
                        />
                    </div>

                    <div className="flex space-x-3">
                        <button
                            type="submit"
                            disabled={loading || !startupId}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Granting...' : 'Grant Access'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                        <strong>Note:</strong> Enter the email of an existing {accessType} user.
                        They will get access to view your startup dashboard.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GrantAccessModal;

