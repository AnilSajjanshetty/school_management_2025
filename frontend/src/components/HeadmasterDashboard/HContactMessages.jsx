// src/components/HeadmasterDashboard/HContactMessages.jsx
import React, { useState } from "react";
import axiosInstance from "../../config/axiosInstance";

export const HContactMessages = ({ contactMessages = [], onReplySent }) => {
    const [activeReplyId, setActiveReplyId] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [loading, setLoading] = useState(false);

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
        } catch (error) {
            console.error("Reply failed:", error);
            alert("Failed to send reply. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6">Contact Messages</h2>

            <div className="bg-white rounded-xl shadow overflow-x-auto">
                <table className="w-full min-w-[600px]">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Message
                            </th>
                            <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {contactMessages.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-gray-500 text-sm">
                                    No messages yet.
                                </td>
                            </tr>
                        ) : (
                            contactMessages.map((msg) => (
                                <React.Fragment key={msg._id}>
                                    {/* Message row */}
                                    <tr>
                                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${msg.type === "complaint"
                                                        ? "bg-red-100 text-red-800"
                                                        : msg.type === "inquiry"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : "bg-green-100 text-green-800"
                                                    }`}
                                            >
                                                {msg.type}
                                            </span>
                                        </td>
                                        <td className="px-4 lg:px-6 py-4 text-xs lg:text-sm text-gray-900 max-w-xs">
                                            {msg.message}
                                        </td>
                                        <td className="px-4 lg:px-6 py-4 text-xs lg:text-sm text-gray-500">
                                            {new Date(msg.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 lg:px-6 py-4 text-right">
                                            {msg.reply ? (
                                                <span className="text-xs text-green-600 font-medium">
                                                    Replied
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        setActiveReplyId(activeReplyId === msg._id ? null : msg._id)
                                                    }
                                                    className="text-xs font-medium text-indigo-600 hover:underline"
                                                >
                                                    {activeReplyId === msg._id ? "Close" : "Reply"}
                                                </button>
                                            )}
                                        </td>
                                    </tr>

                                    {/* Show reply input ONLY for clicked message */}
                                    {activeReplyId === msg._id && !msg.reply && (
                                        <tr className="bg-indigo-50 border-t border-indigo-200">
                                            <td colSpan={4} className="px-4 lg:px-6 py-4">
                                                <div className="flex items-center gap-2 mt-1">
                                                    <input
                                                        type="text"
                                                        value={replyText}
                                                        onChange={(e) => setReplyText(e.target.value)}
                                                        onKeyDown={(e) =>
                                                            e.key === "Enter" && !loading && sendReply(msg._id)
                                                        }
                                                        placeholder="Type your reply..."
                                                        className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        autoFocus
                                                        disabled={loading}
                                                    />
                                                    <button
                                                        onClick={() => sendReply(msg._id)}
                                                        disabled={loading || !replyText.trim()}
                                                        className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
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
                                            </td>
                                        </tr>
                                    )}

                                    {/* Show sent reply */}
                                    {msg.reply && (
                                        <tr className="bg-gray-50">
                                            <td colSpan={4} className="px-4 lg:px-6 py-2 text-xs italic text-gray-600">
                                                <strong>Replied:</strong> {msg.reply}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
