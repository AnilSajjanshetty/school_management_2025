// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { mockData, uid } from "./utils/mockData";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { HeadmasterDashboard } from "./pages/HeadmasterDashboard";
import { ClassTeacherDashboard } from "./pages/ClassTeacherDashboard";
import { TeacherDashboard } from "./pages/TeacherDashboard";
import { StudentDashboard } from "./pages/StudentDashboard";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Login Wrapper with Redirect
const LoginWrapper = ({ onLogin }) => {
  const navigate = useNavigate();
  const handleLogin = (user) => {
    onLogin(user);
    localStorage.setItem("user", JSON.stringify(user));
    navigate(`/${user.role.replace('_', '-')}`, { replace: true });
  };
  return <LoginPage onLogin={handleLogin} />;
};

// Main App with Router
const App = () => {
  const [data, setData] = useState(mockData);

  const handlers = {
    addClass: (payload) => setData(d => ({ ...d, classes: [...d.classes, payload] })),
    removeClass: (id) => setData(d => ({ ...d, classes: d.classes.filter(c => c.id !== id) })),
    addTeacher: (t) => setData(d => ({ ...d, teachers: [...d.teachers, { id: uid('t'), name: t.name, subjects: t.subjects || [] }] })),
    removeTeacher: (id) => setData(d => ({ ...d, teachers: d.teachers.filter(t => t.id !== id) })),
    addAnnouncement: (a) => setData(d => ({ ...d, announcements: [...d.announcements, a] })),
    addEvent: (e) => setData(d => ({ ...d, events: [...d.events, e] })),
    addTestimonial: (t) => setData(d => ({ ...d, testimonials: [...d.testimonials, { id: uid('t'), ...t, public: true }] })),
    createExam: (e) => setData(d => ({ ...d, exams: [...d.exams, { id: uid('ex'), ...e }] })),
    createTimetable: (tt) => setData(d => ({ ...d, timetables: [...d.timetables, { id: uid('tt'), ...tt }] })),
    addStudentToClass: ({ studentId, classId }) => setData(d => ({
      ...d,
      students: d.students.map(s => s.id === studentId ? { ...s, classId } : s)
    })),
    removeStudent: (id) => setData(d => ({ ...d, students: d.students.filter(s => s.id !== id) })),
    addProgress: (p) => setData(d => ({ ...d, progress: [...d.progress, p] })),
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/"; // Force redirect to landing
  };

  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route
          path="/"
          element={
            <LandingPage
              onEnter={() => {
                // Optional: auto-login as demo
                // localStorage.setItem("user", JSON.stringify({ role: "student", name: "Demo Student" }));
                // window.location.href = "/student";
              }}
              data={data}
            />
          }
        />

        {/* Login Page */}
        <Route
          path="/login"
          element={<LoginWrapper onLogin={(u) => { }} />}
        />

        {/* Protected Dashboards */}
        <Route
          path="/headmaster"
          element={
            <ProtectedRoute allowedRoles={["headmaster"]}>
              <HeadmasterDashboard
                user={JSON.parse(localStorage.getItem("user"))}
                data={data}
                handlers={handlers}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/class-teacher"
          element={
            <ProtectedRoute allowedRoles={["class_teacher"]}>
              <ClassTeacherDashboard
                user={JSON.parse(localStorage.getItem("user"))}
                data={data}
                handlers={handlers}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherDashboard
                user={JSON.parse(localStorage.getItem("user"))}
                data={data}
                handlers={handlers}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard
                user={JSON.parse(localStorage.getItem("user"))}
                data={data}
                handlers={handlers}
                onLogout={handleLogout}
              />
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