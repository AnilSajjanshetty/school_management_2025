// src/components/teacherDashboard/TExamsTab.jsx
import React from "react";

export default function TExamsTab({ exams, teacherClasses }) {
    const relevantExams = exams.filter(ex => teacherClasses.some(c => c.id === ex.classId));

    return (
        <div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8 text-gray-800">Exams</h2>
            <div className="space-y-4">
                {relevantExams.length > 0 ? (
                    relevantExams.map(ex => (
                        <div key={ex.id} className="bg-white p-4 lg:p-5 rounded-lg shadow">
                            <p className="font-bold text-base lg:text-lg">{ex.title}</p>
                            <p className="text-xs lg:text-sm text-gray-500 mt-1">{ex.date.split("T")[0]} at {ex.time}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 italic">No exams scheduled.</p>
                )}
            </div>
        </div>
    );
}