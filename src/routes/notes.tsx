import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Search } from "lucide-react";
import { useLocalStorage, SEED_SUBJECTS, uid, type Note, type Subject, colorDot } from "@/lib/store";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Study Notes — Tan bee" },
      { name: "description", content: "Take and organize study notes by subject and topic." },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const [subjects] = useLocalStorage<Subject[]>("sh_subjects", SEED_SUBJECTS);
  const [notes, setNotes] = useLocalStorage<Note[]>("sh_notes", []);
  const [tutorialMode] = useLocalStorage<boolean>("sh_tutorial_mode", false);
  
  const [search, setSearch] = useState("");
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? "");
  const [topic, setTopic] = useState("");
  const [summary, setSummary] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]!);
  
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const subjectById = Object.fromEntries(subjects.map((s) => [s.id, s]));

  const addNote = () => {
    if (!topic.trim() || !summary.trim() || !subjectId) return;
    setNotes([{ id: uid(), subjectId, topic, summary, date }, ...notes]);
    setTopic("");
    setSummary("");
  };

  const filteredNotes = notes.filter((n) => {
    const matchesSearch = n.topic.toLowerCase().includes(search.toLowerCase()) || n.summary.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div>
        <p className="font-mono text-[10px] tracking-[0.25em] text-mint mb-2">// KNOWLEDGE</p>
        <h1 className="font-display text-4xl sm:text-5xl text-ice leading-[0.9] mb-7">Study Notes</h1>
      </div>

      <div className="glass-card p-5 mb-6 animate-rise shrink-0">
        <p className="section-label mb-3">NEW NOTE</p>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-36 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-ice outline-none focus:border-mint/50"
            />
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-48 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-ice outline-none focus:border-mint/50"
            >
              <option value="" disabled>Select Subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Topic (e.g. Thermodynamics Chapter 1)"
              className="flex-1 min-w-[200px] rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-ice outline-none focus:border-mint/50"
            />
          </div>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Write your summary here..."
            className="w-full h-24 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-ice outline-none focus:border-mint/50 resize-none"
          />
          <button
            onClick={addNote}
            disabled={!topic.trim() || !summary.trim() || !subjectId}
            className="self-end inline-flex items-center gap-1.5 rounded-lg bg-mint px-6 py-2.5 text-sm font-semibold text-ink hover:bg-mint/90 disabled:opacity-50"
          >
            <Plus className="size-4" /> Save Note
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col animate-rise [animation-delay:50ms]">
        <div className="relative mb-4 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ice/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="w-full rounded-xl bg-white/5 border border-white/10 pl-9 pr-4 py-2 text-sm text-ice outline-none focus:border-mint/50"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pb-8 pr-2 custom-scrollbar">
          {filteredNotes.map((note) => {
            const subj = subjectById[note.subjectId];
            return (
              <div key={note.id} className="glass-card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-ice text-lg">{note.topic}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {subj && (
                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-ice/70">
                          <span className={`size-1.5 rounded-full ${colorDot[subj.color]}`} />
                          {subj.name}
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-ice/40">{note.date}</span>
                    </div>
                  </div>
                  {confirmDeleteId === note.id ? (
                    <button
                      onClick={() => setNotes(notes.filter((x) => x.id !== note.id))}
                      className="text-ink bg-coral hover:bg-coral/90 px-3 py-1.5 rounded-md text-xs font-bold transition-colors"
                    >
                      Delete
                    </button>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(note.id)}
                      className="text-ice/30 hover:text-coral transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-ice/80 whitespace-pre-wrap leading-relaxed">{note.summary}</p>
              </div>
            );
          })}
          
          {notes.length === 0 && (
            tutorialMode ? (
              <div className="py-12 text-center animate-fade-in h-full flex flex-col justify-center items-center">
                <div className="inline-flex flex-col items-center gap-3 bg-mint/10 border border-mint/20 p-6 rounded-2xl relative shadow-lg shadow-mint/5">
                  <div className="absolute -top-4 animate-bounce bg-mint text-ink rounded-full size-8 flex items-center justify-center font-bold text-lg shadow-md">
                    ↑
                  </div>
                  <p className="text-mint font-semibold mt-2">Take your first note</p>
                  <p className="text-xs text-mint/70 max-w-[250px] leading-relaxed">
                    Select a subject, write a quick summary of what you learned today, and hit Save Note!
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-ice/40 py-12 text-center">No notes found. Create one above!</p>
            )
          )}
        </div>
      </div>
    </div>
  );
}
