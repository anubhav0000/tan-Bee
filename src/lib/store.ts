import { useEffect, useState } from "react";

export type SubjectColor = "sky" | "coral" | "mint" | "viol";

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: SubjectColor;
}

export interface Assignment {
  id: string;
  title: string;
  subjectId: string;
  due: string; // ISO date
  done: boolean;
}

export interface ClassSlot {
  id: string;
  subjectId: string;
  day: number; // 0=Mon ... 6=Sun
  start: string; // "09:00"
  end: string;
  room: string;
}

export interface Exam {
  id: string;
  subjectId: string;
  title: string;
  date: string; // ISO datetime
  venue: string;
}

export interface AttendanceRecord {
  attended: number;
  total: number;
}

export interface Expense {
  id: string;
  label: string;
  category: string;
  amount: number;
  date: string; // ISO date
}

export interface ProjectTask {
  id: string;
  title: string;
  done: boolean;
  assignee: string;
}

export interface Project {
  id: string;
  name: string;
  members: string[];
  tasks: ProjectTask[];
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }, [key, value]);

  return [value, setValue] as const;
}

// ---- Seed data ----

export const SEED_SUBJECTS: Subject[] = [
  { id: "s-cs", name: "Data Structures", code: "CS 201", color: "sky" },
  { id: "s-math", name: "Linear Algebra", code: "MATH 210", color: "coral" },
  { id: "s-chem", name: "Organic Chemistry", code: "CHEM 230", color: "mint" },
  { id: "s-des", name: "Design Systems", code: "DES 305", color: "viol" },
];

const dayISO = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

export const SEED_ASSIGNMENTS: Assignment[] = [
  { id: uid(), title: "Problem Set 5 — Trees", subjectId: "s-cs", due: dayISO(1), done: false },
  { id: uid(), title: "Eigenvalues worksheet", subjectId: "s-math", due: dayISO(3), done: false },
  { id: uid(), title: "Mechanisms lab report", subjectId: "s-chem", due: dayISO(5), done: false },
  { id: uid(), title: "Component audit", subjectId: "s-des", due: dayISO(7), done: false },
  { id: uid(), title: "Problem Set 4 — Graphs", subjectId: "s-cs", due: dayISO(-2), done: true },
];

export const SEED_TIMETABLE: ClassSlot[] = [
  { id: uid(), subjectId: "s-cs", day: 0, start: "09:00", end: "10:30", room: "Rm 204" },
  { id: uid(), subjectId: "s-math", day: 0, start: "11:30", end: "13:00", room: "Rm 118" },
  { id: uid(), subjectId: "s-chem", day: 1, start: "14:00", end: "16:00", room: "Lab 3" },
  { id: uid(), subjectId: "s-cs", day: 1, start: "09:00", end: "10:30", room: "Rm 204" },
  { id: uid(), subjectId: "s-des", day: 2, start: "16:00", end: "18:00", room: "Studio A" },
  { id: uid(), subjectId: "s-math", day: 2, start: "11:30", end: "13:00", room: "Rm 118" },
  { id: uid(), subjectId: "s-chem", day: 3, start: "10:00", end: "11:30", room: "Rm 310" },
  { id: uid(), subjectId: "s-des", day: 4, start: "16:00", end: "18:00", room: "Studio A" },
  { id: uid(), subjectId: "s-cs", day: 4, start: "09:00", end: "10:30", room: "Rm 204" },
];

export const SEED_EXAMS: Exam[] = [
  { id: uid(), subjectId: "s-cs", title: "Data Structures Midterm", date: `${dayISO(3)}T09:00`, venue: "Hall B" },
  { id: uid(), subjectId: "s-math", title: "Linear Algebra Quiz", date: `${dayISO(9)}T11:00`, venue: "Rm 118" },
  { id: uid(), subjectId: "s-des", title: "Design Systems Final", date: `${dayISO(20)}T14:00`, venue: "Studio A" },
];

export const SEED_ATTENDANCE: Record<string, AttendanceRecord> = {
  "s-cs": { attended: 21, total: 24 },
  "s-math": { attended: 18, total: 22 },
  "s-chem": { attended: 15, total: 18 },
  "s-des": { attended: 12, total: 14 },
};

export const SEED_EXPENSES: Expense[] = [
  { id: uid(), label: "Algorithms textbook", category: "Books", amount: 54, date: dayISO(-6) },
  { id: uid(), label: "Lab coat & goggles", category: "Supplies", amount: 32, date: dayISO(-4) },
  { id: uid(), label: "Bus pass", category: "Transport", amount: 40, date: dayISO(-3) },
  { id: uid(), label: "Printing — lab report", category: "Printing", amount: 8, date: dayISO(-2) },
  { id: uid(), label: "Canteen", category: "Food", amount: 12, date: dayISO(-1) },
];

export const SEED_PROJECTS: Project[] = [
  {
    id: uid(),
    name: "App Design Capstone",
    members: ["You", "Riya", "Kabir", "Lena"],
    tasks: [
      { id: uid(), title: "Wireframes", done: true, assignee: "You" },
      { id: uid(), title: "User interviews", done: true, assignee: "Riya" },
      { id: uid(), title: "Hi-fi mockups", done: false, assignee: "Kabir" },
      { id: uid(), title: "Prototype handoff", done: false, assignee: "Lena" },
    ],
  },
];

export const colorDot: Record<SubjectColor, string> = {
  sky: "bg-sky",
  coral: "bg-coral",
  mint: "bg-mint",
  viol: "bg-viol",
};

export const colorBar: Record<SubjectColor, string> = {
  sky: "bg-sky/70",
  coral: "bg-coral/70",
  mint: "bg-mint/70",
  viol: "bg-viol/70",
};

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
