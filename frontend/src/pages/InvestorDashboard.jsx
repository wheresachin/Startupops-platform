import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, CheckCircle, Clock, MessageSquare, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const InvestorDashboard = () => {
    const { user } = useAuth();
    const [startups, setStartups] = useState([]);
    const [selectedStartup, setSelectedStartup] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [feedbackForm, setFeedbackForm] = useState({ rating: 5, comment: '' });

    useEffect(() => {
        fetchStartups();
    }, []);

    useEffect(() => {
        if (selectedStartup) {
            fetchDashboard(selectedStartup);
        }
    }, [selectedStartup]);

    const fetchStartups = async () => {
        try {
            const { data } = await api.get('/investor/startups');
            setStartups(data.startups);
            if (data.startups.length > 0) {
                setSelectedStartup(data.startups[0].id);
            }
        } catch (error) {
            toast.error('Failed to load startups');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDashboard = async (startupId) => {
        try {
            setLoading(true);
            const { data } = await api.get(`/investor/dashboard/${startupId}`);
            setDashboardData(data);
        } catch (error) {
            toast.error('Failed to load dashboard data');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const submitFeedback = async (e) => {
        e.preventDefault();
        try {
            await api.post('/investor/feedback', {
                startupId: selectedStartup,
                rating: feedbackForm.rating,
                comment: feedbackForm.comment
            });
            toast.success('Feedback submitted successfully');
            setFeedbackForm({ rating: 5, comment: '' });
        } catch (error) {
            toast.error('Failed to submit feedback');
        }
    };

    if (loading && !dashboardData) {
        return <div className="flex items-center justify-center h-64">Loading...</div>;
    }

    const statusData = dashboardData?.analytics.statusBreakdown ? [
        { name: 'To Do', value: dashboardData.analytics.statusBreakdown.todo, color: '#94a3b8' },
        { name: 'In Progress', value: dashboardData.analytics.statusBreakdown.inProgress, color: '#3b82f6' },
        { name: 'Done', value: dashboardData.analytics.statusBreakdown.done, color: '#10b981' }
    ] : [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Investor Dashboard</h1>
                <p className="text-slate-500">Monitor startup progress and analytics</p>
            </div>

            {/* Startup Selector */}
            {startups.length > 1 && (
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Select Startup</label>
                    <select
                        value={selectedStartup || ''}
                        onChange={(e) => setSelectedStartup(e.target.value)}
                        className="w-full md:w-auto px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        {startups.map(startup => (
                            <option key={startup.id} value={startup.id}>
                                {startup.name} - {startup.stage}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {dashboardData && (
                <>
                    {/* Startup Overview */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl shadow-lg text-white">
                        <h2 className="text-2xl font-bold mb-4">{dashboardData.startup.name}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-blue-100 text-sm">Problem</p>
                                <p className="font-medium">{dashboardData.startup.problem}</p>
                            </div>
                            <div>
                                <p className="text-blue-100 text-sm">Solution</p>
                                <p className="font-medium">{dashboardData.startup.solution}</p>
                            </div>
                            <div>
                                <p className="text-blue-100 text-sm">Stage</p>
                                <p className="font-medium">{dashboardData.startup.stage}</p>
                            </div>
                            <div>
                                <p className="text-blue-100 text-sm">Market</p>
                                <p className="font-medium">{dashboardData.startup.market || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Analytics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500">Task Completion</p>
                                    <p className="text-3xl font-bold text-slate-900">{dashboardData.analytics.taskCompletionRate}%</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500">Total Tasks</p>
                                    <p className="text-3xl font-bold text-slate-900">{dashboardData.analytics.totalTasks}</p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <Target className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500">Completed</p>
                                    <p className="text-3xl font-bold text-slate-900">{dashboardData.analytics.completedTasks}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Task Distribution</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value }) => `${name}: ${value}`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {statusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Milestones */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Key Milestones</h3>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {dashboardData.milestones.length > 0 ? (
                                    dashboardData.milestones.map((milestone, idx) => (
                                        <div key={idx} className="flex items-start p-3 bg-slate-50 rounded-lg">
                                            <div className={`p-2 rounded-lg ${milestone.status === 'Done' ? 'bg-green-100' :
                                                milestone.status === 'In Progress' ? 'bg-blue-100' : 'bg-slate-200'
                                                } mr-3`}>
                                                {milestone.status === 'Done' ? (
                                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <Clock className="w-4 h-4 text-slate-600" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-slate-900">{milestone.title}</p>
                                                <p className="text-xs text-slate-500">
                                                    Assigned to: {milestone.assignedTo || 'Unassigned'}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-500 text-center py-4">No milestones yet</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Feedback Form */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                            <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                            Submit Feedback
                        </h3>
                        <form onSubmit={submitFeedback} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Rating
                                </label>
                                <div className="flex items-center space-x-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                                            className="focus:outline-none"
                                        >
                                            <Star
                                                className={`w-8 h-8 ${star <= feedbackForm.rating
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-slate-300'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Comment
                                </label>
                                <textarea
                                    value={feedbackForm.comment}
                                    onChange={(e) => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    rows="4"
                                    placeholder="Share your insights and feedback..."
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                            >
                                Submit Feedback
                            </button>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
};

export default InvestorDashboard;
