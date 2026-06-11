import { createFileRoute } from "@tanstack/react-router";
import { useApp, type Hall } from "@/contexts/AppContext";
import { HallList } from "@/modules/halls/screens";

export const Route = createFileRoute("/")({
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
  const { setBooking } = useApp();
  const navigate = Route.useNavigate();

  const selectHall = (h: Hall) => {
    setBooking((b) => ({ ...b, hall: h }));
    navigate({ to: `/halls/${h.id}` });
  };

  const quickBook = (h: Hall) => {
    setBooking((b) => ({ ...b, hall: h, calc: null }));
    navigate({ to: `/halls/${h.id}/calculator` });
  };

  return <HallList onSelect={selectHall} onBook={quickBook} />;
}
