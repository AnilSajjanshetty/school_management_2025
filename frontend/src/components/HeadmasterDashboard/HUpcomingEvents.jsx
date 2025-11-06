// src/components/HeadmasterDashboard/HUpcomingEvents.jsx
export const HUpcomingEvents = ({ events }) => (
    <div className="bg-white p-4 lg:p-6 rounded-xl shadow">
        <h3 className="text-lg lg:text-xl font-bold text-green-700 mb-4">Upcoming Events</h3>
        {events.length > 0 ? (
            <div className="space-y-3">
                {events.map(e => (
                    <div key={e.id} className="border-l-4 border-green-500 pl-3">
                        <p className="font-medium text-sm lg:text-base">{e.title}</p>
                        <p className="text-xs lg:text-sm text-gray-600">{e.date}</p>
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-gray-500 italic text-sm">No upcoming events.</p>
        )}
    </div>
);