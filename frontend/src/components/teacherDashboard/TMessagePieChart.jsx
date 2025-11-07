// src/components/teacherDashboard/TMessagePieChart.jsx
import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function TMessagePieChart({ contactMessages }) {
    const data = useMemo(() => {
        const stats = { feedback: 0, complaint: 0, inquiry: 0 };
        contactMessages.forEach(m => stats[m.type]++);
        return Object.entries(stats)
            .filter(([, v]) => v > 0)
            .map(([k, v]) => ({
                name: k.charAt(0).toUpperCase() + k.slice(1),
                value: v,
                color: k === "complaint" ? "#ef4444" : k === "inquiry" ? "#3b82f6" : "#10b981",
            }));
    }, [contactMessages]);

    return (
        <div className="bg-white p-4 lg:p-6 rounded-xl shadow">
            <h3 className="text-lg lg:text-xl font-bold text-indigo-700 mb-4">Message Breakdown</h3>
            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}`}
                            style={{ fontSize: '12px' }}
                        >
                            {data.map((entry, i) => (
                                <Cell key1={`cell-${i}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-center text-gray-500 py-8 text-sm">No messages</p>
            )}
        </div>
    );
}