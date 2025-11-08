import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import axiosInstance from "../../config/axiosInstance";
import { Modal } from "../Modal";
import { CTNewMessageForm } from "../Forms/CTNewMessageForm";

export const CTMessages = ({ teacherId }) => {
    const [messages, setMessages] = useState([]);
    const [openNewMessage, setOpenNewMessage] = useState(false);

    const fetchMessages = async () => {
        try {
            const res = await axiosInstance.get(`/classTeacher/messages/${teacherId}`);
            setMessages(res.data);
        } catch (err) {
            console.error("Error fetching messages:", err);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    return (
        <div className="p-6">
            {/* Header with New Message Button */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
                <button
                    onClick={() => setOpenNewMessage(true)}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <Plus size={18} /> New Message
                </button>
            </div>

            {/* List of Messages */}
            <div className="space-y-3">
                {messages.length === 0 ? (
                    <p className="text-gray-500 text-sm">No messages yet.</p>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg._id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium text-gray-800">{msg.subject}</h3>
                                <span
                                    className={`text-xs px-2 py-1 rounded ${msg.status === "resolved"
                                        ? "bg-green-100 text-green-700"
                                        : msg.status === "read"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-yellow-100 text-yellow-700"
                                        }`}
                                >
                                    {msg.status}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm mt-2">{msg.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                                {new Date(msg.createdAt).toLocaleString()}
                            </p>
                        </div>
                    ))
                )}
            </div>

            {/* Modal for New Message */}
            <Modal open={openNewMessage} onClose={() => setOpenNewMessage(false)} title="New Message">
                <CTNewMessageForm
                    userId={teacherId}
                    onClose={() => setOpenNewMessage(false)}
                    onMessageSent={fetchMessages}
                />
            </Modal>
        </div>
    );
};
