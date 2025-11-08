// pages/HeadmasterDashboardPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "../components/Modal";
import { CreateClassForm } from "../components/Forms/CreateClassForm";
import { AnnouncementForm } from "../components/Forms/AnnouncementForm";
import { EventForm } from "../components/Forms/EventForm";
import { ExamForm } from "../components/Forms/ExamForm";
import { TimetableCreator } from "../components/Forms/TimetableCreator";
import { AddTeacherForm } from "../components/Forms/AddTeacherForm";
import { AddStudentForm } from "../components/Forms/AddStudentForm";
import { Menu } from "lucide-react";
import axiosInstance from "../config/axiosInstance";

// Import all dashboard components
import { HOverview } from "../components/HeadmasterDashboard/HOverview";
import { HClasses } from "../components/HeadmasterDashboard/HClasses";
import { HClassDetails } from "../components/HeadmasterDashboard/HClassDetails";
import { HTeachers } from "../components/HeadmasterDashboard/HTeachers";
import { HAnnouncements } from "../components/HeadmasterDashboard/HAnnoucements";
import { HEvents } from "../components/HeadmasterDashboard/HEvents";
import { HExams } from "../components/HeadmasterDashboard/HExams";
import { HTestimonials } from "../components/HeadmasterDashboard/HTestimonials";
import { HContactMessages } from "../components/HeadmasterDashboard/HContactMessages";
import { HSideNavbar } from "../components/HeadmasterDashboard/HSideNavbar";
import { HTimetables } from "../components/HeadmasterDashboard/HTimetables";

