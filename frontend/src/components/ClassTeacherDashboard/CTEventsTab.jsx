// src/components/ClassTeacherDashboard/CTEventsTab.jsx
export const CTEventsTab = ({ data }) => {
    if (!data || data.length === 0) {
        return <p className="text-gray-500 text-center py-8">No events</p>;
    }

    return (
        <div className="grid md:grid-cols-2 gap-4">
            {data.map((e, i) => (
                <div
                    key={i}
                    className="bg-white p-5 rounded-lg shadow border-l-4 border-green-500"
                >
                    <h4 className="font-bold">{e.title}</h4>
                    <p className="text-sm text-gray-500">{e.date}</p>
                    <p className="mt-2">{e.description}</p>
                </div>
            ))}
        </div>
    );
};