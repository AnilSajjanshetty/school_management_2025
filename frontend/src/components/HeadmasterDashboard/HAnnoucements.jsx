// src/components/HeadmasterDashboard/HAnnouncements.jsx
export const HAnnouncements = ({ announcements, onAddClick }) => (
    <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <h2 className="text-xl lg:text-2xl font-bold">Announcements</h2>
            <button
                onClick={onAddClick}
                className="px-4 lg:px-5 py-2 lg:py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm lg:text-base"
            >
                + Add
            </button>
        </div>
        <div className="space-y-4">
            {announcements.map(a => (
                <div key={a.id} className="bg-white p-4 lg:p-5 rounded-lg shadow">
                    <p className="font-bold text-base lg:text-lg">{a.title}</p>
                    <p className="text-xs lg:text-sm text-gray-500 mt-1">
                        {a.date} • {a.visibility}
                    </p>
                    <p className="mt-2 text-sm lg:text-base text-gray-700">{a.content}</p>
                </div>
            ))}
        </div>
    </div>
);