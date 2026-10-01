import { createFileRoute } from "@tanstack/react-router";
import { getCustomFiles } from "@/lib/custom-files";
import { useEffect, useState } from "react";
import { FileText, Code } from "lucide-react";

export const Route = createFileRoute("/custom-programs")({
  head: () => ({
    meta: [
      { title: "Custom Programs — Tan bee" },
    ],
  }),
  component: CustomPrograms,
});

function CustomPrograms() {
  const [files, setFiles] = useState<{ filename: string; content: string }[] | null>(null);

  useEffect(() => {
    getCustomFiles().then(setFiles).catch(console.error);
  }, []);

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <p className="font-mono text-[10px] tracking-[0.25em] text-ice/50 mb-2">// COMMUNITY</p>
      <h1 className="font-display text-4xl sm:text-5xl text-ice leading-[0.9] mb-7">Custom Programs</h1>

      {!files ? (
        <div className="text-ice/50 animate-pulse">Loading files...</div>
      ) : files.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FileText className="size-12 mx-auto text-ice/20 mb-4" />
          <h3 className="text-lg font-medium text-ice mb-2">No custom programs found</h3>
          <p className="text-ice/60">Developers can add custom programs from the settings panel.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {files.map((file) => (
            <div key={file.filename} className="glass-card p-6 animate-rise">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-xl bg-mint/10 flex items-center justify-center text-mint">
                  <Code className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-ice">{file.filename}</h3>
                  <p className="text-xs text-ice/50 font-mono">TEXT FILE</p>
                </div>
              </div>
              <div className="bg-black/40 rounded-xl p-4 overflow-x-auto border border-white/5">
                <pre className="text-sm font-mono text-ice/80 whitespace-pre-wrap">{file.content}</pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
