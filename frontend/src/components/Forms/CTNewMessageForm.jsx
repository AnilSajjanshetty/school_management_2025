import React, { useState } from "react";
import { Send } from "lucide-react";
import axiosInstance from "../../config/axiosInstance";

export const CTNewMessageForm = ({ userId, onClose, onMessageSent }) => {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [type, setType] = useState("inquiry");
    const [loading, setLoading] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim()) return alert("Please enter a message");
        setLoading(true);
        try {
            await axiosInstance.post("/classTeacher/messages", {
                teacherId: userId,
                subject,
                message,
                type,
            });
            onMessageSent();
            onClose();
        } catch (err) {
            console.error("Failed to send message:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSend} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Subject</label>
                <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter message subject"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Type</label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                    <option value="inquiry">Inquiry</option>
                    <option value="complaint">Complaint</option>
                    <option value="feedback">Feedback</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Message</label>
                <textarea
                    rows="4"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1"
                >
                    <Send size={16} /> {loading ? "Sending..." : "Send Message"}
                </button>
            </div>
        </form>
    );
};
