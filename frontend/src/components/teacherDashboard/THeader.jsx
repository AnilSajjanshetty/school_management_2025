// src/components/teacherDashboard/THeader.jsx
import React from "react";
import { Menu } from "lucide-react";

export default function THeader({ title, onMenuClick }) {
    return (
        <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
            <button
                onClick={onMenuClick}
                className="text-gray-700 hover:bg-gray-100 rounded-lg p-2 transition-colors"
                aria-label="Open menu"
            >
                <Menu className="w-6 h-6" />
            </button>
            <h1 className="font-bold text-lg text-gray-800">{title}</h1>
            <div className="w-10" />
        </div>
    );
}