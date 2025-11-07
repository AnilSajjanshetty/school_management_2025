// components/ClassTeacherDashboard/CTOverviewTab.jsx
import React from 'react';
import { Users, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const stats = [
    { label: "Total Students", key: "totalStudents", icon: Users, color: "from-purple-500 to-purple-600" },
    { label: "Avg Attendance", key: "avgAttendance", icon: CheckCircle, color: "from-green-500 to-green-600", unit: "%" },
    { label: "Pending Tasks", key: "pendingTasks", icon: AlertCircle, color: "from-yellow-500 to-yellow-600" },
    { label: "Exams Scheduled", key: "examsScheduled", icon: FileText, color: "from-blue-500 to-blue-600" },
];

export const CTOverviewTab = ({ data }) => {
    if (!data) return <p className="text-gray-500 text-center py-8">No data available</p>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.key} className={`bg-gradient-to-br ${stat.color} text-white p-5 rounded-lg shadow`}>
                        <stat.icon className="w-8 h-8 mb-2" />
                        <p className="text-sm opacity-90">{stat.label}</p>
                        <p className="text-2xl font-bold">{data[stat.key] || 0}{stat.unit}</p>
                    </div>
                ))}
            </div>

            {data.attendanceTrend?.length > 0 && (
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
                                <div key={i} className="flex justify-between text-sm">
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
                                <div key={i} className="flex justify-between text-sm">
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