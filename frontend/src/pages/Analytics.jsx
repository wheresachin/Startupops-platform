import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Analytics = () => {
    const { user } = useAuth();
    const [analyticsData, setAnalyticsData] = useState({ taskData: [], feedbackData: [] });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user?.startup) {
            fetchAnalytics();
        } else {
            setIsLoading(false);
        }
    }, [user]);

    const fetchAnalytics = async () => {
        try {
            const { data } = await axios.get('/api/analytics', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setAnalyticsData(data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Analytics</h1>
                    <p className="text-slate-500">Deep dive into your startup's performance metrics.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Task Distribution */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Task Distribution (by Priority)</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analyticsData.taskData}>
                                <defs>
                                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip />
                                <Area type="monotone" dataKey="tasks" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTasks)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Feedback Ratings */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Feedback Ratings</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analyticsData.feedbackData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="feedback" fill="#a855f7" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
