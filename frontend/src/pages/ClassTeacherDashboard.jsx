import React, { useState, useEffect } from 'react';
import { Menu, Bell } from 'lucide-react';
import axiosInstance from '../config/axiosInstance';

// Components
import { CTSideNavbar } from '../components/ClassTeacherDashboard/CTSideNavbar';
import { CTOverviewTab } from '../components/ClassTeacherDashboard/CTOverviewTab';
import { CTMyClassTab } from '../components/ClassTeacherDashboard/CTMyClassTab';
import { CTTeachingClassesTab } from '../components/ClassTeacherDashboard/CTTeachingClassesTab';
import { CTTimetableTab } from '../components/ClassTeacherDashboard/CTTimetableTab';
import { CTAnnouncementsTab } from '../components/ClassTeacherDashboard/CTAnnouncementsTab';
import { CTEventsTab } from '../components/ClassTeacherDashboard/CTEventsTab';
import { CTExamsTab } from '../components/ClassTeacherDashboard/CTExamsTab';
import { CTLoadingState } from '../components/ClassTeacherDashboard/CTLoadingState';
import { CTErrorState } from '../components/ClassTeacherDashboard/CTErrorState';
import { CTHeader } from '../components/ClassTeacherDashboard/CTHeader';
import { CTMessages } from '../components/ClassTeacherDashboard/CTMessagesTab';

export const ClassTeacherDashboard = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = localStorage.getItem("userId");

    const [dashboardData, setDashboardData] = useState(null);
    const [myClassData, setMyClassData] = useState(null);
    const [teachingClassesData, setTeachingClassesData] = useState([]);
    const [timetableData, setTimetableData] = useState({});
    const [announcementsData, setAnnouncementsData] = useState([]);
    const [eventsData, setEventsData] = useState([]);
    const [examsData, setExamsData] = useState([]);

    // Fetchers
    const fetchers = {
        overview: async () => {
            const res = await axiosInstance.get(`/classTeacher/dashboard/${userId}`);
            setDashboardData(res.data);
        },
        myclass: async () => {
            const res = await axiosInstance.get(`/classTeacher/my-class/${userId}`);
            setMyClassData(res.data);
        },
        teaching: async () => {
            const res = await axiosInstance.get(`/classTeacher/teaching-classes/${userId}`);
            setTeachingClassesData(res.data);
        },
        timetables: async () => {
            const res = await axiosInstance.get(`/classTeacher/timetable/${userId}`);
            setTimetableData(res.data);
        },
        announcements: async () => {
            const res = await axiosInstance.get('/classTeacher/announcements');
            setAnnouncementsData(res.data);
        },
        events: async () => {
            const res = await axiosInstance.get('/classTeacher/events');
            setEventsData(res.data);
        },
        exams: async () => {
            const res = await axiosInstance.get(`/classTeacher/exams/${userId}`);
            setExamsData(res.data);
        },
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            await fetchers[activeTab]?.();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab, userId]);

    const retry = () => fetchData();

    const renderContent = () => {
        if (loading) return <CTLoadingState />;
        if (error) return <CTErrorState error={error} onRetry={retry} />;

        switch (activeTab) {
            case 'overview': return <CTOverviewTab data={dashboardData} />;
            case 'myclass': return <CTMyClassTab data={myClassData} />;
            case 'teaching': return <CTTeachingClassesTab data={teachingClassesData} />;
            case 'timetables': return <CTTimetableTab timetableData={timetableData} />;
            case 'announcements': return <CTAnnouncementsTab data={announcementsData} />;
            case 'events': return <CTEventsTab data={eventsData} />;
            case 'exams': return <CTExamsTab data={examsData} />;
            case 'messages': return <CTMessages userId={userId} />;
            default: return null;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <CTSideNavbar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                user={dashboardData?.user}
                myClass={dashboardData?.myClass}
                teachingCount={dashboardData?.teachingClasses?.length || 0}
                onLogout={onLogout}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <CTHeader
                    activeTab={activeTab}
                    onMenuClick={() => setIsSidebarOpen(true)}
                />
                <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-gray-50">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};
