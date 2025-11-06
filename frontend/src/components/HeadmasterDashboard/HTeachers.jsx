// src/components/HeadmasterDashboard/HTeachers.jsx
export const HTeachers = ({ teachers, onAddClick, onRemove }) => (
    <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <h2 className="text-xl lg:text-2xl font-bold">Teachers</h2>
            <button
                onClick={onAddClick}
                className="px-4 lg:px-5 py-2 lg:py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm lg:text-base"
            >
                + Add Teacher
            </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {teachers.map(t => (
                <div key={t.id} className="bg-white p-4 lg:p-6 rounded-xl shadow">
                    <p className="font-bold text-base lg:text-lg">{t.name}</p>
                    <p className="text-xs lg:text-sm text-gray-600 mt-1">
                        Subjects: {t.subjects?.join(", ") || "-"}
                    </p>
                    <button onClick={() => onRemove(t.id)} className="mt-4 text-red-600 text-xs lg:text-sm font-medium">
                        Remove
                    </button>
                </div>
            ))}
        </div>
    </div>
);