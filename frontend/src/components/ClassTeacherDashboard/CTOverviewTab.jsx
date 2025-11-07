// components/ClassTeacherDashboard/CTOverviewTab.jsx
import React from 'react';
import {
    Users,
    CheckCircle,
    AlertCircle,
    FileText,
    Megaphone,
    Calendar,
    TrendingUp,
    Mail, Clock
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';

const stats = [
    { label: 'Total Students', key: 'totalStudents', icon: Users, color: 'from-violet-500 to-purple-600' },
    { label: 'Avg Attendance', key: 'avgAttendance', icon: CheckCircle, color: 'from-emerald-500 to-teal-600', unit: '%' },
    { label: 'Pending Tasks', key: 'pendingTasks', icon: AlertCircle, color: 'from-amber-500 to-orange-600' },
    { label: 'Exams Scheduled', key: 'examsScheduled', icon: FileText, color: 'from-sky-500 to-blue-600' },
];

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
};

const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({
        opacity: 1,
        x: 0,
        transition: { delay: i * 0.1, duration: 0.4 },
    }),
};

export const CTOverviewTab = ({ data }) => {
    if (!data) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-400 animate-pulse">Loading dashboard...</div>
            </div>
        );
    }

    const totalStudents = data.totalStudents ?? 0;
    const avgAttendance = data.avgAttendance ?? 0;
    const pendingTasks = data.pendingTasks ?? 0;
    const examsScheduled = data.examsScheduled ?? 0;
    const attendanceTrend = data.attendanceTrend ?? [];
    const recentAnnouncements = data.recentAnnouncements ?? [];
    const upcomingEvents = data.upcomingEvents ?? [];
    const recentMessages = []

    return (
        <div className="space-y-8 p-1">
            {/* ===== STAT CARDS – GLASSMORPHISM + GLOW ===== */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((s, i) => {
                    const value =
                        s.key === 'totalStudents' ? totalStudents :
                            s.key === 'avgAttendance' ? avgAttendance :
                                s.key === 'pendingTasks' ? pendingTasks :
                                    s.key === 'examsScheduled' ? examsScheduled : 0;

                    return (
                        <motion.div
                            key={s.key}
                            custom={i}
                            initial="hidden"
                            animate="visible"
                            whileHover="hover"
                            variants={cardVariants}
                            className="relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl"></div>
                            <div className={`relative bg-gradient-to-br ${s.color} p-6 rounded-2xl text-white overflow-hidden`}>
                                <div className="flex items-center justify-between">
                                    <div className="z-10">
                                        <p className="text-sm font-medium opacity-90">{s.label}</p>
                                        <p className="text-4xl font-bold mt-1 tracking-tight">
                                            {value}{s.unit ?? ''}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                                        <s.icon className="w-8 h-8" />
                                    </div>
                                </div>
                                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* ===== ATTENDANCE CHART – PREMIUM STYLE ===== */}
            {attendanceTrend.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 p-6"
                >
                    <div className="flex items-center gap-2 mb-5">
                        <TrendingUp className="w-6 h-6 text-violet-600" />
                        <h3 className="text-xl font-bold text-gray-800">Attendance Trend</h3>
                        <span className="ml-auto text-sm text-gray-500">
                            Last {attendanceTrend.length} days
                        </span>
                    </div>

                    <ResponsiveContainer width="100%" height={320}>
                        <LineChart data={attendanceTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="4 6" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="date"
                                tick={{ fill: '#6b7280', fontSize: 13 }}
                                axisLine={{ stroke: '#e5e7eb' }}
                            />
                            <YAxis
                                domain={[0, 100]}
                                tick={{ fill: '#6b7280', fontSize: 13 }}
                                axisLine={{ stroke: '#e5e7eb' }}
                                ticks={[0, 25, 50, 75, 100]}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                    fontSize: '14px',
                                }}
                                labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                                formatter={(v) => <span className="text-violet-600 font-bold">{v}%</span>}
                            />
                            <Line
                                type="monotone"
                                dataKey="percentage"
                                stroke="url(#colorGradient)"
                                strokeWidth={4}
                                dot={{ fill: '#8b5cf6', r: 6, strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 8, stroke: '#8b5cf6', strokeWidth: 3 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>
            )}

            {/* ===== RECENT ANNOUNCEMENTS, EVENTS, MESSAGES ===== */}
            <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-6 mt-8">

                {/* RECENT ANNOUNCEMENTS */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <Megaphone className="h-6 w-6 text-indigo-600" />
                            Recent Announcements
                        </h3>
                    </div>
                    {recentAnnouncements.length > 0 ? (
                        <div className="space-y-4">
                            {recentAnnouncements.map((ann, i) => (
                                <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                        <Megaphone className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800">{ann.title}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {ann.date}
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
                            <Calendar className="h-6 w-6 text-blue-600" />
                            Upcoming Events
                        </h3>
                    </div>
                    {upcomingEvents.length > 0 ? (
                        <div className="space-y-4">
                            {upcomingEvents.map((evt, i) => (
                                <div key={i} className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                        <Calendar className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800">{evt.title}</p>
                                        <p className="text-xs text-blue-600 font-medium mt-1">
                                            {evt.date}
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
                    </div>
                    {recentMessages && recentMessages?.length > 0 ? (
                        <div className="space-y-4">
                            {recentMessages?.map((msg, i) => (
                                <div key={i} className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-purple-700">
                                        {msg.studentName?.charAt(0) || 'S'}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800">{msg.studentName || 'Unknown'}</p>
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{msg.message}</p>
                                        <div className="flex items-center gap-2 mt-2 text-xs">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${msg.type === 'feedback' ? 'bg-green-100 text-green-700' :
                                                msg.type === 'complaint' ? 'bg-red-100 text-red-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                {msg.type || 'general'}
                                            </span>
                                            <span className="text-gray-500">
                                                {msg.time || new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
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
        </div>
    );
};