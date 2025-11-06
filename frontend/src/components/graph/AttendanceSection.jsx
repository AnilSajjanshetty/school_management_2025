// AttendanceSection.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";

/**
 * Props:
 * - attendanceRecords: Array of { today, class: { id | _id, name, section }, daily[], monthly[], yearly[] }
 * - classes: Array of class objects from /api/classes (each has _id, name, section)
 */
const AttendanceSection = ({ attendanceRecords = [], classes = [] }) => {
    const [selectedClassId, setSelectedClassId] = useState("");
    const [view, setView] = useState("monthly"); // "daily" | "monthly" | "yearly"

    // Auto-select first class when classes load
    useEffect(() => {
        if (!selectedClassId && classes && classes.length > 0) {
            setSelectedClassId(classes[0]._id);
        }
    }, [classes, selectedClassId]);

    // Helper: normalize an attendance record's class id to string
    const normalizeClassId = (rec) => {
        if (!rec || !rec.class) return null;
        return (rec.class.id || rec.class._id || "").toString();
    };

    // Find the record for selected class (robust to id/_id mismatch)
    const selectedRecord = useMemo(() => {
        if (!selectedClassId || !attendanceRecords || attendanceRecords.length === 0)
            return null;
        return attendanceRecords.find((rec) => normalizeClassId(rec) === selectedClassId);
    }, [attendanceRecords, selectedClassId]);

    // Debugging logs (remove in production)
    useEffect(() => {
        console.log("AttendanceRecords:", attendanceRecords);
        console.log("Classes:", classes);
        console.log("SelectedClassId:", selectedClassId);
        console.log("SelectedRecord:", selectedRecord);
    }, [attendanceRecords, classes, selectedClassId, selectedRecord]);

    // Utility: parse date strings used in your data
    const parseDate = (dateStr, viewType) => {
        // monthly/date format: 'YYYY-MM-DD' or sometimes '2025-11-01'
        // yearly format: 'YYYY-MM'
        if (!dateStr) return null;
        if (viewType === "yearly") {
            // append -01 to create a parsable month start
            return new Date(dateStr + "-01");
        }
        // else daily/monthly - assume full date
        return new Date(dateStr);
    };

    // Prepare chart data based on view
    const chartData = useMemo(() => {
        if (!selectedRecord) return [];

        // utility to sort entries by date
        const sortByDateAsc = (arr, viewType) =>
            [...arr].sort((a, b) => {
                const da = parseDate(a.date, viewType);
                const db = parseDate(b.date, viewType);
                return da - db;
            });

        if (view === "monthly") {
            const monthArr = selectedRecord.monthly || [];
            const sorted = sortByDateAsc(monthArr, "monthly");
            return sorted.map((e) => ({
                // label as day number (1,2,3) with leading removal
                name: (() => {
                    const d = parseDate(e.date, "monthly");
                    return isNaN(d) ? e.date : String(d.getDate());
                })(),
                attendance: Number(e.percentage ?? 0),
                rawDate: e.date,
            }));
        }

        if (view === "yearly") {
            const yearArr = selectedRecord.yearly || [];
            const sorted = sortByDateAsc(yearArr, "yearly");
            return sorted.map((e) => {
                const d = parseDate(e.date, "yearly"); // YYYY-MM => date
                const label = !isNaN(d)
                    ? d.toLocaleDateString("en", { month: "short", year: "numeric" }).replace(/\d{4}/, (m) => m) // "Nov 2025" (keeps month)
                    : e.date;
                return {
                    name: label.split(" ")[0], // "Nov" — keep short month to match your request
                    attendance: Number(e.percentage ?? 0),
                    rawDate: e.date,
                };
            });
        }

        // view === "daily"
        // prefer daily[] if available; otherwise use last N entries from monthly[]
        const dailyArr = selectedRecord.daily || [];
        if (dailyArr.length > 0) {
            const sorted = sortByDateAsc(dailyArr, "daily");
            return sorted.map((e) => ({
                name: (() => {
                    const d = parseDate(e.date, "daily");
                    return isNaN(d) ? e.date : d.toLocaleDateString("en", { weekday: "short", day: "numeric" });
                })(),
                attendance: Number(e.percentage ?? 0),
                rawDate: e.date,
            }));
        }

        // fallback: take last 7 items from monthly (if exists) and label them as day numbers
        const fallbackMonthly = sortByDateAsc(selectedRecord.monthly || [], "monthly");
        if (fallbackMonthly.length > 0) {
            const last7 = fallbackMonthly.slice(-7);
            return last7.map((e) => ({
                name: (() => {
                    const d = parseDate(e.date, "monthly");
                    return isNaN(d) ? e.date : d.toLocaleDateString("en", { weekday: "short", day: "numeric" });
                })(),
                attendance: Number(e.percentage ?? 0),
                rawDate: e.date,
            }));
        }

        // absolute fallback: show today's label with 0
        return [
            {
                name: selectedRecord.today || new Date().toISOString().slice(0, 10),
                attendance: 0,
                rawDate: selectedRecord.today || new Date().toISOString().slice(0, 10),
            },
        ];
    }, [selectedRecord, view]);

    // Chart options and axis labels
    const xAxisLabel =
        view === "yearly" ? "Month" : view === "monthly" ? "Day of Month" : "Date";

    return (
        <div className="bg-white p-4 lg:p-6 rounded-xl  mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">


                <div className="flex gap-2 w-full sm:w-auto">
                    <select
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg text-sm"
                    >
                        {classes && classes.length > 0 ? (
                            <>
                                {classes.map((c) => (
                                    <option key={c._id} value={c._id}>
                                        {c.name} {c.section ? `(${c.section})` : ""}
                                    </option>
                                ))}
                            </>
                        ) : (
                            <option value="">No classes</option>
                        )}
                    </select>

                    <select
                        value={view}
                        onChange={(e) => setView(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg text-sm"
                    >
                        <option value="daily">Daily</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>
            </div>

            {/* Chart area */}
            {selectedClassId ? (
                chartData && chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} label={{ value: xAxisLabel, position: "insideBottomRight", offset: -5 }} />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                            <Tooltip formatter={(v) => `${v}%`} />
                            <Legend wrapperStyle={{ fontSize: "12px" }} />
                            <Line type="monotone" dataKey="attendance" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-center text-gray-500 py-10">No data available for the selected view.</p>
                )
            ) : (
                <p className="text-center text-gray-500 py-10">Select a class to view attendance.</p>
            )}
        </div>
    );
};

export default AttendanceSection;
