// src/components/ClassTeacherDashboard/CTAnnouncementsTab.jsx
export const CTAnnouncementsTab = ({ data }) => {
    if (!data || data.length === 0) {
        return <p className="text-gray-500 text-center py-8">No announcements</p>;
    }

    return (
        <div className="space-y-4">
            {data.map((a, i) => (
                <div
                    key={i}
                    className="bg-white p-5 rounded-lg shadow border-l-4 border-yellow-500"
                >
                    <h4 className="font-bold">{a.title}</h4>
                    <p className="text-sm text-gray-500">{a.date}</p>
                    <p className="mt-2">{a.content}</p>
                </div>
            ))}
        </div>
    );
};