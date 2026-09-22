import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { useLocalStorage } from "@/lib/store";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  CalendarDays,
  AlarmClock,
  BarChart3,
  Wallet,
  Users,
  QrCode,
  Menu,
  X,
  Info,
  CalendarOff,
  Timer,
  FileText,
  Sparkles,
  Settings,
} from "lucide-react";

const NAV = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, dot: "bg-mint" },
  { title: "Subjects", url: "/subjects", icon: BookOpen, dot: "bg-ice/30" },
  { title: "Assignments", url: "/assignments", icon: ClipboardList, dot: "bg-coral/60" },
  { title: "Class Timetable", url: "/timetable", icon: CalendarDays, dot: "bg-sky/60" },
  { title: "Exam Reminders", url: "/exams", icon: AlarmClock, dot: "bg-viol/60" },
  { title: "Attendance", url: "/attendance", icon: BarChart3, dot: "bg-mint/50" },
  { title: "Holidays", url: "/holidays", icon: CalendarOff, dot: "bg-coral/40" },
  { title: "Expenses", url: "/expenses", icon: Wallet, dot: "bg-ice/30" },
  { title: "Group Projects", url: "/projects", icon: Users, dot: "bg-sky/50" },
  { title: "Study Notes", url: "/notes", icon: FileText, dot: "bg-mint/60", requiresStudyMode: true },
  { title: "AI Study Buddy", url: "/ai-chat", icon: Sparkles, dot: "bg-viol/80", requiresStudyMode: true },
  { title: "Stopwatch", url: "/stopwatch", icon: Timer, dot: "bg-rose/50", requiresStudyMode: true },
  { title: "QR Generator", url: "/qr", icon: QrCode, dot: "bg-coral/50" },
  { title: "Settings", url: "/settings", icon: Settings, dot: "bg-ice/50" },
  { title: "About", url: "/about", icon: Info, dot: "bg-mint/80" },
] as const;

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [tutorialMode, setTutorialMode] = useLocalStorage<boolean>("sh_tutorial_mode", false);
  const [studyMode] = useLocalStorage<boolean>("sh_study_mode", true);

  return (
    <>
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="size-8 rounded-md overflow-hidden bg-mint grid place-items-center">
          <img src="/logo.png" alt="Tan bee Logo" className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="font-display tracking-wide text-ice leading-none uppercase">Tan bee</p>
          <p className="font-mono text-[9px] text-ice/40 mt-1 tracking-[0.2em]">SESS 2026 · LOCAL</p>
        </div>
      </div>
      <nav className="px-3 space-y-0.5 text-[13px] font-medium">
        {NAV.map((item) => {
          if ((item as any).requiresStudyMode && !studyMode) return null;
          
          const active = pathname === item.url;
          return (
            <Link
              key={item.url}
              to={item.url}
              onClick={onNavigate}
              className={
                active
                  ? "flex items-center gap-3 px-3 py-2.5 rounded-lg bg-mint/10 text-mint border-l-2 border-mint"
                  : "flex items-center gap-3 px-3 py-2.5 rounded-lg text-ice/55 hover:bg-white/5 transition-colors border-l-2 border-transparent"
              }
            >
              <span className={`size-1.5 rounded-full ${item.dot}`} />
              <item.icon className="size-3.5" />
              {item.title}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto p-4 border-t border-white/10 flex flex-col gap-3">
        {tutorialMode && (
          <button 
            onClick={() => setTutorialMode(false)}
            className="w-full text-xs font-semibold py-2 px-3 rounded bg-mint/10 text-mint hover:bg-mint/20 transition-colors border border-mint/20 flex items-center justify-center gap-1.5"
          >
            <X className="size-3" /> Dismiss Tutorial
          </button>
        )}
        <div className="rounded-lg bg-white/5 p-3">
          <div className="flex items-center justify-between font-mono text-[10px] text-ice/50">
            <span>DATA</span>
            <span>ON DEVICE</span>
          </div>
          <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full w-full bg-mint/60" />
          </div>
        </div>
      </div>
    </>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="font-body text-ice bg-ink min-h-screen relative overflow-hidden">
      <div className="fixed -top-40 -left-24 w-[520px] h-[520px] rounded-full bg-sky/20 blur-[120px] pointer-events-none" />
      <div className="fixed top-1/3 -right-24 w-[460px] h-[460px] rounded-full bg-mint/15 blur-[120px] pointer-events-none" />
      <div className="relative flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex w-64 shrink-0 border-r border-white/10 bg-panel/40 backdrop-blur-xl flex-col sticky top-0 h-screen">
          <SidebarNav />
        </aside>

        {/* Mobile sidebar */}
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <aside className="absolute left-0 top-0 bottom-0 w-64 border-r border-white/10 bg-panel flex flex-col">
              <button
                onClick={() => setOpen(false)}
                className="absolute right-3 top-5 text-ice/60 hover:text-ice"
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
              <SidebarNav onNavigate={() => setOpen(false)} />
            </aside>
          </div>
        )}

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-panel/40 backdrop-blur-xl sticky top-0 z-40">
            <button onClick={() => setOpen(true)} className="text-ice/70" aria-label="Open menu">
              <Menu className="size-5" />
            </button>
            <span className="font-display tracking-wide text-ice uppercase">Tan bee</span>
          </div>
          <main className="flex-1 p-5 sm:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
