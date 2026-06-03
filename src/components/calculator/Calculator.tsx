import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Calculator as CalcIcon } from "lucide-react";

export function Calculator({ onBack, onBookNow }: { onBack: () => void; onBookNow: () => void }) {
  const { t, booking, setBooking } = useApp();
  const hall = booking.hall!;
  const [reason, setReason] = useState(booking.reason);
  const [days, setDays] = useState(booking.numDays);
  const [start, setStart] = useState(booking.startPeriod);
  const [end, setEnd] = useState(booking.endPeriod);

  const calc = booking.calc;

  const compute = () => {
    const hallAmount = hall.rent * days;
    const discount = days >= 3 ? Math.round(hallAmount * 0.05) : 0;
    const netAmount = hallAmount - discount;
    const gst = Math.round(netAmount * 0.18);
    const deposit = hall.deposit;
    const total = netAmount + gst + deposit;
    setBooking(b => ({
      ...b, reason, numDays: days, startPeriod: start, endPeriod: end,
      calc: { hallAmount, discount, netAmount, gst, deposit, total },
    }));
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl animate-in fade-in duration-300">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-4"><ArrowLeft className="h-4 w-4 mr-1" />Back</Button>

      <Card className="p-6 mb-5">
        <h2 className="text-xl font-bold mb-1 flex items-center gap-2"><CalcIcon className="h-5 w-5 text-primary" />{t("bookingDetails")}</h2>
        <p className="text-sm text-muted-foreground mb-5">{hall.name} • {hall.zone}</p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1 sm:col-span-2"><Label>{t("reason")}</Label><Textarea rows={2} value={reason} onChange={e => setReason(e.target.value)} placeholder="Wedding ceremony, conference..." /></div>
          <div className="space-y-1"><Label>{t("numDays")}</Label><Input type="number" min={1} value={days} onChange={e => setDays(Math.max(1, Number(e.target.value)))} /></div>
          <div className="space-y-1"><Label>{t("startPeriod")}</Label><Input type="time" value={start} onChange={e => setStart(e.target.value)} /></div>
          <div className="space-y-1 sm:col-span-2"><Label>{t("endPeriod")}</Label><Input type="time" value={end} onChange={e => setEnd(e.target.value)} /></div>
        </div>

        <Button onClick={compute} className="mt-5 w-full sm:w-auto">{t("calculate")}</Button>
      </Card>

      {calc && (
        <Card className="p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 border-2 border-primary/30">
          <h3 className="text-lg font-bold mb-4">{t("rentSummary")}</h3>
          <div className="overflow-hidden rounded-md border">
            <table className="w-full text-sm">
              <tbody>
                {[
                  [t("hallAmount"), calc.hallAmount],
                  [t("discount"), -calc.discount],
                  [t("netAmount"), calc.netAmount],
                  [t("gst"), calc.gst],
                  [t("depositAmt"), calc.deposit],
                ].map(([k, v], i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="px-4 py-2.5 text-muted-foreground">{k}</td>
                    <td className="px-4 py-2.5 text-right font-medium">₹{Number(v).toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="bg-primary/10">
                  <td className="px-4 py-3 font-bold">{t("totalAmount")}</td>
                  <td className="px-4 py-3 text-right font-bold text-lg text-primary">₹{calc.total.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Button onClick={onBookNow} size="lg" className="mt-5 w-full bg-success hover:bg-success/90 text-success-foreground">{t("bookNow")}</Button>
        </Card>
      )}
    </div>
  );
}
