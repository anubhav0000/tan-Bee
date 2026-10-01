import { createFileRoute } from "@tanstack/react-router";
import { Settings, BookOpen, Activity, Lock, Unlock, Code, Loader2, Trash2 } from "lucide-react";
import { useLocalStorage } from "@/lib/store";
import { useState, useEffect } from "react";
import { addCustomFile, deleteCustomFile, getCustomFiles } from "@/lib/custom-files";

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
  const [filename, setFilename] = useState("");
  const [codeText, setCodeText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [files, setFiles] = useState<{ filename: string; content: string }[]>([]);

  useEffect(() => {
    if (isUnlocked) {
      loadFiles();
    }
  }, [isUnlocked]);

  const loadFiles = async () => {
    const data = await getCustomFiles();
    setFiles(data);
  };

  const handleUnlock = () => {
    if (devPassword === "020526") {
      setIsUnlocked(true);
      setDevPassword("");
    } else {
      alert("Incorrect password");
    }
  };

  const handleUpdate = async () => {
    if (!filename.trim() || !codeText.trim()) return;
    setIsUpdating(true);
    try {
      await addCustomFile({ data: { filename: filename.trim(), content: codeText } });
      alert("Successfully updated GitHub and Netlify!");
      setFilename("");
      setCodeText("");
      await loadFiles();
    } catch (error) {
      console.error(error);
      alert("Failed to update");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (fileToDelete: string) => {
    if (!confirm(`Are you sure you want to delete ${fileToDelete}?`)) return;
    try {
      await deleteCustomFile({ data: fileToDelete });
      alert("Successfully deleted from GitHub and Netlify!");
      await loadFiles();
    } catch (error) {
      console.error(error);
      alert("Failed to delete");
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-12">
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
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-ice/80 uppercase tracking-wider">Add New File</h3>
              <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-4">
                <input
                  type="text"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  placeholder="Filename (e.g. program.txt)"
                  className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-ice text-sm outline-none focus:border-mint/50 transition-colors"
                />
                <textarea
                  value={codeText}
                  onChange={(e) => setCodeText(e.target.value)}
                  placeholder="Paste your code here in text format..."
                  className="w-full h-40 bg-black/20 border border-white/10 rounded-lg p-3 text-ice font-mono text-sm resize-y outline-none focus:border-mint/50 transition-colors"
                />
              </div>
              <button
                onClick={handleUpdate}
                disabled={isUpdating || !codeText.trim() || !filename.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-mint text-dark font-semibold hover:bg-mint/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Updating Netlify & GitHub...
                  </>
                ) : (
                  "Update & Deploy"
                )}
              </button>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/10">
              <h3 className="text-sm font-medium text-ice/80 uppercase tracking-wider">Manage Files</h3>
              {files.length === 0 ? (
                <p className="text-ice/40 text-sm italic">No custom files found.</p>
              ) : (
                <div className="space-y-2">
                  {files.map((file) => (
                    <div key={file.filename} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                      <span className="text-ice font-mono text-sm">{file.filename}</span>
                      <button
                        onClick={() => handleDelete(file.filename)}
                        className="p-2 text-rose hover:bg-rose/10 rounded-md transition-colors"
                        title="Delete File"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
