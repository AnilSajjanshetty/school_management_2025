// src/components/Forms/AddTeacherForm.jsx
import React, { useState } from "react";
import { uid } from "../../utils/mockData";

export const AddTeacherForm = ({ onCreate, onClose }) => {
    const [name, setName] = useState("");
    const [subjects, setSubjects] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        onCreate({
            id: uid("t"),
            name: name.trim(),
            subjects: subjects
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
        });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Teacher Name"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
            />

            <input
                type="text"
                value={subjects}
                onChange={(e) => setSubjects(e.target.value)}
                placeholder="Subjects (comma-separated)"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />

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
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    Add Teacher
                </button>
            </div>
        </form>
    );
};