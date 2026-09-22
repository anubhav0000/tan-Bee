import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, Minus, Plus, X } from "lucide-react";
import {
  useLocalStorage,
  useHydrated,
  SEED_SUBJECTS,
  SEED_TIMETABLE,
  SEED_EXAMS,
  SEED_ATTENDANCE,
  colorDot,
  computeAttendance,
  markKey,
  toDateKey,
  dayIndex,
  examsOn,
  DAYS,
  type Subject,
  type ClassSlot,
  type Exam,
  type AttendanceRecord,
  type AttendanceMarks,
  type AttendanceStatus,
} from "@/lib/store";

export const Route = createFileRoute("/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance Calculator — StudentHub" },
      { name: "description", content: "Mark present or absent each day, skip exam days, and see how many classes you can miss." },
      { property: "og:title", content: "Attendance Calculator — StudentHub" },
      { property: "og:description", content: "Mark present or absent each day, skip exam days, and see how many classes you can miss." },
    ],
  }),
  component: AttendancePage,
});

const TARGET = 75;

function AttendancePage() {
  const hydrated = useHydrated();
  const [subjects] = useLocalStorage<Subject[]>("sh_subjects", SEED_SUBJECTS);
  const [timetable] = useLocalStorage<ClassSlot[]>("sh_timetable", SEED_TIMETABLE);
  const [exams] = useLocalStorage<Exam[]>("sh_exams", SEED_EXAMS);
  const [baseline, setBaseline] = useLocalStorage<Record<string, AttendanceRecord>>("sh_attendance", SEED_ATTENDANCE);
  const [marks, setMarks] = useLocalStorage<AttendanceMarks>("sh_att_marks", {});
  const [offset, setOffset] = useState(0);

  const date = new Date();
  date.setDate(date.getDate() + offset);
  const dateKey = toDateKey(date);
  const di = dayIndex(date);
  const dayExams = examsOn(exams, dateKey);
  const isExamDay = dayExams.length > 0;

  const subjectById = Object.fromEntries(subjects.map((s) => [s.id, s]));
  const daySlots = timetable.filter((c) => c.day === di).sort((a, b) => a.start.localeCompare(b.start));

  const setMark = (slotId: string, status: AttendanceStatus | null) => {
    const key = markKey(dateKey, slotId);
    const next = { ...marks };
    if (status === null || next[key] === status) delete next[key];
    else next[key] = status;
    setMarks(next);
  };

  const totals = computeAttendance(baseline, marks, timetable);
  const grand = Object.values(totals).reduce(
    (acc, r) => ({ attended: acc.attended + r.attended, total: acc.total + r.total }),
    { attended: 0, total: 0 },
  );
  const overall = grand.total ? Math.round((grand.attended / grand.total) * 100) : 0;

  const updateBaseline = (id: string, patch: Partial<AttendanceRecord>) => {
    const cur = baseline[id] ?? { attended: 0, total: 0 };
    const next = { ...cur, ...patch };
    next.total = Math.max(0, next.total);
    next.attended = Math.max(0, Math.min(next.attended, next.total));
    setBaseline({ ...baseline, [id]: next });
  };

  const dateLabel = hydrated
    ? date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })
    : "…";

  return (
    <div className="max-w-3xl">
      <p className="font-mono text-[10px] tracking-[0.25em] text-mint mb-2">// ATTENDANCE</p>
      <h1 className="font-display text-4xl sm:text-5xl text-ice leading-[0.9] mb-7">Attendance calculator</h1>

      <div className="glass-card p-5 mb-4 animate-rise">
        <div className="flex items-end justify-between">
          <div>
            <p className="section-label">OVERALL</p>
            <p className="font-display text-6xl text-ice mt-2 leading-none">
              {overall}
              <span className="text-2xl text-mint">%</span>
            </p>
          </div>
          <p className="font-mono text-[10px] text-ice/40">
            {grand.attended} / {grand.total} CLASSES · TARGET {TARGET}%
          </p>
        </div>
        <div className="mt-4 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className={`h-full ${overall >= TARGET ? "bg-mint" : "bg-coral"}`} style={{ width: `${overall}%` }} />
        </div>
      </div>

      {/* Daily marking */}
      <div className="glass-card p-5 mb-4 animate-rise [animation-delay:60ms]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="section-label">MARK THE DAY</p>
            <p className="font-display text-2xl text-ice mt-1">{dateLabel}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setOffset(offset - 1)} className="size-8 rounded-lg bg-white/5 border border-white/10 grid place-items-center text-ice/60 hover:text-ice" aria-label="Previous day">
              <ChevronLeft className="size-4" />
            </button>
            <button onClick={() => setOffset(0)} className="rounded-lg bg-white/5 border border-white/10 px-3 h-8 font-mono text-[10px] text-ice/60 hover:text-ice">
              TODAY
            </button>
            <button onClick={() => setOffset(offset + 1)} className="size-8 rounded-lg bg-white/5 border border-white/10 grid place-items-center text-ice/60 hover:text-ice" aria-label="Next day">
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        {isExamDay ? (
          <div className="rounded-xl border border-coral/30 bg-coral/[0.07] px-4 py-4">
            <p className="font-mono text-[10px] tracking-[0.2em] text-coral">EXAM DAY · ATTENDANCE SKIPPED</p>
            <div className="mt-2 space-y-1">
              {dayExams.map((e) => (
                <p key={e.id} className="text-sm text-ice">
                  {e.title}
                  <span className="text-ice/40 text-xs"> · {e.venue}</span>
                </p>
              ))}
            </div>
            <p className="text-xs text-ice/50 mt-3">Classes on {DAYS[di]} are not counted towards your percentage.</p>
          </div>
        ) : daySlots.length === 0 ? (
          <p className="text-sm text-ice/50 py-4">No classes scheduled on {DAYS[di]}.</p>
        ) : (
          <div className="space-y-1.5">
            {daySlots.map((c) => {
              const subj = subjectById[c.subjectId];
              const status = marks[markKey(dateKey, c.id)];
              return (
                <div key={c.id} className="flex items-center gap-3 rounded-lg px-3 py-2.5 bg-white/[0.03]">
                  <span className={`size-2.5 rounded-full ${subj ? colorDot[subj.color] : "bg-ice/30"}`} />
                  <span className="font-mono text-[11px] text-ice/50 w-12">{c.start}</span>
                  <span className="text-sm font-medium text-ice truncate">{subj?.name ?? "Unknown"}</span>
                  <span className="hidden sm:inline text-xs text-ice/35">{c.room}</span>
                  <div className="ml-auto flex items-center gap-1.5">
                    <button
                      onClick={() => setMark(c.id, "present")}
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 h-8 text-xs font-semibold transition-colors ${
                        status === "present" ? "bg-mint text-ink" : "bg-white/5 border border-white/10 text-ice/60 hover:text-ice"
                      }`}
                    >
                      <Check className="size-3.5" /> Present
                    </button>
                    <button
                      onClick={() => setMark(c.id, "absent")}
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 h-8 text-xs font-semibold transition-colors ${
                        status === "absent" ? "bg-coral text-ink" : "bg-white/5 border border-white/10 text-ice/60 hover:text-ice"
                      }`}
                    >
                      <X className="size-3.5" /> Absent
                    </button>
                  </div>
                </div>
              );
            })}
            <p className="font-mono text-[9px] text-ice/30 pt-2">TAP AGAIN TO CLEAR A MARK (DAY SKIPPED, NOT COUNTED)</p>
          </div>
        )}
      </div>

      {/* Per subject */}
      <div className="space-y-2">
        {subjects.map((s, i) => {
          const r = totals[s.id] ?? { attended: 0, total: 0 };
          const b = baseline[s.id] ?? { attended: 0, total: 0 };
          const pct = r.total ? Math.round((r.attended / r.total) * 100) : 0;
          const canMiss = Math.max(0, Math.floor(r.attended / (TARGET / 100) - r.total));
          const mustAttend = pct >= TARGET ? 0 : Math.ceil(((TARGET / 100) * r.total - r.attended) / (1 - TARGET / 100));
          return (
            <div key={s.id} className="glass-card px-5 py-4 animate-rise" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-center gap-3">
                <span className={`size-3 rounded-full ${colorDot[s.color]}`} />
                <p className="text-sm font-semibold text-ice">{s.name}</p>
                <span className={`ml-auto font-display text-2xl ${pct >= TARGET ? "text-mint" : "text-coral"}`}>{pct}%</span>
              </div>
              <div className="mt-3 h-1 rounded-full bg-white/10 overflow-hidden">
                <div className={`h-full ${pct >= TARGET ? "bg-mint" : "bg-coral"}`} style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] text-ice/40">{r.attended} / {r.total} COUNTED</span>
                <div className="flex items-center gap-1.5 ml-2">
                  <span className="font-mono text-[9px] text-ice/30">HELD BEFORE</span>
                  <button onClick={() => updateBaseline(s.id, { attended: b.attended - 1 })} className="size-7 rounded-md bg-white/5 border border-white/10 grid place-items-center text-ice/60 hover:text-ice" aria-label="Prior attended minus">
                    <Minus className="size-3.5" />
                  </button>
                  <span className="font-mono text-[11px] text-ice/70 w-16 text-center">{b.attended} att.</span>
                  <button onClick={() => updateBaseline(s.id, { attended: b.attended + 1, total: Math.max(b.total, b.attended + 1) })} className="size-7 rounded-md bg-white/5 border border-white/10 grid place-items-center text-ice/60 hover:text-ice" aria-label="Prior attended plus">
                    <Plus className="size-3.5" />
                  </button>
                  <button onClick={() => updateBaseline(s.id, { total: b.total - 1 })} className="size-7 rounded-md bg-white/5 border border-white/10 grid place-items-center text-ice/60 hover:text-ice" aria-label="Prior total minus">
                    <Minus className="size-3.5" />
                  </button>
                  <span className="font-mono text-[11px] text-ice/70 w-14 text-center">{b.total} held</span>
                  <button onClick={() => updateBaseline(s.id, { total: b.total + 1 })} className="size-7 rounded-md bg-white/5 border border-white/10 grid place-items-center text-ice/60 hover:text-ice" aria-label="Prior total plus">
                    <Plus className="size-3.5" />
                  </button>
                </div>
                <span className="ml-auto font-mono text-[10px] text-ice/40">
                  {pct >= TARGET ? `CAN MISS ${canMiss}` : `MUST ATTEND NEXT ${mustAttend}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
