// src/components/teacherDashboard/TAnnouncementsTab.jsx
import React from "react";

export default function TAnnouncementsTab({ announcements, teacherClasses, onAdd }) {
    const visibleAnnouncements = announcements.filter(a =>
        !a.visibility || a.visibility === "public" || teacherClasses.some(c => a.visibility === `class:${c.id}`)
    );

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <h2 className="text-2xl lg:text-3xl font-bold">Announcements</h2>
                <button
                    onClick={onAdd}
                    className="px-4 lg:px-5 py-2 lg:py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm lg:text-base"
                >
                    + Add
                </button>
            </div>
            <div className="space-y-4">
                {visibleAnnouncements.length > 0 ? (
                    visibleAnnouncements.map(a => (
                        <div key={a.id} className="bg-white p-4 lg:p-5 rounded-lg shadow">
                            <p className="font-bold text-base lg:text-lg">{a.title}</p>
                            <p className="text-xs lg:text-sm text-gray-500 mt-1">{a.date.split("T")[0]}</p>
                            <p className="mt-2 text-sm lg:text-base text-gray-700">{a.content}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 italic">No announcements.</p>
                )}
            </div>
        </div>
    );
}