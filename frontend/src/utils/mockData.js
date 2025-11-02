export const mockData = {
  classes: [
    {
      id: "class-1A",
      name: "Class 10",
      section: "A",
      teacherId: "t-1",
      teacherName: "Anil Sir",
    },
    {
      id: "class-2A",
      name: "Class 9",
      section: "A",
      teacherId: "t-1",
      teacherName: "Anil Sir",
    },
    {
      id: "class-2A",
      name: "Class 9",
      section: "A",
      teacherId: "t-2",
      teacherName: "Shrikant Sir",
    },
    {
      id: "class-3A",
      name: "Class 8",
      section: "A",
      teacherId: "t-3",
      teacherName: "Rina Maam",
    },
    {
      id: "class-4A",
      name: "Class 11",
      section: "A",
      teacherId: "t-4",
      teacherName: "Arun Sir",
    },
    {
      id: "class-5A",
      name: "Class 12",
      section: "A",
      teacherId: "t-5",
      teacherName: "Pooja Maam",
    },
    {
      id: "class-6A",
      name: "Class 7",
      section: "A",
      teacherId: "t-6",
      teacherName: "Kavita Maam",
    },
  ],
  teachers: [
    { id: "t-1", name: "Anil Sir", subjects: ["Science", "Math"] },
    { id: "t-2", name: "Shrikant Sir", subjects: ["Math"] },
    { id: "t-3", name: "Rina Maam", subjects: ["English"] },
    { id: "t-4", name: "Arun Sir", subjects: ["History"] },
    { id: "t-5", name: "Pooja Maam", subjects: ["Biology"] },
    { id: "t-6", name: "Kavita Maam", subjects: ["Hindi"] },
  ],
  students: [
    {
      id: "s-1",
      name: "Riya Sharma",
      roll: "001",
      classId: "class-1A",
      attendance: 95,
      avgScore: 88,
    },
    {
      id: "s-2",
      name: "Aarav Patel",
      roll: "002",
      classId: "class-1A",
      attendance: 92,
      avgScore: 84,
    },
    {
      id: "s-3",
      name: "Sneha Kumar",
      roll: "003",
      classId: "class-1A",
      attendance: 89,
      avgScore: 82,
    },
    {
      id: "s-4",
      name: "Dev Mehta",
      roll: "004",
      classId: "class-1A",
      attendance: 93,
      avgScore: 90,
    },
    {
      id: "s-5",
      name: "Priya Singh",
      roll: "005",
      classId: "class-1A",
      attendance: 97,
      avgScore: 91,
    },
    {
      id: "s-6",
      name: "Rohan Gupta",
      roll: "006",
      classId: "class-1A",
      attendance: 85,
      avgScore: 78,
    },
  ],
  announcements: [
    {
      id: "a-1",
      title: "PTM Meeting",
      content: "Parent-Teacher Meet tomorrow 3 PM",
      visibility: "public",
      date: "2025-11-01",
    },
    {
      id: "a-2",
      title: "Exam Schedule",
      content: "Mid-term starts Nov 10",
      visibility: "public",
      date: "2025-10-28",
    },
    {
      id: "a-3",
      title: "Class 10 Notice",
      content: "Special lab on Friday",
      visibility: "class:class-1A",
      date: "2025-10-25",
    },
    {
      id: "a-4",
      title: "Holiday",
      content: "School closed on Diwali",
      visibility: "public",
      date: "2025-11-12",
    },
    {
      id: "a-5",
      title: "Sports Day",
      content: "Inter-house competition on Dec 10",
      visibility: "public",
      date: "2025-12-01",
    },
    {
      id: "a-6",
      title: "Science Fair",
      content: "Project submission by Nov 15",
      visibility: "public",
      date: "2025-11-10",
    },
  ],
  // FIXED: Added classId
  events: [
    {
      id: "e-1",
      title: "Science Fair",
      date: "2025-11-20",
      content: "Inter-house science projects",
      public: true,
      classId: "class-1A",
    },
    {
      id: "e-2",
      title: "Cultural Day",
      date: "2025-12-05",
      content: "Dance and drama",
      public: true,
      classId: "class-1A",
    },
    {
      id: "e-3",
      title: "Sports Day",
      date: "2025-12-10",
      content: "Track and field events",
      public: true,
      classId: "class-1A",
    },
    {
      id: "e-4",
      title: "Art Exhibition",
      date: "2025-11-30",
      content: "Student artwork display",
      public: true,
      classId: "class-1A",
    },
    {
      id: "e-5",
      title: "Math Olympiad",
      date: "2025-11-25",
      content: "Inter-school contest",
      public: true,
      classId: "class-1A",
    },
    {
      id: "e-6",
      title: "Parent Workshop",
      date: "2025-11-18",
      content: "Digital literacy session",
      public: true,
      classId: "class-1A",
    },
  ],
  testimonials: [
    {
      message: "Excellent teaching and care!",
      parent: "Mrs. Sharma",
      public: true,
    },
    {
      message: "My child improved a lot in Math.",
      parent: "Mr. Patel",
      public: true,
    },
    {
      message: "Very supportive and dedicated.",
      parent: "Ms. Gupta",
      public: true,
    },
    { message: "Best class teacher ever!", parent: "Mr. Singh", public: true },
    {
      message: "Great science labs and experiments.",
      parent: "Mrs. Desai",
      public: true,
    },
    { message: "Highly recommended school!", parent: "Mr. Rao", public: true },
  ],
  timetables: [
    {
      classId: "class-1A",
      schedule: {
        Monday: [
          { time: "09:00", subject: "Science", teacher: "Anil Sir" },
          { time: "10:00", subject: "Math", teacher: "Anil Sir" },
        ],
        Tuesday: [{ time: "09:00", subject: "English", teacher: "Rina Maam" }],
      },
    },
    {
      classId: "class-2A",
      schedule: {
        Monday: [{ time: "09:00", subject: "Math", teacher: "Shrikant Sir" }],
      },
    },
    {
      classId: "class-3A",
      schedule: {
        Monday: [{ time: "11:00", subject: "English", teacher: "Rina Maam" }],
      },
    },
    {
      classId: "class-4A",
      schedule: {
        Friday: [{ time: "14:00", subject: "History", teacher: "Arun Sir" }],
      },
    },
    {
      classId: "class-5A",
      schedule: {
        Wednesday: [
          { time: "10:00", subject: "Biology", teacher: "Pooja Maam" },
        ],
      },
    },
    {
      classId: "class-6A",
      schedule: {
        Thursday: [{ time: "09:00", subject: "Hindi", teacher: "Kavita Maam" }],
      },
    },
  ],
  progress: [],
  attendance: [
    { date: "2025-10-01", classId: "class-1A", present: 28, total: 30 },
    { date: "2025-10-02", classId: "class-1A", present: 27, total: 30 },
    { date: "2025-10-03", classId: "class-1A", present: 29, total: 30 },
    { date: "2025-10-04", classId: "class-1A", present: 26, total: 30 },
    { date: "2025-10-05", classId: "class-1A", present: 30, total: 30 },
    { date: "2025-10-01", classId: "class-2A", present: 25, total: 28 },
    { date: "2025-10-02", classId: "class-2A", present: 26, total: 28 },
    { date: "2025-10-03", classId: "class-2A", present: 24, total: 28 },
    { date: "2025-10-04", classId: "class-2A", present: 27, total: 28 },
    { date: "2025-10-05", classId: "class-2A", present: 25, total: 28 },
  ],

  exams: [
    {
      id: "ex-1",
      title: "Mid-Term",
      date: "2025-11-10",
      classId: "class-1A",
      time: "09:00",
    },
    {
      id: "ex-2",
      title: "Unit Test",
      date: "2025-11-15",
      classId: "class-1A",
      time: "09:00",
    },
    {
      id: "ex-3",
      title: "Quiz",
      date: "2025-11-20",
      classId: "class-1A",
      time: "09:00",
    },
    {
      id: "ex-4",
      title: "Half Yearly",
      date: "2025-12-05",
      classId: "class-1A",
      time: "09:00",
    },
    {
      id: "ex-5",
      title: "Pre-Board",
      date: "2026-01-10",
      classId: "class-1A",
      time: "09:00",
    },
  ],

  examSubjects: [
    // Mid-Term (6)
    { examId: "ex-1", subject: "Math" },
    { examId: "ex-1", subject: "Science" },
    { examId: "ex-1", subject: "English" },
    { examId: "ex-1", subject: "Hindi" },
    { examId: "ex-1", subject: "Social Studies" },
    { examId: "ex-1", subject: "Computer" },

    // Unit Test (3)
    { examId: "ex-2", subject: "Math" },
    { examId: "ex-2", subject: "Science" },
    { examId: "ex-2", subject: "English" },

    // Quiz (1)
    { examId: "ex-3", subject: "Math" },

    // Half Yearly (5)
    { examId: "ex-4", subject: "Math" },
    { examId: "ex-4", subject: "Science" },
    { examId: "ex-4", subject: "English" },
    { examId: "ex-4", subject: "Hindi" },
    { examId: "ex-4", subject: "Social Studies" },

    // Pre-Board (6)
    { examId: "ex-5", subject: "Math" },
    { examId: "ex-5", subject: "Science" },
    { examId: "ex-5", subject: "English" },
    { examId: "ex-5", subject: "Hindi" },
    { examId: "ex-5", subject: "Social Studies" },
    { examId: "ex-5", subject: "Computer" },
  ],

  // FIXED: No syntax error
  examResults: [
    // Mid-Term
    { examId: "ex-1", studentId: "s-1", subject: "Math", marks: 88 },
    { examId: "ex-1", studentId: "s-1", subject: "Science", marks: 90 },
    { examId: "ex-1", studentId: "s-1", subject: "English", marks: 82 },
    { examId: "ex-1", studentId: "s-1", subject: "Hindi", marks: 95 },
    { examId: "ex-1", studentId: "s-1", subject: "Social Studies", marks: 78 },
    { examId: "ex-1", studentId: "s-1", subject: "Computer", marks: 92 },

    { examId: "ex-1", studentId: "s-2", subject: "Math", marks: 82 },
    { examId: "ex-1", studentId: "s-2", subject: "Science", marks: 78 },
    { examId: "ex-1", studentId: "s-2", subject: "English", marks: 65 },
    { examId: "ex-1", studentId: "s-2", subject: "Hindi", marks: 88 },
    { examId: "ex-1", studentId: "s-2", subject: "Social Studies", marks: 70 },
    { examId: "ex-1", studentId: "s-2", subject: "Computer", marks: 85 },

    // ... (rest of results same as before)
    // Unit Test
    { examId: "ex-2", studentId: "s-1", subject: "Math", marks: 85 },
    { examId: "ex-2", studentId: "s-1", subject: "Science", marks: 87 },
    { examId: "ex-2", studentId: "s-1", subject: "English", marks: 80 },

    // Quiz
    { examId: "ex-3", studentId: "s-1", subject: "Math", marks: 92 },

    // Half Yearly
    { examId: "ex-4", studentId: "s-1", subject: "Math", marks: 89 },
    { examId: "ex-4", studentId: "s-1", subject: "Science", marks: 91 },
    { examId: "ex-4", studentId: "s-1", subject: "English", marks: 84 },
    { examId: "ex-4", studentId: "s-1", subject: "Hindi", marks: 96 },
    { examId: "ex-4", studentId: "s-1", subject: "Social Studies", marks: 82 },

    // Pre-Board
    { examId: "ex-5", studentId: "s-1", subject: "Math", marks: 90 },
    { examId: "ex-5", studentId: "s-1", subject: "Science", marks: 92 },
    { examId: "ex-5", studentId: "s-1", subject: "English", marks: 85 },
    { examId: "ex-5", studentId: "s-1", subject: "Hindi", marks: 97 },
    { examId: "ex-5", studentId: "s-1", subject: "Social Studies", marks: 83 },
    { examId: "ex-5", studentId: "s-1", subject: "Computer", marks: 94 },
  ],

  contactMessages: [
    {
      id: "m1",
      type: "complaint",
      message: "Late bus service",
      date: "2025-10-30",
    },
    {
      id: "m2",
      type: "inquiry",
      message: "Admission process?",
      date: "2025-10-29",
    },
    {
      id: "m3",
      type: "feedback",
      message: "Great teachers!",
      date: "2025-10-28",
    },
  ],

  // -------------------------------------------------
  // 7. TEACHER‑CENTRIC TIMETABLE (one entry per teacher)
  // -------------------------------------------------
  teacherTimetables: [
    {
      teacherId: "t-1", // Anil Sir
      schedule: {
        Monday: [
          { time: "09:00", subject: "Science", classId: "class-1A" },
          { time: "10:00", subject: "Math", classId: "class-1A" },
          { time: "11:00", subject: "Science", classId: "class-2A" },
        ],
        Tuesday: [
          { time: "09:00", subject: "Math", classId: "class-2A" },
          { time: "10:00", subject: "Science", classId: "class-1A" },
        ],
        Wednesday: [{ time: "09:00", subject: "Science", classId: "class-1A" }],
        Thursday: [{ time: "10:00", subject: "Math", classId: "class-1A" }],
        Friday: [{ time: "09:00", subject: "Science", classId: "class-2A" }],
      },
    },
    {
      teacherId: "t-2", // Shrikant Sir
      schedule: {
        Monday: [{ time: "09:00", subject: "Math", classId: "class-2A" }],
      },
    },
    {
      teacherId: "t-3",
      schedule: {
        Monday: [{ time: "11:00", subject: "English", classId: "class-3A" }],
        Tuesday: [{ time: "09:00", subject: "English", classId: "class-1A" }],
      },
    },
    {
      teacherId: "t-4",
      schedule: {
        Friday: [{ time: "14:00", subject: "History", classId: "class-4A" }],
      },
    },
    {
      teacherId: "t-5",
      schedule: {
        Wednesday: [{ time: "10:00", subject: "Biology", classId: "class-5A" }],
      },
    },
    {
      teacherId: "t-6",
      schedule: {
        Thursday: [{ time: "09:00", subject: "Hindi", classId: "class-6A" }],
      },
    },
  ],

  // -------------------------------------------------
  // 8. CLASS‑CENTRIC TIMETABLE (one entry per class)
  // -------------------------------------------------
  classTimetables: [
    {
      classId: "class-1A",
      schedule: {
        Monday: [
          {
            time: "09:00",
            subject: "Science",
            teacherId: "t-1",
            teacherName: "Anil Sir",
          },
          {
            time: "10:00",
            subject: "Math",
            teacherId: "t-1",
            teacherName: "Anil Sir",
          },
        ],
        Tuesday: [
          {
            time: "09:00",
            subject: "English",
            teacherId: "t-3",
            teacherName: "Rina Maam",
          },
          {
            time: "10:00",
            subject: "Science",
            teacherId: "t-1",
            teacherName: "Anil Sir",
          },
        ],
        Wednesday: [
          {
            time: "09:00",
            subject: "Science",
            teacherId: "t-1",
            teacherName: "Anil Sir",
          },
        ],
        Thursday: [
          {
            time: "10:00",
            subject: "Math",
            teacherId: "t-1",
            teacherName: "Anil Sir",
          },
        ],
      },
    },
    {
      classId: "class-2A",
      schedule: {
        Monday: [
          {
            time: "09:00",
            subject: "Math",
            teacherId: "t-2",
            teacherName: "Shrikant Sir",
          },
          {
            time: "11:00",
            subject: "Science",
            teacherId: "t-1",
            teacherName: "Anil Sir",
          },
        ],
        Tuesday: [
          {
            time: "09:00",
            subject: "Math",
            teacherId: "t-1",
            teacherName: "Anil Sir",
          },
        ],
        Friday: [
          {
            time: "09:00",
            subject: "Science",
            teacherId: "t-1",
            teacherName: "Anil Sir",
          },
        ],
      },
    },
    {
      classId: "class-3A",
      schedule: {
        Monday: [
          {
            time: "11:00",
            subject: "English",
            teacherId: "t-3",
            teacherName: "Rina Maam",
          },
        ],
      },
    },
    {
      classId: "class-4A",
      schedule: {
        Friday: [
          {
            time: "14:00",
            subject: "History",
            teacherId: "t-4",
            teacherName: "Arun Sir",
          },
        ],
      },
    },
    {
      classId: "class-5A",
      schedule: {
        Wednesday: [
          {
            time: "10:00",
            subject: "Biology",
            teacherId: "t-5",
            teacherName: "Pooja Maam",
          },
        ],
      },
    },
    {
      classId: "class-6A",
      schedule: {
        Thursday: [
          {
            time: "09:00",
            subject: "Hindi",
            teacherId: "t-6",
            teacherName: "Kavita Maam",
          },
        ],
      },
    },
  ],
};

export const uid = (p = "id") =>
  `${p}_${Math.random().toString(36).slice(2, 9)}`;
