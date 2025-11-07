// src/components/ClassTeacherDashboard/CTTimetableTab.jsx
export const CTTimetableTab = ({ timetableData }) => {
    if (!timetableData || Object.keys(timetableData).length === 0) {
        return <p className="text-gray-500 text-center py-8">No timetable</p>;
    }

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const timeSlots = Array.from(
        new Set(
            Object.values(timetableData).flatMap(arr =>
                arr.map(s => `${s.startTime}-${s.endTime}`)
            )
        )
    )
        .sort()
        .map(t => {
            const [start, end] = t.split('-');
            return { start, end };
        });

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 bg-purple-50 border-b">
                <h3 className="text-lg font-bold text-purple-900">My Teaching Timetable</h3>
                <p className="text-sm text-purple-700">Official school schedule</p>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-purple-100">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">
                                Time
                            </th>
                            {days.map(d => (
                                <th
                                    key={d}
                                    className="px-4 py-3 text-center text-xs font-semibold text-purple-900 uppercase tracking-wider"
                                >
                                    {d.slice(0, 3)}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {timeSlots.map(({ start, end }) => (
                            <tr key={`${start}-${end}`} className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                                    <div>{start}</div>
                                    <div className="text-xs text-gray-500">down {end}</div>
                                </td>
                                {days.map(day => {
                                    const slot = timetableData[day]?.find(
                                        s => s.startTime === start && s.endTime === end
                                    );
                                    return (
                                        <td key={day} className="px-2 py-2 align-top min-h-[70px] text-xs">
                                            {slot ? (
                                                <div className="bg-gradient-to-r from-purple-100 to-purple-50 border border-purple-300 rounded p-2">
                                                    <p className="font-semibold text-purple-900">{slot.subject}</p>
                                                    {slot.subjectCode && (
                                                        <p className="text-purple-700">[ {slot.subjectCode} ]</p>
                                                    )}
                                                    <p className="font-medium text-purple-800">{slot.className}</p>
                                                    {slot.room && (
                                                        <p className="text-gray-600">Room: {slot.room}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-gray-300">—</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-3 bg-gray-50 border-t text-xs text-gray-600 flex gap-4 flex-wrap">
                <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-purple-200 rounded"></div> Subject
                </span>
                <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-purple-300 rounded"></div> Class
                </span>
                <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gray-200 rounded"></div> Room
                </span>
            </div>
        </div>
    );
};