// src/components/teacherDashboard/TRecentAnnouncementsCard.jsx
import React from "react";

export default function TRecentAnnouncementsCard({ announcements, onAdd }) {
    return (
        <div className="bg-white p-4 lg:p-6 rounded-xl shadow">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg lg:text-xl font-bold text-yellow-700">Recent Announcements</h3>
                <button onClick={onAdd} className="text-xs lg:text-sm text-yellow-600 underline">+ Add</button>
            </div>
            {announcements.length > 0 ? (
                <div className="space-y-3">
                    {announcements.map(a => (
                        <div key={a.id} className="border-l-4 border-yellow-500 pl-3">
                            <p className="font-medium text-sm lg:text-base">{a.title}</p>
                            <p className="text-xs lg:text-sm text-gray-600">{a.date.split("T")[0]}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 italic text-sm">No announcements.</p>
            )}
        </div>
    );
}