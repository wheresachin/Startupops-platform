import React, { useState, useEffect } from 'react';
import { getStartupDetails, getAnalytics } from '../services/mockData';
import { Download, Copy, Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const PitchGenerator = () => {
    const [startup, setStartup] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        getStartupDetails().then(setStartup);
    }, []);

    if (!startup) return <div>Loading...</div>;

    const sections = [
        { title: 'The Problem', content: startup.problem, icon: '🚨' },
        { title: 'The Solution', content: startup.solution, icon: '💡' },
        { title: 'Target Market', content: startup.market, icon: '🌍' },
        { title: 'Business Model', content: 'SaaS Subscription ($29/user/month)', icon: '💰' },
        { title: 'Traction', content: 'MVP Launched, 50+ Beta Users, 4.5/5 Avg Feeedback', icon: '🚀' },
    ];

    const handleCopy = () => {
        const text = sections.map(s => `${s.title}:\n${s.content}\n`).join('\n');
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center">
                        <Sparkles className="w-6 h-6 text-yellow-500 mr-2" />
                        Investor Pitch Generator
                    </h1>
                    <p className="text-slate-500">Auto-generate a pitch deck outline based on your startup data.</p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={handleCopy}
                        className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
                    >
                        {copied ? <Check className="w-4 h-4 mr-2 text-green-600" /> : <Copy className="w-4 h-4 mr-2" />}
                        {copied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        <Download className="w-4 h-4 mr-2" /> Export PDF
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.map((section, index) => (
                    <motion.div
                        key={section.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:border-blue-200 transition-colors"
                    >
                        <div className="flex items-center mb-3">
                            <span className="text-2xl mr-3">{section.icon}</span>
                            <h3 className="text-lg font-bold text-slate-800">{section.title}</h3>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/50 min-h-[100px] flex items-center">
                            <p className="text-slate-700 leading-relaxed font-medium">
                                {section.content}
                            </p>
                        </div>
                    </motion.div>
                ))}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-xl shadow-lg text-white flex flex-col justify-center items-center text-center"
                >
                    <h3 className="text-xl font-bold mb-2">Ready to Pitch?</h3>
                    <p className="opacity-90 mb-6">Get expert feedback on your pitch before sending it to investors.</p>
                    <button className="px-6 py-2 bg-white text-blue-700 font-bold rounded-full hover:bg-blue-50 transition shadow-lg">
                        Request Review
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default PitchGenerator;
