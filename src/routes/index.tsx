import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppProvider, useApp, type Hall } from "@/contexts/AppContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { TopBar } from "@/components/TopBar";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { HallList } from "@/components/halls/HallList";
import { HallDetails } from "@/components/halls/HallDetails";
import { Calculator } from "@/components/calculator/Calculator";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { Toaster } from "@/components/ui/sonner";
import { Lock, ShieldCheck, Globe, Users } from "lucide-react";
import { FontSizeProvider } from "@/contexts/FontSizeContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Community Hall Booking — Government Services" },
      { name: "description", content: "Book community halls online with rent calculator, document upload and secure payments." },
      { property: "og:title", content: "Community Hall Booking" },
      { property: "og:description", content: "Book community halls online with rent calculator, document upload and secure payments." },
    ],
  }),
  component: () => (
    <LanguageProvider>
      <FontSizeProvider>

        <AppProvider>
          <App />
          <Toaster richColors position="top-right" />
        </AppProvider>
      </FontSizeProvider>
    </LanguageProvider>
  ),
});

type View = "list" | "details" | "calculator" | "wizard";

function App() {
  const { user, setUser, booking, setBooking } = useApp();
  const [view, setView] = useState<View>("list");

  if (!user) {
    return (
      <AuthScreen onSuccess={() => setView("list")} />
    );
  }

  const selectHall = (h: Hall) => { setBooking(b => ({ ...b, hall: h })); setView("details"); };
  const quickBook = (h: Hall) => {
    setBooking(b => ({ ...b, hall: h, calc: null }));
    setView("calculator");
  };
  const logout = () => { setUser(null); setView("list"); };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-fixed bg-center overflow-x-hidden"
      style={{ backgroundImage: "url('/theme.png')" }}
    >
      <TopBar onLogout={logout} />
      <main className="flex-1 bg-white/30 backdrop-blur-sm">
        {view === "list" && <HallList onSelect={selectHall} onBook={quickBook} />}
        {view === "details" && booking.hall && (
          <HallDetails hall={booking.hall} onBack={() => setView("list")} onCalculate={() => setView("calculator")} />
        )}
        {view === "calculator" && booking.hall && (
          <Calculator onBack={() => setView("details")} onBookNow={() => setView("wizard")} />
        )}
        {view === "wizard" && booking.hall && booking.calc && (
          <BookingWizard onExit={() => {
            setBooking(b => ({ ...b, calc: null, docs: [], agreed: false, txnId: "" }));
            setView("list");
          }} />
        )}
      </main>

      {/* Dark Footer */}
      <footer className="bg-[#0f172a] text-white py-10 mt-auto w-full relative z-20">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8 flex flex-wrap justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <Lock className="h-6 w-6 text-white" strokeWidth={2.5} />
            <div>
              <div className="font-bold text-[13px] mb-1 leading-tight">Secure</div>
              <div className="text-[10px] text-white/60 font-semibold leading-tight">Your data is safe with us</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ShieldCheck className="h-6 w-6 text-white" strokeWidth={2.5} />
            <div>
              <div className="font-bold text-[13px] mb-1 leading-tight">Transparent</div>
              <div className="text-[10px] text-white/60 font-semibold leading-tight">Transparent Services for everyone</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Globe className="h-6 w-6 text-white" strokeWidth={2.5} />
            <div>
              <div className="font-bold text-[13px] mb-1 leading-tight">Accessible</div>
              <div className="text-[10px] text-white/60 font-semibold leading-tight">Access services anytime,anywhere</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Users className="h-6 w-6 text-white" strokeWidth={2.5} />
            <div>
              <div className="font-bold text-[13px] mb-1 leading-tight">Citizen First</div>
              <div className="text-[10px] text-white/60 font-semibold leading-tight">We are here to serve you</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
