import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Play, Square, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/stopwatch")({
  head: () => ({
    meta: [
      { title: "Study Stopwatch — Tan bee" },
      { name: "description", content: "Track your study sessions with a simple stopwatch." },
    ],
  }),
  component: StopwatchPage,
});

function StopwatchPage() {
  const [timeMs, setTimeMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    if (isRunning) {
      intervalId = setInterval(() => {
        setTimeMs((t) => t + 10);
      }, 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  const toggle = () => setIsRunning(!isRunning);
  const reset = () => {
    setIsRunning(false);
    setTimeMs(0);
  };

  const hours = Math.floor(timeMs / 3600000);
  const minutes = Math.floor((timeMs % 3600000) / 60000);
  const seconds = Math.floor((timeMs % 60000) / 1000);
  const ms = Math.floor((timeMs % 1000) / 10);

  const formatNumber = (num: number, digits = 2) => num.toString().padStart(digits, "0");

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[70vh]">
      <p className="font-mono text-[10px] tracking-[0.25em] text-mint mb-2">// FOCUS</p>
      <h1 className="font-display text-4xl sm:text-5xl text-ice leading-[0.9] mb-12">Study Stopwatch</h1>

      <div className="glass-card p-12 w-full flex flex-col items-center animate-rise">
        <div className="font-display text-[5rem] sm:text-[7rem] text-ice tracking-wider leading-none mb-4 flex items-baseline">
          {hours > 0 && <span>{formatNumber(hours)}:</span>}
          <span>{formatNumber(minutes)}:</span>
          <span>{formatNumber(seconds)}</span>
          <span className="text-3xl sm:text-5xl text-ice/40 ml-2">.{formatNumber(ms)}</span>
        </div>

        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={toggle}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-all ${
              isRunning 
                ? "bg-coral text-ink hover:bg-coral/90 shadow-lg shadow-coral/20" 
                : "bg-mint text-ink hover:bg-mint/90 shadow-lg shadow-mint/20"
            }`}
          >
            {isRunning ? (
              <>
                <Square className="size-5 fill-current" /> Stop
              </>
            ) : (
              <>
                <Play className="size-5 fill-current" /> Start
              </>
            )}
          </button>
          
          <button
            onClick={reset}
            disabled={timeMs === 0}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl font-bold text-lg bg-white/5 text-ice hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <RotateCcw className="size-5" /> Reset
          </button>
        </div>
      </div>
    </div>
  );
}
