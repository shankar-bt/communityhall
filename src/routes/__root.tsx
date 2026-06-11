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

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
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
      { title: "Lovable App" },
      { name: "description", content: "Lovable Generated Project" },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lovable App" },
      { property: "og:description", content: "Lovable Generated Project" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
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
      </body>
    </html>
  );
}

import { AppProvider, useApp } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { FontSizeProvider } from "@/contexts/FontSizeContext";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/useAuth";
import { AuthScreen } from "@/modules/auth/screens";
import { TopBar } from "@/components/TopBar";
import { Sidebar } from "@/components/Sidebar";
import { Lock, ShieldCheck, Globe, Users } from "lucide-react";

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <FontSizeProvider>
          <AppProvider>
            <AuthProvider>
              <RootLayoutContent />
              <Toaster richColors position="top-right" />
            </AuthProvider>
          </AppProvider>
        </FontSizeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

function RootLayoutContent() {
  const { user, logout } = useAuth();
  const { isInitialized } = useApp();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3a8a]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthScreen
        onSuccess={() => {
          router.navigate({ to: "/" });
        }}
      />
    );
  }

  const handleLogout = () => {
    logout();
    router.navigate({ to: "/" });
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-fixed bg-center pt-[68px]"
      style={{ backgroundImage: "url('/theme.png')" }}
    >
      <TopBar onLogout={handleLogout} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      
      <div className="flex-1 flex flex-col md:flex-row relative">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 bg-white/30 backdrop-blur-sm overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Dark Footer */}
      <footer className="bg-[#0f172a] text-white py-10 mt-auto w-full relative z-20">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8 flex flex-wrap justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <Lock className="h-6 w-6 text-white" strokeWidth={2.5} />
            <div>
              <div className="font-bold text-[13px] mb-1 leading-tight">Secure</div>
              <div className="text-[10px] text-white/60 font-semibold leading-tight">
                Your data is safe with us
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ShieldCheck className="h-6 w-6 text-white" strokeWidth={2.5} />
            <div>
              <div className="font-bold text-[13px] mb-1 leading-tight">Transparent</div>
              <div className="text-[10px] text-white/60 font-semibold leading-tight">
                Transparent Services for everyone
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Globe className="h-6 w-6 text-white" strokeWidth={2.5} />
            <div>
              <div className="font-bold text-[13px] mb-1 leading-tight">Accessible</div>
              <div className="text-[10px] text-white/60 font-semibold leading-tight">
                Access services anytime,anywhere
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Users className="h-6 w-6 text-white" strokeWidth={2.5} />
            <div>
              <div className="font-bold text-[13px] mb-1 leading-tight">Citizen First</div>
              <div className="text-[10px] text-white/60 font-semibold leading-tight">
                We are here to serve you
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
