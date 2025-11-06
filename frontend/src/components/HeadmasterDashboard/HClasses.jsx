// src/components/HeadmasterDashboard/HClasses.jsx
export const HClasses = ({ classes, onAddClick, onClassClick, onRemove }) => (
    <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <h2 className="text-xl lg:text-2xl font-bold">All Classes</h2>
            <button
                onClick={onAddClick}
                className="px-4 lg:px-5 py-2 lg:py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm lg:text-base"
            >
                + Create Class
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {classes.map(c => (
                <div
                    key={c.id}
                    onClick={() => onClassClick(c.id)}
                    className="bg-white p-4 lg:p-6 rounded-xl shadow hover:shadow-xl cursor-pointer transition"
                >
                    <h3 className="font-bold text-base lg:text-lg">{c.name}</h3>
                    <p className="text-xs lg:text-sm text-gray-600">Section: {c.section || "-"}</p>
                    <p className="text-xs lg:text-sm text-gray-600 mt-1">Teacher: {c.teacherName || "Unassigned"}</p>
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove(c.id);
                            }}
                            className="text-red-600 hover:text-red-800 text-xs lg:text-sm font-medium"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);