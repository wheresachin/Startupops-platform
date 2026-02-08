import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wallet, PieChart, Users, BookOpen, TrendingUp, Sparkles,
    CheckCircle, AlertTriangle, Info, IndianRupee, Target,
    Lightbulb, Clock, Award
} from 'lucide-react';
import toast from 'react-hot-toast';

// Mock initial data
const initialBudgetData = {
    totalFunds: 100000,
    allocations: {
        productDevelopment: 40000,
        infrastructure: 15000,
        teamSupport: 25000,
        mentorship: 10000,
        buffer: 10000
    }
};

const initialMilestones = [
    { id: 1, name: "MVP Development", amount: 10000, completed: false, paid: false, assignee: "Dev Team" },
    { id: 2, name: "User Testing Complete", amount: 5000, completed: false, paid: false, assignee: "QA Lead" },
    { id: 3, name: "Beta Launch", amount: 8000, completed: false, paid: false, assignee: "Full Team" },
];

const initialMentorEngagements = [
    { id: 1, name: "Startup Strategy Session", type: "Advisory", fee: 5000, date: "2026-02-01", completed: true },
    { id: 2, name: "Product Review", type: "One-time consultation", fee: 3000, date: "2026-02-15", completed: false },
];

// AI Suggestion Engine (Rule-Based)
const generateAISuggestions = (allocations, totalFunds) => {
    const suggestions = [];
    const productPercent = (allocations.productDevelopment / totalFunds) * 100;
    const teamPercent = (allocations.teamSupport / totalFunds) * 100;
    const bufferPercent = (allocations.buffer / totalFunds) * 100;

    if (productPercent < 35) {
        suggestions.push({
            type: 'warning',
            message: "Consider allocating at least 35-50% to Product Development for early-stage startups.",
            icon: AlertTriangle
        });
    } else if (productPercent >= 40) {
        suggestions.push({
            type: 'success',
            message: "Great! Your product development allocation aligns with lean startup best practices.",
            icon: CheckCircle
        });
    }

    if (teamPercent > 40) {
        suggestions.push({
            type: 'warning',
            message: "Team support exceeds 40%. Consider milestone-based payments instead of fixed salaries at this stage.",
            icon: AlertTriangle
        });
    }

    if (bufferPercent < 10) {
        suggestions.push({
            type: 'info',
            message: "Maintain at least 10% emergency buffer for unexpected expenses.",
            icon: Info
        });
    }

    suggestions.push({
        type: 'tip',
        message: "For early-stage startups, focusing on product-market fit and user validation provides better ROI than scaling team size.",
        icon: Lightbulb
    });

    return suggestions;
};

