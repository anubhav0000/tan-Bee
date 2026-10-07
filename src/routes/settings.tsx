import { createFileRoute } from "@tanstack/react-router";
import { Settings, BookOpen, Activity, Lock, Unlock, Check } from "lucide-react";
import { useState } from "react";
import { useLocalStorage } from "@/lib/store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Tan bee" },
      { name: "description", content: "Manage your app preferences." },
    ],
  }),
  component: SettingsPage,
});

type AccessFlow = "NONE" | "LIFETIME_OTP" | "LIFETIME_PWD" | "TEMP_OTP";

function SettingsPage() {
  const [studyMode, setStudyMode] = useLocalStorage<boolean>("sh_study_mode", true);
  const [healthMode, setHealthMode] = useLocalStorage<boolean>("sh_health_mode", false);
  
  const [lifetimeAccess, setLifetimeAccess] = useLocalStorage<boolean>("sh_lifetime_access", false);
  const [tempAccessExpiry, setTempAccessExpiry] = useLocalStorage<number>("sh_temp_access_expiry", 0);

  const [flow, setFlow] = useState<AccessFlow>("NONE");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpExpiry, setOtpExpiry] = useState(0);
  const [userOtp, setUserOtp] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const isProgramsUnlocked = lifetimeAccess || Date.now() < tempAccessExpiry;

  const sendOtpEmail = async (flowType: "LIFETIME_OTP" | "TEMP_OTP") => {
    setIsSendingOtp(true);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setOtpExpiry(Date.now() + 5 * 60 * 1000); // 5 mins validity
    
    try {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "b0a4626e-7512-469f-bb44-c49db6082845",
          subject: `Tanbee Unlock OTP: ${otp}`,
          from_name: "Tanbee Admin",
          message: `Your random OTP is: ${otp}. It is valid for 5 minutes.`,
        }),
      });
      setFlow(flowType);
      setAdminError("");
      setUserOtp("");
    } catch (err) {
      setAdminError("Failed to send OTP.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (Date.now() > otpExpiry) {
      setAdminError("OTP has expired. Please retry.");
      return;
    }
    if (userOtp === generatedOtp) {
      if (flow === "LIFETIME_OTP") {
        setFlow("LIFETIME_PWD");
        setAdminError("");
        setAdminPassword("");
      } else if (flow === "TEMP_OTP") {
        setTempAccessExpiry(Date.now() + 15 * 60 * 1000);
        setFlow("NONE");
        setAdminError("");
      }
    } else {
      setAdminError("Incorrect OTP.");
    }
  };

  const handlePwdVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "020526") {
      setLifetimeAccess(true);
      setFlow("NONE");
      setAdminError("");
    } else {
      setAdminError("Incorrect password.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <p className="font-mono text-[10px] tracking-[0.25em] text-ice/50 mb-2">// PREFERENCES</p>
      <h1 className="font-display text-4xl sm:text-5xl text-ice leading-[0.9] mb-7">Settings</h1>

      <div className="glass-card p-6 animate-rise">
        <p className="section-label mb-5">FEATURES</p>
        
        <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-white/10 bg-white/5 transition-colors hover:bg-white/10">
          <div className="flex gap-4">
            <div className="mt-1 text-mint">
              <BookOpen className="size-5" />
            </div>
            <div>
              <p className="font-semibold text-ice">Study Mode</p>
              <p className="text-sm text-ice/60 mt-1 max-w-[280px]">
                Enable advanced study features including the AI Study Buddy, Stopwatch, and Study Notes.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setStudyMode(!studyMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${studyMode ? 'bg-mint' : 'bg-white/20'}`}
          >
            <span className={`inline-block size-4 transform rounded-full bg-white transition-transform ${studyMode ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-white/10 bg-white/5 transition-colors hover:bg-white/10 mt-4">
          <div className="flex gap-4">
            <div className="mt-1 text-rose">
              <Activity className="size-5" />
            </div>
            <div>
              <p className="font-semibold text-ice">Health & Wellness</p>
              <p className="text-sm text-ice/60 mt-1 max-w-[280px]">
                Enable the student health dashboard to track hydration, meals, sleep, and budget.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setHealthMode(!healthMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${healthMode ? 'bg-rose' : 'bg-white/20'}`}
          >
            <span className={`inline-block size-4 transform rounded-full bg-white transition-transform ${healthMode ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      <div className="glass-card p-6 animate-rise mt-8">
        <div className="flex items-center gap-2 mb-5">
          {isProgramsUnlocked ? <Unlock className="size-4 text-mint" /> : <Lock className="size-4 text-ice/50" />}
          <p className="section-label">ADMIN PANEL UNLOCK</p>
        </div>
        
        {!isProgramsUnlocked ? (
          <div className="space-y-4">
            <p className="text-sm text-ice/60 mb-4">Unlock the Programs section with lifetime or temporary access.</p>
            
            {flow === "NONE" && (
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => sendOtpEmail("LIFETIME_OTP")} 
                  disabled={isSendingOtp}
                  className="flex-1 rounded-xl bg-mint/10 text-mint border border-mint/20 px-4 py-3 font-semibold hover:bg-mint/20 transition-colors"
                >
                  {isSendingOtp ? "Sending..." : "Lifetime Access"}
                </button>
                <button 
                  onClick={() => sendOtpEmail("TEMP_OTP")} 
                  disabled={isSendingOtp}
                  className="flex-1 rounded-xl bg-amber/10 text-amber-400 border border-amber/20 px-4 py-3 font-semibold hover:bg-amber/20 transition-colors"
                >
                  {isSendingOtp ? "Sending..." : "Temporary Access (15m)"}
                </button>
              </div>
            )}

            {(flow === "LIFETIME_OTP" || flow === "TEMP_OTP") && (
              <form onSubmit={handleOtpVerify} className="flex flex-col gap-3 animate-fade-in">
                <p className="text-sm text-ice/80">
                  We've sent a random OTP to your registered email. Please enter it below.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <input
                    type="text"
                    value={userOtp}
                    onChange={(e) => setUserOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter numeric OTP"
                    className="w-full sm:flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 sm:py-2.5 text-ice placeholder:text-ice/30 outline-none focus:border-mint/50 transition-colors"
                  />
                  <div className="flex gap-2">
                    <button 
                      type="submit"
                      className="flex-1 sm:flex-none rounded-xl bg-mint px-4 py-3 sm:py-2.5 text-ink font-semibold hover:bg-mint/90 transition-colors"
                    >
                      Verify
                    </button>
                    <button 
                      type="button"
                      onClick={() => sendOtpEmail(flow)}
                      disabled={isSendingOtp}
                      className="flex-1 sm:flex-none rounded-xl bg-white/5 border border-white/10 px-4 py-3 sm:py-2.5 text-ice font-semibold hover:bg-white/10 transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              </form>
            )}

            {flow === "LIFETIME_PWD" && (
              <form onSubmit={handlePwdVerify} className="flex flex-col gap-3 animate-fade-in">
                <p className="text-sm text-ice/80">Enter the second password for lifetime access.</p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full sm:flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 sm:py-2.5 text-ice placeholder:text-ice/30 outline-none focus:border-mint/50 transition-colors"
                  />
                  <button 
                    type="submit"
                    className="w-full sm:w-auto rounded-xl bg-mint px-6 py-3 sm:py-2.5 text-ink font-semibold hover:bg-mint/90 transition-colors"
                  >
                    Unlock
                  </button>
                </div>
              </form>
            )}

            {adminError && <p className="text-rose text-sm mt-2">{adminError}</p>}
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <p className="text-sm text-mint flex items-center gap-2">
              <Check className="size-4" /> Admin panel unlocked.
            </p>
            {lifetimeAccess ? (
              <p className="text-xs text-ice/60">You have lifetime access to the Programs section.</p>
            ) : (
              <p className="text-xs text-ice/60">
                Temporary access expires at {new Date(tempAccessExpiry).toLocaleTimeString()}
              </p>
            )}
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to revoke your access? You will need to unlock it again later.")) {
                  setLifetimeAccess(false);
                  setTempAccessExpiry(0);
                }
              }}
              className="text-xs text-rose/90 hover:text-white hover:bg-rose/90 border border-rose/20 bg-rose/10 px-3 py-1.5 rounded transition-colors"
            >
              Revoke Access
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
