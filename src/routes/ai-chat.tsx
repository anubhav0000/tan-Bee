import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Key, Trash2 } from "lucide-react";
import { useLocalStorage, uid } from "@/lib/store";

export const Route = createFileRoute("/ai-chat")({
  head: () => ({
    meta: [
      { title: "AI Study Buddy — Tan bee" },
      { name: "description", content: "Chat with an AI to help you study." },
    ],
  }),
  component: AIChatPage,
});

type Message = {
  id: string;
  role: "user" | "model";
  text: string;
};

function AIChatPage() {
  const [apiKey, setApiKey] = useLocalStorage("sh_gemini_api_key", "");
  const [apiKeyDraft, setApiKeyDraft] = useState(apiKey);
  const [messages, setMessages] = useLocalStorage<Message[]>("sh_ai_messages", [
    { id: uid(), role: "model", text: "Hi there! I'm your AI Study Buddy. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const saveKey = () => {
    setApiKey(apiKeyDraft.trim());
  };

  const clearChat = () => {
    setMessages([{ id: uid(), role: "model", text: "Hi there! I'm your AI Study Buddy. How can I help you today?" }]);
  };

  const sendMessage = async () => {
    if (!input.trim() || !apiKey) return;

    const userText = input.trim();
    const newMsgs = [...messages, { id: uid(), role: "user" as const, text: userText }];
    setMessages(newMsgs);
    setInput("");
    setIsTyping(true);

    try {
      // Simple fetch call to Gemini API
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: newMsgs.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
          }))
        })
      });

      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      const modelText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand that.";
      setMessages([...newMsgs, { id: uid(), role: "model", text: modelText }]);
    } catch (err: any) {
      setMessages([...newMsgs, { id: uid(), role: "model", text: `Error: ${err.message}. Please check your API key.` }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!apiKey) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="size-16 rounded-2xl bg-mint/10 border border-mint/20 flex items-center justify-center text-mint mb-6">
          <Sparkles className="size-8" />
        </div>
        <h1 className="font-display text-4xl text-ice mb-4">AI Study Buddy</h1>
        <p className="text-sm text-ice/70 mb-8 max-w-md leading-relaxed">
          To keep Tan bee completely free, private, and local without a backend server, you'll need to provide your own Google Gemini API key to use the AI chat. It's completely free to get one!
        </p>
        
        <div className="glass-card p-6 w-full max-w-md flex flex-col items-center animate-rise">
          <div className="flex items-center gap-2 mb-4 text-ice/80 w-full">
            <Key className="size-4" />
            <span className="font-semibold text-sm">Enter your API Key</span>
          </div>
          <input
            type="password"
            value={apiKeyDraft}
            onChange={e => setApiKeyDraft(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-sm text-ice placeholder:text-ice/30 outline-none focus:border-mint/50 mb-4"
          />
          <button 
            onClick={saveKey}
            disabled={!apiKeyDraft.trim()}
            className="w-full rounded-lg bg-mint px-4 py-3 text-sm font-semibold text-ink hover:bg-mint/90 disabled:opacity-50 transition-colors"
          >
            Save Key & Start Chatting
          </button>
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-xs text-mint/70 hover:text-mint mt-4 underline underline-offset-2">
            Get a free Gemini API Key here
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-7">
        <div>
          <p className="font-mono text-[10px] tracking-[0.25em] text-mint mb-2">// ASSISTANT</p>
          <h1 className="font-display text-4xl sm:text-5xl text-ice leading-[0.9]">AI Study Buddy</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={clearChat} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 hover:bg-coral/10 hover:text-coral text-ice/60 transition-colors flex items-center gap-1.5 border border-transparent hover:border-coral/20">
            <Trash2 className="size-3" /> Clear Chat
          </button>
          <button onClick={() => setApiKey("")} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-ice/60 transition-colors flex items-center gap-1.5 border border-transparent hover:border-white/10">
            <Key className="size-3" /> API Key
          </button>
        </div>
      </div>

      <div className="glass-card flex-1 min-h-0 flex flex-col animate-rise overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 ${
                m.role === "user" 
                  ? "bg-mint text-ink rounded-tr-sm" 
                  : "bg-white/5 border border-white/10 text-ice rounded-tl-sm whitespace-pre-wrap leading-relaxed"
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-1.5">
                <div className="size-1.5 rounded-full bg-ice/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="size-1.5 rounded-full bg-ice/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="size-1.5 rounded-full bg-ice/40 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </div>

        <div className="p-3 sm:p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask me anything..."
              className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-ice placeholder:text-ice/30 outline-none focus:border-mint/50"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              className="size-11 shrink-0 rounded-xl bg-mint flex items-center justify-center text-ink hover:bg-mint/90 disabled:opacity-50 transition-colors shadow-lg shadow-mint/10"
            >
              <Send className="size-4 ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
