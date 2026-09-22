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
      { title: "Attendance Calculator — Tan bee" },
      { name: "description", content: "Mark present or absent each day, skip exam days, and see how many classes you can miss." },
      { property: "og:title", content: "Attendance Calculator — Tan bee" },
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
  const [offDays, setOffDays] = useLocalStorage<string[]>("sh_off_days", []);
  const [workingDays, setWorkingDays] = useLocalStorage("sh_working_days", 100);
  const [offset, setOffset] = useState(0);

  const date = new Date();
  date.setDate(date.getDate() + offset);
  const dateKey = toDateKey(date);
  const di = dayIndex(date);
  const dayExams = examsOn(exams, dateKey);
  const isExamDay = dayExams.length > 0;
  const isOffDay = offDays.includes(dateKey);

  const daySlots = timetable.filter((c) => c.day === di).sort((a, b) => a.start.localeCompare(b.start));

  const dayStatus = marks[dateKey] as AttendanceStatus | undefined;

  const attendedDays = (baseline["global"]?.attended || 0) + Object.values(marks).filter(v => v === "present").length;
  const totalTrackedDays = (baseline["global"]?.total || 0) + Object.keys(marks).filter(k => !k.includes('__')).length; // Ignore old slot marks if any
  const overall = totalTrackedDays ? Math.round((attendedDays / totalTrackedDays) * 100) : 0;
  
  const requiredDays = Math.ceil(workingDays * 0.85);
  const remainingDays = Math.max(0, requiredDays - attendedDays);

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
            {attendedDays} / {totalTrackedDays} DAYS RECORDED · TARGET 85%
          </p>
        </div>
        <div className="mt-4 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className={`h-full ${overall >= 85 ? "bg-mint" : "bg-coral"}`} style={{ width: `${overall}%` }} />
        </div>
      </div>

      <div className="glass-card p-5 mb-4 animate-rise [animation-delay:30ms]">
        <p className="section-label mb-3">SEMESTER GOAL (85%)</p>
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm text-ice/70">Total Working Days</label>
          <input
            type="number"
            value={workingDays}
            onChange={(e) => setWorkingDays(parseInt(e.target.value) || 0)}
            className="w-20 rounded-md bg-white/5 border border-white/10 px-2 py-1 text-right text-ice focus:outline-none focus:border-mint"
          />
        </div>
        <div className="flex justify-between items-center text-sm text-ice">
          <span>Required to attend (85%):</span>
          <span className="font-semibold text-mint">{requiredDays} days</span>
        </div>
        <div className="flex justify-between items-center text-sm text-ice mt-2">
          <span>Days left to hit target:</span>
          <span className="font-semibold text-coral">{remainingDays} days</span>
        </div>
      </div>

      {/* Daily marking */}
      <div className="glass-card p-5 mb-4 animate-rise [animation-delay:60ms]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="section-label">MARK THE DAY</p>
            <p className="font-display text-2xl text-ice mt-1">{dateLabel}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
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
            <button 
              onClick={() => setOffDays(isOffDay ? offDays.filter(d => d !== dateKey) : [...offDays, dateKey])}
              className={`text-[10px] font-mono px-2 py-1 rounded border transition-colors ${isOffDay ? 'bg-mint/20 text-mint border-mint/30 hover:bg-mint/30' : 'bg-white/5 text-ice/50 border-white/10 hover:text-ice hover:bg-white/10'}`}
            >
              {isOffDay ? 'MARKED AS OFF DAY' : 'MARK AS OFF DAY'}
            </button>
          </div>
        </div>

        {isOffDay ? (
          <div className="rounded-xl border border-mint/30 bg-mint/[0.07] px-4 py-4 mt-2">
            <p className="font-mono text-[10px] tracking-[0.2em] text-mint">OFF DAY · ATTENDANCE SKIPPED</p>
            <p className="text-sm text-ice mt-2">You marked this day as a holiday or off day.</p>
            <p className="text-xs text-ice/50 mt-1">Classes on this day are not counted towards your percentage.</p>
          </div>
        ) : isExamDay ? (
          <div className="rounded-xl border border-coral/30 bg-coral/[0.07] px-4 py-4 mt-2">
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
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <button
                onClick={() => {
                  const next = { ...marks };
                  next[dateKey] = "present";
                  setMarks(next);
                }}
                className={`flex-1 inline-flex justify-center items-center gap-1.5 rounded-lg py-2.5 text-xs font-semibold transition-colors ${dayStatus === 'present' ? 'bg-mint text-ink' : 'bg-mint/10 text-mint hover:bg-mint/20'}`}
              >
                <Check className="size-4" /> Full Day Present
              </button>
              <button
                onClick={() => {
                  const next = { ...marks };
                  next[dateKey] = "absent";
                  setMarks(next);
                }}
                className={`flex-1 inline-flex justify-center items-center gap-1.5 rounded-lg py-2.5 text-xs font-semibold transition-colors ${dayStatus === 'absent' ? 'bg-coral text-ink' : 'bg-coral/10 text-coral hover:bg-coral/20'}`}
              >
                <X className="size-4" /> Full Day Absent
              </button>
              {dayStatus && (
                <button
                  onClick={() => {
                    const next = { ...marks };
                    delete next[dateKey];
                    setMarks(next);
                  }}
                  className="size-9 rounded-lg bg-white/5 border border-white/10 grid place-items-center text-ice/60 hover:text-ice"
                  aria-label="Clear mark"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <div className="space-y-1.5">
            {daySlots.map((c) => {
              const subj = subjects.find(s => s.id === c.subjectId);
              return (
                <div key={c.id} className="flex items-center gap-3 rounded-lg px-3 py-2.5 bg-white/[0.03]">
                  <span className={`size-2.5 rounded-full ${subj ? colorDot[subj.color] : "bg-ice/30"}`} />
                  <span className="font-mono text-[11px] text-ice/50 w-12">{c.start}</span>
                  <span className="text-sm font-medium text-ice truncate">{subj?.name ?? "Unknown"}</span>
                  <span className="hidden sm:inline text-xs text-ice/35">{c.room}</span>
                </div>
              );
            })}
            </div>
          </div>
        )}
      </div>

      {/* Off Days Log */}
      <div className="glass-card px-5 py-4 mt-6 animate-rise">
        <div className="flex items-center gap-3">
          <p className="text-sm font-semibold text-ice">Off Days Log</p>
        </div>
        <p className="text-xs text-ice/50 mt-1 mb-3">Dates you marked as holidays or skipped.</p>
        {offDays.length === 0 ? (
          <p className="text-xs text-ice/30 italic">No off days recorded yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {offDays.sort().map(d => (
              <div key={d} className="bg-mint/10 border border-mint/20 text-mint px-2 py-1 rounded text-xs font-mono">
                {d}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Global baseline editor */}
      <div className="glass-card px-5 py-4 mt-6 animate-rise">
        <div className="flex items-center gap-3">
          <p className="text-sm font-semibold text-ice">Global Attendance Adjustments</p>
        </div>
        <p className="text-xs text-ice/50 mt-1">Adjust your total prior attendance if you missed tracking days.</p>
        
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[9px] text-ice/30">ATTENDED</span>
            <button onClick={() => updateBaseline("global", { attended: (baseline["global"]?.attended || 0) - 1 })} className="size-7 rounded-md bg-white/5 border border-white/10 grid place-items-center text-ice/60 hover:text-ice" aria-label="Prior attended minus">
              <Minus className="size-3.5" />
            </button>
            <span className="font-mono text-[11px] text-ice/70 w-16 text-center">{baseline["global"]?.attended || 0} extra</span>
            <button onClick={() => updateBaseline("global", { attended: (baseline["global"]?.attended || 0) + 1, total: Math.max(baseline["global"]?.total || 0, (baseline["global"]?.attended || 0) + 1) })} className="size-7 rounded-md bg-white/5 border border-white/10 grid place-items-center text-ice/60 hover:text-ice" aria-label="Prior attended plus">
              <Plus className="size-3.5" />
            </button>
            
            <span className="font-mono text-[9px] text-ice/30 ml-4">TOTAL</span>
            <button onClick={() => updateBaseline("global", { total: (baseline["global"]?.total || 0) - 1 })} className="size-7 rounded-md bg-white/5 border border-white/10 grid place-items-center text-ice/60 hover:text-ice" aria-label="Prior total minus">
              <Minus className="size-3.5" />
            </button>
            <span className="font-mono text-[11px] text-ice/70 w-14 text-center">{baseline["global"]?.total || 0} extra</span>
            <button onClick={() => updateBaseline("global", { total: (baseline["global"]?.total || 0) + 1 })} className="size-7 rounded-md bg-white/5 border border-white/10 grid place-items-center text-ice/60 hover:text-ice" aria-label="Prior total plus">
              <Plus className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