export const HeadmasterDashboard = ({ onLogout }) => {
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

    // View & Selection States
    const [view, setView] = useState("overview");
    const [selectedClassId, setSelectedClassId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Modal States
    const [showAddClass, setShowAddClass] = useState(false);
    const [showAnnForm, setShowAnnForm] = useState(false);
    const [showEventForm, setShowEventForm] = useState(false);
    const [showExamForm, setShowExamForm] = useState(false);
    const [showTTForm, setShowTTForm] = useState(false);
    const [showTeacherForm, setShowTeacherForm] = useState(false);
    const [showStudentForm, setShowStudentForm] = useState(false);

    // Selected class for detail view
    const selectedClass = classes.find(c => c.id === selectedClassId) || null;
    const classStudents = students.filter(s => s.classId === selectedClassId);

    // Fetch Data
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    classRes, studentRes, teacherRes, attendanceRes,
                    announcementRes, eventRes, testimonialRes, timetableRes,
                    examRes, examResultRes, contactRes
                ] = await Promise.all([
                    axiosInstance.get("/classes").catch(() => ({ data: [] })),
                    axiosInstance.get("/students").catch(() => ({ data: [] })),
                    axiosInstance.get("/teachers").catch(() => ({ data: [] })),
                    axiosInstance.get("/attendance/all-classes").catch(() => ({ data: [] })),
                    axiosInstance.get("/announcements").catch(() => ({ data: [] })),
                    axiosInstance.get("/events").catch(() => ({ data: [] })),
                    axiosInstance.get("/testimonials").catch(() => ({ data: [] })),
                    axiosInstance.get("/timetables/all-classes").catch(() => ({ data: [] })),
                    axiosInstance.get("/exams").catch(() => ({ data: [] })),
                    axiosInstance.get("/progress").catch(() => ({ data: [] })),
                    axiosInstance.get("/contactMessage").catch(() => ({ data: [] })),
                ]);

                setClasses(classRes.data || []);
                setStudents(studentRes.data || []);
                setTeachers(teacherRes.data || []);
                setAttendance(attendanceRes.data || []);
                setAnnouncements(announcementRes.data || []);
                setEvents(eventRes.data || []);
                setTestimonials(testimonialRes.data || []);
                setTimetables(timetableRes.data.data || []);
                setExams(examRes.data || []);
                setExamResults(examResultRes.data || []);
                setContactMessages(contactRes.data || []);
            } catch (err) {
                console.error("Dashboard load error:", err);
                setError("Failed to load data.");
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    // CRUD Handlers
    const addClass = (cls) => setClasses(prev => [...prev, { ...cls, id: Date.now().toString() }]);
    const removeClass = (id) => setClasses(prev => prev.filter(c => c.id !== id));

    const addStudent = (student) => setStudents(prev => [...prev, { ...student, id: Date.now().toString() }]);
    const removeStudent = (id) => setStudents(prev => prev.filter(s => s.id !== id));

    const addTeacher = (teacher) => setTeachers(prev => [...prev, { ...teacher, id: Date.now().toString() }]);
    const removeTeacher = (id) => setTeachers(prev => prev.filter(t => t.id !== id));

    const addAnnouncement = (ann) => setAnnouncements(prev => [...prev, { ...ann, id: Date.now().toString() }]);
    const addEvent = (evt) => setEvents(prev => [...prev, { ...evt, id: Date.now().toString() }]);
    const createExam = (exam) => setExams(prev => [...prev, { ...exam, id: Date.now().toString() }]);
    const createTimetable = (tt) => setTimetables(prev => [...prev, { ...tt, id: Date.now().toString() }]);
    const addTestimonial = (t) => setTestimonials(prev => [...prev, { ...t, id: Date.now().toString() }]);

    const classClick = (id) => {
        setSelectedClassId(id);
        setView("classDetail");
    };

    const closeSidebar = () => setIsSidebarOpen(false);

    const user = { name: "Anil", avatar: "img.png" };

    if (loading) return <div className="text-center p-10">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-10">{error}</div>;

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={closeSidebar} />
            )}

            {/* Sidebar */}
            <HSideNavbar
                setView={setView}
                setSelectedClassId={setSelectedClassId}
                closeSidebar={closeSidebar}
                view={view}
                user={user}
                isSidebarOpen={isSidebarOpen}
                onLogout={onLogout}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header */}
                <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
                    <button onClick={() => setIsSidebarOpen(true)} className="text-gray-700">
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="font-bold text-lg text-gray-800">Headmaster</h1>
                    <div className="w-6" />
                </div>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    {view === "overview" && (
                        <HOverview
                            classes={classes}
                            students={students}
                            teachers={teachers}
                            events={events}
                            announcements={announcements}
                            contactMessages={contactMessages?.data}
                            testimonials={testimonials}
                            attendance={attendance}
                            exams={exams}
                            examResults={examResults}
                        />
                    )}

                    {view === "classes" && (
                        <HClasses
                            classes={classes}
                            onAddClick={() => setShowAddClass(true)}
                            onClassClick={classClick}
                            onRemove={removeClass}
                        />
                    )}

                    {view === "classDetail" && selectedClass && (
                        <HClassDetails
                            selectedClass={selectedClass}
                            classStudents={classStudents}
                            onAddStudent={() => setShowStudentForm(true)}
                            onCreateExam={() => setShowExamForm(true)}
                            onCreateTimetable={() => setShowTTForm(true)}
                            onRemoveStudent={removeStudent}
                        />
                    )}

                    {view === "teachers" && (
                        <HTeachers
                            teachers={teachers}
                            onAddClick={() => setShowTeacherForm(true)}
                            onRemove={removeTeacher}
                        />
                    )}

                    {view === "announcements" && (
                        <HAnnouncements
                            announcements={announcements}
                            onAddClick={() => setShowAnnForm(true)}
                        />
                    )}

                    {view === "events" && (
                        <HEvents
                            events={events}
                            onAddClick={() => setShowEventForm(true)}
                        />
                    )}

                    {view === "exams" && (
                        <HExams
                            exams={exams}
                            classes={classes}
                            onAddClick={() => setShowExamForm(true)}
                        />
                    )}
                    {view === "timetables" && (
                        <HTimetables timetables={timetables} onAddClick={() => setShowTTForm(true)} />
                    )}
                    {view === "testimonials" && (
                        <HTestimonials
                            testimonials={testimonials}
                            onAddClick={() => addTestimonial({ content: "Great!", author: "Parent" })}
                        />
                    )}

                    {view === "contacts" && (
                        <HContactMessages contactMessages={contactMessages?.data} />
                    )}
                </main>
            </div>

            {/* MODALS */}
            <Modal open={showAddClass} title="Create Class" onClose={() => setShowAddClass(false)}>
                <CreateClassForm onCreate={(c) => { addClass(c); setShowAddClass(false); }} onClose={() => setShowAddClass(false)} />
            </Modal>

            <Modal open={showAnnForm} title="Create Announcement" onClose={() => setShowAnnForm(false)}>
                <AnnouncementForm classes={classes} teachers={teachers} onCreate={(a) => { addAnnouncement(a); setShowAnnForm(false); }} onClose={() => setShowAnnForm(false)} />
            </Modal>

            <Modal open={showEventForm} title="Create Event" onClose={() => setShowEventForm(false)}>
                <EventForm onCreate={(e) => { addEvent(e); setShowEventForm(false); }} onClose={() => setShowEventForm(false)} />
            </Modal>

            <Modal open={showStudentForm} title="Add Student" onClose={() => setShowStudentForm(false)}>
                <AddStudentForm classes={classes} onCreate={(s) => { addStudent(s); setShowStudentForm(false); }} onClose={() => setShowStudentForm(false)} />
            </Modal>

            <Modal open={showExamForm} title="Create Exam" onClose={() => setShowExamForm(false)}>
                <ExamForm
                    classes={classes}
                    onCreate={(e) => {
                        const cls = classes.find(c => c.id === e.classId);
                        createExam({ ...e, className: cls?.name });
                        setShowExamForm(false);
                    }}
                    onClose={() => setShowExamForm(false)}
                />
            </Modal>

            <Modal open={showTTForm} title="Create Timetable" onClose={() => setShowTTForm(false)}>
                <TimetableCreator
                    classes={classes}
                    teachers={teachers}
                    onCreate={(t) => {
                        const cls = classes.find(c => c.id === t.classId);
                        createTimetable({ ...t, className: cls?.name });
                        setShowTTForm(false);
                    }}
                />
            </Modal>

            <Modal open={showTeacherForm} title="Add Teacher" onClose={() => setShowTeacherForm(false)}>
                <AddTeacherForm onCreate={(t) => { addTeacher(t); setShowTeacherForm(false); }} onClose={() => setShowTeacherForm(false)} />
            </Modal>
        </div>
    );
};