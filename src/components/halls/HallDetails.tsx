import { useState } from "react";
import { useApp, type Hall } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft, ChevronRight, ArrowLeft, Star } from "lucide-react";

export function HallDetails({ hall, onBack, onCalculate }: { hall: Hall; onBack: () => void; onCalculate: () => void }) {
  const { t } = useApp();
  const [idx, setIdx] = useState(0);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const specs: [string, string | number][] = [
    [t("zone"), hall.zone],
    [t("division"), hall.division],
    [t("landmark"), hall.landmark],
    [t("capacity"), `${hall.capacity} guests`],
    [t("rent"), `₹${hall.rent.toLocaleString()}`],
    [t("deposit"), `₹${hall.deposit.toLocaleString()}`],
  ];

  return (
    <div className="container mx-auto px-4 py-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-4"><ArrowLeft className="h-4 w-4 mr-1" />{t("backToHalls")}</Button>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <div className="relative aspect-video bg-muted">
            <img src={hall.images[idx]} alt={hall.name} className="h-full w-full object-cover transition-opacity duration-300" />
            <button onClick={() => setIdx((idx - 1 + hall.images.length) % hall.images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 grid place-items-center h-9 w-9 rounded-full bg-background/80 backdrop-blur hover:bg-background"><ChevronLeft className="h-5 w-5" /></button>
            <button onClick={() => setIdx((idx + 1) % hall.images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center h-9 w-9 rounded-full bg-background/80 backdrop-blur hover:bg-background"><ChevronRight className="h-5 w-5" /></button>
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
              {hall.images.map((_, i) => <span key={i} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-primary" : "w-1.5 bg-background/60"}`} />)}
            </div>
          </div>
          <div className="p-4 flex gap-2 overflow-x-auto">
            {hall.images.map((src, i) => (
              <button key={i} onClick={() => setIdx(i)} className={`shrink-0 h-16 w-24 rounded overflow-hidden border-2 transition-all ${i === idx ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"}`}>
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">{hall.name}</h2>
              <p className="text-sm text-muted-foreground">{hall.landmark}</p>
            </div>
            <Badge variant="secondary" className="text-base"><Star className="h-4 w-4 mr-1 fill-current" />{hall.rating}</Badge>
          </div>
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Specifications</h3>
            <dl className="grid grid-cols-2 gap-y-2 text-sm">
              {specs.map(([k, v]) => (
                <div key={k}><dt className="text-muted-foreground text-xs">{k}</dt><dd className="font-medium">{v}</dd></div>
              ))}
            </dl>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold mb-3">{t("availability")}</h3>
            <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md pointer-events-auto" />
          </Card>
          <Button size="lg" className="w-full" onClick={onCalculate}>{t("calculateRent")}</Button>
        </div>
      </div>
    </div>
  );
}
