// src/pages/ClassTeacherDashboard.jsx
import React, { useState, useMemo, useEffect } from "react";
import { Modal } from "../components/Modal";
import { AddProgressForm } from "../components/Forms/AddProgressForm";
import { AnnouncementForm } from "../components/Forms/AnnouncementForm";
import { EventForm } from "../components/Forms/EventForm";
import { ExamForm } from "../components/Forms/ExamForm";
import { renderTimetableTable } from "../components/TimetableTable";
import {
    BookOpen, Clock, TrendingUp, Users, ChevronDown, ChevronUp,
    UserCheck, Calendar, Award, BarChart3, Megaphone, FileText, Menu, X
} from "lucide-react";
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell
} from "recharts";
import axiosInstance from "../config/axiosInstance";

export const ClassTeacherDashboard = ({ user, onLogout }) => {

    // =============================
    // 🎯 1️⃣ Separate States
    // =============================
    const [students, setStudents] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [timetables, setTimetables] = useState([]);
    const [exams, setExams] = useState([]);
    const [progress, setProgress] = useState([]);
    const [classes, setClasses] = useState([]);
    const [events, setEvents] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [examResults, setExamResults] = useState([]);
    const [examSubjects, setExamSubjects] = useState([]);

    // ⚙️ Status States
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // =============================
    // 🌐 2️⃣ Fetch All Data (Axios)
    // =============================
    const fetchAllData = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token"); // ✅ assuming token is stored here
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            // Use Promise.all for parallel requests
            const [
                studentsRes,
                announcementsRes,
                timetablesRes,
                examsRes,
                progressRes,
                classesRes,
                eventsRes,
                attendanceRes,
                examResultsRes,
                examSubjectsRes,
            ] = await Promise.all([
                axiosInstance.get("/api/students", config),
                axiosInstance.get("/api/announcements", config),
                axiosInstance.get("/api/timetables", config),
                axiosInstance.get("/api/exams", config),
                axiosInstance.get("/api/progress", config),
                axiosInstance.get("/api/classes", config),
                axiosInstance.get("/api/events", config),
                axiosInstance.get("/api/attendance", config),
                axiosInstance.get("/api/exam-results", config),
                axiosInstance.get("/api/exam-subjects", config),
            ]);

            // ✅ Update each useState with fetched data
            setStudents(studentsRes.data || []);
            setAnnouncements(announcementsRes.data || []);
            setTimetables(timetablesRes.data || []);
            setExams(examsRes.data || []);
            setProgress(progressRes.data || []);
            setClasses(classesRes.data || []);
            setEvents(eventsRes.data || []);
            setAttendance(attendanceRes.data || []);
            setExamResults(examResultsRes.data || []);
            setExamSubjects(examSubjectsRes.data || []);
        } catch (err) {
            console.error("❌ Error fetching dashboard data:", err);
            setError(err.response?.data?.message || "Failed to load dashboard data.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on mount
    useEffect(() => {
        fetchAllData();
    }, []);

    // =============================
    // 🧩 3️⃣ CRUD Handlers (with try/catch)
    // =============================

    const handleAddAnnouncement = async (data) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axiosInstance.post("/api/announcements", data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAnnouncements((prev) => [res.data, ...prev]);
        } catch (err) {
            console.error("Error adding announcement:", err);
            alert("Failed to add announcement.");
        }
    };

    const handleAddEvent = async (data) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axiosInstance.post("/api/events", data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEvents((prev) => [res.data, ...prev]);
        } catch (err) {
            console.error("Error adding event:", err);
            alert("Failed to add event.");
        }
    };

    const handleAddContactMessage = async (data) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axiosInstance.post("/api/contact", data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Message sent:", res.data);
        } catch (err) {
            console.error("Error sending contact message:", err);
            alert("Failed to send contact message.");
        }
    };

    const handleAddProgress = async (data) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axiosInstance.post("/api/progress", data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProgress((prev) => [res.data, ...prev]);
        } catch (err) {
            console.error("Error adding progress:", err);
            alert("Failed to add progress.");
        }
    };

    const handleDeleteAnnouncement = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axiosInstance.delete(`/api/announcements/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAnnouncements((prev) => prev.filter((a) => a._id !== id));
        } catch (err) {
            console.error("Error deleting announcement:", err);
            alert("Failed to delete announcement.");
        }
    };

    const handleEditEvent = async (id, updatedData) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axiosInstance.put(`/api/events/${id}`, updatedData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEvents((prev) =>
                prev.map((ev) => (ev._id === id ? res.data : ev))
            );
        } catch (err) {
            console.error("Error updating event:", err);
            alert("Failed to update event.");
        }
    };


    // State
    const [activeTab, setActiveTab] = useState("overview");
    const [expandedClass, setExpandedClass] = useState(null);
    const [showProgress, setShowProgress] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showAnnForm, setShowAnnForm] = useState(false);
    const [showEventForm, setShowEventForm] = useState(false);
    const [showExamForm, setShowExamForm] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Independent selectors
    const [attendanceClassId, setAttendanceClassId] = useState(user?.assignedClassId);
    const [timeFilter, setTimeFilter] = useState("daily");
    const [examClassId, setExamClassId] = useState(user?.assignedClassId);
    const [selectedExamId, setSelectedExamId] = useState("");

    // Derived
    const myClass = classes.find(c => c.id === user?.assignedClassId);
    const myClassStudents = myClass ? students.filter(s => s.classId === myClass.id) : [];

    const getTeachingClasses = () => {
        const teaching = new Set();
        timetables.forEach(tt => {
            const classInfo = classes.find(c => c.id === tt.classId);
            if (!classInfo) return;
            Object.values(tt.schedule || {}).forEach(slots => {
                slots.forEach(slot => {
                    if (user.subjects?.includes(slot.subject) || slot.teacher === user.name) {
                        teaching.add(classInfo.id);
                    }
                });
            });
        });
        return classes.filter(c => teaching.has(c.id));
    };
    const teachingClasses = getTeachingClasses();

    const getClassStudents = (classId) => students.filter(s => s.classId === classId);
    const getStudentProgress = (studentId) => progress.filter(p => p.studentId === studentId);

    const classId = user?.assignedClassId;
    const myClassAnnouncements = announcements
        .filter(a => a.visibility === `class:${classId}`)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    const myClassEvents = events
        .filter(e => e.classId === classId)
        .sort((a, b) => new Date(a.date) - new Date(a.date));
    const upcomingAnnouncements = myClassAnnouncements.slice(0, 3);
    const upcomingEvents = myClassEvents.slice(0, 3);

    const closeSidebar = () => setIsSidebarOpen(false);

    // Attendance Data
    const attendanceData = useMemo(() => {
        const filtered = attendance.filter(a => a.classId === attendanceClassId);
        if (!filtered.length) return [];

        const formatDate = (dateStr) => {
            const d = new Date(dateStr);
            if (timeFilter === "daily") return d.toLocaleDateString();
            if (timeFilter === "monthly") return d.toLocaleString('default', { month: 'short', year: 'numeric' });
            if (timeFilter === "yearly") return d.getFullYear().toString();
            return d.toLocaleDateString();
        };

        const grouped = filtered.reduce((acc, cur) => {
            const key = formatDate(cur.date);
            if (!acc[key]) acc[key] = { date: key, present: 0, total: 0 };
            acc[key].present += cur.present;
            acc[key].total += cur.total;
            return acc;
        }, {});

        return Object.values(grouped)
            .map(g => ({
                date: g.date,
                percentage: Math.round((g.present / g.total) * 100)
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [attendance, attendanceClassId, timeFilter]);

    // Exam Marks Data
    const examMarksData = useMemo(() => {
        if (!selectedExamId) return [];

        const subjects = examSubjects.filter(es => es.examId === selectedExamId);
        const results = examResults.filter(r => r.examId === selectedExamId);
        const map = {};

        subjects.forEach(sub => {
            const subRes = results.filter(r => r.subject === sub.subject);
            if (subRes.length === 0) return;
            const total = subRes.reduce((s, r) => s + r.marks, 0);
            const avg = Math.round(total / subRes.length);
            map[sub.subject] = avg;
        });

        return Object.entries(map)
            .map(([subject, avg]) => ({ subject, avg }))
            .sort((a, b) => a.avg - b.avg);
    }, [selectedExamId, examSubjects, examResults]);

    // Render Teacher Timetable
    const renderTeacherTimetable = () => {
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
        const schedule = { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [] };

        timetables.forEach(tt => {
            const classInfo = classes.find(c => c.id === tt.classId);
            if (!classInfo) return;
            Object.entries(tt.schedule || {}).forEach(([day, slots]) => {
                slots.forEach(slot => {
                    if (user.subjects?.includes(slot.subject) || slot.teacher === user.name) {
                        schedule[day].push({
                            ...slot,
                            className: `${classInfo.name} ${classInfo.section || ""}`.trim(),
                        });
                    }
                });
            });
        });

        Object.keys(schedule).forEach(d => schedule[d].sort((a, b) => a.time.localeCompare(b.time)));
        const times = Array.from(new Set(days.flatMap(d => schedule[d].map(s => s.time)))).sort();

        return times.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse min-w-[600px]">
                    <thead>
                        <tr>
                            <th className="border p-2 bg-purple-100 text-sm lg:text-base">Time</th>
                            {days.map(d => <th key={d} className="border p-2 bg-purple-100 text-sm lg:text-base">{d}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {times.map(t => (
                            <tr key={t}>
                                <td className="border p-2 font-medium bg-gray-50 text-xs lg:text-sm">{t}</td>
                                {days.map(d => {
                                    const slot = schedule[d].find(s => s.time === t);
                                    return (
                                        <td key={d} className="border p-2 align-top h-16 lg:h-20">
                                            {slot ? (
                                                <div className="bg-purple-50 p-1 lg:p-2 rounded hover:bg-purple-100">
                                                    <div className="font-semibold text-purple-900 text-xs lg:text-sm">{slot.subject}</div>
                                                    <div className="text-xs text-purple-700">{slot.className}</div>
                                                </div>
                                            ) : (
                                                <div className="text-xs lg:text-sm text-gray-400 text-center">—</div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <p className="text-gray-500 italic text-center py-8 text-sm lg:text-base">No teaching schedule found.</p>
        );
    };

    const renderMyClassTimetable = () => {
        const tt = timetables.find(t => t.classId === user.assignedClassId);
        if (!tt?.schedule) return <p className="text-gray-500 italic text-center py-8 text-sm lg:text-base">No class timetable available.</p>;
        return renderTimetableTable(tt.schedule);
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar - Fixed */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50
                w-72 bg-purple-800 text-white
                transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                flex flex-col
            `}>
                {/* Header - Fixed */}
                <div className="p-4 lg:p-6 border-b border-purple-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-600 rounded-full w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center text-base lg:text-xl font-bold">
                                {user?.avatar || "CT"}
                            </div>
                            <div>
                                <p className="font-bold text-sm lg:text-base">{user?.name}</p>
                                <p className="text-xs lg:text-sm text-purple-200">Class Teacher</p>
                            </div>
                        </div>
                        <button
                            onClick={closeSidebar}
                            className="lg:hidden text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="bg-purple-700 p-3 rounded">
                        <p className="text-xs text-purple-200">My Class</p>
                        <p className="font-semibold text-sm lg:text-base">{myClass?.name} {myClass?.section}</p>
                        <p className="text-xs mt-2 text-purple-200">Teaching {teachingClasses.length} classes</p>
                    </div>
                </div>

                {/* Navigation - Scrollable */}
                <nav className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-2">
                    {[
                        { tab: "overview", icon: TrendingUp, label: "Overview" },
                        { tab: "myclass", icon: UserCheck, label: "My Class" },
                        { tab: "teaching", icon: BookOpen, label: "Classes I Teach" },
                        { tab: "timetables", icon: Clock, label: "Timetables" },
                        { tab: "announcements", icon: Megaphone, label: "Announcements" },
                        { tab: "events", icon: Calendar, label: "Events" },
                        { tab: "exams", icon: FileText, label: "Exams" },
                    ].map(({ tab, icon: Icon, label }) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab);
                                closeSidebar();
                            }}
                            className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 transition text-sm lg:text-base ${activeTab === tab ? "bg-purple-700" : "hover:bg-purple-700"
                                }`}
                        >
                            <Icon className="w-4 h-4" /> {label}
                        </button>
                    ))}
                </nav>

                {/* Logout - Fixed at bottom */}
                <div className="p-4 lg:p-6 border-t border-purple-700">
                    <button
                        onClick={onLogout}
                        className="w-full px-3 py-2 bg-red-600 rounded hover:bg-red-700 text-sm lg:text-base"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header */}
                <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="text-gray-700"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="font-bold text-lg text-gray-800">Class Teacher</h1>
                    <div className="w-6" />
                </div>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    {/* OVERVIEW */}
                    {activeTab === "overview" && (
                        <div>
                            <h2 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6">Analytics Dashboard</h2>

                            {/* ATTENDANCE GRAPH */}
                            <div className="bg-white p-4 lg:p-6 rounded-lg shadow-lg mb-6 lg:mb-8">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                                    <h3 className="font-bold text-base lg:text-lg">Attendance Trend</h3>
                                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                        <select
                                            value={attendanceClassId}
                                            onChange={e => setAttendanceClassId(e.target.value)}
                                            className="p-2 border rounded text-xs lg:text-sm w-full sm:w-auto"
                                        >
                                            {teachingClasses.map(cls => (
                                                <option key={cls.id} value={cls.id}>{cls.name} {cls.section}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={timeFilter}
                                            onChange={e => setTimeFilter(e.target.value)}
                                            className="p-2 border rounded text-xs lg:text-sm w-full sm:w-auto"
                                        >
                                            <option value="daily">Daily</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="yearly">Yearly</option>
                                        </select>
                                    </div>
                                </div>

                                {attendanceData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={250}>
                                        <LineChart data={attendanceData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                                            <Tooltip formatter={v => `${v}%`} />
                                            <Line type="monotone" dataKey="percentage" stroke="#8b5cf6" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p className="text-gray-500 text-center py-8 text-sm">No attendance data for selected class.</p>
                                )}
                            </div>

                            {/* EXAM MARKS GRAPH */}
                            <div className="bg-white p-4 lg:p-6 rounded-lg shadow-lg mb-6 lg:mb-8">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                                    <h3 className="font-bold text-base lg:text-lg">Subject-wise Average Marks</h3>
                                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                        <select
                                            value={examClassId}
                                            onChange={e => {
                                                setExamClassId(e.target.value);
                                                setSelectedExamId("");
                                            }}
                                            className="p-2 border rounded text-xs lg:text-sm w-full sm:w-auto"
                                        >
                                            {teachingClasses.map(cls => (
                                                <option key={cls.id} value={cls.id}>{cls.name} {cls.section}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={selectedExamId}
                                            onChange={e => setSelectedExamId(e.target.value)}
                                            className="p-2 border rounded text-xs lg:text-sm w-full sm:w-auto"
                                        >
                                            <option value="">Select Exam</option>
                                            {exams
                                                .filter(e => e.classId === examClassId)
                                                .map(ex => {
                                                    const subCount = examSubjects.filter(es => es.examId === ex.id).length;
                                                    return (
                                                        <option key={ex.id} value={ex.id}>
                                                            {ex.title} ({subCount}s)
                                                        </option>
                                                    );
                                                })}
                                        </select>
                                    </div>
                                </div>

                                {selectedExamId && examMarksData.length > 0 ? (
                                    <>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <BarChart data={examMarksData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
                                                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                                                <Tooltip formatter={v => `${v}%`} />
                                                <Bar dataKey="avg" fill="#10b981">
                                                    {examMarksData.map((entry, i) => (
                                                        <Cell key={`cell-${i}`} fill={entry.avg < 70 ? "#ef4444" : "#10b981"} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                        {examMarksData.some(m => m.avg < 70) && (
                                            <p className="text-xs lg:text-sm text-red-600 mt-3 font-medium text-center">
                                                Low performance in: {examMarksData.filter(m => m.avg < 70).map(m => m.subject).join(", ")}
                                            </p>
                                        )}
                                    </>
                                ) : selectedExamId ? (
                                    <p className="text-gray-500 py-8 text-center text-sm">No results yet for this exam.</p>
                                ) : (
                                    <p className="text-gray-500 py-8 text-center text-sm">Select a class and exam to view marks.</p>
                                )}
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
                                {[
                                    { label: "Avg Attendance", value: myClassStudents.length ? Math.round(myClassStudents.reduce((a, b) => a + b.attendance, 0) / myClassStudents.length) : 0, unit: "%", color: "from-purple-500 to-purple-600", icon: BarChart3 },
                                    { label: "Avg Score", value: myClassStudents.length ? Math.round(myClassStudents.reduce((a, b) => a + b.avgScore, 0) / myClassStudents.length) : 0, unit: "%", color: "from-blue-500 to-blue-600", icon: Award },
                                    { label: "Total Progress", value: myClassStudents.reduce((s, st) => s + getStudentProgress(st.id).length, 0), unit: "", color: "from-green-500 to-green-600", icon: TrendingUp },
                                    { label: "My Students", value: myClassStudents.length, unit: "", color: "from-orange-500 to-orange-600", icon: Users },
                                ].map((c, i) => (
                                    <div key={i} className={`bg-gradient-to-br ${c.color} text-white p-4 lg:p-5 rounded-lg shadow-lg`}>
                                        <c.icon className="w-6 h-6 lg:w-8 lg:h-8 mb-2" />
                                        <p className="text-xs lg:text-sm opacity-90">{c.label}</p>
                                        <p className="text-2xl lg:text-3xl font-bold">{c.value}{c.unit}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Announcements & Events */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                                <div className="bg-white p-4 lg:p-5 rounded-lg shadow">
                                    <h3 className="font-bold text-base lg:text-lg mb-3">Upcoming Announcements</h3>
                                    <div className="space-y-2">
                                        {upcomingAnnouncements.length > 0 ? upcomingAnnouncements.map(a => (
                                            <div key={a.id} className="border-l-4 border-yellow-500 pl-3">
                                                <p className="font-semibold text-xs lg:text-sm">{a.title}</p>
                                                <p className="text-xs text-gray-500">{a.date}</p>
                                            </div>
                                        )) : <p className="text-gray-500 text-xs lg:text-sm">No announcements</p>}
                                    </div>
                                </div>
                                <div className="bg-white p-4 lg:p-5 rounded-lg shadow">
                                    <h3 className="font-bold text-base lg:text-lg mb-3">Upcoming Events</h3>
                                    <div className="space-y-2">
                                        {upcomingEvents.length > 0 ? upcomingEvents.map(e => (
                                            <div key={e.id} className="border-l-4 border-green-500 pl-3">
                                                <p className="font-semibold text-xs lg:text-sm">{e.title}</p>
                                                <p className="text-xs text-gray-500">{e.date}</p>
                                            </div>
                                        )) : <p className="text-gray-500 text-xs lg:text-sm">No events</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* MY CLASS */}
                    {activeTab === "myclass" && myClass && (
                        <div>
                            <h2 className="text-xl lg:text-2xl font-bold mb-4">My Class: {myClass.name} {myClass.section}</h2>
                            <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {myClassStudents.map(s => (
                                        <div key={s.id} className="border rounded-lg p-4 hover:border-purple-500 transition">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <p className="font-bold text-sm lg:text-base">{s.name}</p>
                                                    <p className="text-xs lg:text-sm text-gray-500">Roll: {s.roll}</p>
                                                </div>
                                                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-bold">
                                                    {s.avgScore}%
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => { setSelectedStudent(s); setShowProgress(true); }}
                                                className="w-full bg-purple-600 text-white py-2 rounded text-xs lg:text-sm hover:bg-purple-700"
                                            >
                                                Add Progress
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TEACHING CLASSES */}
                    {activeTab === "teaching" && (
                        <div>
                            <h2 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6">Classes I Teach</h2>
                            <div className="space-y-4 lg:space-y-6">
                                {teachingClasses.map(cls => {
                                    const isExpanded = expandedClass === cls.id;
                                    const clsStudents = getClassStudents(cls.id);
                                    return (
                                        <div key={cls.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-4 cursor-pointer hover:from-indigo-700 hover:to-indigo-800 flex justify-between items-center"
                                                onClick={() => setExpandedClass(isExpanded ? null : cls.id)}
                                            >
                                                <div>
                                                    <h3 className="text-lg lg:text-xl font-bold">{cls.name} {cls.section}</h3>
                                                    <p className="text-xs lg:text-sm opacity-90">{clsStudents.length} students</p>
                                                </div>
                                                {isExpanded ? <ChevronUp className="w-5 h-5 lg:w-6 lg:h-6" /> : <ChevronDown className="w-5 h-5 lg:w-6 lg:h-6" />}
                                            </div>
                                            {isExpanded && (
                                                <div className="p-4 lg:p-6">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {clsStudents.map(s => (
                                                            <div key={s.id} className="border rounded-lg p-4 hover:border-indigo-500 transition">
                                                                <div className="flex justify-between mb-2">
                                                                    <p className="font-bold text-sm lg:text-base">{s.name}</p>
                                                                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">Roll {s.roll}</span>
                                                                </div>
                                                                <button
                                                                    onClick={() => { setSelectedStudent(s); setShowProgress(true); }}
                                                                    className="w-full bg-indigo-600 text-white py-2 rounded text-xs lg:text-sm hover:bg-indigo-700"
                                                                >
                                                                    Add Progress
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* TIMETABLES */}
                    {activeTab === "timetables" && (
                        <div>
                            <h2 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6">Timetables</h2>
                            <div className="space-y-6 lg:space-y-10">
                                <div className="bg-white p-4 lg:p-6 rounded-lg shadow-lg">
                                    <h3 className="text-lg lg:text-xl font-bold mb-4 text-purple-700">My Teaching Schedule</h3>
                                    {renderTeacherTimetable()}
                                </div>
                                {myClass && (
                                    <div className="bg-white p-4 lg:p-6 rounded-lg shadow-lg">
                                        <h3 className="text-lg lg:text-xl font-bold mb-4 text-green-700">
                                            My Class Timetable: {myClass.name} {myClass.section}
                                        </h3>
                                        {renderMyClassTimetable()}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ANNOUNCEMENTS */}
                    {activeTab === "announcements" && (
                        <div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 lg:mb-6">
                                <h2 className="text-xl lg:text-2xl font-bold">Announcements</h2>
                                <button
                                    onClick={() => setShowAnnForm(true)}
                                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm lg:text-base"
                                >
                                    Add Announcement
                                </button>
                            </div>
                            <div className="space-y-4">
                                {myClassAnnouncements.length > 0 ? myClassAnnouncements.map(a => (
                                    <div key={a.id} className="bg-white p-4 lg:p-5 rounded-lg shadow border-l-4 border-yellow-500">
                                        <h4 className="font-bold text-base lg:text-lg">{a.title}</h4>
                                        <p className="text-xs lg:text-sm text-gray-500">{a.date}</p>
                                        <p className="mt-2 text-sm lg:text-base text-gray-700">{a.content}</p>
                                    </div>
                                )) : <p className="text-center text-gray-500 py-8 text-sm lg:text-base">No announcements yet</p>}
                            </div>
                        </div>
                    )}

                    {/* EVENTS */}
                    {activeTab === "events" && (
                        <div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 lg:mb-6">
                                <h2 className="text-xl lg:text-2xl font-bold">Events</h2>
                                <button
                                    onClick={() => setShowEventForm(true)}
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm lg:text-base"
                                >
                                    Add Event
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {myClassEvents.length > 0 ? myClassEvents.map(e => (
                                    <div key={e.id} className="bg-white p-4 lg:p-5 rounded-lg shadow border-l-4 border-green-500">
                                        <h4 className="font-bold text-base lg:text-lg">{e.title}</h4>
                                        <p className="text-xs lg:text-sm text-gray-500">{e.date}</p>
                                        <p className="mt-2 text-sm lg:text-base text-gray-700">{e.content}</p>
                                    </div>
                                )) : <p className="text-center text-gray-500 py-8 col-span-2 text-sm lg:text-base">No events yet</p>}
                            </div>
                        </div>
                    )}

                    {/* EXAMS */}
                    {activeTab === "exams" && (
                        <div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 lg:mb-6">
                                <h2 className="text-xl lg:text-2xl font-bold">Exams</h2>
                                <button
                                    onClick={() => setShowExamForm(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm lg:text-base"
                                >
                                    Schedule Exam
                                </button>
                            </div>
                            <div className="space-y-4">
                                {exams
                                    .filter(e => teachingClasses.some(c => c.id === e.classId))
                                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                                    .map(ex => {
                                        const cls = classes.find(c => c.id === ex.classId);
                                        const subCount = examSubjects.filter(es => es.examId === ex.id).length;
                                        return (
                                            <div key={ex.id} className="bg-white p-4 lg:p-5 rounded-lg shadow border-l-4 border-blue-500">
                                                <h4 className="font-bold text-base lg:text-lg">{ex.title}</h4>
                                                <p className="text-xs lg:text-sm text-gray-600">
                                                    {cls?.name} {cls?.section} • {subCount} subject{subCount !== 1 ? "s" : ""} • {ex.date}
                                                </p>
                                            </div>
                                        );
                                    })}
                                {exams.filter(e => teachingClasses.some(c => c.id === e.classId)).length === 0 && (
                                    <p className="text-center text-gray-500 py-8 text-sm lg:text-base">No exams scheduled</p>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* MODALS */}
            <Modal open={showProgress} title={`Add Progress - ${selectedStudent?.name}`} onClose={() => setShowProgress(false)}>
                <AddProgressForm
                    student={selectedStudent}
                    onAdd={(progressData) => {
                        handleAddProgress({ ...progressData, studentId: selectedStudent.id });
                        setShowProgress(false);
                    }}
                    onClose={() => setShowProgress(false)}
                    exams={exams}
                />
            </Modal>

            <Modal open={showAnnForm} title="Create Announcement" onClose={() => setShowAnnForm(false)}>
                <AnnouncementForm
                    onCreate={(a) => {
                        handleAddAnnouncement({ ...a, visibility: `class:${classId}` });
                        setShowAnnForm(false);
                    }}
                    onClose={() => setShowAnnForm(false)}
                />
            </Modal>

            <Modal open={showEventForm} title="Create Event" onClose={() => setShowEventForm(false)}>
                <EventForm
                    onCreate={(e) => {
                        handleAddEvent({ ...e, classId });
                        setShowEventForm(false);
                    }}
                    onClose={() => setShowEventForm(false)}
                />
            </Modal>

            <Modal open={showExamForm} title="Schedule Exam" onClose={() => setShowExamForm(false)}>
                <ExamForm
                    onCreate={(exam) => {
                        handleAddExam({ ...exam, classId });
                        setShowExamForm(false);
                    }}
                    onClose={() => setShowExamForm(false)}
                    classes={classes}
                    user={user}
                />
            </Modal>
        </div>
    );
};