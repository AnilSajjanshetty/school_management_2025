// src/components/teacherDashboard/TOverviewTab.jsx
import React, { useState, useMemo } from "react";
import TAttendanceChart from "./TAttendanceChart";
import TExamMarksChart from "./TExamMarksChart";
import { Calendar, Users, TrendingUp, MessageCircle, BookOpen, Award } from "lucide-react";

export default function TOverviewTab({
    teacherClasses = [],
    selectedClass,
    setSelectedClass,
    selectedExam,
    setSelectedExam,
    attendance = [],
    examResults = [],
    exams = [],
    announcements = [],
    events = [],
    contactMessages = [],
    statistics = {},
    onAddAnnouncement,
    onAddEvent,
    onAddContact,
}) {
    // === Local State for Dropdowns ===
    const [attendanceDuration, setAttendanceDuration] = useState("daily"); // daily | monthly | yearly
    const [examClass, setExamClass] = useState(selectedClass?.id || "");
    const [examId, setExamId] = useState(selectedExam?.id || "");

    // === Derived Data ===
    const {
        totalStudents = 0,
        avgAttendance = 0,
        upcomingEvents = 0,
        contactStats = { feedback: 0, complaint: 0, inquiry: 0 }
    } = statistics;

    const totalMessages = contactStats.feedback + contactStats.complaint + contactStats.inquiry;

    const upcomingEventsList = events
        .filter(e => new Date(e.date) >= new Date())
        .slice(0, 3);

    const recentAnnouncements = announcements.slice(0, 3);
    const recentMessages = contactMessages.slice(0, 3);

    const hasAttendanceData = attendance.length > 0;
    const hasExamData = examResults.length > 0;

    // Filter exams by selected class
    const filteredExams = useMemo(() => {
        return exams.filter(ex => ex.classId === examClass);
    }, [exams, examClass]);

    return (
        <div className="space-y-8">
            {/* === HERO STATS (4 Cards in One Row) === */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Total Students</p>
                            <p className="text-3xl font-bold">{totalStudents}</p>
                        </div>
                        <Users className="h-10 w-10 opacity-80" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Avg Attendance</p>
                            <p className="text-3xl font-bold">{avgAttendance}%</p>
                        </div>
                        <TrendingUp className="h-10 w-10 opacity-80" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Upcoming Events</p>
                            <p className="text-3xl font-bold">{upcomingEvents}</p>
                        </div>
                        <Calendar className="h-10 w-10 opacity-80" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Messages</p>
                            <p className="text-3xl font-bold">{totalMessages}</p>
                        </div>
                        <MessageCircle className="h-10 w-10 opacity-80" />
                    </div>
                </div>
            </div>

            {/* === ATTENDANCE CHART (FULL ROW) === */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <BookOpen className="h-6 w-6 text-indigo-600" />
                        Attendance Trend
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <select
                            value={selectedClass?.id || ""}
                            onChange={e => setSelectedClass(teacherClasses.find(c => c.id === e.target.value))}
                            className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Select Class</option>
                            {teacherClasses.map(c => (
                                <option key={c.id} value={c.id}>{c.name} {c.section}</option>
                            ))}
                        </select>

                        <select
                            value={attendanceDuration}
                            onChange={e => setAttendanceDuration(e.target.value)}
                            className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="daily">Daily</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>
                </div>

                {selectedClass && hasAttendanceData ? (
                    <TAttendanceChart
                        attendance={attendance}
                        selectedClass={selectedClass}
                        duration={attendanceDuration}
                    />
                ) : selectedClass ? (
                    <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-3" />
                        <p className="text-sm font-medium">No attendance data for this period</p>
                    </div>
                ) : (
                    <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                        <p className="text-sm font-medium">Please select a class</p>
                    </div>
                )}
            </div>

            {/* === EXAM MARKS CHART (FULL ROW) === */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Award className="h-6 w-6 text-green-600" />
                        Exam Performance
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <select
                            value={examClass}
                            onChange={e => {
                                setExamClass(e.target.value);
                                setExamId(""); // Reset exam when class changes
                            }}
                            className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">Select Class</option>
                            {teacherClasses.map(c => (
                                <option key={c.id} value={c.id}>{c.name} {c.section}</option>
                            ))}
                        </select>

                        <select
                            value={examId}
                            onChange={e => setExamId(e.target.value)}
                            disabled={!examClass}
                            className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                        >
                            <option value="">Select Exam</option>
                            {filteredExams.map(ex => (
                                <option key={ex.id} value={ex.id}>
                                    {ex.title} ({new Date(ex.date).toLocaleDateString()})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {examClass && examId && hasExamData ? (
                    <TExamMarksChart
                        examResults={examResults.filter(r => r.examId === examId)}
                        selectedExam={filteredExams.find(ex => ex.id === examId)}
                    />
                ) : examClass && examId ? (
                    <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-3" />
                        <p className="text-sm font-medium">No results for this exam</p>
                    </div>
                ) : examClass ? (
                    <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                        <p className="text-sm font-medium">Please select an exam</p>
                    </div>
                ) : (
                    <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                        <p className="text-sm font-medium">Please select a class</p>
                    </div>
                )}
            </div>

            {/* === RECENT ACTIVITY (3 Cards in One Row) === */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Announcements */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800">Announcements</h3>
                        <button onClick={onAddAnnouncement} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                            + Add
                        </button>
                    </div>
                    {recentAnnouncements.length > 0 ? (
                        <div className="space-y-3">
                            {recentAnnouncements.map(ann => (
                                <div key={ann.id} className="border-l-4 border-indigo-500 pl-3">
                                    <p className="font-medium text-sm">{ann.title}</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(ann.date).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm italic text-center py-4">No announcements</p>
                    )}
                </div>

                {/* Events */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800">Upcoming Events</h3>
                        <button onClick={onAddEvent} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                            + Add
                        </button>
                    </div>
                    {upcomingEventsList.length > 0 ? (
                        <div className="space-y-3">
                            {upcomingEventsList.map(evt => (
                                <div key={evt.id} className="border-l-4 border-blue-500 pl-3">
                                    <p className="font-medium text-sm">{evt.title}</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(evt.date).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm italic text-center py-4">No upcoming events</p>
                    )}
                </div>

                {/* Messages */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800">Recent Messages</h3>
                        <button onClick={onAddContact} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                            + Send
                        </button>
                    </div>
                    {recentMessages.length > 0 ? (
                        <div className="space-y-3">
                            {recentMessages.map(msg => (
                                <div key={msg.id} className="flex items-start gap-2">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                                        {msg.studentName.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{msg.studentName}</p>
                                        <p className="text-xs text-gray-600 truncate">{msg.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm italic text-center py-4">No messages</p>
                    )}
                </div>
            </div>
        </div>
    );
}