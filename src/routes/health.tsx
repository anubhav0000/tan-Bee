import { createFileRoute } from "@tanstack/react-router";
import { useState, FormEvent, useEffect } from "react";
import { useLocalStorage } from "@/lib/store";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Activity,
  Droplets,
  Moon,
  Footprints,
  Wallet,
  Flame,
  Book,
  CheckCircle2,
  Circle,
  Plus,
  Utensils,
  Coffee,
  Apple,
  Dumbbell,
  TrendingUp,
  AlertTriangle
} from "lucide-react";

export const Route = createFileRoute("/health")({
  head: () => ({
    meta: [
      { title: "Health & Wellness — Tan bee" },
      { name: "description", content: "Fresh Student Wellness Tracker." },
    ],
  }),
  component: HealthDashboard,
});

const FOOD_PRESETS = [
  { name: "Oats & Fruits", price: 40, kcal: 320, img: "https://images.openai.com/static-rsc-4/AzO236pFbAlD0uzY9FBPZ2tORKIPaO6aRjVsdvB_GChQ5gIKN_lvYsmvP6YfIFpWHXU0iwb47IdiKLmWJMlEdl1Ek0jc_4joKvEz3djcfT1FUTglh6o0r-2nTGu7QD_CZeq8CAoiNXNAq0NyCZMWpNcEy1a-dH1rwHXnIwT4v_YOTgAFj9fr9KpTHhEEEKBA?purpose=fullsize" },
  { name: "Healthy Bowl", price: 80, kcal: 450, img: "https://images.openai.com/static-rsc-4/Nfmgq2Bnlg3hTuNPQ_ezx01RFqsIBvWfb9zIuEyyaDNVW-W_smXUxhEgiCemvIp0AHFrnlSH1RAK_YiXs5evpr4BOeFDLO91EFbnUud0a9gIqOok9TcxQB-zLx20R5i--0kZseVZDm8Df2pfiEhFPBJs935ZAwKG47Os-It0bFj2UrBM785FPKyrNnsYR1bn?purpose=fullsize" },
  { name: "Avocado Toast", price: 60, kcal: 380, img: "https://images.openai.com/static-rsc-4/dZSQUBMeOoh6TN3lZatLlfS38Nzdsd3wGxnmTkuTZ5N3mD0149-LNCpAdkwqcKohWHIyO5jcdaW1YxHxwIdZh8_9p4e-jqERIVox8-UOd4vKC3DhXsA4pGIMZZDHhODLUqxwU3ZnbY5hJleimztz1QRPw7IU1vG4zkG-qbjBeBvY2UbtB-z-eljQRymgUth2?purpose=fullsize" },
  { name: "Chicken Salad", price: 100, kcal: 410, img: "https://images.openai.com/static-rsc-4/6AEB5hbNOMhpr4ZWmawCBeCwL6b2Y6-pAhrEwLnrtkSlVFwyOnc1Q98L2fpp364MgGH8a7D01Mr70zYZZmKTsEB88_5G7ex5b7dXPNlsFr_69v00HeuB-PYaRK_QCIv6F5AfuFkXM90ZVBWFvp9hdnsMGYZMOg5LNbIs9rhZ9FJJDIcAXw3frDxrszgeFYw0?purpose=fullsize" },
];

const FOOD_DATABASE: Record<string, number> = {
  samosa: 250, roti: 100, chapati: 100, egg: 75, dal: 150, rice: 200, 
  chicken: 300, momo: 50, momos: 50, banana: 105, apple: 95, tea: 50, 
  coffee: 70, burger: 400, pizza: 250, sandwich: 200, poha: 250, 
  dosa: 150, idli: 60, paneer: 300, biryani: 500, maggi: 350, 
  noodles: 350, chips: 150, milk: 120, biscuit: 50, roll: 350, wrap: 300
};

function estimateCalories(foodName: string): string {
  const text = foodName.toLowerCase();
  let total = 0;
  let found = false;

  for (const [food, kcal] of Object.entries(FOOD_DATABASE)) {
    if (text.includes(food)) {
      const match = text.match(new RegExp(`(\\d+)\\s*${food}`));
      if (match) {
        total += kcal * parseInt(match[1]);
      } else {
        total += kcal;
      }
      found = true;
    }
  }

  return found ? total.toString() : "";
}

