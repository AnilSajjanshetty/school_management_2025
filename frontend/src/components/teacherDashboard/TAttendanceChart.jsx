// src/components/teacherDashboard/TAttendanceChart.jsx
import React, { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function TAttendanceChart({ attendance, selectedClass, setSelectedClass, teacherClasses, view = "monthly" }) {
    const data = useMemo(() => {
        if (!selectedClass) return [];
        const records = attendance.filter(a => a.classId === selectedClass.id);
        if (records.length === 0) return [];

        if (view === "daily") {
            return records
                .map(a => ({
                    date: a.date.split("-").slice(1).join("/"),
                    attendance: a.total > 0 ? Math.round((a.present / a.total) * 100) : 0,
                }))
                .sort((a, b) => a.date.localeCompare(b.date));
        }

        const map = new Map();
        records.forEach(r => {
            const month = r.date.slice(0, 7);
            const cur = map.get(month) || { present: 0, total: 0 };
            cur.present += r.present;
            cur.total += r.total;
            map.set(month, cur);
        });
        return Array.from(map.entries())
            .map(([month, d]) => ({
                month: new Date(month + "-01").toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
                attendance: d.total > 0 ? Math.round((d.present / d.total) * 100) : 0,
            }))
            .sort((a, b) => a.month.localeCompare(b.month));
    }, [attendance, selectedClass, view]);

    return (
        <div className="bg-white p-4 lg:p-6 rounded-xl shadow">
            <h3 className="text-lg lg:text-xl font-bold text-indigo-700 mb-4">Attendance Trend</h3>
            <select
                value={selectedClass?.id || ""}
                onChange={(e) => setSelectedClass(teacherClasses.find(c => c.id === e.target.value) || null)}
                className="w-full mb-3 px-3 py-2 border rounded-lg text-sm"
            >
                <option value="">Select Class</option>
                {teacherClasses.map(c => (
                    <option key={c.id} value={c.id}>{c.name} {c.section}</option>
                ))}
            </select>

            {selectedClass && data.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={view === "daily" ? "date" : "month"} tick={{ fontSize: 12 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        <Line type="monotone" dataKey="attendance" stroke="#10b981" name="Attendance %" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            ) : selectedClass ? (
                <p className="text-gray-500 italic text-sm">No attendance data.</p>
            ) : (
                <p className="text-gray-500 italic text-sm">Please select a class.</p>
            )}
        </div>
    );
}   