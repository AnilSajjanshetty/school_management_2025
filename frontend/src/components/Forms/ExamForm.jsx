// src/components/Forms/AddExamForm.jsx
import React, { useState, useMemo } from "react";

const ALL_SUBJECTS = [
    "Math",
    "Science",
    "English",
    "Hindi",
    "Social Studies",
    "Computer",
    "History",
    "Biology",
    "Physics",
    "Chemistry",
];

export const ExamForm = ({ onCreate, onClose, classes = [], user }) => {
    const [title, setTitle] = useState("");
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [description, setDescription] = useState("");
    const [selectedClassId, setSelectedClassId] = useState("");

    // === 1. Find classes the teacher teaches ===
    const teachingClassIds = useMemo(() => {
        const set = new Set();
        user?.timetables?.forEach((tt) => {
            Object.values(tt.schedule || {}).forEach((slots) =>
                slots.forEach((slot) => {
                    if (
                        user.subjects?.includes(slot.subject) ||
                        slot.teacher === user.name
                    ) {
                        set.add(tt.classId);
                    }
                })
            );
        });
        return set;
    }, [user]);

    const availableClasses = classes.filter((c) => teachingClassIds.has(c.id));

    // === 2. Toggle subject (max 6) ===
    const toggleSubject = (sub) => {
        setSelectedSubjects((prev) => {
            if (prev.includes(sub)) {
                return prev.filter((s) => s !== sub);
            }
            if (prev.length >= 6) {
                alert("Maximum 6 subjects allowed per exam.");
                return prev;
            }
            return [...prev, sub];
        });
    };

    // === 3. Submit ===
    const handleSubmit = () => {
        if (!title || selectedSubjects.length === 0 || !selectedClassId || !date) {
            alert("Please fill Title, at least one Subject, Class, and Date.");
            return;
        }

        onCreate({
            id: Date.now().toString(),
            title,
            subjects: selectedSubjects, // <-- array
            date,
            time: time || null,
            description,
            classId: selectedClassId,
        });
        onClose();
    };

    return (
        <div className="space-y-5">
            {/* Title */}
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Exam Title (e.g. Mid-Term, Unit Test)"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Subjects - Checkboxes */}
            <div>
                <label className="block font-medium mb-1">Subjects (max 6)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border rounded bg-gray-50">
                    {ALL_SUBJECTS.map((sub) => (
                        <label
                            key={sub}
                            className="flex items-center space-x-2 cursor-pointer select-none"
                        >
                            <input
                                type="checkbox"
                                checked={selectedSubjects.includes(sub)}
                                onChange={() => toggleSubject(sub)}
                                className="rounded text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm">{sub}</span>
                        </label>
                    ))}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                    Selected: {selectedSubjects.join(", ") || "none"}
                </p>
            </div>

            {/* Class */}
            <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">Select Class</option>
                {availableClasses.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                        {cls.name} {cls.section}
                    </option>
                ))}
            </select>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Time (optional)</label>
                    <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Description */}
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description / notes (optional)"
                rows={2}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-3">
                <button
                    onClick={onClose}
                    className="px-4 py-2 border rounded hover:bg-gray-100 transition"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Schedule Exam
                </button>
            </div>
        </div>
    );
};