const ResourceManagement = () => {
    const [activeTab, setActiveTab] = useState('budget');
    const [totalFunds, setTotalFunds] = useState(initialBudgetData.totalFunds);
    const [allocations, setAllocations] = useState(initialBudgetData.allocations);
    const [milestones, setMilestones] = useState(initialMilestones);
    const [mentorEngagements, setMentorEngagements] = useState(initialMentorEngagements);
    const [aiSuggestions, setAiSuggestions] = useState([]);

    useEffect(() => {
        setAiSuggestions(generateAISuggestions(allocations, totalFunds));
    }, [allocations, totalFunds]);

    const categories = [
        { key: 'productDevelopment', label: 'Product Development', icon: Target, color: 'blue' },
        { key: 'infrastructure', label: 'Infrastructure', icon: PieChart, color: 'purple' },
        { key: 'teamSupport', label: 'Team Support (Stipend)', icon: Users, color: 'green' },
        { key: 'mentorship', label: 'Mentorship / Guidance', icon: BookOpen, color: 'orange' },
        { key: 'buffer', label: 'Buffer / Emergency', icon: Wallet, color: 'red' },
    ];

    const totalAllocated = Object.values(allocations).reduce((a, b) => a + b, 0);
    const remaining = totalFunds - totalAllocated;

    const handleAllocationChange = (key, value) => {
        const numValue = parseInt(value) || 0;
        setAllocations(prev => ({ ...prev, [key]: numValue }));
    };

    const handleMilestoneComplete = (id) => {
        setMilestones(prev => prev.map(m =>
            m.id === id ? { ...m, completed: true } : m
        ));
        toast.success('Milestone marked as completed!');
    };

    const handleStipendRelease = (id) => {
        setMilestones(prev => prev.map(m =>
            m.id === id ? { ...m, paid: true } : m
        ));
        toast.success('Stipend released successfully!');
    };

    const handleMentorComplete = (id) => {
        setMentorEngagements(prev => prev.map(m =>
            m.id === id ? { ...m, completed: true } : m
        ));
        toast.success('Engagement marked as completed!');
    };

    const tabs = [
        { id: 'budget', label: 'Budget Allocation', icon: Wallet },
        { id: 'team', label: 'Team Support', icon: Users },
        { id: 'mentor', label: 'Mentor Engagement', icon: BookOpen },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    ];

    const fundsUsed = milestones.filter(m => m.paid).reduce((a, m) => a + m.amount, 0) +
        mentorEngagements.filter(m => m.completed).reduce((a, m) => a + m.fee, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center">
                        <Wallet className="w-6 h-6 text-emerald-500 mr-2" />
                        Resource & Budget Management
                    </h1>
                    <p className="text-slate-500">Lean startup budget planning with AI guidance</p>
                </div>
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-lg shadow-md">
                    <span className="text-sm opacity-80">Total Funds</span>
                    <p className="text-xl font-bold flex items-center">
                        <IndianRupee className="w-5 h-5" />
                        {totalFunds.toLocaleString('en-IN')}
                    </p>
                </div>
            </div>

            {/* Lean Policy Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-800">
                    <strong>Lean Startup Model:</strong> Early-stage startups follow a lean model. The founder does not draw a salary, and team support is milestone-based.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 border-b border-slate-200 overflow-x-auto pb-1">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center px-4 py-2 font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <Icon className="w-4 h-4 mr-2" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                {/* Budget Allocation Tab */}
                {activeTab === 'budget' && (
                    <motion.div
                        key="budget"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                    >
                        {/* Allocation Form */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Total Available Funds (₹)
                                </label>
                                <input
                                    type="number"
                                    value={totalFunds}
                                    onChange={(e) => setTotalFunds(parseInt(e.target.value) || 0)}
                                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 space-y-4">
                                <h3 className="font-semibold text-slate-800">Budget Categories</h3>
                                {categories.map(cat => {
                                    const Icon = cat.icon;
                                    const percent = ((allocations[cat.key] / totalFunds) * 100).toFixed(1);
                                    return (
                                        <div key={cat.key} className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg bg-${cat.color}-100`}>
                                                <Icon className={`w-5 h-5 text-${cat.color}-600`} />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-slate-700">
                                                    {cat.label}
                                                </label>
                                                <input
                                                    type="number"
                                                    value={allocations[cat.key]}
                                                    onChange={(e) => handleAllocationChange(cat.key, e.target.value)}
                                                    className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                                                />
                                            </div>
                                            <div className="text-right min-w-[60px]">
                                                <span className="text-sm font-medium text-slate-600">{percent}%</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Summary */}
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                <h3 className="font-semibold text-slate-800 mb-3">Allocation Summary</h3>
                                <div className="flex justify-between items-center py-2 border-b">
                                    <span className="text-slate-600">Total Allocated</span>
                                    <span className="font-medium">₹{totalAllocated.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-slate-600">Remaining</span>
                                    <span className={`font-medium ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        ₹{remaining.toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* AI Suggestions Panel */}
                        <div className="space-y-4">
                            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-100">
                                <h3 className="font-semibold text-slate-800 flex items-center mb-4">
                                    <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
                                    AI Budget Advisor
                                </h3>
                                <div className="space-y-3">
                                    {aiSuggestions.map((sug, idx) => {
                                        const Icon = sug.icon;
                                        const colors = {
                                            success: 'bg-green-100 text-green-700 border-green-200',
                                            warning: 'bg-amber-100 text-amber-700 border-amber-200',
                                            info: 'bg-blue-100 text-blue-700 border-blue-200',
                                            tip: 'bg-purple-100 text-purple-700 border-purple-200'
                                        };
                                        return (
                                            <div key={idx} className={`p-3 rounded-lg border ${colors[sug.type]}`}>
                                                <div className="flex items-start gap-2">
                                                    <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                    <p className="text-sm">{sug.message}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Team Support Tab */}
                {activeTab === 'team' && (
                    <motion.div
                        key="team"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                    >
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
                                <Target className="w-5 h-5 text-emerald-600 mr-2" />
                                Milestone-Based Team Support
                            </h3>
                            <p className="text-sm text-slate-500 mb-4">
                                Team payments are linked to milestone completion. No recurring salary logic.
                            </p>

                            <div className="space-y-4">
                                {milestones.map(milestone => (
                                    <div key={milestone.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${milestone.completed ? 'bg-green-100' : 'bg-slate-200'}`}>
                                                {milestone.completed ? (
                                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                                ) : (
                                                    <Clock className="w-5 h-5 text-slate-500" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-800">{milestone.name}</p>
                                                <p className="text-sm text-slate-500">Assignee: {milestone.assignee}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium text-slate-700">₹{milestone.amount.toLocaleString('en-IN')}</span>
                                            {!milestone.completed && (
                                                <button
                                                    onClick={() => handleMilestoneComplete(milestone.id)}
                                                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                                                >
                                                    Mark Complete
                                                </button>
                                            )}
                                            {milestone.completed && !milestone.paid && (
                                                <button
                                                    onClick={() => handleStipendRelease(milestone.id)}
                                                    className="px-3 py-1 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700"
                                                >
                                                    Release Stipend
                                                </button>
                                            )}
                                            {milestone.paid && (
                                                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-lg">
                                                    Paid ✓
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Mentor Engagement Tab */}
                {activeTab === 'mentor' && (
                    <motion.div
                        key="mentor"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                    >
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 mb-4">
                            <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-blue-800">
                                <strong>AI Tip:</strong> Short-term mentorship provides better value than full-time paid advisors at early stages.
                            </p>
                        </div>

                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
                                <BookOpen className="w-5 h-5 text-orange-600 mr-2" />
                                Mentor Engagement Tracking
                            </h3>
                            <p className="text-sm text-slate-500 mb-4">
                                Mentor role is guidance-based, not salary-based. Track advisory sessions and one-time consultations.
                            </p>

                            <div className="space-y-4">
                                {mentorEngagements.map(engagement => (
                                    <div key={engagement.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${engagement.completed ? 'bg-green-100' : 'bg-orange-100'}`}>
                                                {engagement.completed ? (
                                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                                ) : (
                                                    <Award className="w-5 h-5 text-orange-600" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-800">{engagement.name}</p>
                                                <p className="text-sm text-slate-500">{engagement.type} • {engagement.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium text-slate-700">₹{engagement.fee.toLocaleString('en-IN')}</span>
                                            {!engagement.completed && (
                                                <button
                                                    onClick={() => handleMentorComplete(engagement.id)}
                                                    className="px-3 py-1 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700"
                                                >
                                                    Mark Complete
                                                </button>
                                            )}
                                            {engagement.completed && (
                                                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-lg">
                                                    Completed ✓
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <motion.div
                        key="analytics"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        {/* Stats Cards */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <p className="text-sm text-slate-500 mb-1">Total Funds Allocated</p>
                            <p className="text-2xl font-bold text-slate-800">₹{totalAllocated.toLocaleString('en-IN')}</p>
                            <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 rounded-full"
                                    style={{ width: `${Math.min((totalAllocated / totalFunds) * 100, 100)}%` }}
                                />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <p className="text-sm text-slate-500 mb-1">Funds Used</p>
                            <p className="text-2xl font-bold text-emerald-600">₹{fundsUsed.toLocaleString('en-IN')}</p>
                            <p className="text-xs text-slate-400 mt-1">Paid milestones + mentorship</p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <p className="text-sm text-slate-500 mb-1">Remaining Buffer</p>
                            <p className="text-2xl font-bold text-amber-600">
                                ₹{(allocations.buffer - fundsUsed).toLocaleString('en-IN')}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">Emergency funds available</p>
                        </div>

                        {/* AI Insight */}
                        <div className="md:col-span-3 bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-100">
                            <h3 className="font-semibold text-slate-800 flex items-center mb-3">
                                <Sparkles className="w-5 h-5 text-emerald-600 mr-2" />
                                AI Insight Summary
                            </h3>
                            <p className="text-slate-700">
                                {fundsUsed < totalAllocated * 0.5
                                    ? "✅ Current fund usage aligns with lean startup best practices. You're maintaining healthy reserves."
                                    : "⚠️ Fund usage is increasing. Consider reviewing upcoming expenses and prioritizing high-impact activities."
                                }
                            </p>
                            <p className="text-sm text-slate-500 mt-2">
                                Product Development: {((allocations.productDevelopment / totalFunds) * 100).toFixed(0)}% |
                                Team Support: {((allocations.teamSupport / totalFunds) * 100).toFixed(0)}% |
                                Buffer: {((allocations.buffer / totalFunds) * 100).toFixed(0)}%
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ResourceManagement;
