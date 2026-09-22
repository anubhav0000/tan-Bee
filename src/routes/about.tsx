import { createFileRoute } from "@tanstack/react-router";
import { Info, Linkedin } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Tan bee" },
      { name: "description", content: "About Tan bee, the app vision, and creator." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="max-w-3xl">
      <p className="font-mono text-[10px] tracking-[0.25em] text-mint mb-2">// ABOUT</p>
      <h1 className="font-display text-4xl sm:text-5xl text-ice leading-[0.9] mb-7">About Tan bee</h1>

      <div className="grid gap-4">
        <div className="glass-card p-6 animate-rise">
          <p className="section-label mb-4">APP DETAILS</p>
          <div className="space-y-5">
            <div>
              <p className="font-mono text-[10px] text-ice/40 tracking-wider">VERSION</p>
              <p className="text-xl font-display text-ice mt-1">1.0.0</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-ice/40 tracking-wider">CREATOR</p>
              <p className="text-xl font-display text-mint mt-1">Anubhav Sikder</p>
              
              <a 
                href="https://www.linkedin.com/in/anubhav-sikder-633190421?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#0A66C2] px-4 py-2 text-sm font-semibold text-white hover:bg-[#004182] transition-colors"
              >
                <Linkedin className="size-4" /> Get in touch
              </a>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 animate-rise [animation-delay:40ms]">
          <p className="section-label mb-3 flex items-center gap-2 text-mint">
            <Info className="size-4" /> APP VISION
          </p>
          <div className="space-y-4 text-[15px] text-ice/80 leading-relaxed mt-4">
            <p>
              Tan bee is designed to be the ultimate campus companion. We believe students deserve software that isn't cluttered or overly complex, but instead brings clarity, speed, and beautiful design to their daily academic lives.
            </p>
            <p>
              From seamless attendance tracking (where you capture the full day at once) to schedule management and QR tools, the vision of Tan bee is to put everything you need right in your pocket. Built to perform brilliantly across both laptops and mobile devices, it's your semester—all in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
