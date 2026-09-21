import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import QRCode from "qrcode";

export const Route = createFileRoute("/qr")({
  head: () => ({
    meta: [
      { title: "QR Generator — StudentHub" },
      { name: "description", content: "Turn any link or text into a downloadable QR code." },
      { property: "og:title", content: "QR Generator — StudentHub" },
      { property: "og:description", content: "Turn any link or text into a downloadable QR code." },
    ],
  }),
  component: QrPage,
});

function QrPage() {
  const [text, setText] = useState("https://");
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const value = text.trim();
    if (!value) {
      setDataUrl(null);
      return;
    }
    let cancelled = false;
    QRCode.toDataURL(value, {
      width: 512,
      margin: 2,
      color: { dark: "#0e1526", light: "#3be8b0" },
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setDataUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [text]);

  return (
    <div className="max-w-3xl">
      <p className="font-mono text-[10px] tracking-[0.25em] text-mint mb-2">// QR GENERATOR</p>
      <h1 className="font-display text-4xl sm:text-5xl text-ice leading-[0.9] mb-7">QR generator</h1>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="glass-card p-5 animate-rise">
          <p className="section-label mb-3">CONTENT</p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Paste a link or type any text…"
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-ice placeholder:text-ice/30 outline-none focus:border-mint/50 resize-none"
          />
          <p className="mt-3 font-mono text-[10px] text-ice/40">
            Links, Wi-Fi credentials, notes — anything under ~500 characters.
          </p>
          {dataUrl && (
            <a
              href={dataUrl}
              download="studenthub-qr.png"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-mint px-4 py-2 text-sm font-semibold text-ink hover:bg-mint/90"
            >
              <Download className="size-4" /> Download PNG
            </a>
          )}
        </div>

        <div className="glass-card p-5 grid place-items-center animate-rise [animation-delay:80ms] relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 left-1/4 w-40 h-[150%] bg-gradient-to-b from-white/10 to-transparent rotate-[-14deg] animate-sweep" />
          </div>
          {dataUrl ? (
            <img src={dataUrl} alt="Generated QR code" className="relative size-56 rounded-xl" />
          ) : (
            <p className="relative font-mono text-[11px] text-ice/30">TYPE SOMETHING TO GENERATE</p>
          )}
        </div>
      </div>
    </div>
  );
}
