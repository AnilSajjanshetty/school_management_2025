// components/ClassTeacherDashboard/CTHeader.jsx
import React from 'react';
import { Menu, Bell } from 'lucide-react';

const tabTitles = {
    overview: 'Analytics Dashboard',
    myclass: 'My Class',
    teaching: 'Classes I Teach',
    timetables: 'Timetables',
    announcements: 'Announcements',
    events: 'Events',
    exams: 'Exams',
};

export const CTHeader = ({ activeTab, onMenuClick }) => {
    return (
        <header className="bg-white shadow-sm px-4 lg:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button onClick={onMenuClick} className="lg:hidden text-gray-600">
                    <Menu className="w-6 h-6" />
                </button>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
                    {tabTitles[activeTab]}
                </h1>
            </div>
            <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-purple-600" />
        </header>
    );
};