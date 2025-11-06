// src/components/HeadmasterDashboard/HClassDetails.jsx
export const HClassDetails = ({
    selectedClass, classStudents, onAddStudent, onCreateExam, onCreateTimetable, onRemoveStudent
}) => (
    <div>
        <div className="flex flex-col gap-3 mb-6">
            <div>
                <h2 className="text-xl lg:text-2xl font-bold">{selectedClass.name} — {selectedClass.section}</h2>
                <p className="text-sm lg:text-base text-gray-600">Teacher: {selectedClass.teacherName || "Unassigned"}</p>
            </div>
            <div className="flex flex-wrap gap-2 lg:gap-3">
                <button onClick={onAddStudent} className="px-3 lg:px-5 py-2 lg:py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 text-xs lg:text-sm">
                    + Add Student
                </button>
                <button onClick={onCreateExam} className="px-3 lg:px-5 py-2 lg:py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-xs lg:text-sm">
                    Create Exam
                </button>
                <button onClick={onCreateTimetable} className="px-3 lg:px-5 py-2 lg:py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-xs lg:text-sm">
                    Create Timetable
                </button>
            </div>
        </div>

        <h3 className="text-lg lg:text-xl font-semibold mb-4">Students</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {classStudents.map(s => (
                <div key={s.id} className="bg-white p-4 lg:p-5 rounded-lg shadow">
                    <p className="font-bold text-sm lg:text-base">{s.name}</p>
                    <p className="text-xs lg:text-sm text-gray-500">Roll: {s.roll}</p>
                    <p className="text-xs lg:text-sm mt-1">Attendance: {s.attendance}%</p>
                    <p className="text-xs lg:text-sm">Avg Score: {s.avgScore}%</p>
                    <button onClick={() => onRemoveStudent(s.id)} className="mt-3 text-red-600 text-xs lg:text-sm font-medium">
                        Remove
                    </button>
                </div>
            ))}
        </div>
    </div>
);