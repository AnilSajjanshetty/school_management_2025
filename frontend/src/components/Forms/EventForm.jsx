// src/components/EventForm.jsx
import React, { useState } from "react";
import { uid } from "../../utils/mockData";

export const EventForm = ({ onCreate, onClose }) => {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");   // YYYY-MM-DD
    const [time, setTime] = useState("");   // HH:MM
    const [content, setContent] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !date) {
            alert("Title and Date are required.");
            return;
        }

        onCreate({
            id: uid("ev"),
            title,
            date,          // e.g. "2025-11-15"
            time: time || null,  // optional
            content,
            public: true,
        });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-1">
            {/* Title */}
            <div>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Event Title"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    required
                />
            </div>

            {/* Date (Calendar) */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                </label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    required
                />
            </div>

            {/* Time (Optional) */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time (optional)
                </label>
                <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
            </div>

            {/* Content */}
            <div>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Event description (optional)"
                    rows={3}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none resize-none"
                />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm"
                >
                    Create Event
                </button>
            </div>
        </form>
    );
};