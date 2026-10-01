import { createFileRoute } from "@tanstack/react-router";
import { Settings, BookOpen, Activity, Lock, Unlock, Code, Loader2 } from "lucide-react";
import { useLocalStorage } from "@/lib/store";
import { useState } from "react";
import { createServerFn } from "@tanstack/react-start";

const updateGithub = createServerFn({ method: "POST" })
  .validator((code: string) => code)
  .handler(async ({ data: code }) => {
    const { exec } = await import("child_process");
    const { promisify } = await import("util");
    const fs = await import("fs");
    const execAsync = promisify(exec);
    
    // Write code to a file so it can be committed
    fs.writeFileSync("src/custom-program.txt", code);
    
    // Run git commands
    await execAsync("git add .");
    await execAsync('git commit -m "Auto update code from developer section"');
    await execAsync("git push");
    
    return { success: true };
  });

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

  const [devPassword, setDevPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [codeText, setCodeText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUnlock = () => {
    if (devPassword === "020526") {
      setIsUnlocked(true);
      setDevPassword("");
    } else {
      alert("Incorrect password");
    }
  };

  const handleUpdate = async () => {
    if (!codeText.trim()) return;
    setIsUpdating(true);
    try {
      await updateGithub({ data: codeText });
      alert("Successfully updated GitHub!");
      setCodeText("");
    } catch (error) {
      console.error(error);
      alert("Failed to update GitHub");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <p className="font-mono text-[10px] tracking-[0.25em] text-ice/50 mb-2">// PREFERENCES</p>
      <h1 className="font-display text-4xl sm:text-5xl text-ice leading-[0.9] mb-7">Settings</h1>

      <div className="glass-card p-6 animate-rise mb-6">
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

      <div className="glass-card p-6 animate-rise" style={{ animationDelay: '0.1s' }}>
        <p className="section-label mb-5 flex items-center gap-2">
          {isUnlocked ? <Unlock className="size-4" /> : <Lock className="size-4" />}
          DEVELOPER SECTION
        </p>

        {!isUnlocked ? (
          <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5">
            <input
              type="password"
              placeholder="Enter password to unlock"
              value={devPassword}
              onChange={(e) => setDevPassword(e.target.value)}
              className="flex-1 bg-transparent border-none text-ice outline-none placeholder:text-ice/40"
              onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
            />
            <button
              onClick={handleUnlock}
              className="px-4 py-2 rounded-lg bg-mint/20 text-mint font-medium hover:bg-mint/30 transition-colors"
            >
              Unlock
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-white/10 bg-white/5">
              <div className="flex gap-2 mb-3 items-center text-ice/80">
                <Code className="size-4" />
                <span className="text-sm font-medium">Add Code to Push to GitHub</span>
              </div>
              <textarea
                value={codeText}
                onChange={(e) => setCodeText(e.target.value)}
                placeholder="Paste your code here in text format..."
                className="w-full h-40 bg-black/20 border border-white/10 rounded-lg p-3 text-ice font-mono text-sm resize-y outline-none focus:border-mint/50 transition-colors"
              />
            </div>
            <button
              onClick={handleUpdate}
              disabled={isUpdating || !codeText.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-mint text-dark font-semibold hover:bg-mint/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Updating GitHub...
                </>
              ) : (
                "Update GitHub"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
