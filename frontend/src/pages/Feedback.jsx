import React, { useState, useEffect } from 'react';
import { getFeedback } from '../services/mockData';
import { MessageSquare, Star, Share2, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const Feedback = () => {
    const [feedback, setFeedback] = useState([]);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        getFeedback().then(setFeedback);
    }, []);

    if (!feedback) return <div>Loading...</div>;

    const filteredFeedback = filter === 'All' ? feedback : feedback.filter(f => f.status === filter);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">User Feedback</h1>
                    <p className="text-slate-500">Validate your ideas with real user insights.</p>
                </div>
                <button className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition">
                    <Share2 className="w-4 h-4 mr-2" /> Share Feedback Link
                </button>
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
                            <p className="text-xl font-bold text-slate-900">4.2/5</p>
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
                {filteredFeedback.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 mr-3">
                                    {item.user.charAt(0)}
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
                            <button className="text-xs text-slate-400 hover:text-blue-600 font-medium transition-colors">Mark as Reviewed</button>
                            <button className="text-xs text-slate-400 hover:text-red-600 font-medium transition-colors">Delete</button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Feedback;
