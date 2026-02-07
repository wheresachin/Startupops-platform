import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle2, ListTodo, MessageSquare, TrendingUp, Users, CheckSquare, UserPlus, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GrantAccessModal from '../components/GrantAccessModal';

const StatCard = ({ icon, title, value, color, bg }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
            </div>
            <div className={`p-3 rounded-lg ${bg}`}>
                {icon}
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [kpis, setKpis] = useState(null);
    const [analytics, setAnalytics] = useState([]);
    const [recentFeedback, setRecentFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showGrantAccessModal, setShowGrantAccessModal] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const { data } = await axios.get('/api/dashboard/stats', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setKpis(data.kpis);
            setAnalytics(data.analytics);
            setRecentFeedback(data.recentFeedback);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="text-slate-600">Loading dashboard...</div>
        </div>
    );

    // Custom view for Team Members
    if (user?.role === 'Team') {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Welcome back, {user?.name}!</h1>
                    <p className="text-slate-500">Here is your work overview.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        icon={<CheckSquare className="w-6 h-6 text-blue-600" />}
                        title="Your Tasks"
                        value={kpis?.totalTasks || 0}
                        color="text-blue-600"
                        bg="bg-blue-100"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
                    <p className="text-slate-500">Overview of your startup's performance.</p>
                </div>
                {user?.role === 'Founder' && (
                    <div className="flex space-x-3">
                        <button
                            onClick={() => navigate('/app/subscription')}
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg flex items-center shadow-lg transform hover:scale-105 transition-all text-sm font-medium"
                        >
                            <CreditCard className="w-4 h-4 mr-2" />
                            Upgrade Plan
                        </button>
                        <button
                            onClick={() => setShowGrantAccessModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center shadow-lg transform hover:scale-105 transition-all"
                        >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Grant Access
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<ListTodo className="w-6 h-6 text-blue-600" />}
                    title="Total Tasks"
                    value={kpis?.totalTasks || 0}
                    color="text-blue-600"
                    bg="bg-blue-100"
                />
                <StatCard
                    icon={<Users className="w-6 h-6 text-purple-600" />}
                    title="Team Members"
                    value={kpis?.teamMembers || 0}
                    color="text-purple-600"
                    bg="bg-purple-100"
                />
                <StatCard
                    icon={<MessageSquare className="w-6 h-6 text-green-600" />}
                    title="Feedback Received"
                    value={kpis?.pendingFeedback || 0}
                    color="text-green-600"
                    bg="bg-green-100"
                />
                <StatCard
                    icon={<TrendingUp className="w-6 h-6 text-amber-600" />}
                    title="Avg Rating"
                    value={`${kpis?.avgRating || '0.0'}/5`}
                    color="text-amber-600"
                    bg="bg-amber-100"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Weekly Activity</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Bar dataKey="tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="feedback" fill="#a855f7" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Feedback</h2>
                    <div className="space-y-4">
                        {recentFeedback.length > 0 ? (
                            recentFeedback.map((item, index) => (
                                <div key={index} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex justify-between items-start">
                                        <span className="font-medium text-slate-900">{item.user}</span>
                                        <span className="text-xs text-slate-500">{item.time}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 mt-1">{item.comment}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-500 text-center py-8">No feedback yet</p>
                        )}
                    </div>
                    {recentFeedback.length > 0 && (
                        <button
                            onClick={() => window.location.href = '/app/feedback'}
                            className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            View All Feedback
                        </button>
                    )}
                </div>
            </div>

            {/* Grant Access Modal */}
            <GrantAccessModal
                isOpen={showGrantAccessModal}
                onClose={() => setShowGrantAccessModal(false)}
            />
        </div>
    );
};

export default Dashboard;
