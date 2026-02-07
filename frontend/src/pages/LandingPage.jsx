import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, Users, CheckSquare, MessageSquare, BarChart2, Zap, ArrowRight, Layout } from 'lucide-react';

const LandingPage = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const features = [
        {
            icon: <Layout className="w-6 h-6 text-purple-600" />,
            title: "Startup Workspace",
            description: "Manage your startup profile and vision."
        },
        {
            icon: <Users className="w-6 h-6 text-purple-600" />,
            title: "Team Management",
            description: "Coordinate your team effectively."
        },
        {
            icon: <CheckSquare className="w-6 h-6 text-purple-600" />,
            title: "Tasks & Milestones",
            description: "Track execution and progress."
        },
        {
            icon: <MessageSquare className="w-6 h-6 text-purple-600" />,
            title: "Feedback & Validation",
            description: "Validate ideas with user feedback."
        },
        {
            icon: <BarChart2 className="w-6 h-6 text-purple-600" />,
            title: "Analytics Dashboard",
            description: "Real-time insights into your progress."
        },
        {
            icon: <Zap className="w-6 h-6 text-purple-600" />,
            title: "AI Insights",
            description: "AI-powered suggestions for growth."
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <nav className="border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-sm z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Rocket className="w-6 h-6 text-purple-600 mr-2" />
                            <span className="font-bold text-xl text-slate-900">StartupOps</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                                Login
                            </Link>
                            <Link to="/signup" className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-20 pb-32 px-4 text-center max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium mb-8">
                        <Zap className="w-4 h-4 mr-2" /> 10x Your Execution
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight mb-6">
                        Build your startup <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                            in record time
                        </span>
                    </h1>
                    <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                        The all-in-one operating system for high-growth founders.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Link to="/signup" className="px-8 py-4 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition shadow-lg shadow-purple-200 flex items-center">
                            Start Building <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                        <Link to="/login" className="px-8 py-4 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition">
                            Login
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to execute</h2>
                        <p className="text-lg text-slate-600">Six core modules, one unified experience.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                            >
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-white text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-4xl font-bold text-slate-900 mb-6">Ready to ship?</h2>
                    <p className="text-xl text-slate-600 mb-10">
                        Join founders building the future.
                    </p>
                    <Link to="/signup" className="inline-flex items-center px-8 py-4 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition shadow-lg shadow-purple-200">
                        Get Started Now <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
