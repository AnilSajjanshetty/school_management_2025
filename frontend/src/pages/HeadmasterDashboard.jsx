import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "../components/Modal";
import { CreateClassForm } from "../components/Forms/CreateClassForm";
import { AnnouncementForm } from "../components/Forms/AnnouncementForm";
import { EventForm } from "../components/Forms/EventForm";
import { ExamForm } from "../components/Forms/ExamForm";
import { TimetableCreator } from "../components/Forms/TimetableCreator";
import { renderTimetableTable } from "../components/TimetableTable";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { AddTeacherForm } from "../components/Forms/AddTeacherForm";
import { AddStudentForm } from "../components/Forms/AddStudentForm";
import { Menu, X } from "lucide-react";
import axiosInstance from "../config/axiosInstance";

export const HeadmasterDashboard = ({ onLogout }) => {
    // ✅ Separate states for each dataset
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [events, setEvents] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [timetables, setTimetables] = useState([]);
    const [exams, setExams] = useState([]);
    const [examResults, setExamResults] = useState([]);
    const [contactMessages, setContactMessages] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Sidebar & View States
    const [view, setView] = useState("overview");
    const [selectedClassId, setSelectedClassId] = useState(null);
    const [showAddClass, setShowAddClass] = useState(false);
    const [showAnnForm, setShowAnnForm] = useState(false);
    const [showEventForm, setShowEventForm] = useState(false);
    const [showExamForm, setShowExamForm] = useState(false);
    const [showTTForm, setShowTTForm] = useState(false);
    const [showTeacherForm, setShowTeacherForm] = useState(false);
    const [showStudentForm, setShowStudentForm] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Graph-related States
    const [attendanceView, setAttendanceView] = useState("monthly");
    const [selectedAttendanceClass, setSelectedAttendanceClass] = useState("");
    const [selectedExamClass, setSelectedExamClass] = useState("");
    const [selectedExamId, setSelectedExamId] = useState("");

    // ✅ Fetch all data with proper try/catch blocks
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    classRes,
                    studentRes,
                    teacherRes,
                    attendanceRes,
                    announcementRes,
                    eventRes,
                    testimonialRes,
                    timetableRes,
                    examRes,
                    examResultRes,
                    contactRes,
                ] = await Promise.all([
                    axiosInstance.get("/classes").catch(() => ({ data: [] })),
                    axiosInstance.get("/students").catch(() => ({ data: [] })),
                    axiosInstance.get("/teachers").catch(() => ({ data: [] })),
                    axiosInstance.get("/attendance").catch(() => ({ data: [] })),
                    axiosInstance.get("/announcements").catch(() => ({ data: [] })),
                    axiosInstance.get("/events").catch(() => ({ data: [] })),
                    axiosInstance.get("/testimonials").catch(() => ({ data: [] })),
                    axiosInstance.get("/timetables").catch(() => ({ data: [] })),
                    axiosInstance.get("/exams").catch(() => ({ data: [] })),
                    axiosInstance.get("/progress").catch(() => ({ data: [] })),
                    axiosInstance.get("/contact").catch(() => ({ data: [] })),
                ]);

                setClasses(classRes.data || []);
                setStudents(studentRes.data || []);
                setTeachers(teacherRes.data || []);
                setAttendance(attendanceRes.data || []);
                setAnnouncements(announcementRes.data || []);
                setEvents(eventRes.data || []);
                setTestimonials(testimonialRes.data || []);
                setTimetables(timetableRes.data || []);
                setExams(examRes.data || []);
                setExamResults(examResultRes.data || []);
                setContactMessages(contactRes.data || []);

                // Default class selections
                setSelectedAttendanceClass(classRes.data?.[0]?._id || "");
                setSelectedExamClass(classRes.data?.[0]?._id || "");
            } catch (err) {
                console.error("❌ Dashboard data load error:", err);
                setError("Failed to load dashboard data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    // ✅ Computed Data
    const upcomingEvents = useMemo(() => {
        const today = new Date().toISOString().split("T")[0];
        return events
            .filter((e) => e.date >= today)
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(0, 3);
    }, [events]);

    const closeSidebar = () => setIsSidebarOpen(false);

    const recentAnnouncements = useMemo(() => {
        return [...announcements]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);
    }, [announcements]);

    const contactStats = useMemo(() => {
        const stats = { feedback: 0, complaint: 0, inquiry: 0 };
        contactMessages.forEach((m) => {
            if (m.type && stats[m.type] !== undefined) stats[m.type]++;
        });
        return stats;
    }, [contactMessages]);

    const pieData = Object.entries(contactStats)
        .filter(([, v]) => v > 0)
        .map(([k, v]) => ({
            name: k.charAt(0).toUpperCase() + k.slice(1),
            value: v,
            color:
                k === "complaint"
                    ? "#ef4444"
                    : k === "inquiry"
                        ? "#3b82f6"
                        : "#10b981",
        }));

    // ✅ Attendance Graph
    const attendanceData = useMemo(() => {
        if (!selectedAttendanceClass) return [];
        const history = attendance.filter(
            (h) => h.classId === selectedAttendanceClass
        );

        if (attendanceView === "monthly") {
            const monthly = {};
            history.forEach((h) => {
                const month = h.date.slice(0, 7);
                if (!monthly[month]) monthly[month] = { present: 0, total: 0 };
                monthly[month].present += h.present;
                monthly[month].total += h.total;
            });
            return Object.entries(monthly).map(([m, d]) => ({
                name: m,
                attendance: Math.round((d.present / d.total) * 100),
            }));
        } else {
            return history.map((h) => ({
                name: h.date.slice(5),
                attendance: Math.round((h.present / h.total) * 100),
            }));
        }
    }, [attendance, selectedAttendanceClass, attendanceView]);

    // ✅ Exam Performance Graph
    const examGraphData = useMemo(() => {
        if (!selectedExamId) return [];
        const results = examResults.filter((r) => r.examId === selectedExamId);
        const subjectMap = {};

        results.forEach((r) => {
            if (!subjectMap[r.subject])
                subjectMap[r.subject] = { total: 0, count: 0 };
            subjectMap[r.subject].total += r.marks;
            subjectMap[r.subject].count += 1;
        });

        return Object.entries(subjectMap).map(([subject, d]) => ({
            subject,
            avgMarks: Math.round(d.total / d.count),
        }));
    }, [selectedExamId, examResults]);
    const examsForClass = exams.filter((e) => e.classId === selectedExamClass);


    // ✅ UI Loading / Error Handling
    if (loading) return <div className="text-center p-10">Loading dashboard...</div>;
    if (error) return <div className="text-red-500 text-center p-10">{error}</div>;
    const user = {
        name: "Anil",
        avatar: "img.png"
    }
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
                w-72 bg-indigo-800 text-white
                transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                flex flex-col
            `}>
                {/* Header - Fixed */}
                <div className="p-4 lg:p-6 border-b border-indigo-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-600 rounded-full w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center font-bold text-base lg:text-lg">
                                {user?.avatar}
                            </div>
                            <div>
                                <p className="font-bold text-sm lg:text-lg">{user?.name}</p>
                                <p className="text-xs lg:text-sm opacity-90">Headmaster</p>
                            </div>
                        </div>
                        <button
                            onClick={closeSidebar}
                            className="lg:hidden text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Navigation - Scrollable */}
                <nav className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-1">
                    {[
                        { label: "Overview", view: "overview" },
                        { label: "Classes", view: "classes" },
                        { label: "Teachers", view: "teachers" },
                        { label: "Announcements", view: "announcements" },
                        { label: "Events", view: "events" },
                        { label: "Testimonials", view: "testimonials" },
                        { label: "Exams", view: "exams" },
                        { label: "Timetable", view: "timetable" },
                        { label: "Contact Messages", view: "contacts" },
                    ].map((item) => (
                        <button
                            key={item.view}
                            onClick={() => {
                                setView(item.view);
                                setSelectedClassId(null);
                                closeSidebar();
                            }}
                            className={`w-full text-left px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg transition-all font-medium text-sm lg:text-base ${view === item.view ? "bg-indigo-700 shadow-md" : "hover:bg-indigo-700"
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Logout - Fixed at bottom */}
                <div className="p-4 lg:p-6 border-t border-indigo-700">
                    <button
                        onClick={onLogout}
                        className="w-full px-3 lg:px-4 py-2 lg:py-2.5 bg-red-600 rounded-lg hover:bg-red-700 font-medium text-sm lg:text-base"
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
                    <h1 className="font-bold text-lg text-gray-800">Headmaster</h1>
                    <div className="w-6" />
                </div>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    {/* OVERVIEW */}
                    {view === "overview" && (
                        <div>
                            <h2 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8 text-gray-800">Dashboard Overview</h2>

                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-5 mb-6 lg:mb-8">
                                <div className="bg-white p-4 lg:p-5 rounded-xl shadow">
                                    <p className="text-xs lg:text-sm text-gray-500">Total Classes</p>
                                    <p className="text-2xl lg:text-3xl font-bold text-indigo-600">{classes.length}</p>
                                </div>
                                <div className="bg-white p-4 lg:p-5 rounded-xl shadow">
                                    <p className="text-xs lg:text-sm text-gray-500">Total Students</p>
                                    <p className="text-2xl lg:text-3xl font-bold text-green-600">{students.length}</p>
                                </div>
                                <div className="bg-white p-4 lg:p-5 rounded-xl shadow">
                                    <p className="text-xs lg:text-sm text-gray-500">Teachers</p>
                                    <p className="text-2xl lg:text-3xl font-bold text-yellow-600">{teachers.length}</p>
                                </div>
                                <div className="bg-white p-4 lg:p-5 rounded-xl shadow">
                                    <p className="text-xs lg:text-sm text-gray-500">Upcoming Events</p>
                                    <p className="text-2xl lg:text-3xl font-bold text-purple-600">{upcomingEvents.length}</p>
                                </div>
                                <div className="bg-white p-4 lg:p-5 rounded-xl shadow">
                                    <p className="text-xs lg:text-sm text-gray-500">Complaints</p>
                                    <p className="text-2xl lg:text-3xl font-bold text-red-600">{contactStats.complaint}</p>
                                </div>
                            </div>

                            {/* Events, Announcements, Messages */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
                                {/* Upcoming Events */}
                                <div className="bg-white p-4 lg:p-6 rounded-xl shadow">
                                    <h3 className="text-lg lg:text-xl font-bold text-green-700 mb-4">Upcoming Events</h3>
                                    {upcomingEvents.length > 0 ? (
                                        <div className="space-y-3">
                                            {upcomingEvents.map((e) => (
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

                                {/* Recent Messages */}
                                <div className="bg-white p-4 lg:p-6 rounded-xl shadow">
                                    <h3 className="text-lg lg:text-xl font-bold text-purple-700 mb-4">Recent Messages</h3>
                                    {contactMessages.slice(0, 3).map((m) => (
                                        <div key={m.id} className="border-l-4 border-purple-500 pl-3 mb-2">
                                            <p className="font-medium text-xs lg:text-sm capitalize">{m.type}</p>
                                            <p className="text-xs text-gray-600">{m.date}</p>
                                        </div>
                                    ))}
                                    {contactMessages.length === 0 && <p className="text-gray-500 italic text-sm">No messages yet.</p>}
                                </div>

                                {/* Recent Announcements */}
                                <div className="bg-white p-4 lg:p-6 rounded-xl shadow">
                                    <h3 className="text-lg lg:text-xl font-bold text-yellow-700 mb-4">Recent Announcements</h3>
                                    {recentAnnouncements.length > 0 ? (
                                        <div className="space-y-3">
                                            {recentAnnouncements.map((a) => (
                                                <div key={a.id} className="border-l-4 border-yellow-500 pl-3">
                                                    <p className="font-medium text-sm lg:text-base">{a.title}</p>
                                                    <p className="text-xs lg:text-sm text-gray-600">{a.date}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic text-sm">No recent announcements.</p>
                                    )}
                                </div>

                                {/* Message Breakdown */}
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

                            {/* Testimonials */}
                            <div className="bg-white p-4 lg:p-6 rounded-xl shadow mb-6 lg:mb-8">
                                <h3 className="text-lg lg:text-xl font-bold text-indigo-700 mb-4">Parent Testimonials</h3>
                                {testimonials.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {testimonials.slice(0, 4).map((t) => (
                                            <div key={t.id} className="bg-gray-50 p-4 rounded-lg italic text-gray-700 text-sm lg:text-base">
                                                "{t.content || t.message}"
                                                <p className="mt-2 font-bold not-italic text-indigo-600 text-xs lg:text-sm">
                                                    — {t.author || t.parent}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic text-sm">No testimonials yet.</p>
                                )}
                            </div>

                            {/* Attendance Graph */}
                            <div className="bg-white p-4 lg:p-6 rounded-xl shadow mb-6 lg:mb-8">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
                                    <h3 className="text-lg lg:text-xl font-bold text-indigo-700">Attendance Trend</h3>
                                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                        <select
                                            value={selectedAttendanceClass}
                                            onChange={(e) => setSelectedAttendanceClass(e.target.value)}
                                            className="p-2 border border-gray-300 rounded-lg text-xs lg:text-sm w-full sm:w-auto"
                                        >
                                            <option value="">Select Class</option>
                                            {classes.map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.name} {c.section}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => setAttendanceView(attendanceView === "monthly" ? "daily" : "monthly")}
                                            className="px-3 lg:px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs lg:text-sm hover:bg-indigo-700"
                                        >
                                            {attendanceView === "monthly" ? "Daily" : "Monthly"}
                                        </button>
                                    </div>
                                </div>
                                {selectedAttendanceClass ? (
                                    <ResponsiveContainer width="100%" height={250}>
                                        <LineChart data={attendanceData}>
                                            <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
                                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
                                            />
                                            <Legend wrapperStyle={{ fontSize: '12px' }} />
                                            <Line
                                                type="monotone"
                                                dataKey="attendance"
                                                stroke="#4f46e5"
                                                strokeWidth={2}
                                                dot={{ fill: "#4f46e5", r: 4 }}
                                                name="Attendance %"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p className="text-center text-gray-500 py-10 text-sm">Select a class to view attendance.</p>
                                )}
                            </div>

                            {/* Exam Performance */}
                            <div className="bg-white p-4 lg:p-6 rounded-xl shadow">
                                <h3 className="text-lg lg:text-xl font-bold text-amber-700 mb-5">Exam Performance</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 mb-5">
                                    <select
                                        value={selectedExamClass}
                                        onChange={(e) => {
                                            setSelectedExamClass(e.target.value);
                                            setSelectedExamId("");
                                        }}
                                        className="p-2 lg:p-3 border border-gray-300 rounded-lg text-xs lg:text-sm"
                                    >
                                        <option value="">Select Class</option>
                                        {classes.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name} {c.section}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={selectedExamId}
                                        onChange={(e) => setSelectedExamId(e.target.value)}
                                        className="p-2 lg:p-3 border border-gray-300 rounded-lg text-xs lg:text-sm"
                                        disabled={!selectedExamClass}
                                    >
                                        <option value="">Select Exam</option>
                                        {examsForClass.map((ex) => (
                                            <option key={ex.id} value={ex.id}>
                                                {ex.title} ({ex.date})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {selectedExamId ? (
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={examGraphData}>
                                            <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
                                            <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
                                            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
                                            />
                                            <Legend wrapperStyle={{ fontSize: '12px' }} />
                                            <Bar dataKey="avgMarks" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Avg Marks" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p className="text-center text-gray-500 py-10 text-sm">Select class and exam to view results.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* CLASSES */}
                    {view === "classes" && (
                        <div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                                <h2 className="text-xl lg:text-2xl font-bold">All Classes</h2>
                                <button
                                    onClick={() => setShowAddClass(true)}
                                    className="px-4 lg:px-5 py-2 lg:py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm lg:text-base"
                                >
                                    + Create Class
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                                {classes.map((c) => (
                                    <div
                                        key={c.id}
                                        onClick={() => classClick(c.id)}
                                        className="bg-white p-4 lg:p-6 rounded-xl shadow hover:shadow-xl cursor-pointer transition"
                                    >
                                        <h3 className="font-bold text-base lg:text-lg">{c.name}</h3>
                                        <p className="text-xs lg:text-sm text-gray-600">Section: {c.section || "-"}</p>
                                        <p className="text-xs lg:text-sm text-gray-600 mt-1">Teacher: {c.teacherName || "Unassigned"}</p>
                                        <div className="mt-4 flex justify-end">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeClass(c.id);
                                                }}
                                                className="text-red-600 hover:text-red-800 text-xs lg:text-sm font-medium"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CLASS DETAIL */}
                    {view === "classDetail" && selectedClass && (
                        <div>
                            <div className="flex flex-col gap-3 mb-6">
                                <div>
                                    <h2 className="text-xl lg:text-2xl font-bold">{selectedClass.name} — {selectedClass.section}</h2>
                                    <p className="text-sm lg:text-base text-gray-600">Teacher: {selectedClass.teacherName || "Unassigned"}</p>
                                </div>
                                <div className="flex flex-wrap gap-2 lg:gap-3">
                                    <button
                                        onClick={() => setShowStudentForm(true)}
                                        className="px-3 lg:px-5 py-2 lg:py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 text-xs lg:text-sm"
                                    >
                                        + Add Student
                                    </button>
                                    <button
                                        onClick={() => setShowExamForm(true)}
                                        className="px-3 lg:px-5 py-2 lg:py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-xs lg:text-sm"
                                    >
                                        Create Exam
                                    </button>
                                    <button
                                        onClick={() => setShowTTForm(true)}
                                        className="px-3 lg:px-5 py-2 lg:py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-xs lg:text-sm"
                                    >
                                        Create Timetable
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-lg lg:text-xl font-semibold mb-4">Students</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {classStudents.map((s) => (
                                    <div key={s.id} className="bg-white p-4 lg:p-5 rounded-lg shadow">
                                        <p className="font-bold text-sm lg:text-base">{s.name}</p>
                                        <p className="text-xs lg:text-sm text-gray-500">Roll: {s.roll}</p>
                                        <p className="text-xs lg:text-sm mt-1">Attendance: {s.attendance}%</p>
                                        <p className="text-xs lg:text-sm">Avg Score: {s.avgScore}%</p>
                                        <button
                                            onClick={() => removeStudent(s.id)}
                                            className="mt-3 text-red-600 text-xs lg:text-sm font-medium"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CONTACT MESSAGES */}
                    {view === "contacts" && (
                        <div>
                            <h2 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6">Contact Messages</h2>
                            <div className="bg-white rounded-xl shadow overflow-x-auto">
                                <table className="w-full min-w-[600px]">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                            <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                            <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {contactMessages.map((msg) => (
                                            <tr key={msg.id}>
                                                <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${msg.type === "complaint" ? "bg-red-100 text-red-800" :
                                                        msg.type === "inquiry" ? "bg-blue-100 text-blue-800" :
                                                            "bg-green-100 text-green-800"
                                                        }`}>
                                                        {msg.type}
                                                    </span>
                                                </td>
                                                <td className="px-4 lg:px-6 py-4 text-xs lg:text-sm text-gray-900">{msg.message}</td>
                                                <td className="px-4 lg:px-6 py-4 text-xs lg:text-sm text-gray-500">{msg.date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {contactMessages.length === 0 && (
                                    <p className="text-center py-8 text-gray-500 text-sm">No messages yet.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* TEACHERS */}
                    {view === "teachers" && (
                        <div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                                <h2 className="text-xl lg:text-2xl font-bold">Teachers</h2>
                                <button
                                    onClick={() => setShowTeacherForm(true)}
                                    className="px-4 lg:px-5 py-2 lg:py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm lg:text-base"
                                >
                                    + Add Teacher
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                                {teachers.map((t) => (
                                    <div key={t.id} className="bg-white p-4 lg:p-6 rounded-xl shadow">
                                        <p className="font-bold text-base lg:text-lg">{t.name}</p>
                                        <p className="text-xs lg:text-sm text-gray-600 mt-1">
                                            Subjects: {t.subjects?.join(", ") || "-"}
                                        </p>
                                        <button
                                            onClick={() => removeTeacher(t.id)}
                                            className="mt-4 text-red-600 text-xs lg:text-sm font-medium"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ANNOUNCEMENTS */}
                    {view === "announcements" && (
                        <div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                                <h2 className="text-xl lg:text-2xl font-bold">Announcements</h2>
                                <button
                                    onClick={() => setShowAnnForm(true)}
                                    className="px-4 lg:px-5 py-2 lg:py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm lg:text-base"
                                >
                                    + Add
                                </button>
                            </div>
                            <div className="space-y-4">
                                {announcements.map((a) => (
                                    <div key={a.id} className="bg-white p-4 lg:p-5 rounded-lg shadow">
                                        <p className="font-bold text-base lg:text-lg">{a.title}</p>
                                        <p className="text-xs lg:text-sm text-gray-500 mt-1">
                                            {a.date} • {a.visibility}
                                        </p>
                                        <p className="mt-2 text-sm lg:text-base text-gray-700">{a.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* EVENTS */}
                    {view === "events" && (
                        <div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                                <h2 className="text-xl lg:text-2xl font-bold">Events</h2>
                                <button
                                    onClick={() => setShowEventForm(true)}
                                    className="px-4 lg:px-5 py-2 lg:py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm lg:text-base"
                                >
                                    + Add
                                </button>
                            </div>
                            <div className="space-y-4">
                                {events.map((e) => (
                                    <div key={e.id} className="bg-white p-4 lg:p-5 rounded-lg shadow">
                                        <p className="font-bold text-base lg:text-lg">{e.title}</p>
                                        <p className="text-xs lg:text-sm text-gray-500 mt-1">{e.date}</p>
                                        <p className="mt-2 text-sm lg:text-base text-gray-700">{e.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TESTIMONIALS */}
                    {view === "testimonials" && (
                        <div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                                <h2 className="text-xl lg:text-2xl font-bold">Testimonials</h2>
                                <button
                                    onClick={() =>
                                        addTestimonial({
                                            id: Date.now().toString(),
                                            content: "Great school!",
                                            author: "Parent",
                                        })
                                    }
                                    className="px-4 lg:px-5 py-2 lg:py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm lg:text-base"
                                >
                                    + Add
                                </button>
                            </div>
                            <div className="space-y-4">
                                {testimonials.map((t) => (
                                    <div key={t.id} className="bg-white p-4 lg:p-5 rounded-lg shadow italic text-gray-700 text-sm lg:text-base">
                                        "{t.content || t.message}"
                                        <p className="mt-3 font-bold not-italic text-indigo-700 text-sm lg:text-base">
                                            — {t.author || t.parent}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* EXAMS */}
                    {view === "exams" && (
                        <div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                                <h2 className="text-xl lg:text-2xl font-bold">Exams</h2>
                                <button
                                    onClick={() => setShowExamForm(true)}
                                    className="px-4 lg:px-5 py-2 lg:py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm lg:text-base"
                                >
                                    + Create Exam
                                </button>
                            </div>
                            <div className="space-y-4">
                                {exams.map((ex) => (
                                    <div key={ex.id} className="bg-white p-4 lg:p-5 rounded-lg shadow">
                                        <p className="font-bold text-base lg:text-lg">{ex.title}</p>
                                        <p className="text-xs lg:text-sm text-gray-500 mt-1">
                                            Class: {ex.className || classes.find((c) => c.id === ex.classId)?.name} • Date: {ex.date}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TIMETABLE */}
                    {view === "timetable" && (
                        <div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                                <h2 className="text-xl lg:text-2xl font-bold">Timetables</h2>
                                <button
                                    onClick={() => setShowTTForm(true)}
                                    className="px-4 lg:px-5 py-2 lg:py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm lg:text-base"
                                >
                                    + Create Timetable
                                </button>
                            </div>
                            <div className="space-y-6">
                                {timetables.map((t) => (
                                    <div key={t.id} className="bg-white p-4 lg:p-6 rounded-xl shadow">
                                        <p className="font-bold text-base lg:text-lg">{t.className}</p>
                                        <p className="text-xs lg:text-sm text-gray-600 mt-1">Teacher: {t.teacherName || "-"}</p>
                                        <div className="mt-4 overflow-x-auto">{renderTimetableTable(t.schedule || {})}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* MODALS */}
            <Modal open={showAddClass} title="Create Class" onClose={() => setShowAddClass(false)}>
                <CreateClassForm
                    onCreate={(p) => {
                        addClass(p);
                        setShowAddClass(false);
                    }}
                    onClose={() => setShowAddClass(false)}
                />
            </Modal>

            <Modal open={showAnnForm} title="Create Announcement" onClose={() => setShowAnnForm(false)}>
                <AnnouncementForm
                    classes={classes}
                    teachers={teachers}
                    onCreate={(p) => {
                        addAnnouncement(p);
                        setShowAnnForm(false);
                    }}
                    onClose={() => setShowAnnForm(false)}
                />
            </Modal>

            <Modal open={showEventForm} title="Create Event" onClose={() => setShowEventForm(false)}>
                <EventForm
                    onCreate={(p) => {
                        addEvent(p);
                        setShowEventForm(false);
                    }}
                    onClose={() => setShowEventForm(false)}
                />
            </Modal>

            <Modal open={showStudentForm} title="Add Student" onClose={() => setShowStudentForm(false)}>
                <AddStudentForm
                    classes={classes}
                    onCreate={(student) => {
                        addStudent(student);
                        setShowStudentForm(false);
                    }}
                    onClose={() => setShowStudentForm(false)}
                />
            </Modal>

            <Modal open={showExamForm} title="Create Exam" onClose={() => setShowExamForm(false)}>
                <ExamForm
                    classes={classes}
                    onCreate={(p) => {
                        const cls = classes.find((c) => c.id === p.classId);
                        createExam({ ...p, className: cls?.name || "" });
                        setShowExamForm(false);
                    }}
                    onClose={() => setShowExamForm(false)}
                />
            </Modal>

            <Modal open={showTTForm} title="Create Timetable" onClose={() => setShowTTForm(false)}>
                <TimetableCreator
                    classes={classes}
                    teachers={teachers}
                    onCreate={(p) => {
                        const cls = classes.find((c) => c.id === p.classId);
                        createTimetable({ ...p, className: cls?.name || "" });
                        setShowTTForm(false);
                    }}
                />
            </Modal>

            <Modal open={showTeacherForm} title="Add Teacher" onClose={() => setShowTeacherForm(false)}>
                <AddTeacherForm
                    onCreate={(p) => {
                        addTeacher(p);
                        setShowTeacherForm(false);
                    }}
                    onClose={() => setShowTeacherForm(false)}
                />
            </Modal>
        </div>
    );
};