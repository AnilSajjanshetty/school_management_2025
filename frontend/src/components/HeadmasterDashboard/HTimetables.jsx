// components/HeadmasterDashboard/HTimetables.jsx
import React from "react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const HTimetables = ({ timetables = [], onAddClick }) => {
    if (!timetables.length) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-2xl font-bold text-gray-800">All Class Timetables</h2>
                    <button
                        onClick={onAddClick}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
                    >
                        + Create Timetable
                    </button>
                </div>

                <div className="text-center py-12 text-gray-500">
                    <p className="text-lg">No timetables available</p>
                </div>
            </div>
        );
    }
    return (
        <div className="space-y-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">All Class Timetables</h2>
                <button
                    onClick={onAddClick}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
                >
                    + Create Timetable
                </button>
            </div>
            {timetables.map((cls) => {
                const { classId, className, timetable } = cls;

                return (
                    <div
                        key={classId}
                        className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
                    >
                        {/* Class Header */}
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
                            <h3 className="text-lg font-bold">{className}</h3>
                        </div>

                        {/* Timetable Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b">
                                        <th className="px-4 py-3 text-left font-medium text-gray-700 w-28">
                                            Day
                                        </th>
                                        {[...Array(8)].map((_, i) => (
                                            <th
                                                key={i}
                                                className="px-4 py-3 text-center font-medium text-gray-700"
                                            >
                                                Period {i + 1}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {days.map((day) => {
                                        const daySlots = timetable[day] || [];

                                        return (
                                            <tr key={day} className="border-b hover:bg-gray-50">
                                                <td className="px-4 py-3 font-medium text-gray-800">
                                                    {day}
                                                </td>
                                                {[...Array(8)].map((_, periodIdx) => {
                                                    const period = periodIdx + 1;
                                                    const slot = daySlots.find((s) => s.period === period);

                                                    return (
                                                        <td
                                                            key={period}
                                                            className="px-4 py-3 text-center align-top min-h-20"
                                                        >
                                                            {slot ? (
                                                                <div className="text-xs space-y-1">
                                                                    <p className="font-semibold text-gray-800">
                                                                        {slot.subject}
                                                                    </p>
                                                                    <p className="text-gray-600">
                                                                        {slot.subjectCode}
                                                                    </p>
                                                                    <p className="text-gray-500 text-xs">
                                                                        {slot.startTime} - {slot.endTime}
                                                                    </p>
                                                                    {slot.room && slot.room !== "-" && (
                                                                        <p className="text-gray-400 text-xs">
                                                                            {slot.room}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-300 text-xs">—</span>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};