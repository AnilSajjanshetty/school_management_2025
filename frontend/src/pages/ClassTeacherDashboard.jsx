// components/ClassTeacherDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
    TrendingUp, UserCheck, BookOpen, Clock, Megaphone, Calendar,
    FileText, X, Menu, Users, BarChart3, CheckCircle, XCircle,
    GraduationCap, Bell, AlertCircle, ChevronRight, RefreshCw
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import axiosInstance from '../config/axiosInstance';

export const ClassTeacherDashboard = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = localStorage.getItem("userId");

    // State
    const [dashboardData, setDashboardData] = useState(null);
    const [myClassData, setMyClassData] = useState(null);
    const [teachingClassesData, setTeachingClassesData] = useState([]);
    const [timetableData, setTimetableData] = useState({});
    const [announcementsData, setAnnouncementsData] = useState([]);
    const [eventsData, setEventsData] = useState([]);
    const [examsData, setExamsData] = useState([]);

    // Fetch functions
    const fetchDashboard = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/classTeacher/dashboard/${userId}`);
            setDashboardData(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch dashboard data');
            console.error('Dashboard fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyClass = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/classTeacher/my-class/${userId}`);
            setMyClassData(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch class data');
            console.error('My class fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchTeachingClasses = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/classTeacher/teaching-classes/${userId}`);
            setTeachingClassesData(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch teaching classes');
            console.error('Teaching classes fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchTimetable = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/classTeacher/timetable/${userId}`);
            setTimetableData(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch timetable');
            console.error('Timetable fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/classTeacher/announcements');
            setAnnouncementsData(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch announcements');
            console.error('Announcements fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/classTeacher/events');
            setEventsData(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch events');
            console.error('Events fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchExams = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/classTeacher/exams/${userId}`);
            setExamsData(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch exams');
            console.error('Exams fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on tab change
    useEffect(() => {
        switch (activeTab) {
            case 'overview': fetchDashboard(); break;
            case 'myclass': fetchMyClass(); break;
            case 'teaching': fetchTeachingClasses(); break;
            case 'timetables': fetchTimetable(); break;
            case 'announcements': fetchAnnouncements(); break;
            case 'events': fetchEvents(); break;
            case 'exams': fetchExams(); break;
            default: break;
        }
    }, [activeTab, userId]);

    // Render content
    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center h-96">
                    <RefreshCw className="w-8 h-8 animate-spin text-purple-600" />
                    <span className="ml-3 text-lg text-gray-600">Loading...</span>
                </div>
            );
        }

        if (error) {
            return (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                    <p className="text-red-700 font-medium">{error}</p>
                    <button
                        onClick={() => {
                            setError(null);
                            switch (activeTab) {
                                case 'overview': fetchDashboard(); break;
                                case 'myclass': fetchMyClass(); break;
                                case 'teaching': fetchTeachingClasses(); break;
                                case 'timetables': fetchTimetable(); break;
                                case 'announcements': fetchAnnouncements(); break;
                                case 'events': fetchEvents(); break;
                                case 'exams': fetchExams(); break;
                            }
                        }}
                        className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            );
        }

        switch (activeTab) {
            case 'overview': return <OverviewTab data={dashboardData} />;
            case 'myclass': return <MyClassTab data={myClassData} />;
            case 'teaching': return <TeachingClassesTab data={teachingClassesData} />;
            case 'timetables': return <TimetableTab timetableData={timetableData} />;
            case 'announcements': return <AnnouncementsTab data={announcementsData} />;
            case 'events': return <EventsTab data={eventsData} />;
            case 'exams': return <ExamsTab data={examsData} />;
            default: return null;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50 w-72 bg-purple-800 text-white
                transform transition-transform duration-300
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                flex flex-col
            `}>
                <div className="p-4 lg:p-6 border-b border-purple-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-600 rounded-full w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center text-base lg:text-xl font-bold">
                                {dashboardData?.user?.avatar || dashboardData?.user?.name?.charAt(0) || "T"}
                            </div>
                            <div>
                                <p className="font-bold text-sm lg:text-base">{dashboardData?.user?.name || "Teacher"}</p>
                                <p className="text-xs lg:text-sm text-purple-200">Class Teacher</p>
                            </div>
                        </div>
                        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="bg-purple-700 p-3 rounded">
                        <p className="text-xs text-purple-200">My Class</p>
                        <p className="font-semibold text-sm lg:text-base">
                            {dashboardData?.myClass
                                ? `${dashboardData.myClass.name} ${dashboardData.myClass.section || ''}`.trim()
                                : 'Not Assigned'}
                        </p>
                        <p className="text-xs mt-2 text-purple-200">
                            Teaching {dashboardData?.teachingClasses?.length || 0} classes
                        </p>
                    </div>
                </div>

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
                            onClick={() => { setActiveTab(tab); setIsSidebarOpen(false); }}
                            className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 transition text-sm lg:text-base
                                ${activeTab === tab ? "bg-purple-700" : "hover:bg-purple-700"}`}
                        >
                            <Icon className="w-4 h-4" /> {label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 lg:p-6 border-t border-purple-700">
                    <button onClick={onLogout} className="w-full px-3 py-2 bg-red-600 rounded hover:bg-red-700 text-sm lg:text-base">
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm px-4 lg:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden text-gray-600 hover:text-gray-900"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
                                {activeTab === 'overview' && 'Analytics Dashboard'}
                                {activeTab === 'myclass' && 'My Class'}
                                {activeTab === 'teaching' && 'Classes I Teach'}
                                {activeTab === 'timetables' && 'Timetables'}
                                {activeTab === 'announcements' && 'Announcements'}
                                {activeTab === 'events' && 'Events'}
                                {activeTab === 'exams' && 'Exams'}
                            </h1>
                        </div>
                    </div>
                    <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-purple-600" />
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

// === TAB COMPONENTS ===

const OverviewTab = ({ data }) => {
    if (!data) return <p className="text-gray-500 text-center py-8">No data available</p>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Students", value: data.totalStudents || 0, icon: Users, color: "from-purple-500 to-purple-600" },
                    { label: "Avg Attendance", value: data.avgAttendance || 0, icon: CheckCircle, color: "from-green-500 to-green-600", unit: "%" },
                    { label: "Pending Tasks", value: data.pendingTasks || 0, icon: AlertCircle, color: "from-yellow-500 to-yellow-600" },
                    { label: "Exams Scheduled", value: data.examsScheduled || 0, icon: FileText, color: "from-blue-500 to-blue-600" },
                ].map((stat, i) => (
                    <div key={i} className={`bg-gradient-to-br ${stat.color} text-white p-5 rounded-lg shadow`}>
                        <stat.icon className="w-8 h-8 mb-2" />
                        <p className="text-sm opacity-90">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}{stat.unit}</p>
                    </div>
                ))}
            </div>

            {data.attendanceTrend && data.attendanceTrend.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-bold mb-4">Attendance Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data.attendanceTrend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip formatter={(v) => `${v}%`} />
                            <Line type="monotone" dataKey="percentage" stroke="#8b5cf6" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-lg shadow">
                    <h3 className="font-bold mb-3">Recent Announcements</h3>
                    {data.recentAnnouncements?.length > 0 ? (
                        <div className="space-y-2">
                            {data.recentAnnouncements.map((a, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                    <span className="font-medium">{a.title}</span>
                                    <span className="text-gray-500">{a.date}</span>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-gray-500">No announcements</p>}
                </div>

                <div className="bg-white p-5 rounded-lg shadow">
                    <h3 className="font-bold mb-3">Upcoming Events</h3>
                    {data.upcomingEvents?.length > 0 ? (
                        <div className="space-y-2">
                            {data.upcomingEvents.map((e, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                    <span className="font-medium">{e.title}</span>
                                    <span className="text-gray-500">{e.date}</span>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-gray-500">No events</p>}
                </div>
            </div>
        </div>
    );
};

const MyClassTab = ({ data }) => {
    if (!data) return <p className="text-gray-500 text-center py-8">No class assigned</p>;

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">{data.className}</h2>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <p className="text-sm text-gray-600">Total Students</p>
                    <p className="text-3xl font-bold">{data.students?.length || 0}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Average Score</p>
                    <p className="text-3xl font-bold">{data.avgScore || 0}%</p>
                </div>
            </div>
            <div className="mt-6">
                <h3 className="font-bold mb-3">Students</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.students?.map((s, i) => (
                        <div key={i} className="border p-4 rounded-lg">
                            <p className="font-semibold">{s.name}</p>
                            <p className="text-sm text-gray-600">Roll: {s.roll}</p>
                            <p className="text-sm">Score: {s.score}%</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

/* ==================== CLASSES I TEACH – DAY × TIME TABLE ==================== */
const TeachingClassesTab = ({ data }) => {
    if (!data || data.length === 0) {
        return <p className="text-gray-500 text-center py-8">No classes assigned</p>;
    }

    // ---------- 1. Build timetable { day → [slot,…] } ----------
    const timetable = {};
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    data.forEach(cls => {
        const className = `${cls.name} ${cls.section || ''}`.trim();

        cls.schedule?.forEach(s => {
            const day = s.day;
            if (!timetable[day]) timetable[day] = [];

            timetable[day].push({
                subject: s.subject,
                subjectCode: s.subjectCode || null,
                className,
                startTime: s.startTime,
                endTime: s.endTime,
                room: s.room || null,
            });
        });
    });

    // ---------- 2. Unique time slots ----------
    const timeSlots = Array.from(
        new Set(
            Object.values(timetable).flatMap(arr =>
                arr.map(s => `${s.startTime}-${s.endTime}`)
            )
        )
    )
        .sort()
        .map(t => {
            const [start, end] = t.split('-');
            return { start, end };
        });

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-purple-50 border-b">
                <h3 className="text-lg font-bold text-purple-900">Classes I Teach</h3>
                <p className="text-sm text-purple-700">Your teaching schedule by day and time</p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-purple-100">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">
                                Time
                            </th>
                            {days.map(d => (
                                <th
                                    key={d}
                                    className="px-4 py-3 text-center text-xs font-semibold text-purple-900 uppercase tracking-wider"
                                >
                                    {d.slice(0, 3)}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {timeSlots.map(({ start, end }) => (
                            <tr key={`${start}-${end}`} className="hover:bg-gray-50">
                                {/* Time column */}
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                                    <div>{start}</div>
                                    <div className="text-xs text-gray-500">down {end}</div>
                                </td>

                                {/* Day columns */}
                                {days.map(day => {
                                    const slots = timetable[day]?.filter(
                                        s => s.startTime === start && s.endTime === end
                                    ) || [];

                                    return (
                                        <td
                                            key={day}
                                            className="px-2 py-2 align-top min-h-[70px] text-xs"
                                        >
                                            {slots.length > 0 ? (
                                                <div className="space-y-1">
                                                    {slots.map((slot, i) => (
                                                        <div
                                                            key={i}
                                                            className="bg-gradient-to-r from-purple-100 to-purple-50 border border-purple-300 rounded p-2"
                                                        >
                                                            <p className="font-semibold text-purple-900">{slot.subject}</p>
                                                            {slot.subjectCode && (
                                                                <p className="text-purple-700">[ {slot.subjectCode} ]</p>
                                                            )}
                                                            <p className="font-medium text-purple-800">{slot.className}</p>
                                                            {slot.room && (
                                                                <p className="text-gray-600">Room: {slot.room}</p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-300">—</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Legend */}
            <div className="p-3 bg-gray-50 border-t text-xs text-gray-600 flex gap-4 flex-wrap">
                <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-purple-200 rounded"></div> Subject
                </span>
                <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-purple-300 rounded"></div> Class
                </span>
                <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gray-200 rounded"></div> Room
                </span>
            </div>
        </div>
    );
};

/* ==================== TIMETABLE TAB (UNCHANGED) ==================== */
const TimetableTab = ({ timetableData }) => {
    if (!timetableData || Object.keys(timetableData).length === 0) {
        return <p className="text-gray-500 text-center py-8">No timetable</p>;
    }

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const timeSlots = Array.from(
        new Set(
            Object.values(timetableData).flatMap((arr) =>
                arr.map((s) => `${s.startTime}-${s.endTime}`)
            )
        )
    )
        .sort()
        .map((t) => {
            const [start, end] = t.split("-");
            return { start, end };
        });

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 bg-purple-50 border-b">
                <h3 className="text-lg font-bold text-purple-900">My Teaching Timetable</h3>
                <p className="text-sm text-purple-700">Official school schedule</p>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-purple-100">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">
                                Time
                            </th>
                            {days.map((d) => (
                                <th
                                    key={d}
                                    className="px-4 py-3 text-center text-xs font-semibold text-purple-900 uppercase tracking-wider"
                                >
                                    {d.slice(0, 3)}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {timeSlots.map(({ start, end }) => (
                            <tr key={`${start}-${end}`} className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                                    <div>{start}</div>
                                    <div className="text-xs text-gray-500">down {end}</div>
                                </td>
                                {days.map((day) => {
                                    const slot = timetableData[day]?.find(
                                        (s) => s.startTime === start && s.endTime === end
                                    );
                                    return (
                                        <td
                                            key={day}
                                            className="px-2 py-2 align-top min-h-[70px] text-xs"
                                        >
                                            {slot ? (
                                                <div className="bg-gradient-to-r from-purple-100 to-purple-50 border border-purple-300 rounded p-2">
                                                    <p className="font-semibold text-purple-900">{slot.subject}</p>
                                                    {slot.subjectCode && (
                                                        <p className="text-purple-700">[ {slot.subjectCode} ]</p>
                                                    )}
                                                    <p className="font-medium text-purple-800">{slot.className}</p>
                                                    {slot.room && (
                                                        <p className="text-gray-600">Room: {slot.room}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-gray-300">—</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-3 bg-gray-50 border-t text-xs text-gray-600 flex gap-4 flex-wrap">
                <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-purple-200 rounded"></div> Subject
                </span>
                <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-purple-300 rounded"></div> Class
                </span>
                <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gray-200 rounded"></div> Room
                </span>
            </div>
        </div>
    );
};

const AnnouncementsTab = ({ data }) => {
    if (!data || data.length === 0) return <p className="text-gray-500 text-center py-8">No announcements</p>;

    return (
        <div className="space-y-4">
            {data.map((a, i) => (
                <div key={i} className="bg-white p-5 rounded-lg shadow border-l-4 border-yellow-500">
                    <h4 className="font-bold">{a.title}</h4>
                    <p className="text-sm text-gray-500">{a.date}</p>
                    <p className="mt-2">{a.content}</p>
                </div>
            ))}
        </div>
    );
};

const EventsTab = ({ data }) => {
    if (!data || data.length === 0) return <p className="text-gray-500 text-center py-8">No events</p>;

    return (
        <div className="grid md:grid-cols-2 gap-4">
            {data.map((e, i) => (
                <div key={i} className="bg-white p-5 rounded-lg shadow border-l-4 border-green-500">
                    <h4 className="font-bold">{e.title}</h4>
                    <p className="text-sm text-gray-500">{e.date}</p>
                    <p className="mt-2">{e.description}</p>
                </div>
            ))}
        </div>
    );
};

const ExamsTab = ({ data }) => {
    if (!data || data.length === 0) return <p className="text-gray-500 text-center py-8">No exams</p>;

    return (
        <div className="space-y-4">
            {data.map((e, i) => (
                <div key={i} className="bg-white p-5 rounded-lg shadow border-l-4 border-blue-500">
                    <h4 className="font-bold">{e.title}</h4>
                    <p className="text-sm text-gray-600">
                        {e.className} • {e.subjects?.length || 0} subjects • {e.date}
                    </p>
                </div>
            ))}
        </div>
    );
};