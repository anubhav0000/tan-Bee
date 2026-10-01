import { createFileRoute } from "@tanstack/react-router";
import { Code2, FileCode } from "lucide-react";
import { getCustomFiles } from "@/lib/customFilesApi";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs — Tan bee" },
      { name: "description", content: "View all custom programs." },
    ],
  }),
  component: ProgramsPage,
});

function ProgramsPage() {
  const modules = import.meta.glob('../custom-files/*', { query: '?raw', import: 'default', eager: true });
  
  const files = Object.entries(modules).map(([path, content]) => {
    const name = path.split('/').pop() || path;
    return { name, content: content as string };
  });

  const isLoading = false;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.25em] text-ice/50 mb-2">// DIRECTORY</p>
        <h1 className="font-display text-4xl sm:text-5xl text-ice leading-[0.9] flex items-center gap-4">
          <Code2 className="size-10 text-mint" />
          Programs
        </h1>
        <p className="text-ice/60 mt-3 max-w-lg">
          View custom files and programs added by the developer.
        </p>
      </div>

      {isLoading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-white/10 rounded w-3/4"></div>
            <div className="h-4 bg-white/10 rounded"></div>
            <div className="h-4 bg-white/10 rounded w-5/6"></div>
          </div>
        </div>
      ) : files.length === 0 ? (
        <div className="glass-card p-12 flex flex-col items-center justify-center text-center animate-rise">
          <div className="size-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <FileCode className="size-8 text-ice/40" />
          </div>
          <h3 className="font-display text-xl text-ice mb-2">No programs available</h3>
          <p className="text-ice/60 max-w-sm">
            There are currently no custom files or programs uploaded by the developer.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {files.map((file) => (
            <div key={file.name} className="glass-card p-6 animate-rise">
              <div className="flex items-center gap-3 mb-4">
                <FileCode className="size-5 text-mint" />
                <h3 className="font-semibold text-lg text-ice">{file.name}</h3>
              </div>
              <div className="bg-black/30 rounded-lg p-4 overflow-x-auto border border-white/5">
                <pre className="text-sm font-mono text-ice/80 leading-relaxed whitespace-pre-wrap">
                  {file.content}
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
