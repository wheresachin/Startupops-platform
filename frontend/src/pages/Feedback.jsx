import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Star, Share2, Filter, Trash2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Feedback = () => {
    const { user } = useAuth();
    const [feedback, setFeedback] = useState([]);
    const [filter, setFilter] = useState('All');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user?.startup) {
            fetchFeedback();
        } else {
            setIsLoading(false);
        }
    }, [user]);

    const fetchFeedback = async () => {
        try {
            const { data } = await axios.get(`/api/feedback/${user.startup}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setFeedback(data);
        } catch (error) {
            console.error('Error fetching feedback:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const { data } = await axios.put(`/api/feedback/${id}`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setFeedback(feedback.map(f => f._id === id ? data : f));
            toast.success(`Marked as ${newStatus}`);
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this feedback?')) return;
        try {
            await axios.delete(`/api/feedback/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setFeedback(feedback.filter(f => f._id !== id));
            toast.success('Feedback deleted');
        } catch (error) {
            toast.error('Failed to delete feedback');
        }
    };

    if (isLoading) return <div>Loading...</div>;

    const filteredFeedback = filter === 'All' ? feedback : feedback.filter(f => f.status === filter);

    // Calc stats
    const avgRating = feedback.length > 0
        ? (feedback.reduce((acc, curr) => acc + curr.rating, 0) / feedback.length).toFixed(1)
        : '0.0';

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">User Feedback</h1>
                    <p className="text-slate-500">Validate your ideas with real user insights.</p>
                </div>
                <div className="flex space-x-3">
                    {/* <button className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition">
                        <Share2 className="w-4 h-4 mr-2" /> Share Feedback Link
                    </button> */}
                </div>
            </div>

            {/* Stats & Filters */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                            <Star className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-medium">Avg Rating</p>
                            <p className="text-xl font-bold text-slate-900">{avgRating}/5</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                            <MessageSquare className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-medium">Total Responses</p>
                            <p className="text-xl font-bold text-slate-900">{feedback.length}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="border-none bg-transparent text-sm font-medium text-slate-600 focus:ring-0 cursor-pointer"
                    >
                        <option value="All">All Status</option>
                        <option value="New">New</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Implemented">Implemented</option>
                    </select>
                </div>
            </div>

            {/* Feedback Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {filteredFeedback.map((item, index) => (
                        <motion.div
                            layout
                            key={item._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 mr-3">
                                        {item.user.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{item.user}</p>
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3 h-3 ${i < item.rating ? 'fill-current' : 'text-slate-200'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${item.status === 'New' ? 'bg-blue-100 text-blue-700' :
                                    item.status === 'Reviewed' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                                    }`}>
                                    {item.status}
                                </span>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                "{item.comment}"
                            </p>
                            <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                                {item.status !== 'Reviewed' && item.status !== 'Implemented' && (
                                    <button
                                        onClick={() => handleUpdateStatus(item._id, 'Reviewed')}
                                        className="text-xs text-slate-400 hover:text-blue-600 font-medium transition-colors flex items-center"
                                    >
                                        <CheckCircle className="w-3 h-3 mr-1" /> Mark Reviewed
                                    </button>
                                )}
                                {item.status === 'Reviewed' && (
                                    <button
                                        onClick={() => handleUpdateStatus(item._id, 'Implemented')}
                                        className="text-xs text-slate-400 hover:text-green-600 font-medium transition-colors flex items-center"
                                    >
                                        <CheckCircle className="w-3 h-3 mr-1" /> Mark Implemented
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="text-xs text-slate-400 hover:text-red-600 font-medium transition-colors ml-auto"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="mt-2 text-[10px] text-slate-300 text-right">
                                {new Date(item.createdAt).toLocaleDateString()}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredFeedback.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                    No feedback found. Try simulating some!
                </div>
            )}
        </div>
    );
};

export default Feedback;
