import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2, Check } from "lucide-react";
import {
  useLocalStorage,
  SEED_SUBJECTS,
  SEED_ASSIGNMENTS,
  uid,
  colorDot,
  type Subject,
  type Assignment,
} from "@/lib/store";

export const Route = createFileRoute("/assignments")({
  head: () => ({
    meta: [
      { title: "Assignments — Tan bee" },
      { name: "description", content: "Track assignments and due dates." },
      { property: "og:title", content: "Assignments — Tan bee" },
      { property: "og:description", content: "Track assignments and due dates." },
    ],
  }),
  component: AssignmentsPage,
});

function AssignmentsPage() {
  const [subjects] = useLocalStorage<Subject[]>("sh_subjects", SEED_SUBJECTS);
  const [assignments, setAssignments] = useLocalStorage<Assignment[]>("sh_assignments", SEED_ASSIGNMENTS);
  const [tutorialMode] = useLocalStorage<boolean>("sh_tutorial_mode", false);
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? "");
  const [due, setDue] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!confirmDeleteId) return;
    const t = setTimeout(() => setConfirmDeleteId(null), 3000);
    return () => clearTimeout(t);
  }, [confirmDeleteId]);

  const subjectById = Object.fromEntries(subjects.map((s) => [s.id, s]));
  const sorted = [...assignments].sort((a, b) => Number(a.done) - Number(b.done) || a.due.localeCompare(b.due));
  const now = new Date().toISOString().slice(0, 10);

  const add = () => {
    if (!title.trim() || !due) return;
    const sid = subjectId || subjects[0]?.id;
    if (!sid) return;
    setAssignments([...assignments, { id: uid(), title: title.trim(), subjectId: sid, due, done: false }]);
    setTitle("");
    setDue("");
  };

  return (
    <div className="max-w-3xl">
      <p className="font-mono text-[10px] tracking-[0.25em] text-mint mb-2">// ASSIGNMENTS</p>
      <h1 className="font-display text-4xl sm:text-5xl text-ice leading-[0.9] mb-7">Assignments</h1>

      <div className="glass-card p-5 mb-4 animate-rise">
        <p className="section-label mb-3">NEW ASSIGNMENT</p>
        <div className="flex flex-wrap gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
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
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-ice outline-none focus:border-mint/50 [color-scheme:dark]"
          />
          <button onClick={add} className="inline-flex items-center gap-1.5 rounded-lg bg-mint px-4 py-2 text-sm font-semibold text-ink hover:bg-mint/90">
            <Plus className="size-4" /> Add
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {sorted.map((a, i) => {
          const subj = subjectById[a.subjectId];
          const overdue = !a.done && a.due < now;
          return (
            <div
              key={a.id}
              className={`glass-card flex items-center gap-4 px-5 py-4 animate-rise ${a.done ? "opacity-45" : ""}`}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <button
                onClick={() => setAssignments(assignments.map((x) => (x.id === a.id ? { ...x, done: !x.done } : x)))}
                className={`size-5 rounded-md border grid place-items-center shrink-0 transition-colors ${
                  a.done ? "bg-mint border-mint text-ink" : "border-white/20 hover:border-mint/60"
                }`}
                aria-label="Toggle done"
              >
                {a.done && <Check className="size-3.5" />}
              </button>
              <span className={`size-2 rounded-full shrink-0 ${subj ? colorDot[subj.color] : "bg-ice/30"}`} />
              <div className="min-w-0">
                <p className={`text-sm font-medium text-ice ${a.done ? "line-through" : ""}`}>{a.title}</p>
                <p className="font-mono text-[10px] text-ice/40">{subj?.name}</p>
              </div>
              <span
                className={`ml-auto font-mono text-[10px] px-2 py-1 rounded ${
                  overdue ? "bg-coral/15 text-coral" : a.done ? "bg-white/5 text-ice/40" : "bg-mint/10 text-mint"
                }`}
              >
                {a.done ? "DONE" : overdue ? "OVERDUE" : `DUE ${a.due.slice(5)}`}
              </span>
              {confirmDeleteId === a.id ? (
                <button
                  onClick={() => setAssignments(assignments.filter((x) => x.id !== a.id))}
                  className="ml-2 text-ink bg-coral hover:bg-coral/90 px-3 py-1.5 rounded-md text-xs font-bold transition-colors"
                >
                  Confirm Delete
                </button>
              ) : (
                <button
                  onClick={() => setConfirmDeleteId(a.id)}
                  className="text-ice/30 hover:text-coral transition-colors ml-2"
                  aria-label="Delete assignment"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>
          );
        })}
        {assignments.length === 0 && (
          tutorialMode ? (
            <div className="py-12 text-center animate-fade-in">
              <div className="inline-flex flex-col items-center gap-3 bg-mint/10 border border-mint/20 p-6 rounded-2xl relative shadow-lg shadow-mint/5">
                <div className="absolute -top-4 animate-bounce bg-mint text-ink rounded-full size-8 flex items-center justify-center font-bold text-lg shadow-md">
                  ↑
                </div>
                <p className="text-mint font-semibold mt-2">Add your first assignment</p>
                <p className="text-xs text-mint/70 max-w-[250px] leading-relaxed">
                  Got homework or a project due? Fill out the details above and hit Add.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-ice/40 py-6 text-center">No assignments yet.</p>
          )
        )}
      </div>
    </div>
  );
}
