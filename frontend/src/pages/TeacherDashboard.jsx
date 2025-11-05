// src/pages/TeacherDashboard.jsx
import React, { useState, useMemo, useEffect } from "react";
import { Modal } from "../components/Modal";
import { AnnouncementForm } from "../components/Forms/AnnouncementForm";
import { EventForm } from "../components/Forms/EventForm";
import { AddContactMessageForm } from "../components/Forms/AddContactMessageForm";
import { AddProgressForm } from "../components/Forms/AddProgressForm";
import { Menu, X } from "lucide-react";
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Legend,
    BarChart, Bar
} from "recharts";
import axiosInstance from "../config/axiosInstance"; // adjust path as needed

export const TeacherDashboard = ({ data, handlers, onLogout }) => {
    const user = { id: "t-1", name: "Anil Sir", avatar: "A", }; // Replace later with real logged-in user

    // === Separate useState Hooks ===
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [events, setEvents] = useState([]);
    const [exams, setExams] = useState([]);
    const [examResults, setExamResults] = useState([]);
    const [contactMessages, setContactMessages] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [teacherTimetables, setTeacherTimetables] = useState([]);

    // === Status States ===
    const [loading, setLoading] = useState({
        classes: false,
        students: false,
        announcements: false,
        events: false,
        exams: false,
        examResults: false,
        contact: false,
        attendance: false,
        timetable: false,
    });

    const [error, setError] = useState({
        classes: null,
        students: null,
        announcements: null,
        events: null,
        exams: null,
        examResults: null,
        contact: null,
        attendance: null,
        timetable: null,
    });
    // ====== UNIVERSAL FETCH FUNCTION ======
    const fetchData = async (endpoint, setState, key) => {
        setLoading((prev) => ({ ...prev, [key]: true }));
        setError((prev) => ({ ...prev, [key]: null }));
        try {
            const res = await axiosInstance.get(endpoint);
            setState(res.data || []);
        } catch (err) {
            console.error(`❌ Error fetching ${key}:`, err);
            setError((prev) => ({
                ...prev,
                [key]: err.response?.data?.message || err.message,
            }));
        } finally {
            setLoading((prev) => ({ ...prev, [key]: false }));
        }
    };

    // ====== FETCH DATA ON MOUNT ======
    useEffect(() => {
        fetchData("/classes", setClasses, "classes");
        fetchData("/students", setStudents, "students");
        fetchData("/announcements", setAnnouncements, "announcements");
        fetchData("/events", setEvents, "events");
        fetchData("/exams", setExams, "exams");
        fetchData("/exam-results", setExamResults, "examResults");
        fetchData("/contact-messages", setContactMessages, "contact");
        fetchData("/attendance", setAttendance, "attendance");
        fetchData(`/timetables/${user.id}`, setTeacherTimetables, "timetable");
    }, []);


    // === HANDLER FUNCTIONS ===

    // 🟢 Add Announcement
    const handleAddAnnouncement = async (announcement) => {
        try {
            const { data } = await axiosInstance.post("/announcements", announcement);
            setAnnouncements((prev) => [...prev, data]);
            console.log("✅ Announcement created:", data);
        } catch (error) {
            console.error("❌ Failed to create announcement:", error.response?.data || error.message);
        }
    };

    // 🟢 Add Event
    const handleAddEvent = async (eventData) => {
        try {
            const { data } = await axiosInstance.post("/events", eventData);
            setEvents((prev) => [...prev, data]);
            console.log("✅ Event created:", data);
        } catch (error) {
            console.error("❌ Failed to create event:", error.response?.data || error.message);
        }
    };

    // 🟢 Add Contact Message
    const handleAddContactMessage = async (messageData) => {
        try {
            const { data } = await axiosInstance.post("/contact", messageData);
            setContactMessages((prev) => [...prev, data]);
            console.log("✅ Contact message sent:", data);
        } catch (error) {
            console.error("❌ Failed to send contact message:", error.response?.data || error.message);
        }
    };

    // 🟢 Add Progress (exam result or student progress)
    const handleAddProgress = async (progressData) => {
        try {
            const { data } = await axiosInstance.post("/progress", progressData);
            setExamResults((prev) => [...prev, data]);
            console.log("✅ Progress added:", data);
        } catch (error) {
            console.error("❌ Failed to add progress:", error.response?.data || error.message);
        }
    };

    const [activeTab, setActiveTab] = useState("overview");
    const [selectedClass, setSelectedClass] = useState(null);
    const [attendanceView, setAttendanceView] = useState("monthly");
    const [selectedExam, setSelectedExam] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [showAnnForm, setShowAnnForm] = useState(false);
    const [showEventForm, setShowEventForm] = useState(false);
    const [showContactForm, setShowContactForm] = useState(false);
    const [showProgress, setShowProgress] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    // === Teacher's Assigned Classes ===
    const teacherClasses = useMemo(() => {
        return classes.filter(c => c.teacherId === user.id);
    }, [classes, user.id]);

    useEffect(() => {
        if (teacherClasses.length > 0 && !selectedClass) {
            setSelectedClass(teacherClasses[0]);
        }
    }, [teacherClasses, selectedClass]);

    const classStudents = useMemo(() => {
        if (!selectedClass) return [];
        return students.filter(s => s.classId === selectedClass.id);
    }, [students, selectedClass]);

    const classAnnouncements = useMemo(() => {
        return announcements.filter(a => {
            return !a.visibility ||
                a.visibility === "public" ||
                teacherClasses.some(c => a.visibility === `class:${c.id}`);
        });
    }, [announcements, teacherClasses]);

    const classEvents = useMemo(() => {
        return events.filter(e => teacherClasses.some(c => e.classId === c.id));
    }, [events, teacherClasses]);

    const upcomingEvents = useMemo(() => {
        const today = new Date().toISOString().split("T")[0];
        return classEvents
            .filter(e => e.date >= today)
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(0, 3);
    }, [classEvents]);

    const contactStats = useMemo(() => {
        const stats = { feedback: 0, complaint: 0, inquiry: 0 };
        contactMessages.forEach(m => stats[m.type]++);
        return stats;
    }, [contactMessages]);

    const pieData = Object.entries(contactStats)
        .filter(([, v]) => v > 0)
        .map(([k, v]) => ({
            name: k.charAt(0).toUpperCase() + k.slice(1),
            value: v,
            color: k === "complaint" ? "#ef4444" : k === "inquiry" ? "#3b82f6" : "#10b981",
        }));

    const renderTeacherTimetable = () => {
        const teacherSchedule = teacherTimetables.find(tt => tt.teacherId === user.id);
        if (!teacherSchedule) {
            return <p className="text-gray-500 italic">No schedule assigned.</p>;
        }

        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
        const schedule = {};
        days.forEach(d => schedule[d] = []);

        Object.entries(teacherSchedule.schedule).forEach(([day, slots]) => {
            slots.forEach(slot => {
                const classInfo = classes.find(c => c.id === slot.classId);
                if (classInfo) {
                    schedule[day].push({
                        ...slot,
                        className: `${classInfo.name} ${classInfo.section || ""}`.trim(),
                    });
                }
            });
        });

        days.forEach(day => schedule[day].sort((a, b) => a.time.localeCompare(b.time)));
        const times = Array.from(new Set(days.flatMap(d => schedule[d].map(s => s.time)))).sort();

        return (
            <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse min-w-[600px]">
                    <thead>
                        <tr>
                            <th className="border p-2 bg-green-100 text-sm md:text-base">Time</th>
                            {days.map(d => <th key={d} className="border p-2 bg-green-100 text-sm md:text-base">{d}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {times.map(t => (
                            <tr key={t}>
                                <td className="border p-2 font-medium bg-gray-50 text-xs md:text-sm">{t}</td>
                                {days.map(d => {
                                    const slot = schedule[d].find(s => s.time === t);
                                    return (
                                        <td key={d} className="border p-2 align-top h-16 md:h-20">
                                            {slot ? (
                                                <div className="bg-green-50 p-1 md:p-2 rounded hover:bg-green-100">
                                                    <div className="font-semibold text-green-900 text-xs md:text-sm">{slot.subject}</div>
                                                    <div className="text-xs text-green-700">{slot.className}</div>
                                                </div>
                                            ) : (
                                                <div className="text-xs md:text-sm text-gray-400 text-center">—</div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const attendanceData = useMemo(() => {
        if (!selectedClass) return [];

        const records = attendance.filter(a => a.classId === selectedClass.id);
        if (records.length === 0) return [];

        if (attendanceView === "daily") {
            return records
                .map(a => ({
                    date: a.date.split("-").slice(1).join("/"),
                    attendance: Math.round((a.present / a.total) * 100),
                }))
                .sort((a, b) => a.date.localeCompare(b.date));
        }

        const map = new Map();
        records.forEach(r => {
            const month = r.date.slice(0, 7);
            const cur = map.get(month) ?? { present: 0, total: 0 };
            cur.present += r.present;
            cur.total += r.total;
            map.set(month, cur);
        });
        return Array.from(map.entries())
            .map(([month, d]) => ({
                month: new Date(month + "-01").toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
                attendance: Math.round((d.present / d.total) * 100),
            }))
            .sort((a, b) => a.month.localeCompare(b.month));
    }, [selectedClass, attendance, attendanceView]);

    const examMarksData = useMemo(() => {
        if (!selectedClass || !selectedExam) return [];

        const studentsInClass = students.filter(s => s.classId === selectedClass.id);
        const results = examResults.filter(r =>
            r.examId === selectedExam.id &&
            studentsInClass.some(s => s.id === r.studentId)
        );

        if (results.length === 0) return [];

        const subjectMap = {};
        results.forEach(r => {
            if (!subjectMap[r.subject]) subjectMap[r.subject] = { total: 0, count: 0 };
            subjectMap[r.subject].total += r.marks;
            subjectMap[r.subject].count += 1;
        });

        return Object.entries(subjectMap).map(([subject, d]) => ({
            subject,
            average: Math.round(d.total / d.count),
        }));
    }, [selectedClass, selectedExam, examResults, students]);

    const availableExams = useMemo(() => {
        if (!selectedClass) return [];
        return exams.filter(ex => ex.classId === selectedClass.id);
    }, [selectedClass, exams]);

    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
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
                w-72 bg-green-800 text-white
                transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                flex flex-col
            `}>
                {/* Header - Fixed */}
                <div className="p-4 lg:p-6 border-b border-green-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-600 rounded-full w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center font-bold text-base lg:text-lg">
                                {user.avatar}
                            </div>
                            <div>
                                <p className="font-bold text-base lg:text-lg">{user.name}</p>
                                <p className="text-xs lg:text-sm opacity-90">Teacher</p>
                            </div>
                        </div>
                        <button
                            onClick={closeSidebar}
                            className="lg:hidden text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="bg-green-700 p-3 rounded-lg">
                        <p className="text-xs opacity-90">Assigned Classes</p>
                        <div className="space-y-1 mt-1 max-h-20 overflow-y-auto">
                            {teacherClasses.map(c => (
                                <p key={c.id} className="font-medium text-xs lg:text-sm">
                                    {c.name} {c.section}
                                </p>
                            ))}
                        </div>
                        <p className="text-xs mt-2 opacity-90">
                            Subjects: {user?.subjects?.join(", ")}
                        </p>
                    </div>
                </div>

                {/* Navigation - Scrollable */}
                <nav className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-1">
                    {[
                        { tab: "overview", label: "Overview" },
                        { tab: "classes", label: "Classes" },
                        { tab: "timetables", label: "My Schedule" },
                        { tab: "announcements", label: "Announcements" },
                        { tab: "events", label: "Events" },
                        { tab: "exams", label: "Exams" },
                        { tab: "contacts", label: "Contact Messages" },
                    ].map(({ tab, label }) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab);
                                if (tab !== "classes") {
                                    setSelectedClass(null);
                                    setSelectedExam(null);
                                }
                                closeSidebar();
                            }}
                            className={`w-full text-left px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg font-medium transition-all text-sm lg:text-base ${activeTab === tab ? "bg-green-700 shadow-md" : "hover:bg-green-700"
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </nav>

                {/* Logout - Fixed at bottom */}
                <div className="p-4 lg:p-6 border-t border-green-700">
                    <button
                        onClick={onLogout}
                        className="w-full px-3 lg:px-4 py-2 lg:py-2.5 bg-red-600 rounded-lg hover:bg-red-700 font-medium text-sm lg:text-base"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content - Scrollable */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header */}
                <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="text-gray-700"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="font-bold text-lg text-gray-800">Teacher Dashboard</h1>
                    <div className="w-6" /> {/* Spacer for centering */}
                </div>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    {!teacherClasses.length ? (
                        <div className="text-center py-20">
                            <p className="text-lg lg:text-xl text-gray-600">No classes assigned.</p>
                        </div>
                    ) : (
                        <>
                            {/* OVERVIEW */}
                            {activeTab === "overview" && (
                                <div>
                                    <h2 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8 text-gray-800">Overview</h2>

                                    {/* Summary Cards */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5 mb-6 lg:mb-8">
                                        <div className="bg-white p-4 lg:p-5 rounded-xl shadow">
                                            <p className="text-xs lg:text-sm text-gray-500">Total Students</p>
                                            <p className="text-2xl lg:text-3xl font-bold text-green-600">
                                                {students.filter(s => teacherClasses.some(c => c.id === s.classId)).length}
                                            </p>
                                        </div>
                                        <div className="bg-white p-4 lg:p-5 rounded-xl shadow">
                                            <p className="text-xs lg:text-sm text-gray-500">Avg Attendance</p>
                                            <p className="text-2xl lg:text-3xl font-bold text-blue-600">
                                                {attendance.length > 0
                                                    ? Math.round(
                                                        attendance.reduce((a, b) => a + (b.present / b.total), 0) / attendance.length * 100
                                                    )
                                                    : 0}%
                                            </p>
                                        </div>
                                        <div className="bg-white p-4 lg:p-5 rounded-xl shadow">
                                            <p className="text-xs lg:text-sm text-gray-500">Complaints</p>
                                            <p className="text-2xl lg:text-3xl font-bold text-red-600">{contactStats.complaint}</p>
                                        </div>
                                        <div className="bg-white p-4 lg:p-5 rounded-xl shadow">
                                            <p className="text-xs lg:text-sm text-gray-500">Upcoming Events</p>
                                            <p className="text-2xl lg:text-3xl font-bold text-purple-600">{upcomingEvents.length}</p>
                                        </div>
                                    </div>

                                    {/* Attendance Graph */}
                                    <div className="bg-white p-4 lg:p-6 rounded-xl shadow mb-6 lg:mb-8">
                                        <h3 className="text-lg lg:text-xl font-bold text-indigo-700 mb-4">Attendance Trend</h3>

                                        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 mb-4">
                                            <select
                                                value={selectedClass?.id || ""}
                                                onChange={(e) => setSelectedClass(teacherClasses.find(c => c.id === e.target.value) || null)}
                                                className="px-3 lg:px-4 py-2 border rounded-lg text-sm lg:text-base"
                                            >
                                                <option value="">Select Class</option>
                                                {teacherClasses.map(c => (
                                                    <option key={c.id} value={c.id}>{c.name} {c.section}</option>
                                                ))}
                                            </select>

                                            <select
                                                value={attendanceView}
                                                onChange={(e) => setAttendanceView(e.target.value)}
                                                className="px-3 lg:px-4 py-2 border rounded-lg text-sm lg:text-base"
                                                disabled={!selectedClass}
                                            >
                                                <option value="monthly">Monthly</option>
                                                <option value="daily">Daily</option>
                                            </select>
                                        </div>

                                        {selectedClass && attendanceData.length > 0 ? (
                                            <ResponsiveContainer width="100%" height={250}>
                                                <LineChart data={attendanceData}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey={attendanceView === "daily" ? "date" : "month"} tick={{ fontSize: 12 }} />
                                                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                                                    <Tooltip />
                                                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="attendance"
                                                        stroke="#10b981"
                                                        name="Attendance %"
                                                        strokeWidth={2}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        ) : selectedClass ? (
                                            <p className="text-gray-500 italic text-sm">No attendance data.</p>
                                        ) : (
                                            <p className="text-gray-500 italic text-sm">Please select a class.</p>
                                        )}
                                    </div>

                                    {/* Exam-wise Marks */}
                                    <div className="bg-white p-4 lg:p-6 rounded-xl shadow mb-6 lg:mb-8">
                                        <h3 className="text-lg lg:text-xl font-bold text-indigo-700 mb-4">Subject-wise Average Marks</h3>

                                        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 mb-4">
                                            <select
                                                value={selectedClass?.id || ""}
                                                onChange={(e) => {
                                                    const cls = teacherClasses.find(c => c.id === e.target.value);
                                                    setSelectedClass(cls || null);
                                                    setSelectedExam(null);
                                                }}
                                                className="px-3 lg:px-4 py-2 border rounded-lg text-sm lg:text-base"
                                            >
                                                <option value="">Select Class</option>
                                                {teacherClasses.map(c => (
                                                    <option key={c.id} value={c.id}>{c.name} {c.section}</option>
                                                ))}
                                            </select>

                                            <select
                                                value={selectedExam?.id || ""}
                                                onChange={(e) => setSelectedExam(availableExams.find(ex => ex.id === e.target.value) || null)}
                                                className="px-3 lg:px-4 py-2 border rounded-lg text-sm lg:text-base"
                                                disabled={!selectedClass}
                                            >
                                                <option value="">Select Exam</option>
                                                {availableExams.map(ex => (
                                                    <option key={ex.id} value={ex.id}>{ex.title} ({ex.date})</option>
                                                ))}
                                            </select>
                                        </div>

                                        {selectedClass && selectedExam && examMarksData.length > 0 ? (
                                            <ResponsiveContainer width="100%" height={250}>
                                                <BarChart data={examMarksData}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
                                                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                                                    <Tooltip />
                                                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                                                    <Bar dataKey="average" fill="#3b82f6" name="Avg Marks" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        ) : selectedClass && selectedExam ? (
                                            <p className="text-gray-500 italic text-sm">No results for this exam.</p>
                                        ) : selectedClass ? (
                                            <p className="text-gray-500 italic text-sm">Please select an exam.</p>
                                        ) : (
                                            <p className="text-gray-500 italic text-sm">Please select a class.</p>
                                        )}
                                    </div>

                                    {/* Events & Announcements */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
                                        <div className="bg-white p-4 lg:p-6 rounded-xl shadow">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg lg:text-xl font-bold text-green-700">Upcoming Events</h3>
                                                <button onClick={() => setShowEventForm(true)} className="text-xs lg:text-sm text-green-600 underline">
                                                    + Add
                                                </button>
                                            </div>
                                            {upcomingEvents.length > 0 ? (
                                                <div className="space-y-3">
                                                    {upcomingEvents.map(e => (
                                                        <div key={e.id} className="border-l-4 border-green-500 pl-3">
                                                            <p className="font-medium text-sm lg:text-base">{e.title}</p>
                                                            <p className="text-xs lg:text-sm text-gray-600">{e.date}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 italic text-sm">No upcoming events.</p>
                                            )}
                                        </div>

                                        <div className="bg-white p-4 lg:p-6 rounded-xl shadow">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg lg:text-xl font-bold text-yellow-700">Recent Announcements</h3>
                                                <button onClick={() => setShowAnnForm(true)} className="text-xs lg:text-sm text-yellow-600 underline">
                                                    + Add
                                                </button>
                                            </div>
                                            {classAnnouncements.length > 0 ? (
                                                <div className="space-y-3">
                                                    {classAnnouncements.slice(0, 3).map(a => (
                                                        <div key={a.id} className="border-l-4 border-yellow-500 pl-3">
                                                            <p className="font-medium text-sm lg:text-base">{a.title}</p>
                                                            <p className="text-xs lg:text-sm text-gray-600">{a.date}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 italic text-sm">No announcements.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Contact Messages */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                                        <div className="bg-white p-4 lg:p-6 rounded-xl shadow">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg lg:text-xl font-bold text-purple-700">Recent Messages</h3>
                                                <button onClick={() => setShowContactForm(true)} className="text-xs lg:text-sm text-purple-600 underline">
                                                    + Add
                                                </button>
                                            </div>
                                            {contactMessages.length > 0 ? (
                                                <div className="space-y-3">
                                                    {contactMessages.slice(0, 3).map(m => (
                                                        <div key={m.id} className="border-l-4 border-purple-500 pl-3">
                                                            <p className="font-medium capitalize text-sm lg:text-base">{m.type}</p>
                                                            <p className="text-xs text-gray-600">{m.date}</p>
                                                            <p className="text-xs lg:text-sm text-gray-700 truncate">{m.message}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 italic text-sm">No messages.</p>
                                            )}
                                        </div>

                                        <div className="bg-white p-4 lg:p-6 rounded-xl shadow">
                                            <h3 className="text-lg lg:text-xl font-bold text-indigo-700 mb-4">Message Breakdown</h3>
                                            {pieData.length > 0 ? (
                                                <ResponsiveContainer width="100%" height={180}>
                                                    <PieChart>
                                                        <Pie
                                                            data={pieData}
                                                            cx="50%"
                                                            cy="50%"
                                                            outerRadius={60}
                                                            dataKey="value"
                                                            label={({ name, value }) => `${name}: ${value}`}
                                                            style={{ fontSize: '12px' }}
                                                        >
                                                            {pieData.map((entry, i) => (
                                                                <Cell key={`cell-${i}`} fill={entry.color} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            ) : (
                                                <p className="text-center text-gray-500 py-8 text-sm">No messages</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* CLASSES TAB */}
                            {activeTab === "classes" && (
                                <div>
                                    <h2 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8 text-gray-800">My Classes</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                                        {teacherClasses.map(cls => (
                                            <div
                                                key={cls.id}
                                                onClick={() => setSelectedClass(cls)}
                                                className={`bg-white p-4 lg:p-6 rounded-xl shadow cursor-pointer transition-all ${selectedClass?.id === cls.id ? "ring-4 ring-green-500" : ""
                                                    }`}
                                            >
                                                <h3 className="text-lg lg:text-xl font-bold text-green-700">
                                                    {cls.name} {cls.section}
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {students.filter(s => s.classId === cls.id).length} Students
                                                </p>
                                                <button className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm lg:text-base">
                                                    View Students
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {selectedClass && (
                                        <div className="mt-6 lg:mt-8">
                                            <h3 className="text-xl lg:text-2xl font-bold mb-4">
                                                Students in {selectedClass.name} {selectedClass.section}
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {classStudents.map(s => (
                                                    <div key={s.id} className="bg-white p-4 lg:p-5 rounded-lg shadow">
                                                        <p className="font-semibold text-base lg:text-lg">{s.name}</p>
                                                        <p className="text-sm text-gray-500">Roll: {s.roll}</p>
                                                        <p className="text-sm mt-1">Attendance: {s.attendance}%</p>
                                                        <p className="text-sm">Avg Score: {s.avgScore}%</p>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedStudent(s);
                                                                setShowProgress(true);
                                                            }}
                                                            className="mt-3 w-full px-3 py-1.5 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                                                        >
                                                            Add Progress
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* MY SCHEDULE */}
                            {activeTab === "timetables" && (
                                <div>
                                    <h2 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8 text-gray-800">My Teaching Schedule</h2>
                                    <div className="bg-white p-4 lg:p-6 rounded-xl shadow">
                                        {renderTeacherTimetable()}
                                    </div>
                                </div>
                            )}

                            {/* ANNOUNCEMENTS */}
                            {activeTab === "announcements" && (
                                <div>
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                                        <h2 className="text-2xl lg:text-3xl font-bold">Announcements</h2>
                                        <button
                                            onClick={() => setShowAnnForm(true)}
                                            className="px-4 lg:px-5 py-2 lg:py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm lg:text-base"
                                        >
                                            + Add
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {classAnnouncements.map(a => (
                                            <div key={a.id} className="bg-white p-4 lg:p-5 rounded-lg shadow">
                                                <p className="font-bold text-base lg:text-lg">{a.title}</p>
                                                <p className="text-xs lg:text-sm text-gray-500 mt-1">{a.date}</p>
                                                <p className="mt-2 text-sm lg:text-base text-gray-700">{a.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* EVENTS */}
                            {activeTab === "events" && (
                                <div>
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                                        <h2 className="text-2xl lg:text-3xl font-bold">Events</h2>
                                        <button
                                            onClick={() => setShowEventForm(true)}
                                            className="px-4 lg:px-5 py-2 lg:py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm lg:text-base"
                                        >
                                            + Add
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {classEvents.map(e => (
                                            <div key={e.id} className="bg-white p-4 lg:p-5 rounded-lg shadow">
                                                <p className="font-bold text-base lg:text-lg">{e.title}</p>
                                                <p className="text-xs lg:text-sm text-gray-500 mt-1">{e.date}</p>
                                                <p className="mt-2 text-sm lg:text-base text-gray-700">{e.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* EXAMS */}
                            {activeTab === "exams" && (
                                <div>
                                    <h2 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8 text-gray-800">Exams</h2>
                                    <div className="space-y-4">
                                        {exams
                                            .filter(ex => teacherClasses.some(c => c.id === ex.classId))
                                            .map(ex => (
                                                <div key={ex.id} className="bg-white p-4 lg:p-5 rounded-lg shadow">
                                                    <p className="font-bold text-base lg:text-lg">{ex.title}</p>
                                                    <p className="text-xs lg:text-sm text-gray-500 mt-1">{ex.date} at {ex.time}</p>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* CONTACT MESSAGES */}
                            {activeTab === "contacts" && (
                                <div>
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                                        <h2 className="text-2xl lg:text-3xl font-bold">Contact Messages</h2>
                                        <button
                                            onClick={() => setShowContactForm(true)}
                                            className="px-4 lg:px-5 py-2 lg:py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm lg:text-base"
                                        >
                                            + Add
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {contactMessages.map(m => (
                                            <div key={m.id} className="bg-white p-4 lg:p-5 rounded-lg shadow">
                                                <p className="font-bold capitalize text-base lg:text-lg">{m.type}</p>
                                                <p className="text-xs lg:text-sm text-gray-500 mt-1">{m.date}</p>
                                                <p className="mt-2 text-sm lg:text-base text-gray-700">{m.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>

            {/* MODALS */}
            <Modal open={showAnnForm} title="Create Announcement" onClose={() => setShowAnnForm(false)}>
                <AnnouncementForm
                    onCreate={(ann) => {
                        handleAddAnnouncement({
                            ...ann,
                            visibility: `class:${teacherClasses[0]?.id}`,
                        });
                        setShowAnnForm(false);
                    }}
                    onClose={() => setShowAnnForm(false)}
                />
            </Modal>

            <Modal open={showEventForm} title="Create Event" onClose={() => setShowEventForm(false)}>
                <EventForm
                    onCreate={(ev) => {
                        handleAddEvent({
                            ...ev,
                            classId: teacherClasses[0]?.id,
                        });
                        setShowEventForm(false);
                    }}
                    onClose={() => setShowEventForm(false)}
                />
            </Modal>

            <Modal open={showContactForm} title="Send Message" onClose={() => setShowContactForm(false)}>
                <AddContactMessageForm
                    onCreate={(msg) => {
                        handleAddContactMessage({
                            type: msg.type,
                            message: msg.message,
                            date: new Date().toLocaleDateString("en-GB"),
                        });
                        setShowContactForm(false);
                    }}
                    onClose={() => setShowContactForm(false)}
                />
            </Modal>

            <Modal
                open={showProgress}
                title={selectedStudent ? `Add Progress - ${selectedStudent.name}` : ""}
                onClose={() => setShowProgress(false)}
            >
                <AddProgressForm
                    student={selectedStudent}
                    onAdd={(progress) => {
                        handleAddProgress({
                            ...progress,
                            studentId: selectedStudent.id,
                        });
                        setShowProgress(false);
                    }}
                    onClose={() => setShowProgress(false)}
                    exams={exams}
                />
            </Modal>
        </div>
    );
};