// src/components/teacherDashboard/TOverviewTab.jsx
import React, { useState, useMemo } from "react";
import TAttendanceChart from "./TAttendanceChart";
import TExamMarksChart from "./TExamMarksChart";
import { Calendar, Users, TrendingUp, MessageCircle, BookOpen, Award, Megaphone, Clock, Mail } from "lucide-react";

export default function TOverviewTab({
    classes = [],
    selectedClass,
    setSelectedClass,
    attendance = {},
    exams = [],
    announcements = [],
    events = [],
    contactMessages = [],
    statistics = {},
    onAddAnnouncement,
    onAddEvent,
    onAddContact,
}) {
    const [examClass, setExamClass] = useState(selectedClass?.id || "");
    const [examId, setExamId] = useState("");

    const {
        totalStudents = 0,
        avgAttendance = 0,
        upcomingEvents = 0,
        contactStats = { feedback: 0, complaint: 0, inquiry: 0 }
    } = statistics;

    const totalMessages = contactStats.feedback + contactStats.complaint + contactStats.inquiry;

    const upcomingEventsList = events
        .filter(e => new Date(e.date) >= new Date())
        .slice(0, 5);

    const recentAnnouncements = announcements.slice(0, 5);
    const recentMessages = contactMessages.slice(0, 5);

    const filteredExams = useMemo(() => {
        return exams.filter(ex => ex.classId === examClass);
    }, [exams, examClass]);

    const selectedExamData = filteredExams.find(ex => ex.id === examId);
    const hasExamData = selectedExamData?.results?.length > 0;

    return (
        <div className="space-y-8">
            {/* HERO STATS */}
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

            {/* ATTENDANCE CHART */}
            {/* <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
                    <BookOpen className="h-6 w-6 text-indigo-600" />
                    Attendance Trend
                </h3>

                {selectedClass && attendance[selectedClass.id]?.length > 0 ? (
                    <TAttendanceChart
                        attendance={attendance}
                        selectedClass={selectedClass}
                        setSelectedClass={setSelectedClass}
                        classes={classes}
                    />
                ) : selectedClass ? (
                    <div className="h-64 flex items-center justify-center text-gray-400">
                        <p className="text-sm font-medium">No attendance data</p>
                    </div>
                ) : (
                    <div className="h-64 flex items-center justify-center text-gray-400">
                        <p className="text-sm font-medium">Please select a class</p>
                    </div>
                )}
            </div> */}

            {/* EXAM CHART */}
            {/* <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
                    <Award className="h-6 w-6 text-green-600" />
                    Exam Performance
                </h3>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <select
                        value={examClass}
                        onChange={e => {
                            setExamClass(e.target.value);
                            setExamId("");
                        }}
                        className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="">Select Class</option>
                        {classes.map(c => (
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
                                {ex.title} ({ex.subject})
                            </option>
                        ))}
                    </select>
                </div>

                {examClass && examId ? (
                    hasExamData ? (
                        <TExamMarksChart selectedExam={selectedExamData} />
                    ) : (
                        <div className="h-64 flex items-center justify-center text-gray-400">
                            <p className="text-sm font-medium">No results</p>
                        </div>
                    )
                ) : examClass ? (
                    <div className="h-64 flex items-center justify-center text-gray-400">
                        <p className="text-sm font-medium">Select an exam</p>
                    </div>
                ) : (
                    <div className="h-64 flex items-center justify-center text-gray-400">
                        <p className="text-sm font-medium">Select a class</p>
                    </div>
                )}
            </div> */}

            {/* RECENT ANNOUNCEMENTS */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Megaphone className="h-6 w-6 text-indigo-600" />
                        Recent Announcements
                    </h3>
                    <button onClick={onAddAnnouncement} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                        + Add New
                    </button>
                </div>
                {recentAnnouncements.length > 0 ? (
                    <div className="space-y-4">
                        {recentAnnouncements.map(ann => (
                            <div key={ann.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                    <Megaphone className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">{ann.title}</p>
                                    <p className="text-sm text-gray-600 mt-1">{ann.content}</p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        {new Date(ann.date).toLocaleDateString()} at {new Date(ann.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-400">
                        <Megaphone className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">No announcements yet</p>
                    </div>
                )}
            </div>

            {/* UPCOMING EVENTS */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Clock className="h-6 w-6 text-blue-600" />
                        Upcoming Events
                    </h3>
                    <button onClick={onAddEvent} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        + Add Event
                    </button>
                </div>
                {upcomingEventsList.length > 0 ? (
                    <div className="space-y-4">
                        {upcomingEventsList.map(evt => (
                            <div key={evt.id} className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <Calendar className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">{evt.title}</p>
                                    <p className="text-sm text-gray-600 mt-1">{evt.content}</p>
                                    <p className="text-xs text-blue-600 font-medium mt-2">
                                        {new Date(evt.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-400">
                        <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">No upcoming events</p>
                    </div>
                )}
            </div>

            {/* RECENT MESSAGES */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Mail className="h-6 w-6 text-purple-600" />
                        Recent Messages
                    </h3>
                    <button onClick={onAddContact} className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                        + Send Message
                    </button>
                </div>
                {recentMessages.length > 0 ? (
                    <div className="space-y-4">
                        {recentMessages.map(msg => (
                            <div key={msg.id} className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-purple-700">
                                    {msg.studentName.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">{msg.studentName}</p>
                                    <p className="text-sm text-gray-600 mt-1">{msg.message}</p>
                                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${msg.type === 'feedback' ? 'bg-green-100 text-green-700' :
                                            msg.type === 'complaint' ? 'bg-red-100 text-red-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                            {msg.type}
                                        </span>
                                        <span>{new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-400">
                        <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">No messages yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}