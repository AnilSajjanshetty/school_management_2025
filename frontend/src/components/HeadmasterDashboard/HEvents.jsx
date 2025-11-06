// src/components/HeadmasterDashboard/HEvents.jsx
export const HEvents = ({ events, onAddClick }) => (
    <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <h2 className="text-xl lg:text-2xl font-bold">Events</h2>
            <button
                onClick={onAddClick}
                className="px-4 lg:px-5 py-2 lg:py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm lg:text-base"
            >
                + Add
            </button>
        </div>
        <div className="space-y-4">
            {events.map(e => (
                <div key={e.id} className="bg-white p-4 lg:p-5 rounded-lg shadow">
                    <p className="font-bold text-base lg:text-lg">{e.title}</p>
                    <p className="text-xs lg:text-sm text-gray-500 mt-1">{e.date}</p>
                    <p className="mt-2 text-sm lg:text-base text-gray-700">{e.content}</p>
                </div>
            ))}
        </div>
    </div>
);