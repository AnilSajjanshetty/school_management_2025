// src/components/teacherDashboard/TSummaryCards.jsx
import React from "react";

export default function TSummaryCards({ totalStudents, avgAttendance, complaints, upcomingEvents }) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5 mb-6 lg:mb-8">
            <div className="bg-white p-4 lg:p-5 rounded-xl shadow">
                <p className="text-xs lg:text-sm text-gray-500">Total Students</p>
                <p className="text-2xl lg:text-3xl font-bold text-green-600">{totalStudents}</p>
            </div>
            <div className="bg-white p-4 lg:p-5 rounded-xl shadow">
                <p className="text-xs lg:text-sm text-gray-500">Avg Attendance</p>
                <p className="text-2xl lg:text-3xl font-bold text-blue-600">{avgAttendance}%</p>
            </div>
            <div className="bg-white p-4 lg:p-5 rounded-xl shadow">
                <p className="text-xs lg:text-sm text-gray-500">Complaints</p>
                <p className="text-2xl lg:text-3xl font-bold text-red-600">{complaints}</p>
            </div>
            <div className="bg-white p-4 lg:p-5 rounded-xl shadow">
                <p className="text-xs lg:text-sm text-gray-500">Upcoming Events</p>
                <p className="text-2xl lg:text-3xl font-bold text-purple-600">{upcomingEvents}</p>
            </div>
        </div>
    );
}