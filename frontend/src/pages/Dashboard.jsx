import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getKPIs, getAnalytics } from '../services/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle2, ListTodo, MessageSquare, TrendingUp, Crown, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [kpis, setKpis] = useState(null);
    const [analytics, setAnalytics] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        getKPIs().then(setKpis);
        getAnalytics().then(setAnalytics);
    }, []);

    if (!kpis) return <div>Loading...</div>;

    const cards = [
        { title: 'Total Tasks', value: kpis.totalTasks, icon: ListTodo, color: 'text-blue-600', bg: 'bg-blue-100' },
        { title: 'Completed', value: kpis.completedTasks, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
        { title: 'Feedback', value: kpis.pendingFeedback, icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-100' },
        { title: 'Milestones', value: `${kpis.milestones.completed}/${kpis.milestones.total}`, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-100' },
    ];

    const isPro = user?.subscription?.plan === 'Pro';

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
                    {isPro ? (
                        <span className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 rounded-full text-sm font-semibold">
                            <Crown className="w-4 h-4" />
                            Pro
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold">
                            Free
                        </span>
                    )}
                </div>
                <div className="flex gap-2">
                    {!isPro && (
                        <button
                            onClick={() => navigate('/pricing')}
                            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition flex items-center gap-2 font-semibold"
                        >
                            <Sparkles className="w-4 h-4" />
                            Upgrade to Pro
                        </button>
                    )}
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        + New Task
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-6 rounded-xl shadow-sm border border-slate-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">{card.title}</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{card.value}</p>
                            </div>
                            <div className={`p-3 rounded-lg ${card.bg}`}>
                                <card.icon className={`w-6 h-6 ${card.color}`} />
                            </div>
                        </div>
                    </motion.div>
                ))}
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
                        {/* Mock recent items */}
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="flex justify-between items-start">
                                <span className="font-medium text-slate-900">BetaUser_01</span>
                                <span className="text-xs text-slate-500">2h ago</span>
                            </div>
                            <p className="text-sm text-slate-600 mt-1">Great UI, but load time is slow.</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="flex justify-between items-start">
                                <span className="font-medium text-slate-900">Investor_Dave</span>
                                <span className="text-xs text-slate-500">1d ago</span>
                            </div>
                            <p className="text-sm text-slate-600 mt-1">Solid value prop. Pitch deck needs work.</p>
                        </div>
                    </div>
                    <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View All Feedback
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
