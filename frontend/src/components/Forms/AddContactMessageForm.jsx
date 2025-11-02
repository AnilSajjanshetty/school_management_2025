// src/components/Forms/AddContactMessageForm.jsx
import React, { useState } from "react";

export const AddContactMessageForm = ({ onCreate, onClose }) => {
    const [type, setType] = useState("feedback");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!message.trim()) {
            alert("Please write a message.");
            return;
        }

        setLoading(true);

        // Simulate API delay
        setTimeout(() => {
            onCreate({
                type,
                message: message.trim(),
            });
            setLoading(false);
            setMessage("");
            onClose();
        }, 500);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5 p-2">
            {/* Type Selector */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message Type
                </label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                    disabled={loading}
                >
                    <option value="feedback">Feedback</option>
                    <option value="complaint">Complaint</option>
                    <option value="inquiry">Inquiry</option>
                </select>
            </div>

            {/* Message Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message
                </label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message here..."
                    rows={5}
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                    required
                    disabled={loading}
                />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-3">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                            </svg>
                            Sending...
                        </>
                    ) : (
                        "Send Message"
                    )}
                </button>
            </div>
        </form>
    );
};