import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, CheckSquare, MessageSquare, BarChart3, LogOut, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

const Sidebar = () => {
    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Startup Profile', path: '/profile', icon: Building2 },
        { name: 'Tasks & Milestones', path: '/tasks', icon: CheckSquare },
        { name: 'Feedback', path: '/feedback', icon: MessageSquare },
        { name: 'Analytics', path: '/analytics', icon: BarChart3 },
        { name: 'Pitch Generator', path: '/pitch', icon: Sparkles },
    ];

    return (
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
                <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors">
                    <LogOut className="w-5 h-5 mr-3" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
