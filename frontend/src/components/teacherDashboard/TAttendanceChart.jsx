// src/components/teacherDashboard/TAttendanceChart.jsx
import React, { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function TAttendanceChart({ attendance, selectedClass, setSelectedClass, classes }) {
    const [view, setView] = useState("daily");
    const [year, setYear] = useState("");

    const classList = classes || [];

    const years = useMemo(() => {
        const records = selectedClass ? attendance[selectedClass.id] || [] : [];
        const ys = [...new Set(records.map(r => r.date.slice(0, 4)))].sort().reverse();
        return ys.length ? ys : [new Date().getFullYear().toString()];
    }, [attendance, selectedClass]);

    const data = useMemo(() => {
        if (!selectedClass || !attendance[selectedClass.id]) return [];

        let records = attendance[selectedClass.id];
        if (year) records = records.filter(r => r.date.startsWith(year));

        if (view === "daily") {
            return records.map(r => ({
                label: new Date(r.date).toLocaleDateString("en", { month: "short", day: "numeric" }),
                attendance: r.total > 0 ? Math.round((r.present / r.total) * 100) : 0
            }));
        }

        const map = {};
        records.forEach(r => {
            const key = view === "monthly" ? r.date.slice(0, 7) : r.date.slice(0, 4);
            if (!map[key]) map[key] = { present: 0, total: 0 };
            map[key].present += r.present;
            map[key].total += r.total;
        });

        return Object.entries(map)
            .map(([k, v]) => {
                const val = v.total > 0 ? Math.round((v.present / v.total) * 100) : 0;
                if (view === "monthly") {
                    const date = new Date(k + "-01");
                    return { label: date.toLocaleDateString("en", { month: "short", year: "2-digit" }), attendance: val };
                }
                return { label: k, attendance: val };
            })
            .sort((a, b) => a.label.localeCompare(b.label));
    }, [attendance, selectedClass, view, year]);

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                <div className="flex gap-2 flex-wrap">
                    <select
                        value={view}
                        onChange={e => setView(e.target.value)}
                        className="px-3 py-1.5 border rounded text-sm"
                    >
                        <option value="daily">Daily</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                    {view !== "daily" && (
                        <select
                            value={year}
                            onChange={e => setYear(e.target.value)}
                            className="px-3 py-1.5 border rounded text-sm"
                        >
                            <option value="">All Years</option>
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    )}
                </div>
            </div>

            <select
                value={selectedClass?.id || ""}
                onChange={e => {
                    const cls = classList.find(c => c.id === e.target.value);
                    setSelectedClass(cls || null);
                }}
                className="w-full mb-4 p-2 border rounded"
            >
                <option value="">Select Class</option>
                {classList.map(c => (
                    <option key={c.id} value={c.id}>
                        {c.name} {c.section}
                    </option>
                ))}
            </select>

            {selectedClass && data.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                        <YAxis domain={[0, 100]} />
                        <Tooltip formatter={(v) => `${v}%`} />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="attendance"
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={{ fill: "#10b981" }}
                            name="Attendance %"
                        />
                    </LineChart>
                </ResponsiveContainer>
            ) : selectedClass ? (
                <p className="text-center py-12 text-gray-500 italic">No attendance data</p>
            ) : (
                <p className="text-center py-12 text-gray-500 italic">Select a class</p>
            )}
        </div>
    );
}