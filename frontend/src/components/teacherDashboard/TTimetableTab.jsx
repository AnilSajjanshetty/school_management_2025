// src/components/teacherDashboard/TTimetableTab.jsx
import React from "react";
import TTimetableTable from "./TTimetableTable";

export default function TTimetableTab({ teacherTimetables, classes }) {
    // Extract the first (and only) timetable for this teacher
    const timetable = teacherTimetables[0] || {};

    return (
        <div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8 text-gray-800 flex items-center gap-3">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                My Teaching Schedule
            </h2>
            <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-lg border border-gray-100">
                <TTimetableTable timetable={timetable} classes={classes} />
            </div>
        </div>
    );
}