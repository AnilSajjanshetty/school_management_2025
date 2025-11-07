// src/components/ClassTeacherDashboard/CTExamsTab.jsx
export const CTExamsTab = ({ data }) => {
    if (!data || data.length === 0) {
        return <p className="text-gray-500 text-center py-8">No exams</p>;
    }

    return (
        <div className="space-y-4">
            {data.map((e, i) => (
                <div
                    key={i}
                    className="bg-white p-5 rounded-lg shadow border-l-4 border-blue-500"
                >
                    <h4 className="font-bold">{e.title}</h4>
                    <p className="text-sm text-gray-600">
                        {e.className} • {e.subjects?.length || 0} subjects • {e.date}
                    </p>
                </div>
            ))}
        </div>
    );
};