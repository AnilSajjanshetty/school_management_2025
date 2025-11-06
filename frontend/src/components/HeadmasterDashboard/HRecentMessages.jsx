// src/components/HeadmasterDashboard/HRecentMessages.jsx
export const HRecentMessages = ({ messages }) => (
    <div className="bg-white p-4 lg:p-6 rounded-xl shadow">
        <h3 className="text-lg lg:text-xl font-bold text-purple-700 mb-4">Recent Messages</h3>
        {messages.length > 0 ? (
            messages.map(m => (
                <div key={m.id} className="border-l-4 border-purple-500 pl-3 mb-2">
                    <p className="font-medium text-xs lg:text-sm capitalize">{m.type}</p>
                    <p className="text-xs text-gray-600">{m.date}</p>
                </div>
            ))
        ) : (
            <p className="text-gray-500 italic text-sm">No messages yet.</p>
        )}
    </div>
);