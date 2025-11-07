// src/components/teacherDashboard/TContactMessagesCard.jsx
import React from "react";

export default function TContactMessagesCard({ messages, onAdd }) {
    return (
        <div className="bg-white p-4 lg:p-6 rounded-xl shadow">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg lg:text-xl font-bold text-purple-700">Recent Messages</h3>
                <button onClick={onAdd} className="text-xs lg:text-sm text-purple-600 underline">+ Add</button>
            </div>
            {messages.length > 0 ? (
                <div className="space-y-3">
                    {messages.map(m => (
                        <div key={m.id} className="border-l-4 border-purple-500 pl-3">
                            <p className="font-medium capitalize text-sm lg:text-base">{m.type}</p>
                            <p className="text-xs text-gray-600">{m.date.split("T")[0]}</p>
                            <p className="text-xs lg:text-sm text-gray-700 truncate">{m.message}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 italic text-sm">No messages.</p>
            )}
        </div>
    );
}