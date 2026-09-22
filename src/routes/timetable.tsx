import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  useLocalStorage,
  SEED_SUBJECTS,
  SEED_TIMETABLE,
  uid,
  colorBar,
  DAYS,
  type Subject,
  type ClassSlot,
} from "@/lib/store";

export const Route = createFileRoute("/timetable")({
  head: () => ({
    meta: [
      { title: "Class Timetable — Tan bee" },
      { name: "description", content: "Your weekly class timetable, color-coded by subject." },
      { property: "og:title", content: "Class Timetable — Tan bee" },
      { property: "og:description", content: "Your weekly class timetable, color-coded by subject." },
    ],
  }),
  component: TimetablePage,
});

function TimetablePage() {
  const [subjects] = useLocalStorage<Subject[]>("sh_subjects", SEED_SUBJECTS);
  const [slots, setSlots] = useLocalStorage<ClassSlot[]>("sh_timetable", SEED_TIMETABLE);
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? "");
  const [day, setDay] = useState(0);
  const [start, setStart] = useState("09:00");
  const [room, setRoom] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!confirmDeleteId) return;
    const t = setTimeout(() => setConfirmDeleteId(null), 3000);
    return () => clearTimeout(t);
  }, [confirmDeleteId]);

  const subjectById = Object.fromEntries(subjects.map((s) => [s.id, s]));

  const add = () => {
    const sid = subjectId || subjects[0]?.id;
    if (!sid) return;
    setSlots([...slots, { id: uid(), subjectId: sid, day, start, end: start, room: room.trim() || "—" }]);
    setRoom("");
  };

  return (
    <div className="max-w-5xl">
      <p className="font-mono text-[10px] tracking-[0.25em] text-mint mb-2">// TIMETABLE</p>
      <h1 className="font-display text-4xl sm:text-5xl text-ice leading-[0.9] mb-7">Class timetable</h1>

      <div className="glass-card p-5 mb-4 animate-rise">
        <p className="section-label mb-3">ADD CLASS SLOT</p>
        <div className="flex flex-wrap gap-2">
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-ice outline-none focus:border-mint/50 [&>option]:bg-panel"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <select
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
            className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-ice outline-none focus:border-mint/50 [&>option]:bg-panel"
          >
            {DAYS.map((d, i) => (
              <option key={d} value={i}>
                {d}
              </option>
            ))}
          </select>
          <input
            type="time"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-ice outline-none focus:border-mint/50 [color-scheme:dark]"
          />
          <input
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Room"
            className="w-28 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-ice placeholder:text-ice/30 outline-none focus:border-mint/50"
          />
          <button onClick={add} className="inline-flex items-center gap-1.5 rounded-lg bg-mint px-4 py-2 text-sm font-semibold text-ink hover:bg-mint/90">
            <Plus className="size-4" /> Add
          </button>
        </div>
      </div>

      <div className="glass-card p-5 overflow-x-auto animate-rise [animation-delay:80ms]">
        <div className="grid grid-cols-7 gap-2 min-w-[640px]">
          {DAYS.map((d, di) => (
            <div key={d}>
              <p className="font-mono text-[10px] text-ice/40 text-center tracking-widest mb-2">{d.toUpperCase()}</p>
              <div className="space-y-1.5">
                {slots
                  .filter((c) => c.day === di)
                  .sort((a, b) => a.start.localeCompare(b.start))
                  .map((c) => {
                    const subj = subjectById[c.subjectId];
                    return (
                      <div key={c.id} className={`group relative rounded-lg px-2 py-1.5 ${subj ? colorBar[subj.color] : "bg-white/20"}`}>
                        <p className="text-[11px] font-semibold text-ink leading-tight truncate">{subj?.name ?? "?"}</p>
                        <p className="font-mono text-[9px] text-ink/70">
                          {c.start} · {c.room}
                        </p>
                        {confirmDeleteId === c.id ? (
                          <button
                            onClick={() => setSlots(slots.filter((x) => x.id !== c.id))}
                            className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-md bg-coral text-ink text-[9px] font-bold z-10"
                            aria-label="Confirm delete"
                          >
                            CONFIRM
                          </button>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(c.id)}
                            className="absolute -top-1.5 -right-1.5 size-4 rounded-full bg-ink text-coral grid place-items-center z-10 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                            aria-label="Remove slot"
                          >
                            <Trash2 className="size-2.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                {slots.filter((c) => c.day === di).length === 0 && (
                  <div className="rounded-lg border border-dashed border-white/10 py-4 text-center font-mono text-[9px] text-ice/25">FREE</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
