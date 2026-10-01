import { createFileRoute } from "@tanstack/react-router";
import { Settings, BookOpen, Activity } from "lucide-react";
import { useLocalStorage } from "@/lib/store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Tan bee" },
      { name: "description", content: "Manage your app preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [studyMode, setStudyMode] = useLocalStorage<boolean>("sh_study_mode", true);
  const [healthMode, setHealthMode] = useLocalStorage<boolean>("sh_health_mode", false);

  return (
    <div className="max-w-2xl mx-auto">
      <p className="font-mono text-[10px] tracking-[0.25em] text-ice/50 mb-2">// PREFERENCES</p>
      <h1 className="font-display text-4xl sm:text-5xl text-ice leading-[0.9] mb-7">Settings</h1>

      <div className="glass-card p-6 animate-rise">
        <p className="section-label mb-5">FEATURES</p>
        
        <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-white/10 bg-white/5 transition-colors hover:bg-white/10">
          <div className="flex gap-4">
            <div className="mt-1 text-mint">
              <BookOpen className="size-5" />
            </div>
            <div>
              <p className="font-semibold text-ice">Study Mode</p>
              <p className="text-sm text-ice/60 mt-1 max-w-[280px]">
                Enable advanced study features including the AI Study Buddy, Stopwatch, and Study Notes.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setStudyMode(!studyMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${studyMode ? 'bg-mint' : 'bg-white/20'}`}
          >
            <span className={`inline-block size-4 transform rounded-full bg-white transition-transform ${studyMode ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-white/10 bg-white/5 transition-colors hover:bg-white/10 mt-4">
          <div className="flex gap-4">
            <div className="mt-1 text-rose">
              <Activity className="size-5" />
            </div>
            <div>
              <p className="font-semibold text-ice">Health & Wellness</p>
              <p className="text-sm text-ice/60 mt-1 max-w-[280px]">
                Enable the student health dashboard to track hydration, meals, sleep, and budget.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setHealthMode(!healthMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${healthMode ? 'bg-rose' : 'bg-white/20'}`}
          >
            <span className={`inline-block size-4 transform rounded-full bg-white transition-transform ${healthMode ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
