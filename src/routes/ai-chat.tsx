import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Construction } from "lucide-react";

export const Route = createFileRoute("/ai-chat")({
  head: () => ({
    meta: [
      { title: "AI Study Buddy — Tan bee" },
      { name: "description", content: "Chat with an AI to help you study." },
    ],
  }),
  component: AIChatPage,
});

function AIChatPage() {
  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[70vh] text-center animate-fade-in">
      <div className="relative">
        <div className="absolute -inset-4 bg-mint/20 blur-xl rounded-full opacity-50 animate-pulse"></div>
        <div className="relative size-20 rounded-3xl bg-panel border border-mint/20 flex items-center justify-center text-mint mb-8 shadow-xl shadow-mint/10">
          <Sparkles className="size-10" />
        </div>
      </div>
      
      <p className="font-mono text-[10px] tracking-[0.25em] text-mint mb-3">// IN DEVELOPMENT</p>
      <h1 className="font-display text-5xl text-ice mb-6 leading-tight">
        AI Study Buddy <br />
        <span className="text-ice/40 italic">Coming Soon</span>
      </h1>
      
      <div className="glass-card p-6 border border-white/10 rounded-2xl max-w-md animate-rise bg-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3 text-ice/80 mb-3 justify-center">
          <Construction className="size-5 text-amber-400" />
          <h3 className="font-semibold text-lg">Under Construction</h3>
        </div>
        <p className="text-sm text-ice/60 leading-relaxed">
          We are currently working hard to bring you a completely free, private, and hyper-intelligent AI study companion directly in your browser. Hang tight!
        </p>
      </div>
    </div>
  );
}
