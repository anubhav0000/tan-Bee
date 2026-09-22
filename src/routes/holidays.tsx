import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarOff } from "lucide-react";
import { useLocalStorage, toDateKey } from "@/lib/store";

export const Route = createFileRoute("/holidays")({
  head: () => ({
    meta: [
      { title: "Holidays — Tan bee" },
      { name: "description", content: "Mark holidays to exclude from attendance." },
    ],
  }),
  component: HolidaysPage,
});

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function HolidaysPage() {
  const [offDays, setOffDays] = useLocalStorage<string[]>("sh_off_days", []);
  
  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date();
    d.setDate(1); // Set to first of month to avoid overflow issues
    return d;
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  const today = () => {
    setCurrentDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const toggleDay = (day: number) => {
    const d = new Date(year, month, day);
    const key = toDateKey(d);
    
    if (offDays.includes(key)) {
      setOffDays(offDays.filter(k => k !== key));
    } else {
      setOffDays([...offDays, key]);
    }
  };

  const todayKey = toDateKey(new Date());

  // Generate calendar grid
  const cells = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push(<div key={`empty-${i}`} className="p-2" />);
  }
  
  for (let d = 1; d <= daysInMonth; d++) {
    const dObj = new Date(year, month, d);
    const key = toDateKey(dObj);
    const isOff = offDays.includes(key);
    const isToday = key === todayKey;
    
    cells.push(
      <button
        key={`day-${d}`}
        onClick={() => toggleDay(d)}
        className={`relative p-2 sm:p-4 rounded-xl border flex flex-col items-center justify-center transition-all min-h-[80px] ${
          isOff 
            ? "bg-coral/20 border-coral/40 text-coral hover:bg-coral/30" 
            : "bg-white/5 border-white/10 text-ice hover:bg-white/10"
        } ${isToday ? "ring-2 ring-mint ring-offset-2 ring-offset-panel" : ""}`}
      >
        <span className="text-xl font-display">{d}</span>
        {isOff && <span className="text-[10px] font-mono mt-1 opacity-80 uppercase tracking-widest hidden sm:block">Holiday</span>}
      </button>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <p className="font-mono text-[10px] tracking-[0.25em] text-coral mb-2">// HOLIDAYS</p>
      <h1 className="font-display text-4xl sm:text-5xl text-ice leading-[0.9] mb-7">Mark Holidays</h1>
      <p className="text-sm text-ice/60 mb-8 max-w-xl">
        Select dates that are public holidays or off-days. Classes scheduled on these dates will not be counted in your Attendance Calculator.
      </p>

      <div className="glass-card p-6 animate-rise">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-3xl text-ice w-48">
              {MONTHS[month]} <span className="text-ice/40">{year}</span>
            </h2>
            <button onClick={today} className="text-[10px] font-mono bg-white/5 border border-white/10 px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors">
              TODAY
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="size-10 rounded-xl bg-white/5 border border-white/10 grid place-items-center hover:bg-white/10 transition-colors">
              <ChevronLeft className="size-5" />
            </button>
            <button onClick={nextMonth} className="size-10 rounded-xl bg-white/5 border border-white/10 grid place-items-center hover:bg-white/10 transition-colors">
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-4 mb-2">
          {DAYS_OF_WEEK.map(day => (
            <div key={day} className="text-center text-[10px] font-mono text-ice/50 py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2 sm:gap-4">
          {cells}
        </div>
      </div>
      
      <div className="mt-8 p-4 rounded-xl border border-mint/20 bg-mint/5 flex items-start gap-4">
        <div className="mt-1 text-mint"><CalendarOff className="size-5" /></div>
        <div>
          <p className="text-sm font-semibold text-ice">How Holidays Work</p>
          <p className="text-xs text-ice/60 mt-1">
            When you mark a day as a Holiday, it is completely removed from your total working days count in the Attendance calculator. It's as if that day never existed in the semester!
          </p>
        </div>
      </div>
    </div>
  );
}
