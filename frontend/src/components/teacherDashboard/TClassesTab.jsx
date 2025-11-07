// src/components/teacherDashboard/TClassesTab.jsx
import React from "react";
import TClassCard from "./TClassCard";
import TStudentCard from "./TStudentCard";

export default function TClassesTab({ teacherClasses, selectedClass, setSelectedClass, students, setSelectedStudent, setShowProgress }) {
    const classStudents = students.filter(s => s.classId === selectedClass?.id);

    return (
        <div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8 text-gray-800">My Classes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                {teacherClasses.map(cls => (
                    <TClassCard
                        key={cls.id}
                        cls={{ ...cls, studentCount: students.filter(s => s.classId === cls.id).length }}
                        isSelected={selectedClass?.id === cls.id}
                        onClick={() => setSelectedClass(cls)}
                    />
                ))}
            </div>

            {selectedClass && (
                <div className="mt-6 lg:mt-8">
                    <h3 className="text-xl lg:text-2xl font-bold mb-4">
                        Students in {selectedClass.name} {selectedClass.section}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {classStudents.map(s => (
                            <TStudentCard
                                key={s.id}
                                student={s}
                                onAddProgress={() => {
                                    setSelectedStudent(s);
                                    setShowProgress(true);
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}