import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { BookingWizard } from "@/modules/booking/screens";

export const Route = createFileRoute("/halls/$hallId/book")({
  component: BookingWizardRouteComponent,
});

function BookingWizardRouteComponent() {
  const { hallId } = Route.useParams();
  const { booking, setBooking, halls } = useApp();
  const navigate = Route.useNavigate();

  useEffect(() => {
    if (halls.length > 0) {
      const selectedHall = halls.find((h) => h.id === hallId);
      if (selectedHall) {
        setBooking((b) => ({ ...b, hall: selectedHall }));
      }
    }
  }, [hallId, halls, setBooking]);

  const selectedHall = booking.hall || halls.find((h) => h.id === hallId);

  // Redirect if calc details or hall details are missing (e.g. on direct page refresh)
  useEffect(() => {
    if (selectedHall && !booking.calc) {
      navigate({ to: `/halls/${hallId}/calculator` });
    }
  }, [selectedHall, booking.calc, hallId, navigate]);

  if (!selectedHall || !booking.calc) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3a8a] mx-auto mb-4"></div>
        <p>Redirecting to calculator...</p>
      </div>
    );
  }

  return (
    <BookingWizard
      onExit={() => {
        setBooking((b) => ({ ...b, calc: null, docs: [], agreed: false, txnId: "" }));
        navigate({ to: "/" });
      }}
    />
  );
}
