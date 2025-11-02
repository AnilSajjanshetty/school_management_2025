import React from "react";

export const Modal = ({ open, title, children, onClose }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-11/12 max-w-2xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button onClick={onClose} className="text-gray-500">Close</button>
                </div>
                {children}
            </div>
        </div>
    );
};