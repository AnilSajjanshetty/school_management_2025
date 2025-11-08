// components/ClassTeacherDashboard/navConfig.js
import {
  TrendingUp,
  UserCheck,
  BookOpen,
  Clock,
  Megaphone,
  Calendar,
  FileText,
  MessageSquare,
} from "lucide-react";

export const navItems = [
  { tab: "overview", icon: TrendingUp, label: "Overview" },
  { tab: "myclass", icon: UserCheck, label: "My Class" },
  { tab: "teaching", icon: BookOpen, label: "Classes I Teach" },
  { tab: "timetables", icon: Clock, label: "Timetables" },
  { tab: "announcements", icon: Megaphone, label: "Announcements" },
  { tab: "events", icon: Calendar, label: "Events" },
  { tab: "exams", icon: FileText, label: "Exams" },
  { tab: "messages", icon: MessageSquare, label: "Messages" },
];
