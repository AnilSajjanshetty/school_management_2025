// src/components/TimetableCreator.jsx
import React, { useState } from "react";
import { uid } from "../../utils/mockData";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SUBJECTS = ["Math", "Science", "English", "Hindi", "Social Studies", "Computer"];

export const TimetableCreator = ({ onCreate, classes = [], teachers = [] }) => {
    const [classId, setClassId] = useState(classes[0]?.id || "");
    const [slots, setSlots] = useState([
        {
            day: "Monday",
            start: "09:00",
            end: "10:00",
            subject: "Science",
            teacher: teachers[0]?.name || "",
        },
    ]);

    // Add new empty slot
    const addSlot = () => {
        setSlots((prev) => [
            ...prev,
            {
                day: "Monday",
                start: "",
                end: "",
                subject: "",
                teacher: teachers[0]?.name || "",
            },
        ]);
    };

    // Update any field
    const updateSlot = (index, field, value) => {
        setSlots((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    // Remove slot
    const removeSlot = (index) => {
        setSlots((prev) => prev.filter((_, i) => i !== index));
    };

    // Submit
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!classId) {
            alert("Please select a class.");
            return;
        }

        const schedule = {};
        let valid = false;

        slots.forEach((slot) => {
            if (slot.day && slot.start && slot.end && slot.subject && slot.teacher) {
                const time = `${slot.start}-${slot.end}`;
                if (!schedule[slot.day]) schedule[slot.day] = [];
                schedule[slot.day].push({
                    time,
                    subject: slot.subject,
                    teacher: slot.teacher,
                });
                valid = true;
            }
        });

        if (!valid) {
            alert("Please fill at least one complete slot.");
            return;
        }

        onCreate({
            id: uid("tt"),
            classId,
            schedule,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-orange-600 mb-4">Create Timetable</h3>

            {/* Class Dropdown */}
            <div>
                <label className="block font-medium text-gray-700 mb-1">Class</label>
                <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                    <option value="">Select Class</option>
                    {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name} {c.section}
                        </option>
                    ))}
                </select>
            </div>

            {/* Slots List */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="font-medium">Time Slots</span>
                    <button
                        type="button"
                        onClick={addSlot}
                        className="px-4 py-1.5 bg-orange-500 text-white text-sm rounded hover:bg-orange-600"
                    >
                        + Add Slot
                    </button>
                </div>

                {slots.map((slot, idx) => (
                    <div
                        key={idx}
                        className="grid grid-cols-1 md:grid-cols-6 gap-3 p-4 bg-gray-50 rounded-lg border"
                    >
                        {/* Day */}
                        <div>
                            <label className="text-xs text-gray-600">Day</label>
                            <select
                                value={slot.day}
                                onChange={(e) => updateSlot(idx, "day", e.target.value)}
                                className="w-full p-2 border rounded text-sm mt-1"
                            >
                                {DAYS.map((d) => (
                                    <option key={d} value={d}>
                                        {d}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Start Time */}
                        <div>
                            <label className="text-xs text-gray-600">Start</label>
                            <input
                                type="time"
                                value={slot.start}
                                onChange={(e) => updateSlot(idx, "start", e.target.value)}
                                className="w-full p-2 border rounded text-sm mt-1"
                            />
                        </div>

                        {/* End Time */}
                        <div>
                            <label className="text-xs text-gray-600">End</label>
                            <input
                                type="time"
                                value={slot.end}
                                onChange={(e) => updateSlot(idx, "end", e.target.value)}
                                className="w-full p-2 border rounded text-sm mt-1"
                            />
                        </div>

                        {/* Subject - Radio */}
                        <div>
                            <label className="text-xs text-gray-600">Subject</label>
                            <div className="mt-1 space-y-1">
                                {SUBJECTS.map((sub) => (
                                    <label key={sub} className="flex items-center text-xs">
                                        <input
                                            type="radio"
                                            name={`subject-${idx}`}
                                            checked={slot.subject === sub}
                                            onChange={() => updateSlot(idx, "subject", sub)}
                                            className="mr-1"
                                        />
                                        {sub}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Teacher */}
                        <div>
                            <label className="text-xs text-gray-600">Teacher</label>
                            <select
                                value={slot.teacher}
                                onChange={(e) => updateSlot(idx, "teacher", e.target.value)}
                                className="w-full p-2 border rounded text-sm mt-1"
                            >
                                <option value="">Select</option>
                                {teachers.map((t) => (
                                    <option key={t.id} value={t.name}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Remove */}
                        <div className="flex items-end">
                            <button
                                type="button"
                                onClick={() => removeSlot(idx)}
                                className="text-red-600 hover:text-red-800 text-sm"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Submit */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400"
                    disabled={!classId || slots.length === 0}
                >
                    Create Timetable
                </button>
            </div>
        </form>
    );
};