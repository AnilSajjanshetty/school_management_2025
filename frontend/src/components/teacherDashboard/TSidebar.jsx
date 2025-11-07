// src/components/teacherDashboard/TSidebar.jsx
import React from "react";
import { Menu, X } from "lucide-react";

const navItems = [
    { id: "overview", label: "Overview" },
    { id: "classes", label: "Classes" },
    { id: "timetables", label: "My Schedule" },
    { id: "announcements", label: "Announcements" },
    { id: "events", label: "Events" },
    { id: "exams", label: "Exams" },
    { id: "contacts", label: "Contact Messages" },
];

export default function TSidebar({
    user,
    teacherClasses,
    activeTab,
    setActiveTab,
    setSelectedClass,
    setSelectedExam,
    isOpen,
    setIsOpen,
    onLogout,
}) {
    const handleTabClick = (tab) => {
        setActiveTab(tab);
        if (tab !== "classes") {
            setSelectedClass(null);
            setSelectedExam(null);
        }
        setIsOpen(false);
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 bg-green-800 text-white
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex flex-col
        `}
            >
                {/* Header */}
                <div className="p-4 lg:p-6 border-b border-green-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-600 rounded-full w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center font-bold text-base lg:text-lg">
                                {user?.avatar || "T"}
                            </div>
                            <div>
                                <p className="font-bold text-base lg:text-lg">{user?.name || "Teacher"}</p>
                                <p className="text-xs lg:text-sm opacity-90">Teacher</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="lg:hidden text-white">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="bg-green-700 p-3 rounded-lg">
                        <p className="text-xs opacity-90">Assigned Classes</p>
                        <div className="space-y-1 mt-1 max-h-20 overflow-y-auto">
                            {teacherClasses.map((c) => (
                                <p key={c.id} className="font-medium text-xs lg:text-sm">
                                    {c.name} {c.section}
                                </p>
                            ))}
                        </div>
                        <p className="text-xs mt-2 opacity-90">
                            Subjects: {user?.subjects?.join(", ") || "None"}
                        </p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-1">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleTabClick(item.id)}
                            className={`
                w-full text-left px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg font-medium
                transition-all text-sm lg:text-base
                ${activeTab === item.id ? "bg-green-700 shadow-md" : "hover:bg-green-700"}
              `}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Logout */}
                <div className="p-4 lg:p-6 border-t border-green-700">
                    <button
                        onClick={onLogout}
                        className="w-full px-3 lg:px-4 py-2 lg:py-2.5 bg-red-600 rounded-lg hover:bg-red-700 font-medium text-sm lg:text-base"
                    >
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}