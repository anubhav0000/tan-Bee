import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Lock, Copy, Check, Menu, Search, HelpCircle, Settings as SettingsIcon, Grid, Inbox, Star, Clock, Send, FileText, Tag, Plus, Users, ShoppingBag, ChevronDown, ChevronUp, Mail, Calendar, AlertCircle, Trash2, Settings2 } from "lucide-react";
import { useLocalStorage, Subject } from "@/lib/store";
import { SEED_SUNSET_CODES } from "@/lib/sunset-data";

export const Route = createFileRoute("/sunset")({
  head: () => ({
    meta: [
      { title: "Sunset — Tan bee" },
      { name: "description", content: "View the beautiful sunset and weather." },
    ],
  }),
  component: SunsetPage,
});

const DUMMY_EMAILS = [
  { sender: "Freelancer", subject: "Anubhav, these Web Development, PHP, and HTML projects...", snippet: "Hi Anubhav, Here are the lat...", time: "2:39 PM" },
  { sender: "Google", subject: "Reminder about Google's Terms of Service", snippet: "sikderanubhav@gmail.com Hello ANUBHAV...", time: "11:11 AM" },
  { sender: "Shopify Billing", subject: "A bill payment failed for My Store", snippet: "My Store October 3, 2026...", time: "8:42 AM" },
  { sender: "LinkedIn", subject: "Shubhayu Bhattacharyya - Technical Associate reacted...", snippet: "A proud milestone in my...", time: "Oct 2" },
  { sender: "Zeno from Resend", subject: "Early access, new integrations, and more", snippet: "Use Resend in different ways...", time: "Oct 2" }
];

const PURCHASES_EMAILS = [
  { sender: "Payments", subject: "Payment failed for Shopify", snippet: "Shopify ₹23.60 Payment Failed In case your money has been debited...", time: "Sep 16" },
  { sender: "Payments", subject: "Refund successful for Shopify", snippet: "Shopify ₹10.00 Refund has been initiated...", time: "Sep 15" },
  { sender: "Payments", subject: "Payment successful for Shopify", snippet: "Shopify ₹10.00 Paid Successfully...", time: "Sep 15" },
  { sender: "My Store", subject: "A shipment from order #1001 is on the way", snippet: "My Store Order #1001 Your order is on the way...", time: "Sep 14" },
  { sender: "My Store", subject: "[My Store] Order #1001 placed by ANUBHAV Sikder", snippet: "ANUBHAV Sikder placed order #1001...", time: "Sep 13" },
  { sender: "My Store", subject: "Order #1001 confirmed", snippet: "My Store Order #1001 Thank you for your order!...", time: "Sep 13" },
  { sender: "Payments", subject: "Refund successful for Shopify", snippet: "Shopify ₹10.00 Refund has been initiated...", time: "Sep 12" },
];

function SunsetPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [viewState, setViewState] = useState<"locked" | "fake" | "real">("locked");
  
  const [activeTab, setActiveTab] = useState("inbox");
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const [sunsetCodesLocal] = useLocalStorage<any[]>("sh_sunset_codes", []);
  const [subjects] = useLocalStorage<Subject[]>("sh_subjects", []);
  const [decoyPassword, setDecoyPassword] = useLocalStorage<string | null>("sh_decoy_password", null);

  const [error, setError] = useState("");
  const [statusText, setStatusText] = useState("");

  const sunsetCodes = [...sunsetCodesLocal, ...SEED_SUNSET_CODES];

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (viewState !== "locked") {
      timeoutId = setTimeout(() => {
        setViewState("locked");
        setPassword("");
        setStatusText("");
        setActiveTab("inbox");
        setIsMoreOpen(false);
      }, 10 * 60 * 1000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [viewState]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStatusText("");

    const proceedAsReal = () => {
      setStatusText("Password matched");
      setTimeout(() => {
        setViewState("real");
        setStatusText("");
      }, 700);
    };

    const proceedAsFake = () => {
      setStatusText("Password matched");
      setTimeout(() => {
        setViewState("fake");
        setStatusText("");
      }, 700);
    };

    if (password === "020526") {
      proceedAsReal();
    } else {
      if (!decoyPassword) {
        setDecoyPassword(password);
        proceedAsFake();
      } else if (password === decoyPassword) {
        proceedAsFake();
      } else {
        setError("Wrong password");
      }
    }
  };

  const handleProfileClick = () => {
    // Exit decoy and go to dashboard
    navigate({ to: "/" });
  };

  if (viewState === "locked") {
    return (
      <div className="max-w-md mx-auto pt-20">
        <div className="glass-card p-8 animate-rise text-center">
          <div className="w-16 h-16 rounded-full bg-amber/10 flex items-center justify-center mx-auto mb-6">
            <Lock className="size-8 text-amber" />
          </div>
          <h1 className="font-display text-3xl text-ice mb-2">Sunset Views</h1>
          <p className="text-ice/60 text-sm mb-6">Enter your access key to view today's sunset forecast.</p>
          
          <form onSubmit={handleUnlock} className="flex flex-col gap-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Access Key"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-ice text-center placeholder:text-ice/30 outline-none focus:border-amber/50 transition-colors"
              autoFocus
            />
            {error && <p className="text-rose text-sm animate-fade-in">{error}</p>}
            {statusText && <p className="text-mint text-sm animate-fade-in font-medium">{statusText}</p>}
            
            <button 
              type="submit"
              className="w-full rounded-xl bg-amber px-4 py-3 text-ink font-semibold hover:bg-amber/90 transition-colors shadow-lg shadow-amber/10"
            >
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (viewState === "fake") {
    return (
      <div className="max-w-2xl mx-auto">
        <p className="font-mono text-[10px] tracking-[0.25em] text-amber/50 mb-2">// FORECAST</p>
        <h1 className="font-display text-4xl sm:text-5xl text-ice leading-[0.9] mb-7 text-amber">Sunset Weather</h1>
        
        <div className="glass-card p-8 animate-rise text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber/20 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-6xl font-display text-ice mb-2">Clear Sky</h2>
            <p className="text-xl text-ice/80 mb-8">Perfect conditions for sunset viewing.</p>
            
            <div className="grid grid-cols-2 gap-4 text-left max-w-md mx-auto">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-ice/50 font-mono mb-1">SUNSET TIME</p>
                <p className="text-2xl font-semibold text-ice">18:42</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-ice/50 font-mono mb-1">TEMPERATURE</p>
                <p className="text-2xl font-semibold text-ice">24°C</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-ice/50 font-mono mb-1">VISIBILITY</p>
                <p className="text-2xl font-semibold text-ice">10 km</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-ice/50 font-mono mb-1">WIND</p>
                <p className="text-2xl font-semibold text-ice">8 km/h</p>
              </div>
            </div>
            
            <button 
              onClick={() => {
                setViewState("locked");
                setPassword("");
              }}
              className="mt-8 text-sm text-ice/40 hover:text-ice/70 transition-colors"
            >
              Return to lock screen
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Real View (Gmail Clone)
  return (
    <div className="fixed inset-0 z-[9999] bg-white animate-fade-in w-screen h-screen m-0 p-0">
      <div className="bg-white text-gray-800 w-full h-full flex flex-col font-sans relative">
        
        {/* Invisible reset button */}
        <button 
          onClick={() => {
            setViewState("locked");
            setPassword("");
          }}
          className="absolute bottom-2 right-2 w-8 h-8 opacity-0 z-50 cursor-default"
          title="Reset"
        />

        {/* Header */}
        <div className="flex items-center justify-between p-2.5 border-b border-gray-200 bg-white z-10 shrink-0">
          <div className="flex items-center gap-4 pl-1">
            <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors">
              <Menu className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex items-center gap-2 cursor-pointer">
              <img src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r5.png" alt="Gmail" className="h-6" />
            </div>
          </div>
          
          <div className="flex-1 max-w-3xl px-8 lg:px-12">
            <div className="flex items-center bg-[#EAF1FB] rounded-full px-4 py-2.5 focus-within:bg-white focus-within:shadow-md transition-all">
              <Search className="w-5 h-5 text-gray-500 mr-3" />
              <input 
                type="text" 
                placeholder="Search mail" 
                value={activeTab === 'purchases' ? 'category:purchases' : ''}
                readOnly
                className="bg-transparent outline-none w-full text-sm font-medium placeholder-gray-500" 
              />
              {activeTab === 'purchases' && <Settings2 className="w-5 h-5 text-gray-500 ml-3" />}
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-3 pr-2">
            <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer hidden sm:block">
              <HelpCircle className="w-5 h-5 text-gray-600" />
            </div>
            <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer hidden sm:block">
              <SettingsIcon className="w-5 h-5 text-gray-600" />
            </div>
            <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer hidden sm:block">
              <Grid className="w-5 h-5 text-gray-600" />
            </div>
            <div 
              onClick={handleProfileClick}
              className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-white font-medium ml-2 cursor-pointer hover:ring-4 hover:ring-gray-100 transition-all"
              title="Google Account"
            >
              A
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden z-10">
          {/* Sidebar */}
          <div className="w-64 py-3 bg-white hidden md:block border-r border-gray-100 overflow-y-auto">
            <div className="px-3 mb-4">
              <button className="flex items-center gap-4 bg-[#C2E7FF] text-[#001D35] px-5 py-3.5 rounded-2xl font-medium hover:shadow-md transition-shadow">
                <Plus className="w-5 h-5" />
                Compose
              </button>
            </div>
            
            <div className="space-y-0.5 text-[14px]">
              <SidebarItem id="inbox" icon={Inbox} label="Inbox" count={675} active={activeTab} setActive={setActiveTab} />
              <SidebarItem id="starred" icon={Star} label="Starred" active={activeTab} setActive={setActiveTab} />
              <SidebarItem id="snoozed" icon={Clock} label="Snoozed" active={activeTab} setActive={setActiveTab} />
              <SidebarItem id="sent" icon={Send} label="Sent" active={activeTab} setActive={setActiveTab} />
              <SidebarItem id="drafts" icon={FileText} label="Drafts" count={3} active={activeTab} setActive={setActiveTab} />
              <SidebarItem id="purchases" icon={ShoppingBag} label="Purchases" count={10} active={activeTab} setActive={setActiveTab} />
              
              <div 
                className="flex items-center gap-4 px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-r-full cursor-pointer mr-4"
                onClick={() => setIsMoreOpen(!isMoreOpen)}
              >
                {isMoreOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                <span>{isMoreOpen ? 'Less' : 'More'}</span>
              </div>

              {isMoreOpen && (
                <div className="pt-1 space-y-0.5">
                  <SidebarItem id="important" icon={Tag} label="Important" active={activeTab} setActive={setActiveTab} />
                  <SidebarItem id="scheduled" icon={Calendar} label="Scheduled" active={activeTab} setActive={setActiveTab} />
                  <SidebarItem id="all" icon={Mail} label="All Mail" active={activeTab} setActive={setActiveTab} />
                  <SidebarItem id="spam" icon={AlertCircle} label="Spam" count={2} active={activeTab} setActive={setActiveTab} />
                  <SidebarItem id="trash" icon={Trash2} label="Trash" active={activeTab} setActive={setActiveTab} />
                </div>
              )}
            </div>
            
            <div className="mt-8 px-6 text-sm">
              <div className="flex items-center justify-between text-gray-700 hover:bg-gray-100 py-1.5 px-2 -mx-2 rounded cursor-pointer">
                <span className="flex items-center gap-4"><Settings2 className="w-4 h-4 text-blue-600" /> Manage subscriptions</span>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
              </div>
              <div className="flex items-center justify-between text-gray-700 hover:bg-gray-100 py-1.5 px-2 -mx-2 rounded cursor-pointer">
                <span className="flex items-center gap-4"><Settings2 className="w-4 h-4 text-gray-500" /> Manage labels</span>
              </div>
              <div className="flex items-center justify-between text-gray-700 hover:bg-gray-100 py-1.5 px-2 -mx-2 rounded cursor-pointer">
                <span className="flex items-center gap-4"><Plus className="w-4 h-4 text-gray-500" /> Create new label</span>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
            
            {activeTab === 'inbox' && (
              <div className="flex border-b border-gray-200 shrink-0">
                <div className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b-2 border-blue-600 text-blue-600 font-medium w-auto sm:w-64 cursor-pointer hover:bg-gray-50 transition-colors">
                  <Inbox className="w-4 sm:w-5 h-4 sm:h-5" /> <span className="hidden sm:inline">Primary</span>
                </div>
                <div className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 text-gray-600 hover:bg-gray-50 cursor-pointer w-auto sm:w-64 transition-colors">
                  <Tag className="w-4 sm:w-5 h-4 sm:h-5" /> 
                  <span className="hidden sm:inline font-medium">Promotions</span> 
                  <span className="hidden lg:inline bg-green-700 text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold">50 new</span>
                </div>
                <div className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 text-gray-600 hover:bg-gray-50 cursor-pointer w-auto sm:w-64 transition-colors">
                  <Users className="w-4 sm:w-5 h-4 sm:h-5" /> 
                  <span className="hidden sm:inline font-medium">Social</span> 
                  <span className="hidden lg:inline bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold">50 new</span>
                </div>
              </div>
            )}
            
            {activeTab === 'purchases' && (
              <div className="flex border-b border-gray-200 shrink-0 p-3 bg-gray-50/50">
                <div className="flex items-center gap-4 text-gray-600 px-4">
                  <input type="checkbox" className="w-4 h-4 border-gray-300 rounded cursor-pointer" />
                  <ChevronDown className="w-4 h-4 cursor-pointer" />
                </div>
                <div className="flex-1"></div>
                <div className="text-xs text-gray-500 px-4">1-9 of 11</div>
              </div>
            )}
            
            {/* Email List */}
            <div className="flex-1 overflow-y-auto pb-16">
              {activeTab === 'inbox' && (
                <>
                  {sunsetCodes.map((code) => {
                    const subject = subjects.find(s => s.id === code.subjectId);
                    const titleStr = code.type === "assignment" 
                      ? `Assignment ${code.number}` 
                      : code.title;
                    const timeStr = new Date(code.createdAt || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

                    return (
                      <CodeEmailRow 
                        key={code.id}
                        sender={subject?.name || "Unknown"}
                        subject={titleStr}
                        codeContent={code.content}
                        time={timeStr}
                        unread={true}
                      />
                    );
                  })}
                  
                  {/* Fill remaining with dummy emails */}
                  {DUMMY_EMAILS.slice(sunsetCodes.length).map((dummy, i) => (
                    <DummyEmailRow key={i} {...dummy} showBackground={false} />
                  ))}
                </>
              )}

              {activeTab === 'purchases' && (
                <>
                  {PURCHASES_EMAILS.map((dummy, i) => (
                    <DummyEmailRow key={i} {...dummy} tag="Inbox" showBackground={true} />
                  ))}
                </>
              )}

              {activeTab !== 'inbox' && activeTab !== 'purchases' && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <Inbox className="w-12 h-12 mb-4 text-gray-300" />
                  <p className="text-sm">No new messages.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 w-full bg-white border-t border-gray-100 p-4 text-[11px] text-gray-500 flex flex-col sm:flex-row justify-between items-center z-20">
              <div className="flex items-center gap-4 mb-2 sm:mb-0">
                <div className="w-48 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gray-400 w-[11%] h-full"></div>
                </div>
                <span>11% of 15 GB used <span className="inline-block ml-1">↗</span></span>
              </div>
              <div className="flex gap-4">
                <a href="#" className="hover:underline">Terms</a>
                <span>·</span>
                <a href="#" className="hover:underline">Privacy</a>
                <span>·</span>
                <a href="#" className="hover:underline">Program Policies</a>
              </div>
              <div className="text-right">
                Last account activity: 10 minutes ago<br/>
                <a href="#" className="hover:underline">Details</a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ id, icon: Icon, label, count, active, setActive }: any) {
  const isActive = active === id;
  return (
    <div 
      className={`flex items-center justify-between px-6 py-1.5 rounded-r-full cursor-pointer mr-4 transition-colors ${
        isActive 
          ? (id === 'inbox' || id === 'purchases' ? 'bg-[#D3E3FD] text-[#041E49] font-bold' : 'bg-gray-200 text-gray-900 font-bold') 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
      onClick={() => setActive(id)}
    >
      <div className="flex items-center gap-4">
        <Icon className={`w-4 h-4 ${isActive ? (id === 'inbox' || id === 'purchases' ? 'text-[#041E49]' : 'text-gray-900') : 'text-gray-500'}`} />
        <span>{label}</span>
      </div>
      {count && <span className={`text-xs ${isActive ? 'font-bold' : 'font-semibold'}`}>{count}</span>}
    </div>
  );
}

function CodeEmailRow({ sender, subject, codeContent, time, unread = false }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border-b border-gray-100 group">
      <div 
        className={`flex items-center px-2 sm:px-4 py-2 sm:py-2.5 cursor-pointer hover:shadow-sm transition-shadow ${unread ? 'bg-gray-50 font-bold text-gray-900' : 'bg-white text-gray-700'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 sm:gap-3 w-32 sm:w-48 shrink-0">
          <input type="checkbox" className="w-4 h-4 border-gray-300 rounded text-gray-300 cursor-pointer hidden sm:block" />
          <Star className={`w-4 h-4 cursor-pointer hidden sm:block ${unread ? 'text-gray-400 hover:text-yellow-400' : 'text-gray-300 hover:text-gray-400'}`} />
          <span className="truncate text-[13px] sm:text-[14px]">{sender}</span>
        </div>
        <div className="flex-1 truncate text-[13px] sm:text-[14px]">
          <span>{subject}</span>
          <span className="text-gray-500 font-normal ml-1 sm:ml-2 hidden sm:inline">- {codeContent.substring(0, 40).replace(/\n/g, ' ')}...</span>
        </div>
        <div className="w-16 sm:w-20 text-right text-[11px] sm:text-xs ml-2 sm:ml-4 shrink-0 font-medium">
          {time}
        </div>
      </div>

      {isOpen && (
        <div className="p-6 bg-white animate-fade-in border-t border-gray-100 shadow-inner">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium text-gray-800">{subject}</h3>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied" : "Copy Code"}
            </button>
          </div>
          <pre className="font-mono text-[13px] text-gray-700 overflow-x-auto p-5 rounded-lg bg-gray-50 border border-gray-200 whitespace-pre-wrap leading-relaxed shadow-sm">
            {codeContent}
          </pre>
        </div>
      )}
    </div>
  );
}

function DummyEmailRow({ sender, subject, snippet, time, unread = false, tag, showBackground }: any) {
  return (
    <div className={`flex items-center border-b border-gray-100 px-2 sm:px-4 py-2 sm:py-2.5 cursor-default ${unread ? 'bg-gray-50 font-bold text-gray-900' : 'bg-white text-gray-700'} ${showBackground ? 'hover:bg-gray-50 hover:shadow-sm transition-shadow' : ''}`}>
      <div className="flex items-center gap-2 sm:gap-3 w-32 sm:w-48 shrink-0">
        <input type="checkbox" className="w-4 h-4 border-gray-300 rounded text-gray-300 hidden sm:block" disabled />
        <Star className={`w-4 h-4 hidden sm:block ${unread ? 'text-gray-400' : 'text-gray-300'}`} />
        <span className="truncate text-[13px] sm:text-[14px]">{sender}</span>
      </div>
      <div className="flex-1 truncate text-[13px] sm:text-[14px] flex items-center">
        {tag && <span className="bg-gray-200 text-gray-600 text-[10px] px-1.5 py-0.5 rounded font-medium mr-2 hidden sm:inline-block">{tag}</span>}
        <span className={unread ? "font-bold text-gray-900" : "font-semibold text-gray-800"}>{subject}</span>
        <span className="text-gray-500 font-normal ml-1 sm:ml-2 hidden sm:inline">- {snippet}</span>
      </div>
      <div className="w-16 sm:w-20 text-right text-[11px] sm:text-xs ml-2 sm:ml-4 shrink-0 font-medium">
        {time}
      </div>
    </div>
  );
}
