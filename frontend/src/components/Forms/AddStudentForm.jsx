// src/components/Forms/AddStudentForm.jsx
import React, { useState } from "react";
import { uid } from "../../utils/mockData";

export const AddStudentForm = ({ onCreate, onClose, classes = [] }) => {
    const [name, setName] = useState("");
    const [roll, setRoll] = useState("");
    const [selectedClassId, setSelectedClassId] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !roll || !selectedClassId) return alert("All fields are required.");

        onCreate({
            id: uid("s"),
            name: name.trim(),
            roll,
            classId: selectedClassId,
            attendance: 100, // default
            avgScore: 0, // default
        });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Student Name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
            />

            <input
                type="text"
                value={roll}
                onChange={(e) => setRoll(e.target.value)}
                placeholder="Roll Number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
            />

            <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
            >
                <option value="">Select Class</option>
                {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                        {c.name} {c.section}
                    </option>
                ))}
            </select>

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                    Add Student
                </button>
            </div>
        </form>
    );
};