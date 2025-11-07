// src/components/teacherDashboard/TExamMarksChart.jsx
import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function TExamMarksChart({ selectedExam }) {
    const data = useMemo(() => {
        if (!selectedExam?.results?.length) return [];

        const map = {};
        selectedExam.results.forEach(r => {
            const subj = selectedExam.subject;
            if (!map[subj]) map[subj] = { total: 0, count: 0 };
            map[subj].total += r.marks;
            map[subj].count += 1;
        });

        return Object.entries(map).map(([subject, d]) => ({
            subject,
            average: Math.round(d.total / d.count),
        }));
    }, [selectedExam]);

    if (!selectedExam) return null;

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(v) => `${v}/100`} />
                <Legend />
                <Bar dataKey="average" fill="#10b981" name="Avg Marks" />
            </BarChart>
        </ResponsiveContainer>
    );
}