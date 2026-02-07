import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckSquare, Clock, AlertCircle, TrendingUp, MessageSquare, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const MentorDashboard = () => {
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
            const { data } = await axios.get('/api/mentor/startups', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
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
            const { data } = await axios.get(`/api/mentor/dashboard/${startupId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
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
            await axios.post('/api/mentor/feedback', {
                startupId: selectedStartup,
                rating: feedbackForm.rating,
                comment: feedbackForm.comment
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
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

    const priorityData = dashboardData?.executionMetrics.priorityBreakdown ? [
        { name: 'High', count: dashboardData.executionMetrics.priorityBreakdown.high, fill: '#ef4444' },
        { name: 'Medium', count: dashboardData.executionMetrics.priorityBreakdown.medium, fill: '#f59e0b' },
        { name: 'Low', count: dashboardData.executionMetrics.priorityBreakdown.low, fill: '#10b981' }
    ] : [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Mentor Dashboard</h1>
                <p className="text-slate-500">Guide and track startup execution</p>
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
                    <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 rounded-xl shadow-lg text-white">
                        <h2 className="text-2xl font-bold mb-4">{dashboardData.startup.name}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-green-100 text-sm">Problem</p>
                                <p className="font-medium">{dashboardData.startup.problem}</p>
                            </div>
                            <div>
                                <p className="text-green-100 text-sm">Solution</p>
                                <p className="font-medium">{dashboardData.startup.solution}</p>
                            </div>
                            <div>
                                <p className="text-green-100 text-sm">Stage</p>
                                <p className="font-medium">{dashboardData.startup.stage}</p>
                            </div>
                            <div>
                                <p className="text-green-100 text-sm">Completion Rate</p>
                                <p className="font-medium text-2xl">{dashboardData.executionMetrics.completionRate}%</p>
                            </div>
                        </div>
                    </div>

                    {/* Execution Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500">Total Tasks</p>
                                    <p className="text-3xl font-bold text-slate-900">{dashboardData.executionMetrics.totalTasks}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <CheckSquare className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500">Completed</p>
                                    <p className="text-3xl font-bold text-green-600">{dashboardData.executionMetrics.completedTasks}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <CheckSquare className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500">In Progress</p>
                                    <p className="text-3xl font-bold text-blue-600">{dashboardData.executionMetrics.inProgressTasks}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Clock className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500">Weekly Completed</p>
                                    <p className="text-3xl font-bold text-purple-600">{dashboardData.executionMetrics.weeklyCompleted}</p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts and Tasks */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Priority Breakdown Chart */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Tasks by Priority</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={priorityData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Recent Tasks */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Tasks</h3>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {dashboardData.tasks.slice(0, 5).map((task, idx) => (
                                    <div key={idx} className="flex items-start p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <div className={`p-2 rounded-lg ${task.status === 'Done' ? 'bg-green-100' :
                                                task.status === 'In Progress' ? 'bg-blue-100' : 'bg-slate-200'
                                            } mr-3`}>
                                            {task.priority === 'High' ? (
                                                <AlertCircle className="w-4 h-4 text-red-600" />
                                            ) : (
                                                <CheckSquare className="w-4 h-4 text-slate-600" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-slate-900">{task.title}</p>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <span className={`text-xs px-2 py-1 rounded-full ${task.status === 'Done' ? 'bg-green-100 text-green-700' :
                                                        task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-slate-100 text-slate-700'
                                                    }`}>
                                                    {task.status}
                                                </span>
                                                <span className={`text-xs px-2 py-1 rounded-full ${task.priority === 'High' ? 'bg-red-100 text-red-700' :
                                                        task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-green-100 text-green-700'
                                                    }`}>
                                                    {task.priority}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Assigned to: {task.assignedTo || 'Unassigned'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* All Tasks List */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">All Tasks</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Task</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Priority</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Assigned To</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dashboardData.tasks.map((task, idx) => (
                                        <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="py-3 px-4 text-sm text-slate-900">{task.title}</td>
                                            <td className="py-3 px-4">
                                                <span className={`text-xs px-2 py-1 rounded-full ${task.status === 'Done' ? 'bg-green-100 text-green-700' :
                                                        task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-slate-100 text-slate-700'
                                                    }`}>
                                                    {task.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`text-xs px-2 py-1 rounded-full ${task.priority === 'High' ? 'bg-red-100 text-red-700' :
                                                        task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-green-100 text-green-700'
                                                    }`}>
                                                    {task.priority}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-slate-600">{task.assignedTo || 'Unassigned'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Feedback Form */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                            <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
                            Submit Guidance & Feedback
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
                                    Detailed Feedback & Suggestions
                                </label>
                                <textarea
                                    value={feedbackForm.comment}
                                    onChange={(e) => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                                    rows="4"
                                    placeholder="Share execution feedback, suggestions for improvement, or guidance..."
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
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

export default MentorDashboard;
