// src/components/teacherDashboard/TExamsTab.jsx
import React from "react";

export default function TExamsTab({ exams = [], teacherClassIds = [] }) {
    // Default to empty array if undefined
    const relevantExams = Array.isArray(exams)
        ? exams.filter(ex => teacherClassIds.includes(ex?.classId))
        : [];

    return (
        <div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-gray-800">Exams</h2>
            <div className="space-y-4">
                {relevantExams.length > 0 ? (
                    relevantExams.map(ex => (
                        <div key={ex.id} className="bg-white p-5 rounded-lg shadow">
                            <p className="font-bold text-lg">{ex.title}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                {new Date(ex.date).toLocaleDateString()} • {ex.duration} min • {ex.subject}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">Room: {ex.room}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 italic">No exams scheduled for your classes.</p>
                )}
            </div>
        </div>
    );
}