// src/components/teacherDashboard/TStudentCard.jsx
import React from "react";

export default function TStudentCard({ student, onAddProgress }) {
    return (
        <div className="bg-white p-4 lg:p-5 rounded-lg shadow">
            <p className="font-semibold text-base lg:text-lg">{student.name}</p>
            <p className="text-sm text-gray-500">Roll: {student.roll}</p>
            <p className="text-sm mt-1">Attendance: {student.attendance || 0}%</p>
            <p className="text-sm">Avg Score: {student.avgScore || 0}%</p>
            <button
                onClick={onAddProgress}
                className="mt-3 w-full px-3 py-1.5 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
            >
                Add Progress
            </button>
        </div>
    );
}