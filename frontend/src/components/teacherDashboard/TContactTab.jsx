import React, { useState } from "react";
import axiosInstance from "../../config/axiosInstance";

export default function TContactTab({ contactMessages = [], onAdd, onReplySent }) {
    const [activeReplyId, setActiveReplyId] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [loading, setLoading] = useState(false);

    const startReplying = (msgId) => {
        setActiveReplyId(msgId);
        setReplyText("");
    };

    const cancelReply = () => {
        setActiveReplyId(null);
        setReplyText("");
    };

    const sendReply = async (msgId) => {
        const text = replyText.trim();
        if (!text) return;

        setLoading(true);
        try {
            const res = await axiosInstance.post(`/contact-messages/${msgId}/reply`, {
                reply: text,
            });

            if (onReplySent) onReplySent(msgId, text, res.data);

            cancelReply();
        } catch (err) {
            console.error("Reply failed:", err);
            alert("Failed to send reply. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <h2 className="text-2xl lg:text-3xl font-bold">Contact Messages</h2>
                <button
                    onClick={onAdd}
                    className="px-4 lg:px-5 py-2 lg:py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm lg:text-base"
                >
                    + Add
                </button>
            </div>

            {/* Messages Section */}
            <div className="space-y-4">
                {contactMessages.length > 0 ? (
                    contactMessages.map((m) => (
                        <div key={m.id} className="bg-white p-4 lg:p-5 rounded-lg shadow">
                            {/* Top Row: Type + Status */}
                            <div className="flex justify-between items-center">
                                <p className="font-bold capitalize text-base lg:text-lg">{m.type}</p>
                                <span
                                    className={`px-2 py-0.5 text-xs rounded-full ${m.status === "resolved"
                                            ? "bg-green-100 text-green-700"
                                            : m.status === "read"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-gray-100 text-gray-700"
                                        }`}
                                >
                                    {m.status || "pending"}
                                </span>
                            </div>

                            {/* Date */}
                            <p className="text-xs lg:text-sm text-gray-500 mt-1">
                                {m.date ? m.date.split("T")[0] : "N/A"}
                            </p>

                            {/* Message */}
                            <p className="mt-2 text-sm lg:text-base text-gray-700">{m.message}</p>

                            {/* Reply / Replied Section */}
                            <div className="mt-3">
                                {m.reply ? (
                                    <p className="text-sm italic text-green-700">
                                        <strong>Replied:</strong> {m.reply}
                                    </p>
                                ) : activeReplyId === m.id ? (
                                    <div className="flex items-center gap-2 mt-2">
                                        <input
                                            type="text"
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && !loading && sendReply(m.id)}
                                            placeholder="Type your reply..."
                                            className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            autoFocus
                                            disabled={loading}
                                        />
                                        <button
                                            onClick={() => sendReply(m.id)}
                                            disabled={loading || !replyText.trim()}
                                            className="px-3 py-1.5 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50"
                                        >
                                            {loading ? "Sending..." : "Send"}
                                        </button>
                                        <button
                                            onClick={cancelReply}
                                            disabled={loading}
                                            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:underline"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => startReplying(m.id)}
                                        className="text-sm font-medium text-purple-600 hover:underline"
                                    >
                                        Reply
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 italic">No messages.</p>
                )}
            </div>
        </div>
    );
}
