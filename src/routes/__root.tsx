import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Shell } from "@/components/shell";
import { useLocalStorage, useHydrated } from "@/lib/store";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-ice">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-ice">Page not found</h2>
        <p className="mt-2 text-sm text-ice/50">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-mint px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-mint/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-ice">This page didn't load</h1>
        <p className="mt-2 text-sm text-ice/50">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-mint px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-mint/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-white/10 px-4 py-2 text-sm font-medium text-ice transition-colors hover:bg-white/5"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Tan bee" },
      {
        name: "description",
        content:
          "Tan bee: dashboard, subjects, assignments, timetable, exam reminders, attendance, expenses, group projects and QR tools. Fully responsive for both mobile and laptop users.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0F0F11" },
    ],
    links: [
      { rel: "manifest", href: "/manifest.json" },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/logo.png", type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}

function NameOnboarding({ children }: { children: ReactNode }) {
  const [userName, setUserName] = useLocalStorage<string>("sh_user_name", "");
  const [draftName, setDraftName] = useState("");
  const hydrated = useHydrated();

  if (!hydrated) return null;

  if (!userName) {
    return (
      <div className="min-h-screen bg-panel flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/3 -left-20 w-72 h-72 bg-mint/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-coral/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="glass-card max-w-sm w-full p-8 flex flex-col items-center text-center animate-rise relative z-10">
          <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-xl">
            <img src="/logo.png" alt="Tan bee" className="w-10 h-10 drop-shadow-md" />
          </div>
          <h1 className="font-display text-4xl text-ice mb-2">Welcome to Tan bee</h1>
          <p className="text-sm text-ice/60 mb-8">What should we call you?</p>
          
          <form 
            onSubmit={(e) => { 
              e.preventDefault(); 
              if (draftName.trim()) setUserName(draftName.trim()); 
            }}
            className="w-full flex flex-col gap-3"
          >
            <input
              type="text"
              autoFocus
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-ice text-center placeholder:text-ice/30 outline-none focus:border-mint/50 transition-colors"
            />
            <button 
              type="submit"
              disabled={!draftName.trim()}
              className="w-full rounded-xl bg-mint px-4 py-3 text-ink font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-mint/90 transition-colors shadow-lg shadow-mint/10"
            >
              Get Started
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <NameOnboarding>
        <Shell>
          <Outlet />
        </Shell>
      </NameOnboarding>
    </QueryClientProvider>
  );
}
