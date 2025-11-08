// components/HeadmasterDashboard/HOverview.jsx
import React, { useMemo } from "react";
import { HSummaryCards } from "./HSummaryCards";
import { HUpcomingEvents } from "./HUpcomingEvents";
import { HRecentAnnouncements } from "./HRecentAnnouncements";
import { HRecentMessages } from "./HRecentMessages";
import { HMessageBreakdown } from "./HMessageBreakdown";
import AttendanceSection from "../graph/AttendanceSection";
import ExamPerformance from "../graph/ExamPerformance";

export const HOverview = ({
    classes, students, teachers, events, announcements,
    contactMessages, testimonials, attendance, exams, examResults
}) => {
    const upcomingEvents = useMemo(() => {
        const today = new Date().toISOString().split("T")[0];
        return events
            .filter(e => e.date >= today)
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(0, 3);
    }, [events]);

    const recentAnnouncements = useMemo(() => {
        return [...announcements]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);
    }, [announcements]);

    const contactStats = useMemo(() => {
        const stats = { feedback: 0, complaint: 0, inquiry: 0 };
        contactMessages?.forEach(m => m.type && stats[m.type] !== undefined && stats[m.type]++);
        return stats;
    }, [contactMessages]);

    return (
        <div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8 text-gray-800">Dashboard Overview</h2>

            <HSummaryCards
                totalClasses={classes.length}
                totalStudents={students.length}
                totalTeachers={teachers.length}
                upcomingEvents={upcomingEvents.length}
                complaints={contactStats.complaint}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
                <HUpcomingEvents events={upcomingEvents} />
                <HRecentMessages messages={contactMessages.slice(0, 3)} />
                <HRecentAnnouncements announcements={recentAnnouncements} />
                <HMessageBreakdown contactStats={contactStats} />
            </div>

            <div className="bg-white p-4 lg:p-6 rounded-xl shadow mb-6 lg:mb-8">
                <h3 className="text-lg lg:text-xl font-bold text-indigo-700 mb-4">Parent Testimonials</h3>
                {testimonials.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {testimonials.slice(0, 4).map(t => (
                            <div key={t.id} className="bg-gray-50 p-4 rounded-lg italic text-gray-700 text-sm lg:text-base">
                                "{t.content || t.message}"
                                <p className="mt-2 font-bold not-italic text-indigo-600 text-xs lg:text-sm">— {t.author || t.parent}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic text-sm">No testimonials yet.</p>
                )}
            </div>

            <div className="bg-white p-4 lg:p-6 rounded-xl shadow mb-6 lg:mb-8">
                <h3 className="text-lg lg:text-xl font-bold text-indigo-700">
                    Attendance Trend
                </h3>
                <AttendanceSection attendanceRecords={attendance} classes={classes} />
            </div>

            <div className="bg-white p-4 lg:p-6 rounded-xl shadow">
                <h3 className="text-lg lg:text-xl font-bold text-amber-700 mb-5">Exam Performance</h3>
                <ExamPerformance exams={exams} classes={classes} />
            </div>
        </div>
    );
};