// src/components/teacherDashboard/TContactTab.jsx
import React from "react";

export default function TContactTab({ contactMessages, onAdd }) {
    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <h2 className="text-2xl lg:text-3xl font-bold">Contact Messages</h2>
                <button
                    onClick={onAdd}
                    className="px-4 lg:px-5 py-2 lg:py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm lg:text-base"
                >
                    + Add
                </button>
            </div>
            <div className="space-y-4">
                {contactMessages.length > 0 ? (
                    contactMessages.map(m => (
                        <div key={m.id} className="bg-white p-4 lg:p-5 rounded-lg shadow">
                            <p className="font-bold capitalize text-base lg:text-lg">{m.type}</p>
                            <p className="text-xs lg:text-sm text-gray-500 mt-1">{m.date.split("T")[0]}</p>
                            <p className="mt-2 text-sm lg:text-base text-gray-700">{m.message}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 italic">No messages.</p>
                )}
            </div>
        </div>
    );
}