import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, ArrowRight } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('Founder');

    const handleLogin = (e) => {
        e.preventDefault();
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">S</span>
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">Sign in to your account</h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Or{' '}
                    <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                        create a new startup workspace
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-100">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">I am a...</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRole('Founder')}
                                    className={`py-2 px-4 border rounded-md text-sm font-medium flex items-center justify-center ${role === 'Founder'
                                        ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500'
                                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                                        }`}
                                >
                                    Founder
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('Team')}
                                    className={`py-2 px-4 border rounded-md text-sm font-medium flex items-center justify-center ${role === 'Team'
                                        ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500'
                                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                                        }`}
                                >
                                    Team Member
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                Sign in
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
