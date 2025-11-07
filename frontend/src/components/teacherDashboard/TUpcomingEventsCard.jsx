// src/components/teacherDashboard/TUpcomingEventsCard.jsx
import React from "react";

export default function TUpcomingEventsCard({ events, onAdd }) {
    return (
        <div className="bg-white p-4 lg:p-6 rounded-xl shadow">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg lg:text-xl font-bold text-green-700">Upcoming Events</h3>
                <button onClick={onAdd} className="text-xs lg:text-sm text-green-600 underline">+ Add</button>
            </div>
            {events.length > 0 ? (
                <div className="space-y-3">
                    {events.map(e => (
                        <div key={e.id} className="border-l-4 border-green-500 pl-3">
                            <p className="font-medium text-sm lg:text-base">{e.title}</p>
                            <p className="text-xs lg:text-sm text-gray-600">{e.date.split("T")[0]}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 italic text-sm">No upcoming events.</p>
            )}
        </div>
    );
}