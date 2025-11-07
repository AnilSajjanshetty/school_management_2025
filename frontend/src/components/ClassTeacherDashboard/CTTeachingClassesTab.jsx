// components/ClassTeacherDashboard/CTTeachingClassesTab.jsx
export const CTTeachingClassesTab = ({ data }) => {
    if (!data || data.length === 0) return <p className="text-gray-500 text-center py-8">No classes assigned</p>;

    const timetable = {};
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    data.forEach(cls => {
        const className = `${cls.name} ${cls.section || ''}`.trim();
        cls.schedule?.forEach(s => {
            if (!timetable[s.day]) timetable[s.day] = [];
            timetable[s.day].push({ ...s, className });
        });
    });

    const timeSlots = Array.from(
        new Set(
            Object.values(timetable).flatMap(arr => arr.map(s => `${s.startTime}-${s.endTime}`))
        )
    ).sort().map(t => {
        const [start, end] = t.split('-');
        return { start, end };
    });

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 bg-purple-50 border-b">
                <h3 className="text-lg font-bold text-purple-900">Classes I Teach</h3>
                <p className="text-sm text-purple-700">Your teaching schedule by day and time</p>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-purple-100">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-purple-900 uppercase">Time</th>
                            {days.map(d => <th key={d} className="px-4 py-3 text-center text-xs font-semibold text-purple-900 uppercase">{d.slice(0, 3)}</th>)}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {timeSlots.map(({ start, end }) => (
                            <tr key={`${start}-${end}`} className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                                    <div>{start}</div>
                                    <div className="text-xs text-gray-500">↓ {end}</div>
                                </td>
                                {days.map(day => {
                                    const slots = timetable[day]?.filter(s => s.startTime === start && s.endTime === end) || [];
                                    return (
                                        <td key={day} className="px-2 py-2 align-top min-h-[70px] text-xs">
                                            {slots.length > 0 ? (
                                                <div className="space-y-1">
                                                    {slots.map((slot, i) => (
                                                        <div key={i} className="bg-gradient-to-r from-purple-100 to-purple-50 border border-purple-300 rounded p-2">
                                                            <p className="font-semibold text-purple-900">{slot.subject}</p>
                                                            {slot.subjectCode && <p className="text-purple-700">[ {slot.subjectCode} ]</p>}
                                                            <p className="font-medium text-purple-800">{slot.className}</p>
                                                            {slot.room && <p className="text-gray-600">Room: {slot.room}</p>}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : <span className="text-gray-300">—</span>}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};