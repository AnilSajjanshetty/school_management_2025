// components/ClassTeacherDashboard/CTSideNavbar.jsx
import React from 'react';
import { X } from 'lucide-react';
import { navItems } from './navConfig';

export const CTSideNavbar = ({
    activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen,
    user, myClass, teachingCount, onLogout
}) => {
    return (
        <aside className={`
      fixed lg:static inset-y-0 left-0 z-50 w-72 bg-purple-800 text-white
      transform transition-transform duration-300 h-full flex flex-col
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
            {/* Header */}
            <div className="p-4 lg:p-6 border-b border-purple-700 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-600 rounded-full w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center font-bold">
                            {user?.name?.[0] || "T"}
                        </div>
                        <div>
                            <p className="font-bold text-sm lg:text-base">{user?.name || "Teacher"}</p>
                            <p className="text-xs lg:text-sm text-purple-200">Class Teacher</p>
                        </div>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="bg-purple-700 p-3 rounded">
                    <p className="text-xs text-purple-200">My Class</p>
                    <p className="font-semibold text-sm lg:text-base">
                        {myClass ? `${myClass.name} ${myClass.section || ''}`.trim() : 'Not Assigned'}
                    </p>
                    <p className="text-xs mt-2 text-purple-200">Teaching {teachingCount} classes</p>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-2">
                {navItems.map(({ tab, icon: Icon, label }) => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setIsSidebarOpen(false); }}
                        className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 transition text-sm lg:text-base
              ${activeTab === tab ? "bg-purple-700" : "hover:bg-purple-700"}`}
                    >
                        <Icon className="w-4 h-4" /> {label}
                    </button>
                ))}
            </nav>

            {/* Logout */}
            <div className="p-4 lg:p-6 border-t border-purple-700 flex-shrink-0">
                <button onClick={onLogout} className="w-full px-3 py-2 bg-red-600 rounded hover:bg-red-700 text-sm lg:text-base">
                    Logout
                </button>
            </div>
        </aside>
    );
};