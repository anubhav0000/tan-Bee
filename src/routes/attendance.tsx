import { createFileRoute } from "@tanstack/react-router";
import { Minus, Plus } from "lucide-react";
import {
  useLocalStorage,
  SEED_SUBJECTS,
  SEED_ATTENDANCE,
  colorDot,
  type Subject,
  type AttendanceRecord,
} from "@/lib/store";

export const Route = createFileRoute("/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance Calculator — StudentHub" },
      { name: "description", content: "Track attendance per subject and see how many classes you can miss." },
      { property: "og:title", content: "Attendance Calculator — StudentHub" },
      { property: "og:description", content: "Track attendance per subject and see how many classes you can miss." },
    ],
  }),
  component: AttendancePage,
});

const TARGET = 75;

function AttendancePage() {
  const [subjects] = useLocalStorage<Subject[]>("sh_subjects", SEED_SUBJECTS);
  const [attendance, setAttendance] = useLocalStorage<Record<string, AttendanceRecord>>("sh_attendance", SEED_ATTENDANCE);

  const update = (id: string, patch: Partial<AttendanceRecord>) => {
    const cur = attendance[id] ?? { attended: 0, total: 0 };
    const next = { ...cur, ...patch };
    next.attended = Math.max(0, Math.min(next.attended, next.total));
    next.total = Math.max(0, next.total);
    setAttendance({ ...attendance, [id]: next });
  };

  const totals = Object.values(attendance).reduce(
    (acc, r) => ({ attended: acc.attended + r.attended, total: acc.total + r.total }),
    { attended: 0, total: 0 },
  );
  const overall = totals.total ? Math.round((totals.attended / totals.total) * 100) : 0;

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
            {totals.attended} / {totals.total} CLASSES · TARGET {TARGET}%
          </p>
        </div>
        <div className="mt-4 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className={`h-full ${overall >= TARGET ? "bg-mint" : "bg-coral"}`} style={{ width: `${overall}%` }} />
        </div>
      </div>

      <div className="space-y-2">
        {subjects.map((s, i) => {
          const r = attendance[s.id] ?? { attended: 0, total: 0 };
          const pct = r.total ? Math.round((r.attended / r.total) * 100) : 0;
          // classes you can still miss while staying >= TARGET
          const canMiss = Math.max(0, Math.floor(r.attended / (TARGET / 100) - r.total));
          const mustAttend = pct >= TARGET ? 0 : Math.ceil((TARGET / 100 * r.total - r.attended) / (1 - TARGET / 100));
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
                <div className="flex items-center gap-1.5">
                  <button onClick={() => update(s.id, { attended: r.attended - 1 })} className="size-7 rounded-md bg-white/5 border border-white/10 grid place-items-center text-ice/60 hover:text-ice" aria-label="Attended minus">
                    <Minus className="size-3.5" />
                  </button>
                  <span className="font-mono text-[11px] text-ice/70 w-16 text-center">{r.attended} attended</span>
                  <button onClick={() => update(s.id, { attended: r.attended + 1, total: r.total + 1 })} className="size-7 rounded-md bg-white/5 border border-white/10 grid place-items-center text-ice/60 hover:text-ice" aria-label="Attended plus">
                    <Plus className="size-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => update(s.id, { total: r.total - 1 })} className="size-7 rounded-md bg-white/5 border border-white/10 grid place-items-center text-ice/60 hover:text-ice" aria-label="Total minus">
                    <Minus className="size-3.5" />
                  </button>
                  <span className="font-mono text-[11px] text-ice/70 w-14 text-center">{r.total} held</span>
                  <button onClick={() => update(s.id, { total: r.total + 1 })} className="size-7 rounded-md bg-white/5 border border-white/10 grid place-items-center text-ice/60 hover:text-ice" aria-label="Missed plus">
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
