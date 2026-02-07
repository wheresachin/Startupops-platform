import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Building2, Users, Edit2, Save, Plus, Link, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import AddMemberModal from '../components/AddMemberModal';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const StartupProfile = () => {
    const { user, updateUser } = useAuth();
    const [startup, setStartup] = useState(null);
    const [team, setTeam] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    // Form state for creating/editing
    const [formData, setFormData] = useState({
        name: '',
        stage: 'Idea',
        market: '',
        problem: '',
        solution: ''
    });

    useEffect(() => {
        if (user?.startup) {
            fetchStartupDetails();
        } else {
            setIsLoading(false);
        }
    }, [user]);

    const fetchStartupDetails = async () => {
        try {
            const { data } = await axios.get(`/api/startups/${user.startup}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setStartup(data);
            setTeam(data.team || []);
            setFormData({
                name: data.name,
                stage: data.stage,
                market: data.market,
                problem: data.problem,
                solution: data.solution
            });
        } catch (error) {
            toast.error('Failed to fetch startup details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateStartup = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/startups', formData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setStartup(data);
            setTeam(data.team || []);

            // Update user context with new startup ID
            const updatedUser = { ...user, startup: data._id };
            updateUser(updatedUser);

            toast.success('Startup profile created successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create startup');
        }
    };

    const handleUpdateStartup = async () => {
        try {
            const { data } = await axios.put(`/api/startups/${startup._id}`, formData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setStartup(data);
            setIsEditing(false);
            toast.success('Startup profile updated!');
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    const handleAddMember = async (newMember) => {
        try {
            const { data } = await axios.post(`/api/startups/${startup._id}/members`, { email: newMember.email }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setTeam(data.team); // Backend should return updated team array or user object, adjusting based on controller response
            // Re-fetch to be sure or update locally if controller returns just added member
            // Checking controller: returns { message, team: [...] } which maps to user IDs. 
            // We need populated team. Ideally controller should return populated team or we re-fetch.
            // Let's re-fetch for simplicity and correctness.
            fetchStartupDetails();
            setIsAddMemberModalOpen(false);
            toast.success('Team member added successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add member');
        }
    };

    const copyFeedbackLink = () => {
        const feedbackLink = `${window.location.origin}/submit-feedback?startup=${startup._id}`;
        navigator.clipboard.writeText(feedbackLink).then(() => {
            setCopied(true);
            toast.success('Feedback link copied!');
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (isLoading) return <div>Loading...</div>;

    // Show Create Form if no startup
    if (!startup) {
        return (
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                <div className="text-center mb-8">
                    <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building2 className="h-8 w-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Create your Startup Profile</h2>
                    <p className="text-slate-500">Tell us about your venture to get started.</p>
                </div>

                <form onSubmit={handleCreateStartup} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Startup Name</label>
                        <input
                            type="text"
                            required
                            className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. NextGen AI"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Current Stage</label>
                        <select
                            className="w-full border border-slate-300 rounded-lg p-2.5"
                            value={formData.stage}
                            onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                        >
                            <option value="Idea">Idea Phase</option>
                            <option value="MVP">MVP / Prototype</option>
                            <option value="Growth">Growth / Scaling</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Target Market</label>
                        <input
                            type="text"
                            className="w-full border border-slate-300 rounded-lg p-2.5"
                            value={formData.market}
                            onChange={(e) => setFormData({ ...formData, market: e.target.value })}
                            placeholder="e.g. B2B SaaS, FinTech"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">The Problem</label>
                        <textarea
                            className="w-full border border-slate-300 rounded-lg p-2.5"
                            rows="3"
                            value={formData.problem}
                            onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                            placeholder="What problem are you solving?"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">The Solution</label>
                        <textarea
                            className="w-full border border-slate-300 rounded-lg p-2.5"
                            rows="3"
                            value={formData.solution}
                            onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                            placeholder="How does your product solve it?"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition"
                    >
                        Create Startup Profile
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    {isEditing ? (
                        <input
                            type="text"
                            className="text-2xl font-bold text-slate-800 border-b border-slate-300 focus:outline-none focus:border-blue-500 bg-transparent w-full"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    ) : (
                        <h1 className="text-2xl font-bold text-slate-800">{startup.name}</h1>
                    )}
                    <p className="text-slate-500 text-sm sm:text-base">Manage your startup identity and team.</p>
                </div>
                <button
                    onClick={() => {
                        if (isEditing) {
                            handleUpdateStartup();
                        } else {
                            setIsEditing(true);
                        }
                    }}
                    className={`flex items-center px-4 py-2 rounded-lg transition text-sm font-medium ${isEditing ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                >
                    {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit2 className="w-4 h-4 mr-2" />}
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
            </div>

            {/* Startup Details Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center mb-4">
                        <Building2 className="w-5 h-5 text-blue-600 mr-2" />
                        <h2 className="text-lg font-bold text-slate-800">General Info</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 uppercase">Stage</label>
                            {isEditing ? (
                                <select
                                    className="w-full mt-1 border rounded p-1"
                                    value={formData.stage}
                                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                                >
                                    <option value="Idea">Idea Phase</option>
                                    <option value="MVP">MVP / Prototype</option>
                                    <option value="Growth">Growth / Scaling</option>
                                </select>
                            ) : (
                                <span className={`inline-block px-2 py-1 mt-1 text-xs font-medium rounded-full ${startup.stage === 'Idea' ? 'bg-yellow-100 text-yellow-700' :
                                    startup.stage === 'MVP' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                    }`}>
                                    {startup.stage}
                                </span>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 uppercase">Target Market</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    className="w-full mt-1 border rounded p-1"
                                    value={formData.market}
                                    onChange={(e) => setFormData({ ...formData, market: e.target.value })}
                                />
                            ) : (
                                <p className="text-slate-700 mt-1">{startup.market}</p>
                            )}
                        </div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center mb-4">
                        <h2 className="text-lg font-bold text-slate-800">The Problem & Solution</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 uppercase">Problem</label>
                            {isEditing ? (
                                <textarea
                                    className="w-full mt-1 border rounded p-2"
                                    rows="2"
                                    value={formData.problem}
                                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                                />
                            ) : (
                                <p className="text-slate-700 mt-1">{startup.problem}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 uppercase">Solution</label>
                            {isEditing ? (
                                <textarea
                                    className="w-full mt-1 border rounded p-2"
                                    rows="2"
                                    value={formData.solution}
                                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                                />
                            ) : (
                                <p className="text-slate-700 mt-1">{startup.solution}</p>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Feedback Link Section */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl shadow-sm border border-purple-100"
            >
                <div className="flex items-center mb-4">
                    <Link className="w-5 h-5 text-purple-600 mr-2" />
                    <h2 className="text-lg font-bold text-slate-800">Shareable Feedback Link</h2>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                    Share this link with users, customers, or investors to collect feedback directly.
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="flex-1 bg-white px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-700 font-mono overflow-x-auto whitespace-nowrap">
                        {window.location.origin}/submit-feedback?startup={startup._id}
                    </div>
                    <button
                        onClick={copyFeedbackLink}
                        className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center shrink-0 ${copied
                            ? 'bg-green-600 text-white'
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                            }`}
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 mr-2" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy Link
                            </>
                        )}
                    </button>
                </div>
            </motion.div>

            {/* Team Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                        <Users className="w-5 h-5 text-blue-600 mr-2" />
                        <h2 className="text-lg font-bold text-slate-800">Team Members</h2>
                    </div>
                    <button
                        onClick={() => setIsAddMemberModalOpen(true)}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        <Plus className="w-4 h-4 mr-1" /> Add Member
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {team.length > 0 ? (
                        team.map((member) => (
                            <div key={member._id} className="flex items-center p-4 border border-slate-100 rounded-lg hover:border-blue-200 transition bg-slate-50">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold mr-3">
                                    {getInitials(member.name)}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{member.name}</p>
                                    <p className="text-xs text-slate-500">
                                        {member.role}
                                        {member.username && <span className="ml-1 text-slate-400">(@{member.username})</span>}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-8 text-slate-500">
                            No team members yet. Invite your co-founders or employees.
                        </div>
                    )}
                </div>
            </div>

            {/* Add Member Modal */}
            <AddMemberModal
                isOpen={isAddMemberModalOpen}
                onClose={() => setIsAddMemberModalOpen(false)}
                onAdd={handleAddMember}
            />
        </div>
    );
};

export default StartupProfile;
