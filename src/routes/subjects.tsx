import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  useLocalStorage,
  SEED_SUBJECTS,
  uid,
  colorDot,
  SUBJECT_COLORS,
  type Subject,
  type SubjectColor,
} from "@/lib/store";

export const Route = createFileRoute("/subjects")({
  head: () => ({
    meta: [
      { title: "Subjects — Tan bee" },
      { name: "description", content: "Manage your subjects, codes and colors." },
      { property: "og:title", content: "Subjects — Tan bee" },
      { property: "og:description", content: "Manage your subjects, codes and colors." },
    ],
  }),
  component: SubjectsPage,
});

const COLORS: SubjectColor[] = SUBJECT_COLORS;

function SubjectsPage() {
  const [subjects, setSubjects] = useLocalStorage<Subject[]>("sh_subjects", SEED_SUBJECTS);
  const [tutorialMode] = useLocalStorage<boolean>("sh_tutorial_mode", false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [color, setColor] = useState<SubjectColor>("sky");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!confirmDeleteId) return;
    const t = setTimeout(() => setConfirmDeleteId(null), 3000);
    return () => clearTimeout(t);
  }, [confirmDeleteId]);

  const add = () => {
    if (!name.trim()) return;
    setSubjects([...subjects, { id: uid(), name: name.trim(), code: code.trim() || "—", color }]);
    setName("");
    setCode("");
  };

  return (
    <div className="max-w-3xl">
      <p className="font-mono text-[10px] tracking-[0.25em] text-mint mb-2">// SUBJECTS</p>
      <h1 className="font-display text-4xl sm:text-5xl text-ice leading-[0.9] mb-7">Your subjects</h1>

      <div className="glass-card p-5 mb-4 animate-rise">
        <p className="section-label mb-3">ADD SUBJECT</p>
        <div className="flex flex-wrap gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Subject name"
            className="flex-1 min-w-40 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-ice placeholder:text-ice/30 outline-none focus:border-mint/50"
          />
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Code (e.g. CS 201)"
            className="w-32 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-ice placeholder:text-ice/30 outline-none focus:border-mint/50"
          />
          <div className="flex flex-wrap items-center gap-1.5">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                aria-label={`Color ${c}`}
                className={`size-6 rounded-full ${colorDot[c]} ${color === c ? "ring-2 ring-ice ring-offset-2 ring-offset-panel" : "opacity-50"}`}
              />
            ))}
          </div>
          <button
            onClick={add}
            className="inline-flex items-center gap-1.5 rounded-lg bg-mint px-4 py-2 text-sm font-semibold text-ink hover:bg-mint/90"
          >
            <Plus className="size-4" /> Add
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {subjects.map((s, i) => (
          <div
            key={s.id}
            className="glass-card flex items-center gap-4 px-5 py-4 animate-rise"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <span className={`size-3 rounded-full ${colorDot[s.color]}`} />
            <div>
              <p className="text-sm font-semibold text-ice">{s.name}</p>
              <p className="font-mono text-[10px] text-ice/40 tracking-wider">{s.code}</p>
            </div>
            {confirmDeleteId === s.id ? (
              <button
                onClick={() => setSubjects(subjects.filter((x) => x.id !== s.id))}
                className="ml-auto text-ink bg-coral hover:bg-coral/90 px-3 py-1.5 rounded-md text-xs font-bold transition-colors"
              >
                Confirm Delete
              </button>
            ) : (
              <button
                onClick={() => setConfirmDeleteId(s.id)}
                className="ml-auto text-ice/30 hover:text-coral transition-colors"
                aria-label={`Delete ${s.name}`}
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </div>
        ))}
        {subjects.length === 0 && (
          tutorialMode ? (
            <div className="py-12 text-center animate-fade-in">
              <div className="inline-flex flex-col items-center gap-3 bg-mint/10 border border-mint/20 p-6 rounded-2xl relative shadow-lg shadow-mint/5">
                <div className="absolute -top-4 animate-bounce bg-mint text-ink rounded-full size-8 flex items-center justify-center font-bold text-lg shadow-md">
                  ↑
                </div>
                <p className="text-mint font-semibold mt-2">Create your first subject</p>
                <p className="text-xs text-mint/70 max-w-[250px] leading-relaxed">
                  Type a name like "Computer Science" and click Add. You need at least one subject to track attendance and assignments!
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-ice/40 py-6 text-center">No subjects yet — add one above.</p>
          )
        )}
      </div>
    </div>
  );
}
