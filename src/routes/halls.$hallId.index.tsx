import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { HallDetails } from "@/modules/halls/screens";

export const Route = createFileRoute("/halls/$hallId/")({
  component: HallDetailsIndexComponent,
});

function HallDetailsIndexComponent() {
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

  if (!selectedHall) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3a8a] mx-auto mb-4"></div>
        <p>Loading hall details...</p>
      </div>
    );
  }

  return (
    <HallDetails
      hall={selectedHall}
      onBack={() => navigate({ to: "/" })}
      onCalculate={() => navigate({ to: `/halls/${hallId}/calculator` })}
    />
  );
}
