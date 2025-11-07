// src/components/teacherDashboard/TExamMarksChart.jsx
import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function TExamMarksChart({
    examResults,
    selectedClass,
    selectedExam,
    setSelectedClass,
    setSelectedExam,
    exams,
    teacherClasses
}) {
    const availableExams = useMemo(() =>
        exams.filter(e => e.classId === selectedClass?.id),
        [exams, selectedClass]
    );

    const data = useMemo(() => {
        if (!selectedExam) return [];
        const result = examResults.find(r => r.examId === selectedExam.id);
        if (!result) return [];

        const map = {};
        result.results.forEach(r => {
            const subj = result.subject;
            if (!map[subj]) map[subj] = { total: 0, count: 0 };
            map[subj].total += r.marksObtained;
            map[subj].count += 1;
        });

        return Object.entries(map).map(([subject, d]) => ({
            subject,
            average: Math.round(d.total / d.count)
        }));
    }, [examResults, selectedExam]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-indigo-700 mb-4">Subject-wise Average Marks</h3>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <select
                    value={selectedClass?.id || ""}
                    onChange={e => {
                        const cls = teacherClasses.find(c => c.id === e.target.value);
                        setSelectedClass(cls);
                        setSelectedExam(null);
                    }}
                    className="flex-1 p-2 border rounded"
                >
                    <option value="">Select Class</option>
                    {teacherClasses.map(c => (
                        <option key={c.id} value={c.id}>{c.name} {c.section}</option>
                    ))}
                </select>

                <select
                    value={selectedExam?.id || ""}
                    onChange={e => setSelectedExam(availableExams.find(ex => ex.id === e.target.value) || null)}
                    className="flex-1 p-2 border rounded"
                    disabled={!selectedClass}
                >
                    <option value="">Select Exam</option>
                    {availableExams.map(ex => (
                        <option key={ex.id} value={ex.id}>
                            {ex.title} ({new Date(ex.date).toLocaleDateString()})
                        </option>
                    ))}
                </select>
            </div>

            {selectedClass && selectedExam && data.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="subject" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="average" fill="#3b82f6" name="Avg Marks" />
                    </BarChart>
                </ResponsiveContainer>
            ) : selectedClass && selectedExam ? (
                <p className="text-center py-12 text-gray-500 italic">No results yet</p>
            ) : selectedClass ? (
                <p className="text-center py-12 text-gray-500 italic">Select an exam</p>
            ) : (
                <p className="text-center py-12 text-gray-500 italic">Select a class</p>
            )}
        </div>
    );
}