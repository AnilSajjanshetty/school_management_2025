// src/pages/TeacherDashboard.jsx
import reaact, { useState, useEffect, useMemo } from "react";
import TSidebar from "../components/teacherDashboard/TSidebar";
import THeader from "../components/teacherDashboard/THeader";
import TOverviewTab from "../components/teacherDashboard/TOverviewTab";
import TClassesTab from "../components/teacherDashboard/TClassesTab";
import TTimetableTab from "../components/teacherDashboard/TTimetableTab";
import TAnnouncementsTab from "../components/teacherDashboard/TAnnouncementsTab";
import TEventsTab from "../components/teacherDashboard/TEventsTab";
import TExamsTab from "../components/teacherDashboard/TExamsTab";
import TContactTab from "../components/teacherDashboard/TContactTab";
import { Modal } from "../components/Modal";
import { AnnouncementForm } from "../components/Forms/AnnouncementForm";
import { EventForm } from "../components/Forms/EventForm";
import { AddContactMessageForm } from "../components/Forms/AddContactMessageForm";
import { AddProgressForm } from "../components/Forms/AddProgressForm";
import axiosInstance from "../config/axiosInstance";

export const TeacherDashboard = ({ onLogout }) => {
    // === State ===
    const [user, setUser] = useState(null);
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [events, setEvents] = useState([]);
    const [exams, setExams] = useState([]);
    const [contactMessages, setContactMessages] = useState([]);
    const [attendance, setAttendance] = useState({}); // { classId: [...] }
    const [teacherTimetables, setTeacherTimetables] = useState([]);
    const [dashboardLoading, setDashboardLoading] = useState(true);

    // UI States
    const [activeTab, setActiveTab] = useState("overview");
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedExam, setSelectedExam] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Modals
    const [showAnnForm, setShowAnnForm] = useState(false);
    const [showEventForm, setShowEventForm] = useState(false);
    const [showContactForm, setShowContactForm] = useState(false);
    const [showProgress, setShowProgress] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [statistics, setStatistics] = useState({});

    // === Fetch Dashboard Data ===
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            setDashboardLoading(false);
            return;
        }

        const fetchDashboardData = async () => {
            setDashboardLoading(true);
            try {
                const response = await axiosInstance.get(`/teachers/dashboard/${userId}`);
                const data = response.data;

                setUser({
                    id: data.teacher.id,
                    name: data.teacher.name || "Teacher",
                    email: data.teacher.email,
                    phone: data.teacher.phone,
                    subjects: data.teacher.subjects || [],
                    avatar: data.teacher.name?.charAt(0)?.toUpperCase() || "T",
                });

                setClasses(data.classes || []);
                setStudents(data.students || []);
                setAnnouncements(data.announcements || []);
                setEvents(data.events || []);
                setExams(data.exams || []);
                setContactMessages(data.contactMessages || []);
                setAttendance(data.attendance || {}); // { classId: [...] }
                setTeacherTimetables(data.timetable ? [data.timetable] : []);
                setStatistics(data.statistics || {});
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setDashboardLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // === FIXED: Get teacher's classes using classTeacherId or subjectTeachers ===
    const teacherClasses = useMemo(() => {
        if (!user?.id || !classes.length) return [];

        return classes.filter(cls => {
            const isClassTeacher = cls.classTeacherId === user.id;
            const teachesSubject = cls.subjectTeachers?.some(st => st.teacherId === user.id);
            return isClassTeacher || teachesSubject;
        });
    }, [classes, user?.id]);

    // Auto-select first class
    useEffect(() => {
        if (teacherClasses.length > 0 && !selectedClass) {
            setSelectedClass(teacherClasses[0]);
        }
    }, [teacherClasses, selectedClass]);

    // === Handlers ===
    const handleAddAnnouncement = async (announcement) => {
        try {
            const { data } = await axiosInstance.post("/announcements", {
                ...announcement,
                visibility: `class:${selectedClass?.id}`,
            });
            setAnnouncements(prev => [...prev, data]);
            setShowAnnForm(false);
        } catch (error) {
            console.error("Failed to create announcement:", error);
        }
    };

    const handleAddEvent = async (eventData) => {
        try {
            const { data } = await axiosInstance.post("/events", {
                ...eventData,
                classId: selectedClass?.id,
            });
            setEvents(prev => [...prev, data]);
            setShowEventForm(false);
        } catch (error) {
            console.error("Failed to create event:", error);
        }
    };

    const handleAddContactMessage = async (messageData) => {
        try {
            const { data } = await axiosInstance.post("/contact", {
                ...messageData,
                date: new Date().toISOString(),
            });
            setContactMessages(prev => [...prev, data]);
            setShowContactForm(false);
        } catch (error) {
            console.error("Failed to send contact message:", error);
        }
    };

    const handleAddProgress = async (progressData) => {
        try {
            const { data } = await axiosInstance.post("/progress", {
                ...progressData,
                studentId: selectedStudent.id,
            });
            setShowProgress(false);
        } catch (error) {
            console.error("Failed to add progress:", error);
        }
    };

    // === Render Tab Content ===
    const renderTabContent = () => {
        if (dashboardLoading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            );
        }

        if (teacherClasses.length === 0) {
            return (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-6 rounded-lg text-center">
                    <p className="text-lg font-semibold mb-2">No Classes Assigned</p>
                    <p className="text-sm">Contact your admin to assign you as a class teacher or subject teacher.</p>
                </div>
            );
        }

        const commonProps = {
            teacherClasses,
            students,
            attendance: attendance[selectedClass?.id] || [],
            contactMessages,
            events,
            announcements,
            selectedClass,
            setSelectedClass,
            selectedExam,
            setSelectedExam,
            exams,
            setSelectedStudent,
            setShowProgress,
        };

        switch (activeTab) {
            case "overview":
                return (
                    <TOverviewTab
                        {...commonProps}
                        onAddEvent={() => setShowEventForm(true)}
                        onAddAnnouncement={() => setShowAnnForm(true)}
                        onAddContact={() => setShowContactForm(true)}
                        statistics={statistics}
                    />
                );
            case "classes":
                return <TClassesTab {...commonProps} />;
            case "timetables":
                return <TTimetableTab teacherTimetables={teacherTimetables} user={user} classes={classes} />;
            case "announcements":
                return <TAnnouncementsTab announcements={announcements} teacherClasses={teacherClasses} onAdd={() => setShowAnnForm(true)} />;
            case "events":
                return <TEventsTab events={events} teacherClasses={teacherClasses} onAdd={() => setShowEventForm(true)} />;
            case "exams":
                return <TExamsTab exams={exams} teacherClasses={teacherClasses} />;
            case "contacts":
                return <TContactTab contactMessages={contactMessages} onAdd={() => setShowContactForm(true)} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* === SIDEBAR: ALWAYS VISIBLE === */}
            <TSidebar
                user={user}
                teacherClasses={teacherClasses}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setSelectedClass={setSelectedClass}
                setSelectedExam={setSelectedExam}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                onLogout={onLogout}
            />

            {/* === MAIN CONTENT === */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <THeader title="Teacher Dashboard" onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-gray-50">
                    {renderTabContent()}
                </main>
            </div>

            {/* === MODALS === */}
            <Modal open={showAnnForm} title="Create Announcement" onClose={() => setShowAnnForm(false)}>
                <AnnouncementForm onCreate={handleAddAnnouncement} onClose={() => setShowAnnForm(false)} />
            </Modal>

            <Modal open={showEventForm} title="Create Event" onClose={() => setShowEventForm(false)}>
                <EventForm onCreate={handleAddEvent} onClose={() => setShowEventForm(false)} />
            </Modal>

            <Modal open={showContactForm} title="Send Message" onClose={() => setShowContactForm(false)}>
                <AddContactMessageForm onCreate={handleAddContactMessage} onClose={() => setShowContactForm(false)} />
            </Modal>

            <Modal
                open={showProgress}
                title={selectedStudent ? `Add Progress - ${selectedStudent.name}` : ""}
                onClose={() => setShowProgress(false)}
            >
                <AddProgressForm
                    student={selectedStudent}
                    exams={exams}
                    onAdd={handleAddProgress}
                    onClose={() => setShowProgress(false)}
                />
            </Modal>
        </div>
    );
};