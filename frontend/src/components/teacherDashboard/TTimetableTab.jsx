// src/components/teacherDashboard/TTimetableTab.jsx
import React from "react";
import TTimetableTable from "./TTimetableTable";

export default function TTimetableTab({ teacherTimetables, user, classes }) {
    return (
        <div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8 text-gray-800">My Teaching Schedule</h2>
            <div className="bg-white p-4 lg:p-6 rounded-xl shadow">
                <TTimetableTable teacherTimetables={teacherTimetables} user={user} classes={classes} />
            </div>
        </div>
    );
}   