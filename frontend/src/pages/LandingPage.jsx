import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, Users, CheckSquare, MessageSquare, BarChart2, Zap, ArrowRight, Layout, Mail, Phone, MapPin, Github, Twitter, Linkedin, Menu, X } from 'lucide-react';

const LandingPage = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setMobileMenuOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Enhanced Navbar */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className="border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-md z-50 shadow-sm"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <motion.div
                            className="flex items-center cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Rocket className="w-6 h-6 text-purple-600 mr-2" />
                            <span className="font-bold text-xl text-slate-900">StartupOps</span>
                        </motion.div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <button onClick={() => scrollToSection('about')} className="text-sm font-medium text-slate-600 hover:text-purple-600 transition">
                                About
                            </button>
                            <button onClick={() => scrollToSection('how-it-works')} className="text-sm font-medium text-slate-600 hover:text-purple-600 transition">
                                How It Works
                            </button>
                            <button onClick={() => scrollToSection('contact')} className="text-sm font-medium text-slate-600 hover:text-purple-600 transition">
                                Contact Us
                            </button>
                            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
                                Login
                            </Link>
                            <Link to="/signup" className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition transform hover:scale-105">
                                Get Started
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="md:hidden py-4 space-y-4"
                        >
                            <button onClick={() => scrollToSection('about')} className="block w-full text-left text-sm font-medium text-slate-600 hover:text-purple-600 transition py-2">
                                About
                            </button>
                            <button onClick={() => scrollToSection('how-it-works')} className="block w-full text-left text-sm font-medium text-slate-600 hover:text-purple-600 transition py-2">
                                How It Works
                            </button>
                            <button onClick={() => scrollToSection('contact')} className="block w-full text-left text-sm font-medium text-slate-600 hover:text-purple-600 transition py-2">
                                Contact Us
                            </button>
                            <Link to="/login" className="block text-sm font-medium text-slate-600 hover:text-slate-900 transition py-2">
                                Login
                            </Link>
                            <Link to="/signup" className="block px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition text-center">
                                Get Started
                            </Link>
                        </motion.div>
                    )}
                </div>
            </motion.nav>

            {/* Hero Section with Enhanced Animations */}
            <section className="pt-20 pb-32 px-4 text-center max-w-5xl mx-auto overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="inline-flex items-center px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium mb-8"
                    >
                        <Zap className="w-4 h-4 mr-2" /> 10x Your Execution
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight mb-6"
                    >
                        Build your startup <br />
                        <motion.span
                            initial={{ backgroundPosition: "0% 50%" }}
                            animate={{ backgroundPosition: "100% 50%" }}
                            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                            className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_auto]"
                        >
                            in record time
                        </motion.span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
                    >
                        The all-in-one operating system for high-growth founders.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        className="flex flex-col sm:flex-row justify-center gap-4"
                    >
                        <Link to="/signup" className="px-8 py-4 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition shadow-lg shadow-purple-200 flex items-center justify-center group">
                            Start Building <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/login" className="px-8 py-4 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition hover:scale-105 transform">
                            Login
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

            {/* About Section */}
            <section id="about" className="py-24 bg-gradient-to-b from-white to-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">About StartupOps</h2>
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                            StartupOps is designed by founders, for founders. We understand the challenges of building a startup from scratch.
                            Our platform brings together everything you need to execute fast, collaborate seamlessly, and scale efficiently.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
                        <p className="text-lg text-slate-600">Simple, powerful, and designed for execution.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { step: "1", title: "Create Your Workspace", desc: "Set up your startup profile and invite your team members in minutes." },
                            { step: "2", title: "Execute & Track", desc: "Break down your vision into tasks, track milestones, and measure progress." },
                            { step: "3", title: "Grow & Scale", desc: "Collect feedback, analyze data, and make informed decisions to scale faster." }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2, duration: 0.6 }}
                                whileHover={{ y: -10 }}
                                className="text-center"
                            >
                                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                <p className="text-slate-600">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">Everything you need to execute</h2>
                        <p className="text-lg text-slate-600">Six core modules, one unified experience.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 transition-all"
                            >
                                <motion.div
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.6 }}
                                    className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6"
                                >
                                    {feature.icon}
                                </motion.div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">Get In Touch</h2>
                        <p className="text-lg text-slate-600">Have questions? We'd love to hear from you.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="bg-white p-6 rounded-xl shadow-sm text-center"
                        >
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-slate-900 mb-2">Email</h3>
                            <p className="text-slate-600 text-sm">contact@startupops.com</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            whileHover={{ scale: 1.05 }}
                            className="bg-white p-6 rounded-xl shadow-sm text-center"
                        >
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Phone className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-slate-900 mb-2">Phone</h3>
                            <p className="text-slate-600 text-sm">+91 1234567890</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            whileHover={{ scale: 1.05 }}
                            className="bg-white p-6 rounded-xl shadow-sm text-center"
                        >
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MapPin className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-slate-900 mb-2">Location</h3>
                            <p className="text-slate-600 text-sm">IIT Jammu, India</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-r from-purple-600 to-pink-600 text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to ship?</h2>
                        <p className="text-xl text-purple-100 mb-10">
                            Join founders building the future.
                        </p>
                        <Link to="/signup" className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition shadow-lg transform hover:scale-105 group">
                            Get Started Now <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-300 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center mb-4">
                                <Rocket className="w-6 h-6 text-purple-400 mr-2" />
                                <span className="font-bold text-xl text-white">StartupOps</span>
                            </div>
                            <p className="text-slate-400 mb-4">
                                The all-in-one operating system for high-growth founders. Execute faster, collaborate better, scale smarter.
                            </p>
                            <div className="flex space-x-4">
                                <motion.a
                                    whileHover={{ scale: 1.2, color: "#a855f7" }}
                                    href="#"
                                    className="hover:text-purple-400 transition"
                                >
                                    <Twitter className="w-5 h-5" />
                                </motion.a>
                                <motion.a
                                    whileHover={{ scale: 1.2, color: "#a855f7" }}
                                    href="#"
                                    className="hover:text-purple-400 transition"
                                >
                                    <Linkedin className="w-5 h-5" />
                                </motion.a>
                                <motion.a
                                    whileHover={{ scale: 1.2, color: "#a855f7" }}
                                    href="#"
                                    className="hover:text-purple-400 transition"
                                >
                                    <Github className="w-5 h-5" />
                                </motion.a>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold text-white mb-4">Product</h4>
                            <ul className="space-y-2">
                                <li><button onClick={() => scrollToSection('about')} className="hover:text-purple-400 transition">About</button></li>
                                <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-purple-400 transition">How It Works</button></li>
                                <li><Link to="/signup" className="hover:text-purple-400 transition">Pricing</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-white mb-4">Support</h4>
                            <ul className="space-y-2">
                                <li><button onClick={() => scrollToSection('contact')} className="hover:text-purple-400 transition">Contact Us</button></li>
                                <li><a href="#" className="hover:text-purple-400 transition">Help Center</a></li>
                                <li><a href="#" className="hover:text-purple-400 transition">Privacy Policy</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
                        <p>&copy; 2024 StartupOps. All rights reserved. Built with ❤️ by founders, for founders.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
