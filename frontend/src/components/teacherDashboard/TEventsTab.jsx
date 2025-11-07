// src/components/teacherDashboard/TEventsTab.jsx
import React from "react";

export default function TEventsTab({ events, teacherClasses, onAdd }) {
    const classEvents = events.filter(e => teacherClasses.some(c => e.classId === c.id));

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <h2 className="text-2xl lg:text-3xl font-bold">Events</h2>
                <button
                    onClick={onAdd}
                    className="px-4 lg:px-5 py-2 lg:py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm lg:text-base"
                >
                    + Add
                </button>
            </div>
            <div className="space-y-4">
                {classEvents.length > 0 ? (
                    classEvents.map(e => (
                        <div key={e.id} className="bg-white p-4 lg:p-5 rounded-lg shadow">
                            <p className="font-bold text-base lg:text-lg">{e.title}</p>
                            <p className="text-xs lg:text-sm text-gray-500 mt-1">{e.date.split("T")[0]}</p>
                            <p className="mt-2 text-sm lg:text-base text-gray-700">{e.content}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 italic">No events.</p>
                )}
            </div>
        </div>
    );
}