type HealthHistoryEntry = {
  date: string;
  score: number;
  calories: number;
  water: number;
  sleep: number;
  exercise: number;
  spend: number;
};

function generateMockHistory(): HealthHistoryEntry[] {
  const history: HealthHistoryEntry[] = [];
  const today = new Date();
  for (let i = 14; i >= 1; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    history.push({
      date: d.toISOString().split('T')[0]!,
      score: Math.floor(Math.random() * 40) + 50,
      calories: Math.floor(Math.random() * 800) + 1200,
      water: Math.floor(Math.random() * 1000) + 1000,
      sleep: Math.floor(Math.random() * 180) + 240,
      exercise: Math.floor(Math.random() * 45),
      spend: Math.floor(Math.random() * 200) + 50,
    });
  }
  return history;
}

function CircularProgress({ score }: { score: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
        <circle
          className="text-[#E2E8F0]"
          strokeWidth="6"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="40"
          cy="40"
        />
        <circle
          className="text-mint transition-all duration-1000 ease-out"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="40"
          cy="40"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-ice">{score}</span>
      </div>
    </div>
  );
}

function HealthDashboard() {
  const [userName] = useLocalStorage<string>("sh_user_name", "Student");
  
  // States
  const [dailyBudget, setDailyBudget] = useLocalStorage<number>("sh_daily_budget", 150);
  const [waterIntake, setWaterIntake] = useLocalStorage<number>("sh_water_intake", 500);
  const [foodSpend, setFoodSpend] = useLocalStorage<number>("sh_food_spend", 45);
  const [calories, setCalories] = useLocalStorage<number>("sh_calories", 400);
  const [sleepMinutes, setSleepMinutes] = useLocalStorage<number>("sh_sleep_mins", 360); // 6 hours default
  const [exerciseMinutes, setExerciseMinutes] = useLocalStorage<number>("sh_exercise_mins", 0);
  const [steps, setSteps] = useLocalStorage<number>("sh_steps", 4230);

  // Form states
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [newBudget, setNewBudget] = useState(dailyBudget.toString());
  
  const [customFoodName, setCustomFoodName] = useState("");
  const [customFoodCost, setCustomFoodCost] = useState("");
  const [customFoodKcal, setCustomFoodKcal] = useState("");
  const [isFetchingKcal, setIsFetchingKcal] = useState(false);
  const [foodType, setFoodType] = useState<"home" | "outside">("outside");

  const [sleepInputHrs, setSleepInputHrs] = useState("");
  const [sleepInputMins, setSleepInputMins] = useState("");

  const [exerciseInputMins, setExerciseInputMins] = useState("");

  const [history, setHistory] = useLocalStorage<HealthHistoryEntry[]>("sh_health_history", generateMockHistory());
  const [lastDate, setLastDate] = useLocalStorage<string>("sh_health_last_date", new Date().toISOString().split('T')[0]!);
  const [timeRange, setTimeRange] = useState<"7D"|"1M"|"3M"|"6M"|"1Y">("7D");
  const [resetConfirm, setResetConfirm] = useState(false);

  // Targets
  const waterGoal = 2000;
  const calorieGoal = 2000;
  const sleepGoalMins = 480;

  const calculateHealthScore = (cal: number, w: number, s: number, e: number) => {
    const scoreCal = Math.min(100, (cal / calorieGoal) * 100);
    const scoreWater = Math.min(100, (w / waterGoal) * 100);
    const scoreSleep = Math.min(100, (s / sleepGoalMins) * 100);
    return Math.round((scoreCal + scoreWater + scoreSleep + (e > 30 ? 100 : e * 3.3)) / 4);
  };

  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0]!;
    if (lastDate !== todayStr) {
      const newEntry: HealthHistoryEntry = {
        date: lastDate,
        score: calculateHealthScore(calories, waterIntake, sleepMinutes, exerciseMinutes),
        calories,
        water: waterIntake,
        sleep: sleepMinutes,
        exercise: exerciseMinutes,
        spend: foodSpend
      };
      setHistory(prev => [...prev, newEntry]);
      
      setCalories(0);
      setWaterIntake(0);
      setFoodSpend(0);
      setSleepMinutes(0);
      setExerciseMinutes(0);
      setSteps(0);
      
      setLastDate(todayStr);
    }
  }, []);

  const handleSetBudget = (e: FormEvent) => {
    e.preventDefault();
    if (newBudget) setDailyBudget(Number(newBudget));
    setIsEditingBudget(false);
  };

  const handleFoodBlur = async () => {
    if (!customFoodName.trim()) return;

    setIsFetchingKcal(true);
    try {
      const response = await fetch(`https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(customFoodName)}`, {
        headers: { 'X-Api-Key': 'B9A3dlYo801THJdtyjDBcIIif0IvoZ9TzOmYNmN4' }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          const totalKcal = data.items.reduce((acc: number, item: any) => acc + item.calories, 0);
          setCustomFoodKcal(Math.round(totalKcal).toString());
          setIsFetchingKcal(false);
          return;
        }
      }
    } catch (err) {
      console.error("Failed to fetch calories", err);
    }
    setIsFetchingKcal(false);

    // Fallback to offline database
    const estimated = estimateCalories(customFoodName);
    if (estimated) setCustomFoodKcal(estimated);
  };

  const addCustomFood = (e: FormEvent) => {
    e.preventDefault();
    if (customFoodKcal) {
      if (foodType === "outside" && customFoodCost) {
        setFoodSpend(foodSpend + Number(customFoodCost));
      }
      setCalories(calories + Number(customFoodKcal));
      setCustomFoodName("");
      setCustomFoodCost("");
      setCustomFoodKcal("");
    }
  };

  const addPresetFood = (price: number, kcal: number) => {
    setFoodSpend(foodSpend + price);
    setCalories(calories + kcal);
  };

  const addWater = (amount: number) => setWaterIntake(Math.min(waterGoal, waterIntake + amount));

  const logSleep = (e: FormEvent) => {
    e.preventDefault();
    const hrs = Number(sleepInputHrs) || 0;
    const mins = Number(sleepInputMins) || 0;
    if (hrs > 0 || mins > 0) {
      setSleepMinutes(hrs * 60 + mins);
      setSleepInputHrs("");
      setSleepInputMins("");
    }
  };

  const logExercise = (e: FormEvent) => {
    e.preventDefault();
    const mins = Number(exerciseInputMins);
    if (mins > 0) {
      setExerciseMinutes(exerciseMinutes + mins);
      setExerciseInputMins("");
    }
  };

  const getFilteredHistory = () => {
    let days = 7;
    if (timeRange === "1M") days = 30;
    if (timeRange === "3M") days = 90;
    if (timeRange === "6M") days = 180;
    if (timeRange === "1Y") days = 365;
    return history.slice(-days);
  };

  const handleWipeData = () => {
    if (resetConfirm) {
      localStorage.removeItem("sh_health_history");
      localStorage.removeItem("sh_health_last_date");
      localStorage.removeItem("sh_calories");
      localStorage.removeItem("sh_water_intake");
      localStorage.removeItem("sh_food_spend");
      localStorage.removeItem("sh_sleep_mins");
      localStorage.removeItem("sh_exercise_mins");
      localStorage.removeItem("sh_steps");
      window.location.reload();
    } else {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 3000);
    }
  };

  // Compute Health Score (rough estimation for UI)
  const healthScore = calculateHealthScore(calories, waterIntake, sleepMinutes, exerciseMinutes);

  return (
    <div className="-mx-5 sm:-mx-8 -my-5 sm:-my-8 p-5 sm:p-8 min-h-screen bg-transparent text-ice pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 max-w-3xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-ice">Good Morning, {userName} 👋</h1>
          <p className="text-ice/60 text-sm mt-1">Take care of yourself while you take care of your studies.</p>
        </div>
        <div className="w-12 h-12 bg-white/5 rounded-full shadow-sm border border-white/10 flex items-center justify-center overflow-hidden">
          <span className="text-sky font-bold text-xl">{userName[0]}</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Main Health Score Card */}
        <div className="bg-white/5 rounded-[24px] p-6 shadow-sm border border-white/10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex flex-col items-center">
            <p className="text-ice/60 text-xs font-semibold uppercase tracking-wider mb-2">Today's Health</p>
            <CircularProgress score={healthScore} />
            <p className="text-ice/60 text-xs mt-2">/ 100</p>
          </div>
          
          <div className="grid grid-cols-2 gap-x-12 gap-y-6 flex-1 w-full">
            <div>
              <div className="flex items-center gap-2 text-ice/60 text-xs font-semibold mb-1">
                <Flame className="size-4 text-amber" /> CALORIES
              </div>
              <p className="text-xl font-bold text-ice">{calories} <span className="text-sm font-normal text-ice/60">kcal</span></p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-ice/60 text-xs font-semibold mb-1">
                <Droplets className="size-4 text-sky" /> WATER
              </div>
              <p className="text-xl font-bold text-ice">{(waterIntake/1000).toFixed(1)} <span className="text-sm font-normal text-ice/60">L</span></p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-ice/60 text-xs font-semibold mb-1">
                <Moon className="size-4 text-[#8B5CF6]" /> SLEEP
              </div>
              <p className="text-xl font-bold text-ice">{Math.floor(sleepMinutes / 60)}h {sleepMinutes % 60}m</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-ice/60 text-xs font-semibold mb-1">
                <Footprints className="size-4 text-mint" /> STEPS
              </div>
              <p className="text-xl font-bold text-ice">{steps}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Budget & Food Entry Card */}
          <div className="bg-white/5 rounded-[24px] p-6 shadow-sm border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2 text-ice"><Wallet className="size-5 text-mint" /> Food Budget</h2>
              {!isEditingBudget ? (
                <button onClick={() => setIsEditingBudget(true)} className="text-xs text-sky font-medium hover:underline">Edit Budget</button>
              ) : (
                <button onClick={() => setIsEditingBudget(false)} className="text-xs text-ice/60">Cancel</button>
              )}
            </div>

            {isEditingBudget ? (
              <form onSubmit={handleSetBudget} className="flex gap-2 mb-6">
                <input 
                  type="number" 
                  value={newBudget}
                  onChange={e => setNewBudget(e.target.value)}
                  className="flex-1 bg-transparent border border-white/10 rounded-xl px-3 py-2 text-sm text-ice placeholder:text-ice/40 outline-none focus:border-[#22C55E]"
                  placeholder="Daily Budget (₹)"
                  required
                />
                <button type="submit" className="bg-mint text-white px-4 py-2 rounded-xl text-sm font-medium">Save</button>
              </form>
            ) : (
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-ice/60">Spent: ₹{foodSpend}</span>
                  <span className="font-medium text-ice">Left: ₹{Math.max(0, dailyBudget - foodSpend)}</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${foodSpend > dailyBudget ? 'bg-red-500' : 'bg-mint'}`} 
                    style={{ width: `${Math.min(100, (foodSpend/dailyBudget)*100)}%` }} 
                  />
                </div>
              </div>
            )}

            <h3 className="text-sm font-medium text-ice mb-3">Log Custom Food</h3>
            <form onSubmit={addCustomFood} className="grid grid-cols-2 gap-2 mb-6">
              <div className="col-span-2 flex gap-2 mb-2">
                <button 
                  type="button" 
                  onClick={() => setFoodType("home")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${foodType === 'home' ? 'bg-mint/10 border-[#22C55E] text-mint' : 'bg-transparent border-white/10 text-ice/60'}`}
                >
                  🏠 Home Food
                </button>
                <button 
                  type="button" 
                  onClick={() => setFoodType("outside")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${foodType === 'outside' ? 'bg-sky/10 border-[#38BDF8] text-sky' : 'bg-transparent border-white/10 text-ice/60'}`}
                >
                  🍔 Outside Food
                </button>
              </div>
              <input 
                type="text" 
                value={customFoodName}
                onChange={e => setCustomFoodName(e.target.value)}
                onBlur={handleFoodBlur}
                placeholder="What did you eat? (e.g. 2 Samosa)"
                className="col-span-2 bg-transparent border border-white/10 rounded-xl px-3 py-2 text-sm text-ice placeholder:text-ice/40 outline-none focus:border-[#22C55E]"
                required
              />
              {foodType === "outside" && (
                <input 
                  type="number" 
                  value={customFoodCost}
                  onChange={e => setCustomFoodCost(e.target.value)}
                  placeholder="Cost (₹)"
                  className="bg-transparent border border-white/10 rounded-xl px-3 py-2 text-sm text-ice placeholder:text-ice/40 outline-none focus:border-[#22C55E]"
                  required
                />
              )}
              <div className={`relative ${foodType === "home" ? "col-span-2" : ""}`}>
                <input 
                  type="number" 
                  value={customFoodKcal}
                  onChange={e => setCustomFoodKcal(e.target.value)}
                  placeholder="Calories"
                  className="w-full bg-transparent border border-white/10 rounded-xl px-3 py-2 text-sm text-ice placeholder:text-ice/40 outline-none focus:border-[#22C55E]"
                  required
                />
                {isFetchingKcal && (
                  <Activity className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-sky animate-pulse" />
                )}
              </div>
              <button type="submit" className="col-span-2 mt-1 bg-white/10 hover:bg-[#E2E8F0] text-ice transition-colors py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                <Plus className="size-4" /> Add Food
              </button>
            </form>
          </div>

          <div className="space-y-6">
            {/* Quick Food Cards */}
            <div className="bg-white/5 rounded-[24px] p-6 shadow-sm border border-white/10">
              <h2 className="font-semibold text-ice mb-4">Quick Ideas</h2>
              <div className="grid grid-cols-2 gap-3">
                {FOOD_PRESETS.map((food, i) => (
                  <div key={i} className="rounded-2xl border border-white/10 overflow-hidden group cursor-pointer hover:border-[#22C55E] hover:shadow-sm transition-all" onClick={() => addPresetFood(food.price, food.kcal)}>
                    <div className="h-20 w-full overflow-hidden">
                      <img src={food.img} alt={food.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-semibold text-ice truncate">{food.name}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[10px] text-ice/60">{food.kcal} kcal</span>
                        <span className="text-[10px] font-medium text-mint">₹{food.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Water Tracker */}
            <div className="rounded-[24px] p-6 shadow-sm relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)' }}>
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Droplets className="w-24 h-24 text-[#0284C7]" />
              </div>
              <h2 className="font-semibold text-sky mb-1 flex items-center gap-2"><Droplets className="size-5" /> Hydration</h2>
              <p className="text-3xl font-bold text-ice">{(waterIntake/1000).toFixed(1)} <span className="text-lg font-normal opacity-60">/ {(waterGoal/1000).toFixed(1)} L</span></p>
              
              <div className="flex gap-2 mt-5 relative z-10">
                {[100, 250, 500].map(amount => (
                  <button
                    key={amount}
                    onClick={() => addWater(amount)}
                    className="flex-1 py-2 px-1 rounded-xl bg-white/5/40 hover:bg-white/5/60 transition-colors text-xs font-semibold text-sky flex flex-col items-center gap-0.5 active:scale-95"
                  >
                    <Plus className="size-3" />
                    {amount}ml
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Sleep Tracker */}
          <div className="rounded-[24px] p-6 shadow-sm text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)' }}>
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Moon className="w-24 h-24 text-white" />
            </div>
            <h2 className="font-semibold text-white/90 mb-1 flex items-center gap-2"><Moon className="size-5" /> Sleep Tracker</h2>
            <p className="text-3xl font-bold">{Math.floor(sleepMinutes / 60)}h {sleepMinutes % 60}m</p>
            <p className="text-white/60 text-sm mt-1">Target: 8h 00m</p>

            <form onSubmit={logSleep} className="mt-5 flex gap-2 relative z-10">
              <input 
                type="number" 
                value={sleepInputHrs}
                onChange={e => setSleepInputHrs(e.target.value)}
                placeholder="Hrs"
                className="w-16 bg-white/5/10 border border-white/20 rounded-xl px-2 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/50"
              />
              <input 
                type="number" 
                value={sleepInputMins}
                onChange={e => setSleepInputMins(e.target.value)}
                placeholder="Mins"
                className="w-16 bg-white/5/10 border border-white/20 rounded-xl px-2 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/50"
              />
              <button type="submit" className="flex-1 bg-white/5/20 hover:bg-white/5/30 transition-colors rounded-xl text-sm font-medium">Log Sleep</button>
            </form>
          </div>

          {/* Exercise & Study */}
          <div className="flex flex-col gap-6">
            <div className="bg-white/5 rounded-[24px] p-6 shadow-sm border border-white/10">
              <h2 className="font-semibold flex items-center gap-2 text-ice mb-3"><Dumbbell className="size-5 text-amber" /> Exercise</h2>
              <div className="flex justify-between items-center mb-4">
                <span className="text-ice/60 text-sm">Today's Activity</span>
                <span className="font-bold text-ice">{exerciseMinutes} mins</span>
              </div>
              <form onSubmit={logExercise} className="flex gap-2">
                <input 
                  type="number" 
                  value={exerciseInputMins}
                  onChange={e => setExerciseInputMins(e.target.value)}
                  placeholder="Minutes"
                  className="w-24 bg-transparent border border-white/10 rounded-xl px-3 py-2 text-sm text-ice placeholder:text-ice/40 outline-none focus:border-[#FBBF24]"
                />
                <button type="submit" className="flex-1 bg-amber/20 hover:bg-[#FDE68A] text-amber transition-colors rounded-xl text-sm font-medium">Log Workout</button>
              </form>
            </div>

            <div className="bg-viol/10 rounded-[24px] p-6 shadow-sm border border-white/10">
              <h2 className="font-semibold flex items-center gap-2 text-viol mb-2"><Book className="size-5" /> Study & Health</h2>
              <p className="text-sm text-viol/80">You've been active for 2h 15m today.</p>
              <div className="mt-4 flex gap-2">
                <span className="bg-white/5 text-viol text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm">💻 3h Screen</span>
                <span className="bg-white/5 text-mint text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm">👀 Rest eyes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Historical Charts */}
        <div className="bg-white/5 rounded-[24px] p-6 shadow-sm border border-white/10 mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="font-semibold flex items-center gap-2 text-ice"><TrendingUp className="size-5 text-mint" /> Health Trends</h2>
            <div className="flex bg-white/10 p-1 rounded-xl">
              {(["7D", "1M", "3M", "6M", "1Y"] as const).map(tr => (
                <button
                  key={tr}
                  onClick={() => setTimeRange(tr)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${timeRange === tr ? "bg-white/5 text-ice shadow-sm" : "text-ice/60 hover:text-ice"}`}
                >
                  {tr}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-64 mb-8">
            <p className="text-xs text-ice/60 mb-2 font-medium">Health Score Progress</p>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getFilteredHistory()}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3be8b0" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3be8b0" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" hide />
                <YAxis domain={[0, 100]} hide />
                <Tooltip contentStyle={{ backgroundColor: '#151d31', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#c7d4ea', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)' }} />
                <Area type="monotone" dataKey="score" stroke="#3be8b0" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid md:grid-cols-2 gap-6 h-48">
            <div>
              <p className="text-xs text-ice/60 mb-2 font-medium">Calories</p>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getFilteredHistory()}>
                  <XAxis dataKey="date" hide />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#151d31', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#c7d4ea', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)' }} />
                  <Bar dataKey="calories" fill="#ffc14d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="text-xs text-ice/60 mb-2 font-medium">Hydration (ml)</p>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getFilteredHistory()}>
                  <XAxis dataKey="date" hide />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#151d31', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#c7d4ea', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)' }} />
                  <Bar dataKey="water" fill="#5eead4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="mt-12 flex flex-col items-center justify-center p-6 border-t border-white/10">
          <p className="text-xs text-ice/60 mb-4 text-center">Need a fresh start? This will delete all your local health data.</p>
          <button 
            onClick={handleWipeData}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${resetConfirm ? "bg-red-500 text-white animate-pulse" : "bg-red-500/10 text-red-400 hover:bg-red-500/20"}`}
          >
            <AlertTriangle className="size-4" />
            {resetConfirm ? "Are you sure? Click again to wipe data" : "Reset All Data"}
          </button>
        </div>

      </div>
    </div>
  );
}
