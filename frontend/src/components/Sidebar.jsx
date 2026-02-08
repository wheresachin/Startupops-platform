import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, CheckSquare, MessageSquare, BarChart3, LogOut, Sparkles, X, CreditCard, Wallet } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isMobileOpen, onMobileClose }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
        onMobileClose?.();
    };

    const allNavItems = [
        // Founder & Team Items
        { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard, roles: ['Founder', 'Team'] },
        { name: 'Startup Profile', path: '/app/profile', icon: Building2, roles: ['Founder'] },
        { name: 'Tasks & Milestones', path: '/app/tasks', icon: CheckSquare, roles: ['Founder', 'Team'] },
        { name: 'Feedback', path: '/app/feedback', icon: MessageSquare, roles: ['Founder', 'Team'] },
        { name: 'Analytics', path: '/app/analytics', icon: BarChart3, roles: ['Founder'] },
        { name: 'Pitch Generator', path: '/app/pitch', icon: Sparkles, roles: ['Founder'] },
        { name: 'Resources', path: '/app/resources', icon: Wallet, roles: ['Founder'] },
        { name: 'Subscription', path: '/app/subscription', icon: CreditCard, roles: ['Founder'] },

        // Investor Items
        { name: 'Dashboard', path: '/investor/dashboard', icon: LayoutDashboard, roles: ['Investor'] },

        // Mentor Items
        { name: 'Dashboard', path: '/mentor/dashboard', icon: LayoutDashboard, roles: ['Mentor'] },
    ];

    const navItems = allNavItems.filter(item => item.roles.includes(user?.role));


    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col h-full">
                <div className="p-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">S</span>
                        </div>
                        <span className="text-xl font-bold text-slate-900">StartupOps</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1 mt-4">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                clsx(
                                    'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                                    isActive
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                )
                            }
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-200">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar */}
            <aside className={clsx(
                "fixed top-0 left-0 z-50 w-64 h-full bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col",
                isMobileOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">S</span>
                        </div>
                        <span className="text-xl font-bold text-slate-900">StartupOps</span>
                    </div>
                    <button
                        onClick={onMobileClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-600" />
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-1 mt-4">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onMobileClose}
                            className={({ isActive }) =>
                                clsx(
                                    'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                                    isActive
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                )
                            }
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-200">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
