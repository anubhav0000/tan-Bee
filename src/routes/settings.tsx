import { createFileRoute } from "@tanstack/react-router";
import { Settings, BookOpen, Activity, Lock, Unlock, Save, Download, Trash2 } from "lucide-react";
import { useState } from "react";
import { useLocalStorage, Subject } from "@/lib/store";
import { uid } from "@/lib/store";

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
  const [subjects] = useLocalStorage<Subject[]>("sh_subjects", []);
  const [sunsetCodes, setSunsetCodes] = useLocalStorage<any[]>("sh_sunset_codes", []);
  const [, setSunsetEnabled] = useLocalStorage<boolean>("sh_sunset_enabled", false);

  const [adminPassword, setAdminPassword] = useState("");
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminError, setAdminError] = useState("");

  const [codeSubject, setCodeSubject] = useState("");
  const [codeType, setCodeType] = useState<"assignment" | "other">("assignment");
  const [codeNumber, setCodeNumber] = useState("");
  const [codeTitle, setCodeTitle] = useState("");
  const [codeContent, setCodeContent] = useState("");

  const handleAdminUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "020526") {
      setIsAdminUnlocked(true);
      setAdminError("");
    } else {
      setAdminError("Incorrect password");
    }
  };

  const handleSaveCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeContent) return;
    if (codeType === "assignment" && (!codeSubject || !codeNumber)) return;
    if (codeType === "other" && (!codeSubject || !codeTitle)) return;

    const newCode = {
      id: uid(),
      subjectId: codeSubject,
      type: codeType,
      number: codeNumber,
      title: codeTitle,
      content: codeContent,
      createdAt: new Date().toISOString(),
    };

    setSunsetCodes([newCode, ...sunsetCodes]);
    setSunsetEnabled(true);
    
    // Reset form
    setCodeNumber("");
    setCodeTitle("");
    setCodeContent("");
  };

  const handleDeleteCode = (id: string) => {
    setSunsetCodes(sunsetCodes.filter(c => c.id !== id));
  };

  const handleExportCodes = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sunsetCodes, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "sunset-codes.json");
    dlAnchorElem.click();
  };

  return (
    <div className="max-w-2xl mx-auto pb-20">
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

      <div className="glass-card p-6 animate-rise mt-8">
        <div className="flex items-center gap-2 mb-5">
          {isAdminUnlocked ? <Unlock className="size-4 text-mint" /> : <Lock className="size-4 text-ice/50" />}
          <p className="section-label">ADMIN PANEL</p>
        </div>
        
        {!isAdminUnlocked ? (
          <form onSubmit={handleAdminUnlock} className="flex flex-col gap-3">
            <p className="text-sm text-ice/60 mb-2">Enter the admin password to unlock advanced settings.</p>
            <div className="flex gap-2">
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Password"
                className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-ice placeholder:text-ice/30 outline-none focus:border-mint/50 transition-colors"
              />
              <button 
                type="submit"
                className="rounded-xl bg-mint px-4 py-2.5 text-ink font-semibold hover:bg-mint/90 transition-colors"
              >
                Unlock
              </button>
            </div>
            {adminError && <p className="text-rose text-sm mt-1">{adminError}</p>}
          </form>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <p className="text-sm text-mint">Admin panel unlocked.</p>
            <form onSubmit={handleSaveCode} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ice/50 mb-1">Subject</label>
                <select
                  value={codeSubject}
                  onChange={(e) => setCodeSubject(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-ice outline-none focus:border-mint/50 transition-colors appearance-none"
                  required
                >
                  <option value="" disabled>Select a subject</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ice/50 mb-1">Type</label>
                <select
                  value={codeType}
                  onChange={(e) => setCodeType(e.target.value as any)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-ice outline-none focus:border-mint/50 transition-colors appearance-none"
                >
                  <option value="assignment">Assignment</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {codeType === "assignment" ? (
                <div>
                  <label className="block text-xs font-semibold text-ice/50 mb-1">Assignment Number</label>
                  <input
                    type="text"
                    value={codeNumber}
                    onChange={(e) => setCodeNumber(e.target.value)}
                    placeholder="e.g. 1, 2, or 3"
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-ice placeholder:text-ice/30 outline-none focus:border-mint/50 transition-colors"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-ice/50 mb-1">Title</label>
                  <input
                    type="text"
                    value={codeTitle}
                    onChange={(e) => setCodeTitle(e.target.value)}
                    placeholder="Enter title"
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-ice placeholder:text-ice/30 outline-none focus:border-mint/50 transition-colors"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-ice/50 mb-1">Source Code</label>
                <textarea
                  value={codeContent}
                  onChange={(e) => setCodeContent(e.target.value)}
                  placeholder="Paste your source code here..."
                  className="w-full h-40 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-ice placeholder:text-ice/30 outline-none focus:border-mint/50 transition-colors font-mono text-sm resize-none"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full rounded-xl bg-mint px-4 py-3 text-ink font-semibold flex items-center justify-center gap-2 hover:bg-mint/90 transition-colors"
              >
                <Save className="size-4" /> Save Code
              </button>
            </form>

            {sunsetCodes.length > 0 && (
              <div className="pt-6 border-t border-white/10 mt-6">
                <p className="section-label mb-4">MANAGE CODES</p>
                <div className="space-y-2 mb-6">
                  {sunsetCodes.map(code => (
                    <AdminCodeItem key={code.id} code={code} onDelete={handleDeleteCode} />
                  ))}
                </div>

                <p className="text-sm text-ice/60 mb-3">
                  Want all users to see these codes? Export them and paste the content into <code>src/lib/sunset-data.ts</code>, then push to GitHub!
                </p>
                <button 
                  onClick={handleExportCodes}
                  className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-ice font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                >
                  <Download className="size-4" /> Export Codes JSON
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminCodeItem({ code, onDelete }: { code: any, onDelete: (id: string) => void }) {
  const [deleteStage, setDeleteStage] = useState(0);
  
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 transition-colors hover:bg-white/10">
      <div>
        <p className="text-sm font-semibold text-ice">
          {code.type === "assignment" ? `Assignment ${code.number}` : code.title}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {deleteStage > 0 && (
          <button 
            onClick={() => setDeleteStage(0)}
            className="text-xs font-semibold text-ice/60 hover:text-ice px-3 py-1.5 rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
        
        {deleteStage === 0 && (
          <button 
            onClick={() => setDeleteStage(1)} 
            className="text-xs font-semibold text-rose hover:text-rose/80 px-3 py-1.5 rounded-lg border border-rose/30 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="size-3" /> Delete
          </button>
        )}
        {deleteStage === 1 && (
          <button 
            onClick={() => setDeleteStage(2)} 
            className="text-xs font-semibold text-amber hover:text-amber/80 px-3 py-1.5 rounded-lg border border-amber/30 transition-colors"
          >
            Are you sure?
          </button>
        )}
        {deleteStage === 2 && (
          <button 
            onClick={() => {
              setDeleteStage(0);
              onDelete(code.id);
            }} 
            className="text-xs font-semibold text-ink bg-rose hover:bg-rose/90 px-3 py-1.5 rounded-lg transition-colors"
          >
            Confirm Delete
          </button>
        )}
      </div>
    </div>
  );
}
