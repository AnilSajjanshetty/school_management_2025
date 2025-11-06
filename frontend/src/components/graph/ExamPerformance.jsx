import React, { useState, useEffect } from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

const ExamPerformance = ({ exams = [], classes = [] }) => {
    const [selectedClassId, setSelectedClassId] = useState("");
    const [selectedExamId, setSelectedExamId] = useState("");
    const [examGraphData, setExamGraphData] = useState([]);

    // Filter exams by class
    const examsForClass = exams.filter(
        (exam) => exam.classId && exam.classId._id === selectedClassId
    );

    // Update chart data when exam changes
    useEffect(() => {
        if (selectedExamId) {
            const selectedExam = exams.find((e) => e._id === selectedExamId);
            if (selectedExam && selectedExam.results?.length > 0) {
                const data = selectedExam.results.map((r) => ({
                    subject: selectedExam.subject,
                    avgMarks: r.marksObtained,
                }));
                setExamGraphData(data);
            } else {
                setExamGraphData([]);
            }
        } else {
            setExamGraphData([]);
        }
    }, [selectedExamId, exams]);

    return (
        <div className="bg-white  lg:p-6 rounded-xl ">

            {/* Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 mb-5">
                {/* Class Dropdown */}
                <select
                    value={selectedClassId}
                    onChange={(e) => {
                        setSelectedClassId(e.target.value);
                        setSelectedExamId("");
                    }}
                    className="p-2 lg:p-3 border border-gray-300 rounded-lg text-xs lg:text-sm"
                >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                        <option key={cls._id} value={cls._id}>
                            {cls.name} {cls.section}
                        </option>
                    ))}
                </select>

                {/* Exam Dropdown */}
                <select
                    value={selectedExamId}
                    onChange={(e) => setSelectedExamId(e.target.value)}
                    className="p-2 lg:p-3 border border-gray-300 rounded-lg text-xs lg:text-sm"
                    disabled={!selectedClassId}
                >
                    <option value="">Select Exam</option>
                    {examsForClass.map((exam) => (
                        <option key={exam._id} value={exam._id}>
                            {exam.title} ({new Date(exam.date).toLocaleDateString()})
                        </option>
                    ))}
                </select>
            </div>

            {/* Chart */}
            {selectedExamId ? (
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={examGraphData}>
                        <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
                        <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#f9fafb",
                                border: "1px solid #e5e7eb",
                            }}
                        />
                        <Legend wrapperStyle={{ fontSize: "12px" }} />
                        <Bar
                            dataKey="avgMarks"
                            fill="#f59e0b"
                            radius={[8, 8, 0, 0]}
                            name="Marks Obtained"
                        />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-center text-gray-500 py-10 text-sm">
                    Select class and exam to view results.
                </p>
            )}
        </div>
    );
};

export default ExamPerformance;
