import { useEffect, useRef, useState } from "react";

export function useCurrentTime() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return now;
}

export type SubjectColor =
  | "sky"
  | "coral"
  | "mint"
  | "viol"
  | "amber"
  | "rose"
  | "lime"
  | "cyan"
  | "plum"
  | "sand";

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

export type AttendanceStatus = "present" | "absent";
/** key: `${YYYY-MM-DD}__${slotId}` */
export type AttendanceMarks = Record<string, AttendanceStatus>;

export interface Expense {
  id: string;
  label: string;
  category: string;
  amount: number;
  date: string;
  paymentMethod?: "cash" | "upi";
}
export interface ClearEvent {
  id: string;
  amount: number;
  timestamp: number; // For undo window logic
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

export interface Note {
  id: string;
  subjectId: string;
  topic: string;
  date: string;
  summary: string;
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function smartMerge(parsed: any, initial: any): any {
  if (Array.isArray(parsed) && Array.isArray(initial)) {
    const hasId = (arr: any[]) => arr.length > 0 && arr[0] && typeof arr[0].id !== "undefined";
    if (hasId(parsed) || hasId(initial)) {
      const parsedMap = new Map(parsed.map((item: any) => [item?.id, item]));
      const result = [...parsed];
      for (const initItem of initial) {
        if (!initItem || typeof initItem.id === "undefined") continue;
        if (parsedMap.has(initItem.id)) {
           const existing = parsedMap.get(initItem.id);
           const merged = smartMerge(existing, initItem);
           const idx = result.findIndex((r) => r?.id === initItem.id);
           if (idx !== -1) result[idx] = merged;
        } else {
           result.push(initItem);
        }
      }
      return result;
    }
    return parsed;
  }
  
  if (typeof parsed === "object" && parsed !== null && typeof initial === "object" && initial !== null) {
    const merged = { ...parsed };
    for (const key in initial) {
      if (!(key in parsed)) {
        merged[key] = initial[key];
      } else {
        merged[key] = smartMerge(parsed[key], initial[key]);
      }
    }
    return merged;
  }
  
  return parsed;
}

/** Hydration-safe localStorage state for SPA */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        return smartMerge(parsed, initial) as T;
      }
      return initial;
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

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

// ---- Helpers ----

export const inr = (n: number) =>
  "₹" + Math.round(n).toLocaleString("en-IN");

export const toDateKey = (d: Date) => {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

export const markKey = (dateKey: string, slotId: string) => `${dateKey}__${slotId}`;

/** Monday = 0 */
export const dayIndex = (d: Date) => (d.getDay() + 6) % 7;

export function examsOn(exams: Exam[], dateKey: string) {
  return exams.filter((e) => e.date.slice(0, 10) === dateKey);
}

/** Combines "classes held before tracking" with day-by-day marks. */
export function computeAttendance(
  baseline: Record<string, AttendanceRecord>,
  marks: AttendanceMarks,
  timetable: ClassSlot[],
  offDays: string[] = [],
): Record<string, AttendanceRecord> {
  const slotById = Object.fromEntries(timetable.map((s) => [s.id, s]));
  const out: Record<string, AttendanceRecord> = {};
  for (const [sid, r] of Object.entries(baseline)) {
    out[sid] = { attended: r.attended, total: r.total };
  }
  for (const [k, status] of Object.entries(marks)) {
    const [dateKey, slotId] = k.split("__");
    if (offDays.includes(dateKey)) continue;
    const slot = slotById[slotId ?? ""];
    if (!slot) continue;
    const cur = out[slot.subjectId] ?? { attended: 0, total: 0 };
    cur.total += 1;
    if (status === "present") cur.attended += 1;
    out[slot.subjectId] = cur;
  }
  return out;
}

// ---- Seed data ----

export const SEED_SUBJECTS: Subject[] = [];
export const SEED_ASSIGNMENTS: Assignment[] = [];
export const SEED_TIMETABLE: ClassSlot[] = [];
export const SEED_EXAMS: Exam[] = [];
export const SEED_ATTENDANCE: Record<string, AttendanceRecord> = {};
export const SEED_EXPENSES: Expense[] = [];
export const SEED_PROJECTS: Project[] = [];

export const SUBJECT_COLORS: SubjectColor[] = [
  "sky",
  "coral",
  "mint",
  "viol",
  "amber",
  "rose",
  "lime",
  "cyan",
  "plum",
  "sand",
];

export const colorDot: Record<SubjectColor, string> = {
  sky: "bg-sky",
  coral: "bg-coral",
  mint: "bg-mint",
  viol: "bg-viol",
  amber: "bg-amber",
  rose: "bg-rose",
  lime: "bg-lime",
  cyan: "bg-cyan",
  plum: "bg-plum",
  sand: "bg-sand",
};

export const colorBar: Record<SubjectColor, string> = {
  sky: "bg-sky/70",
  coral: "bg-coral/70",
  mint: "bg-mint/70",
  viol: "bg-viol/70",
  amber: "bg-amber/70",
  rose: "bg-rose/70",
  lime: "bg-lime/70",
  cyan: "bg-cyan/70",
  plum: "bg-plum/70",
  sand: "bg-sand/70",
};

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
