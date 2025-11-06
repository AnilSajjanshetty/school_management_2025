// src/components/HeadmasterDashboard/HMessageBreakdown.jsx
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export const HMessageBreakdown = ({ contactStats }) => {
    const pieData = Object.entries(contactStats)
        .filter(([, v]) => v > 0)
        .map(([k, v]) => ({
            name: k.charAt(0).toUpperCase() + k.slice(1),
            value: v,
            color: k === "complaint" ? "#ef4444" : k === "inquiry" ? "#3b82f6" : "#10b981",
        }));

    return (
        <div className="bg-white p-4 lg:p-6 rounded-xl shadow">
            <h3 className="text-lg lg:text-xl font-bold text-indigo-700 mb-4">Message Breakdown</h3>
            {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}`}
                            style={{ fontSize: "12px" }}
                        >
                            {pieData.map((entry, i) => (
                                <Cell key={`cell-${i}`} fill={entry.color} />
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
};