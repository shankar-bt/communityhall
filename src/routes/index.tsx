import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useApp, type Hall } from "@/contexts/AppContext";
import { TopBar } from "@/components/TopBar";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { HallList } from "@/components/halls/HallList";
import { HallDetails } from "@/components/halls/HallDetails";
import { Calculator } from "@/components/calculator/Calculator";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { Lock, ShieldCheck, Globe, Users } from "lucide-react";
import { z } from "zod";
import { HALLS } from "@/lib/halls";

const appSearchSchema = z.object({
  view: z.enum(["list", "details", "calculator", "wizard"]).optional().catch("list"),
  hallId: z.string().optional(),
});

export const Route = createFileRoute("/")({
  validateSearch: (search) => appSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Community Hall Booking — Government Services" },
      {
        name: "description",
        content:
          "Book community halls online with rent calculator, document upload and secure payments.",
      },
      { property: "og:title", content: "Community Hall Booking" },
      {
        property: "og:description",
        content:
          "Book community halls online with rent calculator, document upload and secure payments.",
      },
    ],
  }),
  component: App,
});

function App() {
  const { user, setUser, booking, setBooking, isInitialized } = useApp();
  const { view = "list", hallId } = Route.useSearch();
  const navigate = Route.useNavigate();

  // Sync hallId from search query parameters to context booking state
  useEffect(() => {
    if (hallId && (!booking.hall || booking.hall.id !== hallId)) {
      const selectedHall = HALLS.find((h) => h.id === hallId);
      if (selectedHall) {
        setBooking((b) => ({ ...b, hall: selectedHall }));
      }
    }
  }, [hallId, booking.hall, setBooking]);

  // Handle redirect if user refreshes on pages that require specific state
  useEffect(() => {
    if (view === "wizard" && (!booking.calc || !booking.hall)) {
      navigate({ search: { view: "details", hallId } });
    }
  }, [view, booking.calc, booking.hall, hallId, navigate]);

  // Show a loading/spinner during hydration initialization to prevent hydration mismatch and flash
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
          setUser({ name: "Citizen User", contact: "9876543210", role: "citizen" });
          navigate({ search: { view: "list", hallId: undefined } });
        }}
      />
    );
  }

  const selectHall = (h: Hall) => {
    setBooking((b) => ({ ...b, hall: h }));
    navigate({ search: { view: "details", hallId: h.id } });
  };
  const quickBook = (h: Hall) => {
    setBooking((b) => ({ ...b, hall: h, calc: null }));
    navigate({ search: { view: "calculator", hallId: h.id } });
  };
  const logout = () => {
    setUser(null);
    navigate({ search: { view: "list", hallId: undefined } });
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-fixed bg-center overflow-x-hidden"
      style={{ backgroundImage: "url('/theme.png')" }}
    >
      <TopBar onLogout={logout} />
      <main className="flex-1 bg-white/30 backdrop-blur-sm">
        {view === "list" && <HallList onSelect={selectHall} onBook={quickBook} />}
        {view === "details" && booking.hall && (
          <HallDetails
            hall={booking.hall}
            onBack={() => navigate({ search: { view: "list", hallId: undefined } })}
            onCalculate={() =>
              navigate({ search: { view: "calculator", hallId: booking.hall?.id } })
            }
          />
        )}
        {view === "calculator" && booking.hall && (
          <Calculator
            onBack={() => navigate({ search: { view: "details", hallId: booking.hall?.id } })}
            onBookNow={() => navigate({ search: { view: "wizard", hallId: booking.hall?.id } })}
          />
        )}
        {view === "wizard" && booking.hall && booking.calc && (
          <BookingWizard
            onExit={() => {
              setBooking((b) => ({ ...b, calc: null, docs: [], agreed: false, txnId: "" }));
              navigate({ search: { view: "list", hallId: undefined } });
            }}
          />
        )}
      </main>

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
