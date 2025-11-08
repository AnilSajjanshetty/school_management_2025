// src/components/HeadmasterDashboard/HSideNavbar.jsx
import { X } from 'lucide-react';
import React from 'react';

export const HSideNavbar = ({ setSelectedClassId, setView, closeSidebar, view, user, isSidebarOpen, onLogout }) => {
    return (
        <aside className={`
            fixed lg:static inset-y-0 left-0 z-50
            w-72 bg-indigo-800 text-white
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            flex flex-col h-full
        `}>
            {/* Header */}
            <div className="p-4 lg:p-6 border-b border-indigo-700 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 rounded-full w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center font-bold text-base lg:text-lg">
                            {user?.avatar?.[0] || 'A'}
                        </div>
                        <div>
                            <p className="font-bold text-sm lg:text-lg">{user?.name}</p>
                            <p className="text-xs lg:text-sm opacity-90">Headmaster</p>
                        </div>
                    </div>
                    <button
                        onClick={closeSidebar}
                        className="lg:hidden text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Scrollable Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-1">
                {[
                    { label: "Overview", view: "overview" },
                    { label: "Classes", view: "classes" },
                    { label: "Teachers", view: "teachers" },
                    { label: "Announcements", view: "announcements" },
                    { label: "Events", view: "events" },
                    { label: "Testimonials", view: "testimonials" },
                    { label: "Exams", view: "exams" },
                    { label: "Timetable", view: "timetables" },
                    { label: "Contact Messages", view: "contacts" },
                ].map((item) => (
                    <button
                        key={item.view}
                        onClick={() => {
                            setView(item.view);
                            setSelectedClassId(null);
                            closeSidebar();
                        }}
                        className={`w-full text-left px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg transition-all font-medium text-sm lg:text-base ${view === item.view
                            ? "bg-indigo-700 shadow-md"
                            : "hover:bg-indigo-700"
                            }`}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* Logout - Fixed at Bottom */}
            <div className="p-4 lg:p-6 border-t border-indigo-700 flex-shrink-0">
                <button
                    onClick={onLogout}
                    className="w-full px-3 lg:px-4 py-2 lg:py-2.5 bg-red-600 rounded-lg hover:bg-red-700 font-medium text-sm lg:text-base transition"
                >
                    Logout
                </button>
            </div>
        </aside>
    );
};