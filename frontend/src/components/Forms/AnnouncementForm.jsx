// src/components/Forms/AnnouncementForm.jsx
import React, { useState } from "react";
import { uid } from "../../utils/mockData";

export const AnnouncementForm = ({ onCreate, onClose, classes = [], teachers = [] }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [visibility, setVisibility] = useState("public");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return alert("Title is required.");

        onCreate({
            id: uid("ann"),
            title: title.trim(),
            content: content.trim(),
            visibility,
            date: new Date().toLocaleDateString("en-GB"),
        });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Announcement Title"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                required
            />

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your announcement..."
                rows={4}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 resize-none"
            />

            <div>
                <label className="block font-medium text-gray-700 mb-1">Visibility</label>
                <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                >
                    <option value="public">Public (Everyone)</option>
                    <optgroup label="Classes">
                        {classes.map((c) => (
                            <option key={c.id} value={`class:${c.id}`}>
                                {c.name} {c.section}
                            </option>
                        ))}
                    </optgroup>
                    <optgroup label="Teachers">
                        {teachers.map((t) => (
                            <option key={t.id} value={`teacher:${t.id}`}>
                                {t.name}
                            </option>
                        ))}
                    </optgroup>
                </select>
            </div>

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 border rounded-lg hover:bg-gray-100"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                >
                    Create Announcement
                </button>
            </div>
        </form>
    );
};