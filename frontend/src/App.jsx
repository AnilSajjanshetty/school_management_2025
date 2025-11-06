// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { HeadmasterDashboard } from "./pages/HeadmasterDashboard";
import { TeacherDashboard } from "./pages/TeacherDashboard";
import { StudentDashboard } from "./pages/StudentDashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
import { ClassTeacherDashboard } from "./pages/ClassTeacherDashboard";

const App = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <Router>
      <Routes>
        {/* Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Headmaster Dashboard */}
        <Route
          path="/headmaster"
          element={
            <ProtectedRoute allowedRoles={["headmaster"]}>
              <HeadmasterDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Class Teacher Dashboard */}
        <Route
          path="/class-teacher"
          element={
            <ProtectedRoute allowedRoles={["class_teacher"]}>
              <ClassTeacherDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Teacher Dashboard */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Student Dashboard */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
