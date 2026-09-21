import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  useLocalStorage,
  SEED_SUBJECTS,
  uid,
  colorDot,
  type Subject,
  type SubjectColor,
} from "@/lib/store";

export const Route = createFileRoute("/subjects")({
  head: () => ({
    meta: [
      { title: "Subjects — StudentHub" },
      { name: "description", content: "Manage your subjects, codes and colors." },
      { property: "og:title", content: "Subjects — StudentHub" },
      { property: "og:description", content: "Manage your subjects, codes and colors." },
    ],
  }),
  component: SubjectsPage,
});

const COLORS: SubjectColor[] = ["sky", "coral", "mint", "viol"];

function SubjectsPage() {
  const [subjects, setSubjects] = useLocalStorage<Subject[]>("sh_subjects", SEED_SUBJECTS);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [color, setColor] = useState<SubjectColor>("sky");

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
          <div className="flex items-center gap-1.5">
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
            <button
              onClick={() => setSubjects(subjects.filter((x) => x.id !== s.id))}
              className="ml-auto text-ice/30 hover:text-coral transition-colors"
              aria-label={`Delete ${s.name}`}
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
        {subjects.length === 0 && <p className="text-sm text-ice/40 py-6 text-center">No subjects yet — add one above.</p>}
      </div>
    </div>
  );
}
