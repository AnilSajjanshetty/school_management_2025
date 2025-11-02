import React, { useState, useMemo } from "react";
import { mockData, uid } from "./utils/mockData";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { HeadmasterDashboard } from "./pages/HeadmasterDashboard";
import { ClassTeacherDashboard } from "./pages/ClassTeacherDashboard";
import { TeacherDashboard } from "./pages/TeacherDashboard";
import { StudentDashboard } from "./pages/StudentDashboard";

const App = () => {
  const [user, setUser] = useState(null);
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
    addStudentToClass: ({ studentId, classId }) => setData(d => ({ ...d, students: d.students.map(s => s.id === studentId ? { ...s, classId } : s) })),
    removeStudent: (id) => setData(d => ({ ...d, students: d.students.filter(s => s.id !== id) })),
    addProgress: (p) => setData(d => ({ ...d, progress: [...d.progress, p] })),
  };

  const handleLogin = (u) => setUser(u);
  const handleLogout = () => setUser(null);

  if (!user) return <LandingPage onEnter={() => setUser({ role: 'demo' })} data={data} />;

  if (user.role === 'headmaster') return <HeadmasterDashboard user={user} data={data} handlers={handlers} onLogout={handleLogout} />;
  if (user.role === 'class_teacher') return <ClassTeacherDashboard user={user} data={data} handlers={handlers} onLogout={handleLogout} />;
  if (user.role === 'teacher') return <TeacherDashboard user={user} data={data} handlers={handlers} onLogout={handleLogout} />;
  if (user.role === 'student') return <StudentDashboard user={user} data={data} handlers={handlers} onLogout={handleLogout} />;
  // if (user.role === 'student') return <LoginPage onLogin={handleLogin} />;

  return <LoginPage onLogin={handleLogin} />;
};

export default App;