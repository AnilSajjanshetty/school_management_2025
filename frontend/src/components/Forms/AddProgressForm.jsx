import React, { useState } from "react";
import { uid } from "../../utils/mockData";

export const AddProgressForm = ({ student, onAdd, onClose, exams = [] }) => {
    const [subject, setSubject] = useState('');
    const [marks, setMarks] = useState('');
    const [remarks, setRemarks] = useState('');
    const [examId, setExamId] = useState(exams[0]?.id || '');

    const submit = (e) => {
        e.preventDefault();
        if (!student || subject.trim() === '' || marks === '') return;
        onAdd({ id: uid('pr'), studentId: student.id, subject: subject.trim(), marks: Number(marks), remarks: remarks.trim(), examId: examId || '' });
        onClose();
    };

    return (
        <form onSubmit={submit} className="space-y-3">
            <div>
                <div className="text-sm font-semibold mb-1">Student</div>
                <div className="p-2 bg-gray-100 rounded">{student?.name || '—'}</div>
            </div>
            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" className="w-full p-2 border rounded" />
            <input value={marks} onChange={e => setMarks(e.target.value)} placeholder="Marks" type="number" min="0" max="100" className="w-full p-2 border rounded" />
            <select value={examId} onChange={e => setExamId(e.target.value)} className="w-full p-2 border rounded">
                <option value="">Select exam (optional)</option>
                {exams.map(ex => <option key={ex.id} value={ex.id}>{ex.title} — {ex.date}</option>)}
            </select>
            <textarea value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Remarks" className="w-full p-2 border rounded" />
            <div className="flex justify-end gap-2">
                <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Add</button>
            </div>
        </form>
    );
};