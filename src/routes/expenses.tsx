import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useLocalStorage, SEED_EXPENSES, uid, inr, type Expense } from "@/lib/store";

export const Route = createFileRoute("/expenses")({
  head: () => ({
    meta: [
      { title: "College Expenses — StudentHub" },
      { name: "description", content: "Log college expenses by category and track your monthly total." },
      { property: "og:title", content: "College Expenses — StudentHub" },
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
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState<string>("Books");
  const [amount, setAmount] = useState("");

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
    setExpenses([...expenses, { id: uid(), label: label.trim(), category, amount: amt, date: new Date().toISOString().slice(0, 10) }]);
    setLabel("");
    setAmount("");
  };

  return (
    <div className="max-w-3xl">
      <p className="font-mono text-[10px] tracking-[0.25em] text-mint mb-2">// EXPENSES</p>
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
          <button onClick={add} className="inline-flex items-center gap-1.5 rounded-lg bg-mint px-4 py-2 text-sm font-semibold text-ink hover:bg-mint/90">
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
                <p className="text-sm font-medium text-ice truncate">{e.label}</p>
                <p className="font-mono text-[10px] text-ice/40">
                  {e.category.toUpperCase()} · {e.date}
                </p>
              </div>
              <span className="ml-auto font-display text-xl text-ice">{inr(e.amount)}</span>
              <button
                onClick={() => setExpenses(expenses.filter((x) => x.id !== e.id))}
                className="text-ice/30 hover:text-coral transition-colors"
                aria-label="Delete expense"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        {expenses.length === 0 && <p className="text-sm text-ice/40 py-6 text-center">No expenses logged yet.</p>}
      </div>
    </div>
  );
}
