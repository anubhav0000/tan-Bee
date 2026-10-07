import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useFiles } from "../hooks/useFiles";
import FileCard from "../components/FileManagement/FileCard";
import { Search, Download, Copy, Eye, Check, X, Lock } from "lucide-react";

import { useLocalStorage, useHydrated } from "@/lib/store";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs — Tan bee" },
      { name: "description", content: "Access study programs and resources." },
    ],
  }),
  component: ProgramsPage,
});

function CodeCard({ q }: { q: any }) {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(q.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyOutput = () => {
    if (!q.output) return;
    navigator.clipboard.writeText(q.output);
    setCopiedOutput(true);
    setTimeout(() => setCopiedOutput(false), 2000);
  };

  const handleDownload = () => {
    const watermark = "\n\n// Downloaded from Tanbee\n";
    const watermarkedCode = q.code + watermark;
    const blob = new Blob([watermarkedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${q.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="bg-panel rounded-lg shadow-sm border border-white/10 overflow-hidden flex flex-col transition hover:border-mint/50">
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="font-semibold text-lg text-ice">{q.title}</h3>
          <p className="text-sm text-ice/50 mb-4">C Programming Snippet</p>
          
          <div className="flex flex-col gap-2 mt-auto">
            <div className="flex gap-2">
              <button 
                  onClick={() => setShowCode(true)} 
                  className="flex-1 flex items-center justify-center gap-1 bg-white/5 hover:bg-white/10 text-ice py-2 rounded text-sm transition"
              >
                  <Eye className="w-4 h-4" /> View
              </button>
              <button 
                  onClick={handleDownload} 
                  className="flex-1 flex items-center justify-center gap-1 bg-mint/10 text-mint hover:bg-mint/20 py-2 rounded text-sm transition font-medium"
              >
                  <Download className="w-4 h-4" /> Download
              </button>
            </div>
            <button 
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-1 bg-sky/10 text-sky hover:bg-sky/20 py-2 rounded text-sm transition font-medium"
            >
                {copied ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy Code</>}
            </button>
          </div>
        </div>
      </div>

      {showCode && mounted && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-ink/90 backdrop-blur-sm animate-fade-in">
          <div className="bg-panel rounded-xl border border-white/10 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
              <h3 className="font-semibold text-lg text-ice">{q.title}</h3>
              <button 
                onClick={() => setShowCode(false)}
                className="p-2 rounded-lg hover:bg-white/10 text-ice/60 hover:text-rose transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto bg-ink/50 flex-grow flex flex-col gap-6">
              <div>
                <h4 className="text-sm font-semibold text-ice mb-2">Code</h4>
                <pre className="text-sm text-ice/80 font-mono whitespace-pre-wrap"><code>{q.code}</code></pre>
              </div>
              {q.output && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-mint">Output</h4>
                    <button onClick={handleCopyOutput} className="text-xs flex items-center gap-1 text-mint hover:text-mint/80 bg-mint/10 px-2 py-1 rounded">
                      {copiedOutput ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy Output</>}
                    </button>
                  </div>
                  <pre className="text-sm text-mint/80 font-mono whitespace-pre-wrap bg-black/20 p-4 rounded border border-white/5"><code>{q.output}</code></pre>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-white/10 bg-white/5 flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button 
                onClick={handleCopy}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-sky/10 text-sky hover:bg-sky/20 px-4 py-3 sm:py-2 rounded-lg text-sm transition font-medium"
              >
                {copied ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy Code</>}
              </button>
              <button 
                onClick={handleDownload}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-mint/10 text-mint hover:bg-mint/20 px-4 py-3 sm:py-2 rounded-lg text-sm transition font-medium"
              >
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

function ProgramsPage() {
  const hydrated = useHydrated();
  const [lifetimeAccess] = useLocalStorage<boolean>("sh_lifetime_access", false);
  const [tempAccessExpiry] = useLocalStorage<number>("sh_temp_access_expiry", 0);
  const isProgramsUnlocked = hydrated ? (lifetimeAccess || Date.now() < tempAccessExpiry) : false;

  const { files, loading } = useFiles();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [activeTab, setActiveTab] = useState<"resources" | "snippets">("resources");

  const categories = ["All", ...new Set(files.map((f: any) => f.category))];

  const filteredFiles = files.filter((file: any) => {
    const matchesSearch =
      file.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || file.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const [codes, setCodes] = useState<any[]>([]);

  useEffect(() => {
    fetch('/c_codes.json')
      .then(res => res.json())
      .then(data => setCodes(data))
      .catch(err => console.error("Failed to load codes", err));
  }, []);

  const filteredCodes = codes.filter((q) => 
    q.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isProgramsUnlocked) {
    return (
      <div className="max-w-7xl mx-auto">
        <p className="font-mono text-[10px] tracking-[0.25em] text-mint mb-2">// PROGRAMS</p>
        <h1 className="font-display text-4xl sm:text-5xl text-ice leading-[0.9] mb-7">Programs & Resources</h1>
        
        <div className="max-w-3xl mx-auto py-20 mt-10 text-center animate-rise bg-panel rounded-xl border border-white/10">
          <div className="w-16 h-16 rounded-full bg-rose/10 flex items-center justify-center mx-auto mb-6 border border-rose/20">
            <Lock className="size-8 text-rose" />
          </div>
          <h2 className="text-2xl font-display text-ice mb-4">Content Locked</h2>
          <p className="text-ice/60 mb-8 max-w-md mx-auto">
            You need admin verification to access the study programs and code snippets.
          </p>
          <Link 
            to="/settings"
            className="inline-flex items-center justify-center gap-2 bg-mint text-ink font-semibold px-6 py-3 rounded-xl hover:bg-mint/90 transition-colors"
          >
            Go to Settings to Unlock
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <p className="font-mono text-[10px] tracking-[0.25em] text-mint mb-2">// PROGRAMS</p>
      <h1 className="font-display text-4xl sm:text-5xl text-ice leading-[0.9] mb-7">Programs & Resources</h1>

      <div className="flex gap-6 mb-6 border-b border-white/10 animate-rise">
        <button 
          onClick={() => setActiveTab("resources")}
          className={`py-2 px-1 border-b-2 transition-colors font-medium text-sm sm:text-base ${activeTab === 'resources' ? 'border-mint text-mint' : 'border-transparent text-ice/60 hover:text-ice'}`}
        >
          Study Resources
        </button>
        <button 
          onClick={() => setActiveTab("snippets")}
          className={`py-2 px-1 border-b-2 transition-colors font-medium text-sm sm:text-base ${activeTab === 'snippets' ? 'border-mint text-mint' : 'border-transparent text-ice/60 hover:text-ice'}`}
        >
          Code Snippets
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 animate-rise">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ice/40 w-5 h-5" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-3 sm:py-2 border border-white/10 rounded-lg bg-panel focus:outline-none focus:border-mint text-ice"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {activeTab === "resources" && (
            <select
              className="w-full sm:w-auto py-3 sm:py-2 px-4 border border-white/10 rounded-lg bg-panel text-ice focus:outline-none focus:border-mint"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((cat: any) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {activeTab === "resources" ? (
        loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mint"></div>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-20 bg-panel rounded-lg border border-white/10 border-dashed animate-rise">
            <h3 className="text-xl font-medium text-ice/60">No resources found</h3>
            <p className="text-ice/40 mt-2">Try adjusting your search or category filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-rise [animation-delay:40ms]">
            {filteredFiles.map((file: any) => (
              <FileCard
                key={file.$id}
                fileData={file}
                isAdmin={false}
                onEdit={(data: any) => console.log("Edit requested for", data)}
              />
            ))}
          </div>
        )
      ) : (
        filteredCodes.length === 0 ? (
          <div className="text-center py-20 bg-panel rounded-lg border border-white/10 border-dashed animate-rise">
            <h3 className="text-xl font-medium text-ice/60">No snippets found</h3>
            <p className="text-ice/40 mt-2">Try adjusting your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-rise [animation-delay:40ms]">
            {filteredCodes.map((q) => (
              <CodeCard key={q.id} q={q} />
            ))}
          </div>
        )
      )}
    </div>
  );
}
