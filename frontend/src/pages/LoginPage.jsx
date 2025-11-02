import React from "react";

export const LoginPage = ({ onLogin }) => {
    const quickLogin = (role) => {
        const users = {
            headmaster: { id: 'u-hm', name: 'Dr. Headmaster', email: 'hm@school', role: 'headmaster', avatar: 'HM' },
            class_teacher: { id: 'u-ct', name: 'Class Teacher', email: 'ct@school', role: 'class_teacher', avatar: 'CT', assignedClassId: 'class-1A', subjects: ['Science', 'Math'] },
            teacher: { id: 'u-t', name: 'Subject Teacher', email: 't@school', role: 'teacher', avatar: 'T', subjects: ['Math'] },
            student: { id: 'u-s', name: 'Student Demo', email: 's@school', role: 'student', avatar: 'S', studentId: 's-001', classId: 'class-1A' }
        };
        onLogin(users[role]);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Quick Demo Login</h2>
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => quickLogin('headmaster')} className="p-3 bg-indigo-600 text-white rounded">Headmaster</button>
                    <button onClick={() => quickLogin('class_teacher')} className="p-3 bg-purple-600 text-white rounded">Class Teacher</button>
                    <button onClick={() => quickLogin('teacher')} className="p-3 bg-green-600 text-white rounded">Teacher</button>
                    <button onClick={() => quickLogin('student')} className="p-3 bg-pink-600 text-white rounded">Student</button>
                </div>
            </div>
        </div>
    );
};