import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Copy, Check, Sparkles, Wand2, FileText, Presentation, HelpCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import ScriptPromptModal from '../components/ScriptPromptModal';

const PitchGenerator = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('script');
    const [loading, setLoading] = useState(false);
    const [pitch, setPitch] = useState(null);
    const [copied, setCopied] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchSavedPitch();
    }, []);

    const fetchSavedPitch = async () => {
        try {
            const { data } = await axios.get('/api/pitch', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setPitch(data);
        } catch (error) {
            // No saved pitch yet
            console.log('No saved pitch found');
        }
    };

    const generateScript = async (customPrompt = '') => {
        setLoading(true);
        try {
            const { data } = await axios.post('/api/pitch/generate-script',
                { customPrompt },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setPitch(prev => ({ ...prev, script: data.script }));
            toast.success('Pitch script generated!');
            setIsModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to generate script');
        } finally {
            setLoading(false);
        }
    };

    const generatePresentation = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post('/api/pitch/generate-presentation', {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setPitch(prev => ({ ...prev, presentation: data.presentation }));
            toast.success('Presentation outline generated!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to generate presentation');
        } finally {
            setLoading(false);
        }
    };

    const generateQA = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post('/api/pitch/generate-qa', {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setPitch(prev => ({ ...prev, qaPrep: data.qaPrep }));
            toast.success('Q&A preparation generated!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to generate Q&A');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success('Copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    const tabs = [
        { id: 'script', label: 'Pitch Script', icon: FileText },
        { id: 'presentation', label: 'Presentation', icon: Presentation },
        { id: 'qa', label: 'Q&A Prep', icon: HelpCircle },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center">
                        <Sparkles className="w-6 h-6 text-yellow-500 mr-2" />
                        AI Pitch Generator
                    </h1>
                    <p className="text-slate-500">Generate investor-ready pitches powered by Gemini AI</p>
                </div>
                <button
                    onClick={async () => {
                        setLoading(true);
                        try {
                            toast.loading('Analyzing problem and generating complete pitch...', { id: 'generate-all' });

                            // Generate all three in parallel
                            await Promise.all([
                                generateScript(),
                                generatePresentation(),
                                generateQA()
                            ]);

                            toast.success('Complete pitch generated!', { id: 'generate-all' });
                        } catch (error) {
                            toast.error('Failed to generate complete pitch', { id: 'generate-all' });
                        } finally {
                            setLoading(false);
                        }
                    }}
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white rounded-lg hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 transition disabled:opacity-50 shadow-md text-sm font-medium"
                >
                    {loading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    <span className="hidden sm:inline">{loading ? 'Generating...' : 'Generate AI Pitch'}</span>
                    <span className="sm:hidden">{loading ? 'Generating...' : 'AI Pitch'}</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 border-b border-slate-200 overflow-x-auto pb-1 scrollbar-hide">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center px-4 py-2 font-medium transition-all ${activeTab === tab.id
                                ? 'text-blue-600 border-b-2 border-blue-600'
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
                {activeTab === 'script' && (
                    <motion.div
                        key="script"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                    >
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-800">Pitch Script</h2>
                            <div className="flex space-x-2">
                                {pitch?.script && (
                                    <button
                                        onClick={() => handleCopy(pitch.script)}
                                        className="flex items-center px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition text-sm"
                                    >
                                        {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    disabled={loading}
                                    className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50"
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Wand2 className="w-4 h-4 mr-2" />
                                    )}
                                    {pitch?.script ? 'Customize' : 'Generate'}
                                </button>
                            </div>
                        </div>

                        {pitch?.script ? (
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                <div className="prose max-w-none">
                                    <pre className="whitespace-pre-wrap text-slate-700 font-sans text-sm leading-relaxed">
                                        {pitch.script}
                                    </pre>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-12 rounded-xl text-center border border-blue-100">
                                <Wand2 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-slate-800 mb-2">No Pitch Script Yet</h3>
                                <p className="text-slate-600 mb-4">Click "Generate Script" to create an AI-powered investor pitch</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'presentation' && (
                    <motion.div
                        key="presentation"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                    >
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-800">Presentation Outline</h2>
                            <button
                                onClick={generatePresentation}
                                disabled={loading}
                                className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Wand2 className="w-4 h-4 mr-2" />
                                )}
                                {pitch?.presentation ? 'Regenerate' : 'Generate'} Presentation
                            </button>
                        </div>

                        {pitch?.presentation?.slides ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {pitch.presentation.slides.map((slide, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:border-purple-200 transition"
                                    >
                                        <div className="flex items-center mb-3">
                                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold text-sm mr-3">
                                                {slide.number}
                                            </div>
                                            <h3 className="font-bold text-slate-800">{slide.title}</h3>
                                        </div>
                                        <ul className="space-y-1 mb-3">
                                            {slide.content?.map((point, i) => (
                                                <li key={i} className="text-sm text-slate-600 flex items-start">
                                                    <span className="text-purple-500 mr-2">•</span>
                                                    {point}
                                                </li>
                                            ))}
                                        </ul>
                                        {slide.visuals && (
                                            <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded">
                                                <strong>Visuals:</strong> {slide.visuals}
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-12 rounded-xl text-center border border-purple-100">
                                <Presentation className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-slate-800 mb-2">No Presentation Yet</h3>
                                <p className="text-slate-600 mb-4">Generate a slide-by-slide presentation outline</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'qa' && (
                    <motion.div
                        key="qa"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                    >
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-800">Q&A Preparation</h2>
                            <button
                                onClick={generateQA}
                                disabled={loading}
                                className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Wand2 className="w-4 h-4 mr-2" />
                                )}
                                {pitch?.qaPrep?.length > 0 ? 'Regenerate' : 'Generate'} Q&A
                            </button>
                        </div>

                        {pitch?.qaPrep?.length > 0 ? (
                            <div className="space-y-4">
                                {pitch.qaPrep.map((qa, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white p-5 rounded-xl shadow-sm border border-slate-100"
                                    >
                                        <div className="flex items-start mb-3">
                                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xs mr-3 mt-1">
                                                Q
                                            </div>
                                            <p className="font-semibold text-slate-800">{qa.question}</p>
                                        </div>
                                        <div className="flex items-start ml-9">
                                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs mr-3 mt-1">
                                                A
                                            </div>
                                            <p className="text-slate-600">{qa.answer}</p>
                                        </div>
                                        {qa.keyPoints?.length > 0 && (
                                            <div className="ml-9 mt-3 bg-slate-50 p-3 rounded-lg">
                                                <p className="text-xs font-semibold text-slate-700 mb-1">Key Points:</p>
                                                <ul className="space-y-1">
                                                    {qa.keyPoints.map((point, i) => (
                                                        <li key={i} className="text-xs text-slate-600 flex items-start">
                                                            <span className="text-green-500 mr-1">✓</span>
                                                            {point}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-12 rounded-xl text-center border border-green-100">
                                <HelpCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-slate-800 mb-2">No Q&A Prep Yet</h3>
                                <p className="text-slate-600 mb-4">Generate common investor questions and answers</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Script Prompt Modal */}
            <ScriptPromptModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onGenerate={generateScript}
                isLoading={loading}
            />
        </div>
    );
};

export default PitchGenerator;
