// src/pages/StudentDashboard.jsx
import React, { useState, useMemo, useEffect } from "react";
import { renderTimetableTable } from "../components/TimetableTable";
import { Menu, X, Bell, Calendar, MessageSquare, BookOpen, Award, Clock, ChevronRight, Plus } from "lucide-react";
import axiosInstance from "../config/axiosInstance";
const classesName = (classId, classes = []) => classes.find(c => c.id === classId)?.name || '-';

export const StudentDashboard = ({ onLogout }) => {
    // === State for data ===
    const [students, setStudents] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [exams, setExams] = useState([]);
    const [timetables, setTimetables] = useState([]);
    const [classes, setClasses] = useState([]);
    const [events, setEvents] = useState([]);
    const [contactMessages, setContactMessages] = useState([]);
    const [attendance, setAttendance] = useState([])
    const [user, setUser] = useState([])


    // === UI State ===
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("overview");
    const [showMessageForm, setShowMessageForm] = useState(false);

    // // === Fetch all data with axiosInstance ===
    // useEffect(() => {
    //     const userId = localStorage.getItem("userId")
    //     const fetchAllData = async () => {
    //         try {
    //             const [
    //                 userRes,
    //                 studentsRes,
    //                 announcementsRes,
    //                 examsRes,
    //                 timetablesRes,
    //                 classesRes,
    //                 eventsRes,
    //                 contactMessagesRes,
    //             ] = await Promise.all([
    //                 axiosInstance.get(`/users/${userId}`),
    //                 axiosInstance.get("/students"),
    //                 axiosInstance.get("/announcements"),
    //                 axiosInstance.get("/exams"),
    //                 axiosInstance.get("/timetables"),
    //                 axiosInstance.get("/classes"),
    //                 axiosInstance.get("/events"),
    //                 axiosInstance.get("/contact-messages"),
    //             ]);
    //             setUser(userRes.data)
    //             setStudents(studentsRes.data);
    //             setAnnouncements(announcementsRes.data);
    //             setExams(examsRes.data);
    //             setTimetables(timetablesRes.data);
    //             setClasses(classesRes.data);
    //             setEvents(eventsRes.data);
    //             setContactMessages(contactMessagesRes.data);
    //         } catch (error) {
    //             console.error("❌ Error fetching student dashboard data:", error);
    //         }
    //     };

    //     fetchAllData();
    // }, []);


    // src/pages/StudentDashboard.jsx
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const fetchAllData = async () => {
            try {
                // Single endpoint for all dashboard data
                const response = await axiosInstance.get(`/students/dashboard/${userId}`);
                const data = response.data;

                setUser({ studentId: data.student.id });
                setStudents([data.student]);
                setTimetables([data.timetable]);
                setAnnouncements(data.announcements);
                setEvents(data.events);
                setExams(data.exams);
                setClasses([{ id: data.student.classId, name: data.student.className }]);
            } catch (error) {
                console.error("❌ Error fetching dashboard data:", error);
            }
        };

        fetchAllData();
    }, []);
    // === Derived data ===
    const student = students.find((s) => s.id === user?.studentId) || students[0];
    const timetable = timetables.find((t) => t.classId === student?.classId);

    const myAnnouncements = useMemo(() => {
        if (!student) return [];
        return announcements
            .filter(
                (a) =>
                    !a.visibility ||
                    a.visibility === "public" ||
                    a.visibility === `class:${student.classId}`
            )
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);
    }, [announcements, student]);

    const myEvents = useMemo(() => {
        if (!student) return [];
        const today = new Date().toISOString().split("T")[0];
        return events
            .filter((e) => e.classId === student.classId && e.date >= today)
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(0, 3);
    }, [events, student]);

    const myContactMessages = useMemo(() => {
        if (!student) return [];
        return contactMessages
            .filter((m) => m.studentId === student.id)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [contactMessages, student]);

    const upcomingExams = useMemo(() => {
        if (!student) return [];
        const today = new Date().toISOString().split("T")[0];
        return exams
            .filter((ex) => ex.classId === student.classId && ex.date >= today)
            .sort((a, b) => a.date.localeCompare(b.date));
    }, [exams, student]);
    const renderSection = () => {
        switch (activeSection) {
            case "timetable":
                return (
                    <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-600" /> My Timetable
                        </h3>
                        <div className="bg-white p-4 rounded-xl shadow-lg">
                            {timetable?.schedule ? renderTimetableTable(timetable.schedule) : (
                                <p className="text-gray-500 text-center py-8">No timetable available.</p>
                            )}
                        </div>
                    </div>
                );

            case "exams":
                return (
                    <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Award className="w-5 h-5 text-green-600" /> Exams & Results
                        </h3>
                        <div className="space-y-3">
                            {upcomingExams.length > 0 ? upcomingExams.map(ex => (
                                <div key={ex.id} className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-lg">{ex.title}</p>
                                            <p className="text-sm text-gray-600">Date: {ex.date}</p>
                                            {ex.time && <p className="text-xs text-gray-500">Time: {ex.time}</p>}
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                            )) : (
                                <p className="text-center text-gray-500 py-8">No upcoming exams.</p>
                            )}
                        </div>
                    </div>
                );

            case "announcements":
                return (
                    <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-yellow-600" /> Announcements
                        </h3>
                        <div className="space-y-3">
                            {myAnnouncements.length > 0 ? myAnnouncements.map(a => (
                                <div key={a.id} className="bg-white p-4 rounded-xl shadow border-l-4 border-yellow-500">
                                    <p className="font-semibold text-lg">{a.title}</p>
                                    <p className="text-sm text-gray-600">{a.date}</p>
                                    <p className="mt-2 text-gray-700">{a.content}</p>
                                </div>
                            )) : (
                                <p className="text-center text-gray-500 py-8">No announcements.</p>
                            )}
                        </div>
                    </div>
                );

            case "events":
                return (
                    <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-green-600" /> Events
                        </h3>
                        <div className="space-y-3">
                            {myEvents.length > 0 ? myEvents.map(e => (
                                <div key={e.id} className="bg-white p-4 rounded-xl shadow border-l-4 border-green-500">
                                    <p className="font-semibold text-lg">{e.title}</p>
                                    <p className="text-sm text-gray-600">{e.date}</p>
                                    <p className="mt-2 text-gray-700">{e.content}</p>
                                </div>
                            )) : (
                                <p className="text-center text-gray-500 py-8">No upcoming events.</p>
                            )}
                        </div>
                    </div>
                );

            case "contact":
                return (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-purple-600" /> My Messages
                            </h3>
                            <button
                                onClick={() => setShowMessageForm(true)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
                            >
                                <Plus className="w-4 h-4" /> Add Message
                            </button>
                        </div>
                        <div className="space-y-3">
                            {myContactMessages.length > 0 ? myContactMessages.map(m => (
                                <div key={m.id} className="bg-white p-4 rounded-xl shadow">
                                    <p className="font-medium capitalize">{m.type}</p>
                                    <p className="text-sm text-gray-600">{m.date}</p>
                                    <p className="mt-1 text-gray-700">{m.message}</p>
                                </div>
                            )) : (
                                <p className="text-center text-gray-500 py-8">No messages yet.</p>
                            )}
                        </div>
                    </div>
                );

            default:
                return (
                    <div>
                        <h3 className="text-xl font-bold mb-4">Dashboard Overview</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-5 rounded-xl shadow-lg">
                                <BookOpen className="w-8 h-8 mb-2" />
                                <p className="text-sm opacity-90">Attendance</p>
                                <p className="text-3xl font-bold">{student?.attendance}%</p>
                            </div>
                            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-5 rounded-xl shadow-lg">
                                <Award className="w-8 h-8 mb-2" />
                                <p className="text-sm opacity-90">Avg Score</p>
                                <p className="text-3xl font-bold">{student?.avgScore}%</p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-5 rounded-xl shadow-lg">
                                <Calendar className="w-8 h-8 mb-2" />
                                <p className="text-sm opacity-90">Upcoming Exams</p>
                                <p className="text-3xl font-bold">{upcomingExams.length}</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-yellow-600" /> Recent Announcements
                                </h4>
                                <div className="space-y-2">
                                    {myAnnouncements.length > 0 ? myAnnouncements.map(a => (
                                        <div key={a.id} className="bg-white p-3 rounded-lg shadow border-l-4 border-yellow-500">
                                            <p className="font-medium text-sm">{a.title}</p>
                                            <p className="text-xs text-gray-500">{a.date}</p>
                                        </div>
                                    )) : (
                                        <p className="text-gray-500 text-sm">No announcements.</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-green-600" /> Upcoming Events
                                </h4>
                                <div className="space-y-2">
                                    {myEvents.length > 0 ? myEvents.map(e => (
                                        <div key={e.id} className="bg-white p-3 rounded-lg shadow border-l-4 border-green-500">
                                            <p className="font-medium text-sm">{e.title}</p>
                                            <p className="text-xs text-gray-500">{e.date}</p>
                                        </div>
                                    )) : (
                                        <p className="text-gray-500 text-sm">No events.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* MOBILE HEADER */}
            <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex justify-between items-center md:hidden">
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
                <button
                    onClick={onLogout}
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 font-medium"
                >
                    Logout
                </button>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* FIXED SIDEBAR - NO SCROLL WITH MAIN */}
                <aside
                    className={`
                        fixed inset-y-0 left-0 z-50 w-72 bg-blue-800 text-white flex flex-col
                        transform transition-transform duration-300 ease-in-out
                        md:relative md:translate-x-0 md:inset-auto
                        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
                        h-screen
                    `}
                >
                    {/* Mobile Close */}
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="absolute top-4 right-4 p-1 rounded-lg hover:bg-blue-700 md:hidden"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Sidebar Content - SCROLLS INDEPENDENTLY */}
                    <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                                {student?.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold text-lg">{student?.name}</p>
                                <p className="text-sm opacity-90">Student</p>
                            </div>
                        </div>

                        <div className="mb-6 bg-blue-700 p-4 rounded-lg">
                            <p className="text-xs opacity-90">Class</p>
                            <p className="font-semibold">{classesName(student?.classId, classes)}</p>
                            <p className="text-xs mt-2 opacity-90">Roll: {student?.roll}</p>
                        </div>

                        <nav className="flex-1 space-y-1">
                            {[
                                { id: "overview", label: "Overview", icon: BookOpen },
                                { id: "timetable", label: "Timetable", icon: Clock },
                                { id: "exams", label: "Exams", icon: Award },
                                { id: "announcements", label: "Announcements", icon: Bell },
                                { id: "events", label: "Events", icon: Calendar },
                                { id: "contact", label: "Messages", icon: MessageSquare },
                            ].map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => {
                                        setActiveSection(id);
                                        setMobileMenuOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-3 ${activeSection === id ? "bg-blue-700 shadow-md" : "hover:bg-blue-700"
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {label}
                                    {id === "contact" && myContactMessages.length > 0 && (
                                        <span className="ml-auto bg-red-500 text-xs px-2 py-0.5 rounded-full">
                                            {myContactMessages.length}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </nav>

                        {/* Desktop Logout */}
                        <button
                            onClick={onLogout}
                            className="hidden md:block mt-6 w-full px-4 py-2.5 bg-red-600 rounded-lg hover:bg-red-700 font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </aside>

                {/* Mobile Overlay */}
                {mobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                )}

                {/* MAIN CONTENT - ONLY THIS SCROLLS */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-gray-50">
                    <div className="max-w-6xl mx-auto">
                        {renderSection()}
                    </div>
                </main>
            </div>

            {/* MODAL: Add Message */}
            {showMessageForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                        <h3 className="text-lg font-bold mb-4">Send Message to Teacher</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const message = {
                                    id: `msg-${Date.now()}`,
                                    studentId: student.id,
                                    type: formData.get("type"),
                                    message: formData.get("message"),
                                    date: new Date().toLocaleDateString("en-GB"),
                                };
                                // You can pass this to a handler later
                                console.log("New message:", message);
                                setShowMessageForm(false);
                            }}
                            className="space-y-3"
                        >
                            <select
                                name="type"
                                required
                                className="w-full px-3 py-2 border rounded-lg"
                            >
                                <option value="">Select Type</option>
                                <option value="inquiry">Inquiry</option>
                                <option value="complaint">Complaint</option>
                                <option value="feedback">Feedback</option>
                            </select>
                            <textarea
                                name="message"
                                required
                                rows={4}
                                placeholder="Type your message..."
                                className="w-full px-3 py-2 border rounded-lg resize-none"
                            />
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
                                >
                                    Send
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowMessageForm(false)}
                                    className="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};