import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2, Settings, Undo, Check, X, ShieldAlert, IndianRupee } from "lucide-react";
import { useLocalStorage, SEED_EXPENSES, uid, inr, type Expense, type ClearEvent } from "@/lib/store";

export const Route = createFileRoute("/expenses")({
  head: () => ({
    meta: [
      { title: "College Expenses — Tan bee" },
      { name: "description", content: "Log college expenses by category and track your monthly total." },
      { property: "og:title", content: "College Expenses — Tan bee" },
      { property: "og:description", content: "Log college expenses by category and track your monthly total." },
    ],
  }),
  component: ExpensesPage,
});

const CATEGORIES = ["Books", "Supplies", "Transport", "Food", "Printing", "Fees", "Other"];
const CAT_COLORS: Record<string, string> = {
  Books: "bg-sky",
  Supplies: "bg-mint",
  Transport: "bg-coral",
  Food: "bg-viol",
  Printing: "bg-ice/50",
  Fees: "bg-coral/70",
  Other: "bg-ice/30",
};

function ExpensesPage() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>("sh_expenses", SEED_EXPENSES);
  const [tutorialMode] = useLocalStorage<boolean>("sh_tutorial_mode", false);
  const [parentTracking, setParentTracking] = useLocalStorage("sh_parent_tracking", false);
  const [upiClears, setUpiClears] = useLocalStorage<ClearEvent[]>("sh_upi_clears", []);
  
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState<string>("Books");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "upi">("upi");
  
  const [clearAmountInput, setClearAmountInput] = useState("");
  const [confirmState, setConfirmState] = useState<"none" | "partial" | "full">("none");
  const [recentClearId, setRecentClearId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!confirmDeleteId) return;
    const t = setTimeout(() => setConfirmDeleteId(null), 3000);
    return () => clearTimeout(t);
  }, [confirmDeleteId]);

  // Auto-hide undo after 60s
  useEffect(() => {
    if (!recentClearId) return;
    const t = setTimeout(() => {
      setRecentClearId(null);
    }, 60000);
    return () => clearTimeout(t);
  }, [recentClearId]);

  const totalUpiExpenses = expenses.filter(e => e.paymentMethod === "upi").reduce((s, e) => s + e.amount, 0);
  const totalCleared = upiClears.reduce((s, c) => s + c.amount, 0);
  const upiBalance = Math.max(0, totalUpiExpenses - totalCleared);

  const monthKey = new Date().toISOString().slice(0, 7);
  const monthExpenses = expenses.filter((e) => e.date.startsWith(monthKey));
  const monthTotal = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const byCat = CATEGORIES.map((c) => ({
    name: c,
    total: monthExpenses.filter((e) => e.category === c).reduce((s, e) => s + e.amount, 0),
  })).filter((c) => c.total > 0);

  const add = () => {
    const amt = parseFloat(amount);
    if (!label.trim() || !amt || amt <= 0) return;
    setExpenses([...expenses, { id: uid(), label: label.trim(), category, amount: amt, date: new Date().toISOString().slice(0, 10), paymentMethod }]);
    setLabel("");
    setAmount("");
  };

  const handleClear = (full: boolean) => {
    const amt = full ? upiBalance : parseFloat(clearAmountInput);
    if (!amt || amt <= 0 || amt > upiBalance) return;
    
    if (confirmState === "none") {
      setConfirmState(full ? "full" : "partial");
      return;
    }
    
    const newClear: ClearEvent = { id: uid(), amount: amt, timestamp: Date.now() };
    setUpiClears([...upiClears, newClear]);
    setRecentClearId(newClear.id);
    setConfirmState("none");
    setClearAmountInput("");
  };

  const undoClear = () => {
    if (!recentClearId) return;
    setUpiClears(upiClears.filter(c => c.id !== recentClearId));
    setRecentClearId(null);
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-2">
        <p className="font-mono text-[10px] tracking-[0.25em] text-mint">// EXPENSES</p>
        <button onClick={() => setParentTracking(!parentTracking)} className={`flex items-center gap-1.5 font-mono text-[10px] px-2 py-1 rounded transition-colors ${parentTracking ? "bg-mint/10 text-mint" : "bg-white/5 text-ice/40 hover:text-ice"}`}>
          <Settings className="size-3" /> PARENT TRACKING {parentTracking ? "ON" : "OFF"}
        </button>
      </div>
      <h1 className="font-display text-4xl sm:text-5xl text-ice leading-[0.9] mb-7">College expenses</h1>

      <div className="glass-card p-5 mb-4 animate-rise">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="section-label">THIS MONTH</p>
            <p className="font-display text-5xl text-ice mt-2 leading-none">{inr(monthTotal)}</p>
          </div>
          <p className="font-mono text-[10px] text-ice/40">{monthExpenses.length} ENTRIES</p>
        </div>
        {byCat.length > 0 && (
          <div className="flex h-2 rounded-full overflow-hidden bg-white/10">
            {byCat.map((c) => (
              <div key={c.name} title={`${c.name} ${inr(c.total)}`} className={CAT_COLORS[c.name]} style={{ width: `${(c.total / monthTotal) * 100}%` }} />
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-3 mt-3 font-mono text-[9px] text-ice/40">
          {byCat.map((c) => (
            <span key={c.name} className="flex items-center gap-1.5">
              <span className={`size-2 rounded ${CAT_COLORS[c.name]}`} />
              {c.name.toUpperCase()} {inr(c.total)}
            </span>
          ))}
        </div>
      </div>

      {parentTracking && (
        <div className="glass-card p-5 mb-4 animate-rise border-mint/20">
          <div className="flex items-center justify-between mb-2">
            <p className="section-label text-mint">UPI REIMBURSEMENT BALANCE</p>
          </div>
          <p className="font-display text-4xl text-ice">{inr(upiBalance)}</p>
          <p className="font-mono text-[9px] text-ice/40 mt-1">AMOUNT OWED BY PARENTS FOR UPI EXPENSES</p>
          
          <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10 flex flex-col gap-3">
            {recentClearId ? (
              <div className="flex items-center justify-between gap-3 bg-mint/10 p-3 rounded-md border border-mint/20">
                <div className="flex items-center gap-2 text-mint text-sm font-semibold">
                  <Check className="size-4" /> Clear successful!
                </div>
                <button onClick={undoClear} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-coral/10 text-coral text-xs font-semibold hover:bg-coral/20 transition-colors">
                  <Undo className="size-3.5" /> Undo Action
                </button>
              </div>
            ) : confirmState !== "none" ? (
              <div className="flex items-center justify-between gap-3 bg-coral/10 p-3 rounded-md border border-coral/20">
                <div className="flex items-center gap-2 text-coral text-sm font-semibold">
                  <ShieldAlert className="size-4" /> Are you sure you want to clear?
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setConfirmState("none")} className="px-3 py-1.5 rounded-md bg-white/5 text-ice/70 text-xs font-semibold hover:bg-white/10">Cancel</button>
                  <button onClick={() => handleClear(confirmState === "full")} className="px-3 py-1.5 rounded-md bg-coral text-ink text-xs font-bold hover:bg-coral/90">Confirm</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="number"
                  placeholder="₹ Custom amount"
                  value={clearAmountInput}
                  onChange={(e) => setClearAmountInput(e.target.value)}
                  className="w-36 rounded-md bg-ink/50 border border-white/10 px-3 py-1.5 text-sm text-ice placeholder:text-ice/30 outline-none focus:border-mint/50"
                  disabled={upiBalance === 0}
                />
                <button onClick={() => handleClear(false)} disabled={upiBalance === 0 || !clearAmountInput} className="px-3 py-1.5 rounded-md bg-white/10 text-ice text-xs font-semibold hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed">
                  Clear Amount
                </button>
                <div className="w-px h-6 bg-white/10 hidden sm:block" />
                <button onClick={() => handleClear(true)} disabled={upiBalance === 0} className="px-3 py-1.5 rounded-md bg-mint/20 text-mint border border-mint/30 text-xs font-semibold hover:bg-mint/30 disabled:opacity-50 disabled:cursor-not-allowed ml-auto">
                  Clear Full Balance
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="glass-card p-5 mb-4 animate-rise [animation-delay:60ms]">
        <p className="section-label mb-3">LOG EXPENSE</p>
        <div className="flex flex-wrap gap-2">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="What was it?"
            className="flex-1 min-w-40 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-ice placeholder:text-ice/30 outline-none focus:border-mint/50"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-ice outline-none focus:border-mint/50 [&>option]:bg-panel"
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="₹ 0"
            className="w-24 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-ice placeholder:text-ice/30 outline-none focus:border-mint/50"
          />
          {parentTracking && (
            <div className="flex rounded-lg bg-white/5 border border-white/10 p-1">
              <button 
                onClick={() => setPaymentMethod("cash")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${paymentMethod === 'cash' ? 'bg-white/10 text-ice' : 'text-ice/40 hover:text-ice'}`}
              >
                Cash
              </button>
              <button 
                onClick={() => setPaymentMethod("upi")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${paymentMethod === 'upi' ? 'bg-mint text-ink' : 'text-ice/40 hover:text-ice'}`}
              >
                UPI
              </button>
            </div>
          )}
          <button onClick={add} className="inline-flex items-center gap-1.5 rounded-lg bg-mint px-4 py-2 text-sm font-semibold text-ink hover:bg-mint/90 ml-auto sm:ml-0">
            <Plus className="size-4" /> Add
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {[...expenses]
          .sort((a, b) => b.date.localeCompare(a.date))
          .map((e, i) => (
            <div key={e.id} className="glass-card flex items-center gap-4 px-5 py-3.5 animate-rise" style={{ animationDelay: `${i * 30}ms` }}>
              <span className={`size-2.5 rounded-full ${CAT_COLORS[e.category] ?? "bg-ice/30"}`} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-ice truncate flex items-center gap-2">
                  {e.label}
                  {parentTracking && e.paymentMethod === "upi" && <span className="px-1.5 py-0.5 rounded bg-mint/10 text-mint text-[9px] font-mono border border-mint/20">UPI</span>}
                  {parentTracking && e.paymentMethod === "cash" && <span className="px-1.5 py-0.5 rounded bg-white/5 text-ice/40 text-[9px] font-mono border border-white/10">CASH</span>}
                </p>
                <p className="font-mono text-[10px] text-ice/40">
                  {e.category.toUpperCase()} · {e.date}
                </p>
              </div>
              <span className="ml-auto font-display text-xl text-ice">{inr(e.amount)}</span>
              {confirmDeleteId === e.id ? (
                <button
                  onClick={() => setExpenses(expenses.filter((x) => x.id !== e.id))}
                  className="ml-2 text-ink bg-coral hover:bg-coral/90 px-3 py-1.5 rounded-md text-xs font-bold transition-colors"
                >
                  Confirm Delete
                </button>
              ) : (
                <button
                  onClick={() => setConfirmDeleteId(e.id)}
                  className="text-ice/30 hover:text-coral transition-colors ml-2"
                  aria-label="Delete expense"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>
          ))}
        {expenses.length === 0 && (
          tutorialMode ? (
            <div className="py-12 text-center animate-fade-in">
              <div className="inline-flex flex-col items-center gap-3 bg-mint/10 border border-mint/20 p-6 rounded-2xl relative shadow-lg shadow-mint/5">
                <div className="absolute -top-4 animate-bounce bg-mint text-ink rounded-full size-8 flex items-center justify-center font-bold text-lg shadow-md">
                  ↑
                </div>
                <p className="text-mint font-semibold mt-2">Log your first expense</p>
                <p className="text-xs text-mint/70 max-w-[250px] leading-relaxed">
                  Spent money on food or books today? Log it here to keep your daily budget on track!
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-ice/40 py-6 text-center">No expenses logged yet.</p>
          )
        )}
      </div>
    </div>
  );
}
