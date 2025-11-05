import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/axiosInstance";

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { data } = await axiosInstance.post("/login", { email, password });
            const { accessToken, refreshToken, role, _id } = data

            // Save user + tokens to localStorage
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("role", role);
            localStorage.setItem("userId", _id);

            // Navigate based on user role
            switch (data.role) {
                case "headmaster":
                    navigate("/headmaster");
                    break;
                case "teacher":
                    navigate("/teacher");
                    break;
                case "class_teacher":
                    navigate("/class-teacher");
                    break;
                case "student":
                    navigate("/student");
                    break;
                default:
                    navigate("/");
            }
        } catch (err) {
            console.error(err);
            setError("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 to-pink-50 flex items-center justify-center p-4">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md">
                <h2 className="text-3xl font-black text-center mb-8 bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                    Login to Dashboard
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-violet-300 focus:border-violet-500 text-lg"
                    />

                    {/* Password Field */}
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-pink-300 focus:border-pink-500 text-lg"
                    />

                    {/* Error Message */}
                    {error && (
                        <p className="text-red-500 text-center font-semibold">{error}</p>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-violet-600 to-pink-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition-transform disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
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
