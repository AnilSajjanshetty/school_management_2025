// components/ClassTeacherDashboard/CTMyClassTab.jsx
export const CTMyClassTab = ({ data }) => {
    if (!data) return <p className="text-gray-500 text-center py-8">No class assigned</p>;

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">{data.className}</h2>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <p className="text-sm text-gray-600">Total Students</p>
                    <p className="text-3xl font-bold">{data.students?.length || 0}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Average Score</p>
                    <p className="text-3xl font-bold">{data.avgScore || 0}%</p>
                </div>
            </div>
            <div className="mt-6">
                <h3 className="font-bold mb-3">Students</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.students?.map((s, i) => (
                        <div key={i} className="border p-4 rounded-lg">
                            <p className="font-semibold">{s.name}</p>
                            <p className="text-sm text-gray-600">Roll: {s.roll}</p>
                            <p className="text-sm">Score: {s.score}%</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};