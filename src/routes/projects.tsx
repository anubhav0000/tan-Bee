import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2, Check, UserPlus, X } from "lucide-react";
import { useLocalStorage, SEED_PROJECTS, uid, type Project } from "@/lib/store";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Group Projects — Tan bee" },
      { name: "description", content: "Manage group projects, members and shared tasks." },
      { property: "og:title", content: "Group Projects — Tan bee" },
      { property: "og:description", content: "Manage group projects, members and shared tasks." },
    ],
  }),
  component: ProjectsPage,
});

const MEMBER_COLORS = ["bg-sky", "bg-coral", "bg-mint", "bg-viol"];

function ProjectsPage() {
  const [projects, setProjects] = useLocalStorage<Project[]>("sh_projects", SEED_PROJECTS);
  const [name, setName] = useState("");
  const [taskDraft, setTaskDraft] = useState<Record<string, string>>({});
  const [memberDraft, setMemberDraft] = useState<Record<string, string>>({});
  const [confirmDeleteProjectId, setConfirmDeleteProjectId] = useState<string | null>(null);
  const [confirmDeleteTaskId, setConfirmDeleteTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (!confirmDeleteProjectId) return;
    const t = setTimeout(() => setConfirmDeleteProjectId(null), 3000);
    return () => clearTimeout(t);
  }, [confirmDeleteProjectId]);

  useEffect(() => {
    if (!confirmDeleteTaskId) return;
    const t = setTimeout(() => setConfirmDeleteTaskId(null), 3000);
    return () => clearTimeout(t);
  }, [confirmDeleteTaskId]);

  const update = (id: string, patch: Partial<Project>) =>
    setProjects(projects.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const addProject = () => {
    if (!name.trim()) return;
    setProjects([...projects, { id: uid(), name: name.trim(), members: ["You"], tasks: [] }]);
    setName("");
  };

  return (
    <div className="max-w-3xl">
      <p className="font-mono text-[10px] tracking-[0.25em] text-mint mb-2">// GROUP PROJECTS</p>
      <h1 className="font-display text-4xl sm:text-5xl text-ice leading-[0.9] mb-7">Group projects</h1>

      <div className="glass-card p-5 mb-4 animate-rise">
        <p className="section-label mb-3">NEW PROJECT</p>
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project name"
            className="flex-1 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-ice placeholder:text-ice/30 outline-none focus:border-mint/50"
          />
          <button onClick={addProject} className="inline-flex items-center gap-1.5 rounded-lg bg-mint px-4 py-2 text-sm font-semibold text-ink hover:bg-mint/90">
            <Plus className="size-4" /> Create
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {projects.map((p, i) => {
          const done = p.tasks.filter((t) => t.done).length;
          const pct = p.tasks.length ? Math.round((done / p.tasks.length) * 100) : 0;
          return (
            <div key={p.id} className="glass-card p-5 animate-rise" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-center gap-3">
                <p className="text-base font-semibold text-ice">{p.name}</p>
                <span className={`ml-auto font-mono text-[10px] px-2 py-1 rounded ${pct === 100 ? "bg-mint/10 text-mint" : pct >= 50 ? "bg-sky/10 text-sky" : "bg-coral/10 text-coral"}`}>
                  {pct === 100 ? "COMPLETE" : pct >= 50 ? "ON TRACK" : "AT RISK"}
                </span>
                {confirmDeleteProjectId === p.id ? (
                  <button
                    onClick={() => setProjects(projects.filter((x) => x.id !== p.id))}
                    className="ml-2 text-ink bg-coral hover:bg-coral/90 px-3 py-1.5 rounded-md text-xs font-bold transition-colors"
                  >
                    Confirm Delete
                  </button>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteProjectId(p.id)}
                    className="text-ice/30 hover:text-coral transition-colors ml-2"
                    aria-label="Delete project"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>

              <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-mint transition-all" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-2 font-mono text-[10px] text-ice/40">
                {done} / {p.tasks.length} TASKS DONE
              </p>

              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                {p.members.map((m, mi) => (
                  <span key={m} className="group flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 pl-1 pr-2 py-0.5 text-xs text-ice/70">
                    <span className={`size-5 rounded-full ${MEMBER_COLORS[mi % MEMBER_COLORS.length]} grid place-items-center text-[9px] font-bold text-ink`}>
                      {m.slice(0, 2).toUpperCase()}
                    </span>
                    {m}
                    {m !== "You" && (
                      <button
                        onClick={() => update(p.id, { members: p.members.filter((x) => x !== m) })}
                        className="text-ice/30 hover:text-coral"
                        aria-label={`Remove ${m}`}
                      >
                        <X className="size-3" />
                      </button>
                    )}
                  </span>
                ))}
                <input
                  value={memberDraft[p.id] ?? ""}
                  onChange={(e) => setMemberDraft({ ...memberDraft, [p.id]: e.target.value })}
                  onKeyDown={(e) => {
                    const v = (memberDraft[p.id] ?? "").trim();
                    if (e.key === "Enter" && v) {
                      update(p.id, { members: [...p.members, v] });
                      setMemberDraft({ ...memberDraft, [p.id]: "" });
                    }
                  }}
                  placeholder="+ member"
                  className="w-24 rounded-full bg-white/5 border border-dashed border-white/15 px-3 py-1 text-xs text-ice placeholder:text-ice/30 outline-none focus:border-mint/50"
                />
                <UserPlus className="size-3.5 text-ice/25" />
              </div>

              <div className="mt-4 space-y-1">
                {p.tasks.map((t) => (
                  <div key={t.id} className={`flex items-center gap-3 rounded-lg px-3 py-2 bg-white/[0.03] ${t.done ? "opacity-45" : ""}`}>
                    <button
                      onClick={() => update(p.id, { tasks: p.tasks.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)) })}
                      className={`size-4 rounded border grid place-items-center shrink-0 ${t.done ? "bg-mint border-mint text-ink" : "border-white/20 hover:border-mint/60"}`}
                      aria-label="Toggle task"
                    >
                      {t.done && <Check className="size-3" />}
                    </button>
                    <span className={`text-sm text-ice ${t.done ? "line-through" : ""}`}>{t.title}</span>
                    <select
                      value={t.assignee}
                      onChange={(e) => update(p.id, { tasks: p.tasks.map((x) => (x.id === t.id ? { ...x, assignee: e.target.value } : x)) })}
                      className="ml-auto rounded bg-white/5 border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-ice/60 outline-none [&>option]:bg-panel"
                    >
                      {p.members.map((m) => (
                        <option key={m}>{m}</option>
                      ))}
                    </select>
                    {confirmDeleteTaskId === t.id ? (
                      <button
                        onClick={() => update(p.id, { tasks: p.tasks.filter((x) => x.id !== t.id) })}
                        className="ml-2 text-ink bg-coral hover:bg-coral/90 px-2 py-1 rounded text-[10px] font-bold transition-colors"
                      >
                        Confirm
                      </button>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteTaskId(t.id)}
                        className="text-ice/30 hover:text-coral ml-2"
                        aria-label="Delete task"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </div>
                ))}
                <input
                  value={taskDraft[p.id] ?? ""}
                  onChange={(e) => setTaskDraft({ ...taskDraft, [p.id]: e.target.value })}
                  onKeyDown={(e) => {
                    const v = (taskDraft[p.id] ?? "").trim();
                    if (e.key === "Enter" && v) {
                      update(p.id, { tasks: [...p.tasks, { id: uid(), title: v, done: false, assignee: p.members[0] ?? "You" }] });
                      setTaskDraft({ ...taskDraft, [p.id]: "" });
                    }
                  }}
                  placeholder="+ Add task and press Enter"
                  className="w-full rounded-lg bg-white/5 border border-dashed border-white/15 px-3 py-2 text-sm text-ice placeholder:text-ice/30 outline-none focus:border-mint/50"
                />
              </div>
            </div>
          );
        })}
        {projects.length === 0 && <p className="text-sm text-ice/40 py-6 text-center">No projects yet — create one above.</p>}
      </div>
    </div>
  );
}
