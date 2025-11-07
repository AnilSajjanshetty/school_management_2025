// src/components/teacherDashboard/TTimetableTable.jsx
import React from "react";

export default function TTimetableTable({ timetable, classes }) {
    const schedule = timetable?.schedule || {};
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const times = Array.from(
        new Set(
            Object.values(schedule)
                .flat()
                .map(s => s.time)
                .filter(Boolean)
        )
    ).sort();

    const hasAnyClass = Object.values(schedule).some(slots => slots.length > 0);

    if (!hasAnyClass) {
        return (
            <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <p className="text-gray-500 italic">No schedule assigned.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse min-w-[700px]">
                <thead>
                    <tr>
                        <th className="border p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm md:text-base font-bold">
                            Time
                        </th>
                        {days.map(d => (
                            <th key={d} className="border p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm md:text-base font-bold">
                                {d}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {times.map(t => (
                        <tr key={t} className="hover:bg-gray-50 transition-colors">
                            <td className="border p-3 font-medium bg-gray-50 text-xs md:text-sm text-gray-700">
                                {t}
                            </td>
                            {days.map(d => {
                                const slot = schedule[d]?.find(s => s.time === t);
                                const classInfo = slot ? classes.find(c => c.id === slot.classId) : null;
                                return (
                                    <td key={d} className="border p-3 align-top min-h-20">
                                        {slot ? (
                                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-lg hover:shadow-md transition-all border border-green-200">
                                                <div className="font-bold text-green-900 text-xs md:text-sm">
                                                    {slot.subject}
                                                </div>
                                                <div className="text-xs text-emerald-700 font-medium mt-1">
                                                    {classInfo?.name} {classInfo?.section}
                                                </div>
                                                <div className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                    </svg>
                                                    {slot.room}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center text-xs md:text-sm text-gray-400 h-full flex items-center justify-center">
                                                —
                                            </div>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}