// src/components/HeadmasterDashboard/HExams.jsx
export const HExams = ({ exams, classes, onAddClick }) => (
    <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <h2 className="text-xl lg:text-2xl font-bold">Exams</h2>
            <button
                onClick={onAddClick}
                className="px-4 lg:px-5 py-2 lg:py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm lg:text-base"
            >
                + Create Exam
            </button>
        </div>
        <div className="space-y-4">
            {exams.map(ex => (
                <div key={ex.id} className="bg-white p-4 lg:p-5 rounded-lg shadow">
                    <p className="font-bold text-base lg:text-lg">{ex.title}</p>
                    <p className="text-xs lg:text-sm text-gray-500 mt-1">
                        Class: {ex.className || classes.find(c => c.id === ex.classId)?.name} • Date: {ex.date}
                    </p>
                </div>
            ))}
        </div>
    </div>
);