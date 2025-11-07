// src/components/teacherDashboard/TEventsTab.jsx
import React from "react";

export default function TEventsTab({ events, teacherClassIds, onAdd }) {
    const relevantEvents = events.filter(e =>
        e.public || (e.classId && teacherClassIds.includes(e.classId))
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl lg:text-3xl font-bold">Events</h2>
                <button onClick={onAdd} className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    + Add
                </button>
            </div>
            <div className="space-y-4">
                {relevantEvents.length > 0 ? (
                    relevantEvents.map(e => (
                        <div key={e.id} className="bg-white p-5 rounded-lg shadow">
                            <p className="font-bold text-lg">{e.title}</p>
                            <p className="text-sm text-gray-500 mt-1">{new Date(e.date).toLocaleDateString()}</p>
                            <p className="mt-2 text-gray-700">{e.content}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 italic">No events.</p>
                )}
            </div>
        </div>
    );
}