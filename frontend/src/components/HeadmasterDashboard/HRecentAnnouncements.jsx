// src/components/HeadmasterDashboard/HRecentAnnouncements.jsx
export const HRecentAnnouncements = ({ announcements }) => (
    <div className="bg-white p-4 lg:p-6 rounded-xl shadow">
        <h3 className="text-lg lg:text-xl font-bold text-yellow-700 mb-4">Recent Announcements</h3>
        {announcements.length > 0 ? (
            <div className="space-y-3">
                {announcements.map(a => (
                    <div key={a.id} className="border-l-4 border-yellow-500 pl-3">
                        <p className="font-medium text-sm lg:text-base">{a.title}</p>
                        <p className="text-xs lg:text-sm text-gray-600">{a.date}</p>
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-gray-500 italic text-sm">No recent announcements.</p>
        )}
    </div>
);