import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  useLocalStorage,
  SEED_SUBJECTS,
  SEED_EXAMS,
  uid,
  colorDot,
  type Subject,
  type Exam,
} from "@/lib/store";

export const Route = createFileRoute("/exams")({
  head: () => ({
    meta: [
      { title: "Exam Reminders — StudentHub" },
      { name: "description", content: "Upcoming exams with live countdowns." },
      { property: "og:title", content: "Exam Reminders — StudentHub" },
      { property: "og:description", content: "Upcoming exams with live countdowns." },
    ],
  }),
  component: ExamsPage,
});

function ExamsPage() {
  const [subjects] = useLocalStorage<Subject[]>("sh_subjects", SEED_SUBJECTS);
  const [exams, setExams] = useLocalStorage<Exam[]>("sh_exams", SEED_EXAMS);
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? "");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");

  const subjectById = Object.fromEntries(subjects.map((s) => [s.id, s]));
  const now = Date.now();
  const sorted = [...exams].sort((a, b) => a.date.localeCompare(b.date));

  const add = () => {
    const sid = subjectId || subjects[0]?.id;
    if (!title.trim() || !date || !sid) return;
    setExams([...exams, { id: uid(), title: title.trim(), subjectId: sid, date, venue: venue.trim() || "—" }]);
    setTitle("");
    setDate("");
    setVenue("");
  };

  return (
    <div className="max-w-3xl">
      <p className="font-mono text-[10px] tracking-[0.25em] text-mint mb-2">// EXAM REMINDERS</p>
      <h1 className="font-display text-4xl sm:text-5xl text-ice leading-[0.9] mb-7">Exam reminders</h1>

      <div className="glass-card p-5 mb-4 animate-rise">
        <p className="section-label mb-3">ADD EXAM</p>
        <div className="flex flex-wrap gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Exam title"
            className="flex-1 min-w-40 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-ice placeholder:text-ice/30 outline-none focus:border-mint/50"
          />
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
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-ice outline-none focus:border-mint/50 [color-scheme:dark]"
          />
          <input
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            placeholder="Venue"
            className="w-28 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-ice placeholder:text-ice/30 outline-none focus:border-mint/50"
          />
          <button onClick={add} className="inline-flex items-center gap-1.5 rounded-lg bg-mint px-4 py-2 text-sm font-semibold text-ink hover:bg-mint/90">
            <Plus className="size-4" /> Add
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {sorted.map((e, i) => {
          const subj = subjectById[e.subjectId];
          const ms = new Date(e.date).getTime() - now;
          const past = ms < 0;
          const hrs = Math.round(Math.abs(ms) / 3600000);
          const days = Math.floor(hrs / 24);
          const countdown = past ? "DONE" : days > 0 ? `IN ${days}D ${hrs % 24}H` : `IN ${hrs}H`;
          return (
            <div key={e.id} className={`glass-card flex items-center gap-4 px-5 py-4 animate-rise ${past ? "opacity-45" : ""}`} style={{ animationDelay: `${i * 50}ms` }}>
              <span className={`size-3 rounded-full shrink-0 ${subj ? colorDot[subj.color] : "bg-ice/30"}`} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ice">{e.title}</p>
                <p className="font-mono text-[10px] text-ice/40">
                  {new Date(e.date).toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })} · {e.venue}
                </p>
              </div>
              <span className={`ml-auto font-mono text-[10px] px-2 py-1 rounded ${past ? "bg-white/5 text-ice/40" : hrs <= 72 ? "bg-coral/15 text-coral" : "bg-mint/10 text-mint"}`}>
                {countdown}
              </span>
              <button
                onClick={() => setExams(exams.filter((x) => x.id !== e.id))}
                className="text-ice/30 hover:text-coral transition-colors"
                aria-label="Delete exam"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          );
        })}
        {exams.length === 0 && <p className="text-sm text-ice/40 py-6 text-center">No exams scheduled.</p>}
      </div>
    </div>
  );
}
