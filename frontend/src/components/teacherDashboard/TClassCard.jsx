// src/components/teacherDashboard/TClassCard.jsx
import React from "react";

export default function TClassCard({ cls, isSelected, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`bg-white p-4 lg:p-6 rounded-xl shadow cursor-pointer transition-all ${isSelected ? "ring-4 ring-green-500" : ""
                }`}
        >
            <h3 className="text-lg lg:text-xl font-bold text-green-700">
                {cls.name} {cls.section}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
                {cls.studentCount || 0} Students
            </p>
            <button className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm lg:text-base">
                View Students
            </button>
        </div>
    );
}