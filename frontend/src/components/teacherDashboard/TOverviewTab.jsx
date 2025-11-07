// src/components/teacherDashboard/TOverviewTab.jsx
import React from "react";
import TSummaryCards from "./TSummaryCards";
import TAttendanceChart from "./TAttendanceChart";
import TExamMarksChart from "./TExamMarksChart";
import TUpcomingEventsCard from "./TUpcomingEventsCard";
import TRecentAnnouncementsCard from "./TRecentAnnouncementsCard";
import TContactMessagesCard from "./TContactMessagesCard";
import TMessagePieChart from "./TMessagePieChart";

export default function TOverviewTab({
    teacherClasses, students, attendance, contactMessages, events, announcements,
    selectedClass, setSelectedClass, selectedExam, setSelectedExam, exams, examResults,
    onAddEvent, onAddAnnouncement, onAddContact
}) {
    const totalStudents = students.filter(s => teacherClasses.some(c => c.id === s.classId)).length;
    const avgAttendance = attendance.length > 0
        ? Math.round(attendance.reduce((a, b) => a + (b.total > 0 ? b.present / b.total : 0), 0) / attendance.length * 100)
        : 0;
    const complaints = contactMessages.filter(m => m.type === "complaint").length;
    const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).slice(0, 3);
    const recentAnnouncements = announcements.slice(0, 3);
    const recentMessages = contactMessages.slice(0, 3);

    return (
        <div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8 text-gray-800">Overview</h2>
            <TSummaryCards totalStudents={totalStudents} avgAttendance={avgAttendance} complaints={complaints} upcomingEvents={upcomingEvents.length} />
            <div className="grid lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
                <TAttendanceChart attendance={attendance} selectedClass={selectedClass} setSelectedClass={setSelectedClass} teacherClasses={teacherClasses} />
                <TExamMarksChart examResults={examResults} selectedClass={selectedClass} selectedExam={selectedExam} setSelectedClass={setSelectedClass} setSelectedExam={setSelectedExam} exams={exams} teacherClasses={teacherClasses} />
            </div>
            <div className="grid lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
                <TUpcomingEventsCard events={upcomingEvents} onAdd={onAddEvent} />
                <TRecentAnnouncementsCard announcements={recentAnnouncements} onAdd={onAddAnnouncement} />
            </div>
            <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
                <TContactMessagesCard messages={recentMessages} onAdd={onAddContact} />
                <TMessagePieChart contactMessages={contactMessages} />
            </div>
        </div>
    );
}