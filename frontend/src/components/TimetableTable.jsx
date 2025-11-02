import React from "react";

export const renderTimetableTable = (schedule = {}) => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const times = Array.from(
        new Set(days.flatMap(d => (schedule[d] || []).map(s => s.time)))
    ).sort((a, b) => a.localeCompare(b));

    return (
        <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
                <thead>
                    <tr>
                        <th className="border p-2 bg-gray-100">Time</th>
                        {days.map(d => (
                            <th key={d} className="border p-2 bg-gray-100">{d}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {times.map(t => (
                        <tr key={t}>
                            <td className="border p-2 font-medium">{t}</td>
                            {days.map(d => {
                                const slot = (schedule[d] || []).find(s => s.time === t);
                                return (
                                    <td key={d} className="border p-2 align-top h-20">
                                        {slot ? (
                                            <div>
                                                <div className="font-semibold">{slot.subject}</div>
                                                <div className="text-sm text-gray-600">{slot.teacher}</div>
                                            </div>
                                        ) : (
                                            <div className="text-sm text-gray-400">-</div>
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
};