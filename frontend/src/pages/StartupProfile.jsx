import React, { useState, useEffect } from 'react';
import { getStartupDetails, getTeam } from '../services/mockData';
import { Building2, Users, Edit2, Save, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const StartupProfile = () => {
    const [startup, setStartup] = useState(null);
    const [team, setTeam] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        getStartupDetails().then(setStartup);
        getTeam().then(setTeam);
    }, []);

    if (!startup) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">{startup.name}</h1>
                    <p className="text-slate-500">Manage your startup identity and team.</p>
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`flex items-center px-4 py-2 rounded-lg transition ${isEditing ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
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
                                <select className="width-full mt-1 border rounded p-1">
                                    <option>Idea</option>
                                    <option>MVP</option>
                                    <option>Growth</option>
                                </select>
                            ) : (
                                <span className="inline-block px-2 py-1 mt-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                                    {startup.stage}
                                </span>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 uppercase">Target Market</label>
                            {isEditing ? (
                                <input type="text" defaultValue={startup.market} className="w-full mt-1 border rounded p-1" />
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
                                <textarea className="w-full mt-1 border rounded p-2" rows="2" defaultValue={startup.problem} />
                            ) : (
                                <p className="text-slate-700 mt-1">{startup.problem}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 uppercase">Solution</label>
                            {isEditing ? (
                                <textarea className="w-full mt-1 border rounded p-2" rows="2" defaultValue={startup.solution} />
                            ) : (
                                <p className="text-slate-700 mt-1">{startup.solution}</p>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Team Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                        <Users className="w-5 h-5 text-blue-600 mr-2" />
                        <h2 className="text-lg font-bold text-slate-800">Team Members</h2>
                    </div>
                    <button className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                        <Plus className="w-4 h-4 mr-1" /> Add Member
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {team.map((member) => (
                        <div key={member.id} className="flex items-center p-4 border border-slate-100 rounded-lg hover:border-blue-200 transition bg-slate-50">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold mr-3">
                                {member.avatar}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-900">{member.name}</p>
                                <p className="text-xs text-slate-500">{member.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StartupProfile;
