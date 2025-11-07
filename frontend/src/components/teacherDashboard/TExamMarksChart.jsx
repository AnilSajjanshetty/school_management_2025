// src/components/teacherDashboard/TExamMarksChart.jsx
import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function TExamMarksChart({ examResults, selectedClass, selectedExam, setSelectedClass, setSelectedExam, exams, teacherClasses }) {
    const availableExams = useMemo(() => {
        if (!selectedClass) return [];
        return exams.filter(ex => ex.classId === selectedClass.id);
    }, [selectedClass, exams]);

    const data = useMemo(() => {
        if (!selectedClass || !selectedExam) return [];
        const studentsInClass = new Set(examResults.filter(r => r.examId === selectedExam.id).map(r => r.studentId));
        const results = examResults.filter(r => r.examId === selectedExam.id && studentsInClass.has(r.studentId));
        if (results.length === 0) return [];

        const map = {};
        results.forEach(r => {
            if (!map[r.subject]) map[r.subject] = { total: 0, count: 0 };
            map[r.subject].total += r.marks;
            map[r.subject].count += 1;
        });

        return Object.entries(map).map(([subject, d]) => ({
            subject,
            average: Math.round(d.total / d.count),
        }));
    }, [examResults, selectedClass, selectedExam]);

    return (
        <div className="bg-white p-4 lg:p-6 rounded-xl shadow">
            <h3 className="text-lg lg:text-xl font-bold text-indigo-700 mb-4">Subject-wise Average Marks</h3>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <select
                    value={selectedClass?.id || ""}
                    onChange={(e) => {
                        const cls = teacherClasses.find(c => c.id === e.target.value);
                        setSelectedClass(cls || null);
                        setSelectedExam(null);
                    }}
                    className="px-3 py-2 border rounded-lg text-sm"
                >
                    <option value="">Select Class</option>
                    {teacherClasses.map(c => (
                        <option key={c.id} value={c.id}>{c.name} {c.section}</option>
                    ))}
                </select>
                <select
                    value={selectedExam?.id || ""}
                    onChange={(e) => setSelectedExam(availableExams.find(ex => ex.id === e.target.value) || null)}
                    className="px-3 py-2 border rounded-lg text-sm"
                    disabled={!selectedClass}
                >
                    <option value="">Select Exam</option>
                    {availableExams.map(ex => (
                        <option key={ex.id} value={ex.id}>{ex.title} ({ex.date.split("T")[0]})</option>
                    ))}
                </select>
            </div>

            {selectedClass && selectedExam && data.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        <Bar dataKey="average" fill="#3b82f6" name="Avg Marks" />
                    </BarChart>
                </ResponsiveContainer>
            ) : selectedClass && selectedExam ? (
                <p className="text-gray-500 italic text-sm">No results.</p>
            ) : selectedClass ? (
                <p className="text-gray-500 italic text-sm">Select an exam.</p>
            ) : (
                <p className="text-gray-500 italic text-sm">Select a class.</p>
            )}
        </div>
    );
}