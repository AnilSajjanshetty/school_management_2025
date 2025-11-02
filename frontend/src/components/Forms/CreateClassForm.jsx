import React, { useState } from "react";

export const CreateClassForm = ({ onCreate, onClose }) => {
    const [name, setName] = useState('');
    const [section, setSection] = useState('A');
    const [teacherName, setTeacherName] = useState('');

    const submit = (e) => {
        e.preventDefault();
        if (!name) return;
        onCreate({ id: `class_${Math.random().toString(36).slice(2, 9)}`, name, section, teacherName });
    };

    return (
        <form onSubmit={submit} className="space-y-3">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Class name (e.g. Class 10)" className="w-full p-2 border rounded" />
            <input value={section} onChange={e => setSection(e.target.value)} placeholder="Section" className="w-full p-2 border rounded" />
            <input value={teacherName} onChange={e => setTeacherName(e.target.value)} placeholder="Assigned teacher (optional)" className="w-full p-2 border rounded" />
            <div className="flex justify-end gap-2">
                <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Create</button>
            </div>
        </form>
    );
};