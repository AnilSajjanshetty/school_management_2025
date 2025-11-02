// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoginPage = ({ onLogin }) => {
    const [role, setRole] = useState("student");
    const navigate = useNavigate();

    const mockUsers = {
        headmaster: { role: "headmaster", name: "Headmaster Raj" },
        class_teacher: { role: "class_teacher", name: "Ms. Anita" },
        teacher: { role: "teacher", name: "Mr. Kumar" },
        student: { role: "student", name: "Priya Sharma" },
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = mockUsers[role];
        onLogin(user);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 to-pink-50 flex items-center justify-center p-4">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md">
                <h2 className="text-3xl font-black text-center mb-8 bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                    Login to Dashboard
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-violet-300 focus:border-violet-500 text-lg"
                    >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="class_teacher">Class Teacher</option>
                        <option value="headmaster">Headmaster</option>
                    </select>
                    <button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-violet-600 to-pink-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition-transform"
                    >
                        Login as {role.replace("_", " ")}
                    </button>
                </form>
                <p className="text-center mt-6 text-gray-600">
                    <button
                        onClick={() => navigate("/")}
                        className="text-violet-600 font-bold hover:underline"
                    >
                        Back to Home
                    </button>
                </p>
            </div>
        </div>
    );
};