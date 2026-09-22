import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  useLocalStorage,
  useHydrated,
  SEED_SUBJECTS,
  SEED_ASSIGNMENTS,
  SEED_TIMETABLE,
  SEED_EXAMS,
  SEED_ATTENDANCE,
  SEED_EXPENSES,
  colorDot,
  colorBar,
  computeAttendance,
  toDateKey,
  examsOn,
  inr,
  DAYS,
  type Subject,
  type Assignment,
  type ClassSlot,
  type Exam,
  type AttendanceRecord,
  type AttendanceMarks,
  type Expense,
} from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Tan bee" },
      { name: "description", content: "Your day at a glance: classes, assignments, attendance, expenses and the next exam." },
      { property: "og:title", content: "Dashboard — Tan bee" },
      { property: "og:description", content: "Your day at a glance: classes, assignments, attendance, expenses and the next exam." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [subjects] = useLocalStorage<Subject[]>("sh_subjects", SEED_SUBJECTS);
  const [assignments] = useLocalStorage<Assignment[]>("sh_assignments", SEED_ASSIGNMENTS);
  const [timetable] = useLocalStorage<ClassSlot[]>("sh_timetable", SEED_TIMETABLE);
  const [exams] = useLocalStorage<Exam[]>("sh_exams", SEED_EXAMS);
  const [baseline] = useLocalStorage<Record<string, AttendanceRecord>>("sh_attendance", SEED_ATTENDANCE);
  const [marks] = useLocalStorage<AttendanceMarks>("sh_att_marks", {});
  const [expenses] = useLocalStorage<Expense[]>("sh_expenses", SEED_EXPENSES);
  const [userName] = useLocalStorage<string>("sh_user_name", "");
  const hydrated = useHydrated();

  const now = new Date();
  const today = (now.getDay() + 6) % 7; // Mon=0
  const todayKey = toDateKey(now);
  const todayExams = examsOn(exams, todayKey);
  const dateLabel = hydrated
    ? now.toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })
    : "Today";

  const subjectById = Object.fromEntries(subjects.map((s) => [s.id, s]));
  const todaysClasses = timetable
    .filter((c) => c.day === today)
    .sort((a, b) => a.start.localeCompare(b.start));

  const pending = assignments.filter((a) => !a.done);
  const dueThisWeek = pending.filter((a) => {
    const diff = (new Date(a.due).getTime() - now.getTime()) / 86400000;
    return diff <= 7;
  }).length;

  const attendance = computeAttendance(baseline, marks, timetable);
  const attended = Object.values(attendance).reduce((s, r) => s + r.attended, 0);
  const total = Object.values(attendance).reduce((s, r) => s + r.total, 0);
  const pct = total ? Math.round((attended / total) * 100) : 0;

  const monthKey = now.toISOString().slice(0, 7);
  const monthSpend = expenses
    .filter((e) => e.date.startsWith(monthKey))
    .reduce((s, e) => s + e.amount, 0);

  const nextExam = exams
    .filter((e) => new Date(e.date).getTime() > now.getTime())
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  const examHrs = nextExam
    ? Math.max(1, Math.round((new Date(nextExam.date).getTime() - now.getTime()) / 3600000))
    : null;

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 mb-7 animate-rise">
        <div>
          <p className="font-mono text-[10px] tracking-[0.25em] text-mint mb-2">// HELLO, {userName.toUpperCase()}</p>
          <h1 className="font-display text-4xl sm:text-5xl text-ice leading-[0.9] tracking-tight">{dateLabel}</h1>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] text-ice/40">SEMESTER IN SESSION</p>
          <p className="font-display text-2xl text-ice/80 mt-1">
            {todaysClasses.length} {todaysClasses.length === 1 ? "CLASS" : "CLASSES"} TODAY
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-4">
        <Link to="/assignments" className="xl:col-span-3 glass-card p-5 block hover:bg-white/[0.07] transition-colors animate-rise [animation-delay:60ms]">
          <p className="section-label">PENDING ASSIGNMENTS</p>
          <p className="font-display text-5xl text-ice mt-3 leading-none">{String(pending.length).padStart(2, "0")}</p>
          <p className="text-xs text-ice/50 mt-3">{dueThisWeek} due this week</p>
          <div className="mt-4 h-1 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-coral" style={{ width: `${Math.min(100, pending.length * 14)}%` }} />
          </div>
        </Link>

        <Link to="/attendance" className="xl:col-span-3 glass-card p-5 block hover:bg-white/[0.07] transition-colors animate-rise [animation-delay:120ms]">
          <p className="section-label">ATTENDANCE</p>
          <p className="font-display text-5xl text-ice mt-3 leading-none">
            {pct}
            <span className="text-2xl text-mint">%</span>
          </p>
          <p className="text-xs text-ice/50 mt-3">Target 75% · {pct >= 75 ? "on track" : "below target"}</p>
          <div className="mt-4 h-1 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-mint" style={{ width: `${pct}%` }} />
          </div>
        </Link>

        <Link to="/expenses" className="xl:col-span-3 glass-card p-5 block hover:bg-white/[0.07] transition-colors animate-rise [animation-delay:180ms]">
          <p className="section-label">EXPENSES · THIS MONTH</p>
          <p className="font-display text-5xl text-ice mt-3 leading-none">{inr(monthSpend)}</p>
          <p className="text-xs text-ice/50 mt-3">{expenses.filter((e) => e.date.startsWith(monthKey)).length} entries logged</p>
          <div className="mt-4 h-1 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-sky" style={{ width: `${Math.min(100, (monthSpend / 500) * 100)}%` }} />
          </div>
        </Link>

        <Link to="/exams" className="xl:col-span-3 rounded-2xl border border-mint/30 bg-mint/[0.06] backdrop-blur-md p-5 block hover:bg-mint/[0.1] transition-colors animate-rise [animation-delay:240ms]">
          <p className="font-mono text-[10px] tracking-[0.2em] text-mint flex items-center gap-2">
            NEXT EXAM <span className="size-1.5 rounded-full bg-coral animate-pulse" />
          </p>
          {nextExam ? (
            <>
              <p className="font-display text-4xl text-ice mt-3 leading-none">
                {examHrs}
                <span className="text-xl text-coral"> HRS</span>
              </p>
              <p className="text-xs text-ice/60 mt-3">
                {nextExam.title} ·{" "}
                {new Date(nextExam.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              </p>
            </>
          ) : (
            <p className="text-sm text-ice/50 mt-4">No upcoming exams</p>
          )}
        </Link>

        <div className="sm:col-span-2 xl:col-span-7 glass-card p-5 animate-rise [animation-delay:300ms]">
          <div className="flex items-center justify-between mb-4">
            <p className="section-label">TODAY'S CLASSES</p>
            <Link to="/timetable" className="font-mono text-[10px] text-mint/70 hover:text-mint">
              FULL TIMETABLE →
            </Link>
          </div>
          {todayExams.length > 0 && (
            <p className="mb-3 rounded-lg border border-coral/30 bg-coral/[0.07] px-3 py-2 font-mono text-[10px] tracking-[0.15em] text-coral">
              EXAM DAY · ATTENDANCE NOT COUNTED TODAY
            </p>
          )}
          {todaysClasses.length === 0 ? (
            <p className="text-sm text-ice/50 py-4">No classes today. Add slots on the timetable page.</p>
          ) : (
            <div className="space-y-1">
              {todaysClasses.map((c) => {
                const subj = subjectById[c.subjectId];
                return (
                  <div key={c.id} className="flex items-center gap-4 rounded-lg px-3 py-2.5 bg-white/[0.03] hover:bg-white/[0.07] transition-colors">
                    <span className={`size-2 rounded-full ${subj ? colorDot[subj.color] : "bg-ice/30"}`} />
                    <span className="font-mono text-[11px] text-ice/50 w-14">{c.start}</span>
                    <span className="text-sm font-medium text-ice">{subj?.name ?? "Unknown"}</span>
                    <span className="ml-auto text-xs text-ice/40">{c.room}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="sm:col-span-2 xl:col-span-5 glass-card p-5 relative overflow-hidden animate-rise [animation-delay:360ms]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 left-1/4 w-40 h-[150%] bg-gradient-to-b from-white/10 to-transparent rotate-[-14deg] animate-sweep" />
          </div>
          <div className="relative">
            <p className="section-label mb-4">WEEKLY TIMETABLE</p>
            <div className="grid grid-cols-5 gap-1.5">
              {[0, 1, 2, 3, 4].map((d) => (
                <div key={d} className="space-y-1.5">
                  <p className="font-mono text-[9px] text-ice/40 text-center mb-1">{DAYS[d]}</p>
                  {timetable
                    .filter((c) => c.day === d)
                    .sort((a, b) => a.start.localeCompare(b.start))
                    .map((c) => {
                      const subj = subjectById[c.subjectId];
                      return <div key={c.id} title={subj?.name} className={`h-6 rounded ${subj ? colorBar[subj.color] : "bg-white/20"}`} />;
                    })}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-4 font-mono text-[9px] text-ice/40">
              {subjects.map((s) => (
                <span key={s.id} className="flex items-center gap-1.5">
                  <span className={`size-2 rounded ${colorBar[s.color]}`} />
                  {s.code}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
