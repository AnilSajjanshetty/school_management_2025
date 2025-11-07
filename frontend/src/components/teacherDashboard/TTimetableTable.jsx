// src/components/teacherDashboard/TTimetableTable.jsx
import React from "react";

export default function TTimetableTable({ teacherTimetables, user, classes }) {
    const schedule = teacherTimetables.find(tt => tt.teacherId === user?.id)?.schedule || {};
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const times = Array.from(new Set(Object.values(schedule).flatMap(slots => slots.map(s => s.time)))).sort();

    if (!Object.keys(schedule).length) {
        return <p className="text-gray-500 italic">No schedule assigned.</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse min-w-[600px]">
                <thead>
                    <tr>
                        <th className="border p-2 bg-green-100 text-sm md:text-base">Time</th>
                        {days.map(d => (
                            <th key={d} className="border p-2 bg-green-100 text-sm md:text-base">{d}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {times.map(t => (
                        <tr key={t}>
                            <td className="border p-2 font-medium bg-gray-50 text-xs md:text-sm">{t}</td>
                            {days.map(d => {
                                const slot = schedule[d]?.find(s => s.time === t);
                                const classInfo = slot ? classes.find(c => c.id === slot.classId) : null;
                                return (
                                    <td key={d} className="border p-2 align-top h-16 md:h-20">
                                        {slot ? (
                                            <div className="bg-green-50 p-1 md:p-2 rounded hover:bg-green-100">
                                                <div className="font-semibold text-green-900 text-xs md:text-sm">{slot.subject}</div>
                                                <div className="text-xs text-green-700">{classInfo?.name} {classInfo?.section}</div>
                                            </div>
                                        ) : (
                                            <div className="text-xs md:text-sm text-gray-400 text-center">—</div>
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