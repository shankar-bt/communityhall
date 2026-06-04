import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { HALLS } from "@/lib/halls";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calculator as CalcIcon,
  Building2,
  Calendar as CalendarIcon,
  IndianRupee,
  Tag,
  Wallet,
  Percent,
  ArrowUpCircle,
  Banknote,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

export function Calculator({ onBack, onBookNow }: { onBack: () => void; onBookNow: () => void }) {
  const { t, booking, setBooking } = useApp();
  const hall = booking.hall!;
  const [reason, setReason] = useState(booking.reason || "Marriage");
  const [days, setDays] = useState(booking.numDays || 1);
  const [start, setStart] = useState(booking.startPeriod || "Morning (6:00 AM)");
  const [end, setEnd] = useState(booking.endPeriod || "Morning (2:00 PM)");

  const calc = booking.calc;

  const compute = () => {
    const hallAmount = hall.rent * days;
    const discount = days >= 3 ? Math.round(hallAmount * 0.05) : 0;
    const netAmount = hallAmount - discount;
    const gst = Math.round(netAmount * (hall.gstPercentage / 100 || 0.18));
    const deposit = hall.deposit;
    const total = netAmount + gst + deposit;
    setBooking((b) => ({
      ...b,
      reason,
      numDays: days,
      startPeriod: start,
      endPeriod: end,
      calc: { hallAmount, discount, netAmount, gst, deposit, total },
    }));
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-orange-50/90 via-white/90 to-blue-100/90 pb-20">
      <div className="container mx-auto px-4 py-8 max-w-6xl animate-in fade-in duration-300 space-y-6">
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-blue-100/80 to-blue-50/40 rounded-xl p-6 flex items-center relative overflow-hidden border border-blue-200/50 shadow-sm">
          <div className="relative z-10 flex items-center gap-4">
            <div className="bg-blue-200/50 p-3 rounded-xl text-blue-800">
              <CalendarIcon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 mb-1">Calculate Rent Amount</h1>
              <p className="text-sm text-slate-600 font-medium">
                Provide booking details to calculate the estimated rent amount
              </p>
            </div>
          </div>
          {/* Subtle background graphic for the banner */}
          <div
            className="absolute right-0 top-0 bottom-0 w-1/3 opacity-30 pointer-events-none"
            style={{
              backgroundImage: "url('/theme.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              maskImage: "linear-gradient(to right, transparent, black)",
            }}
          ></div>
        </div>

        {/* Select Hall Card */}
        <Card className="p-5 flex items-center gap-4 bg-white/70 backdrop-blur-md border-white/60 shadow-sm rounded-xl">
          <div className="bg-blue-50 p-3 rounded-lg text-[#1e3a8a]">
            <Building2 className="h-7 w-7" />
          </div>
          <div className="flex-1 max-w-md">
            <h2 className="text-sm font-bold text-slate-800 mb-1">Select Hall</h2>
            <Select
              value={hall.id}
              onValueChange={(val) => {
                const newHall = HALLS.find((h) => h.id === val);
                if (newHall) setBooking((b) => ({ ...b, hall: newHall, calc: null }));
              }}
            >
              <SelectTrigger className="bg-white border-slate-200">
                <SelectValue placeholder="Select a hall" />
              </SelectTrigger>
              <SelectContent>
                {HALLS.map((h) => (
                  <SelectItem key={h.id} value={h.id}>
                    {h.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Booking Details Card */}
        <Card className="p-6 bg-white/70 backdrop-blur-md border-white/60 shadow-sm rounded-xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
            <h2 className="text-lg font-bold text-slate-800">Booking Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-slate-600">
                <CalendarIcon className="h-4 w-4 text-blue-500 bg-blue-50 rounded-full p-0.5" />{" "}
                Reason For Booking
              </Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Marriage">Marriage</SelectItem>
                  <SelectItem value="Meeting">Meeting</SelectItem>
                  <SelectItem value="Exhibition">Exhibition</SelectItem>
                  <SelectItem value="Family Function">Family Function</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-slate-600">
                <CalendarIcon className="h-4 w-4 text-blue-500 bg-blue-50 rounded-full p-0.5" />{" "}
                Number of Days
              </Label>
              <Select value={String(days)} onValueChange={(val) => setDays(Number(val))}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-slate-600">
                <CalendarIcon className="h-4 w-4 text-blue-500 bg-blue-50 rounded-full p-0.5" />{" "}
                Start Period
              </Label>
              <Select value={start} onValueChange={setStart}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Morning (6:00 AM)">Morning (6:00 AM)</SelectItem>
                  <SelectItem value="Evening (2:00 PM)">Evening (2:00 PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-slate-600">
                <CalendarIcon className="h-4 w-4 text-blue-500 bg-blue-50 rounded-full p-0.5" /> End
                Period
              </Label>
              <Select value={end} onValueChange={setEnd}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Morning (2:00 PM)">Morning (2:00 PM)</SelectItem>
                  <SelectItem value="Evening (10:00 PM)">Evening (10:00 PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onBack}
              className="px-6 py-5 rounded-lg text-[14px] font-bold"
            >
              Back
            </Button>
            <Button
              onClick={compute}
              className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-8 py-5 rounded-lg text-[14px] font-bold shadow-md"
            >
              <CalcIcon className="h-4 w-4 mr-2" />
              Calculate
            </Button>
          </div>
        </Card>

        {calc && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Cards Row */}
            <Card className="p-4 bg-white/80 backdrop-blur-md border-white/60 shadow-sm rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                <h3 className="font-bold text-slate-800 text-sm">Rent Calculation Summary</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {/* Hall Amount */}
                <div className="bg-blue-50/50 rounded-lg p-3 flex flex-col justify-center border border-blue-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="h-3 w-3 text-blue-500" />
                    <span className="text-[10px] font-semibold text-slate-600 uppercase">
                      Hall Amount
                    </span>
                  </div>
                  <div className="font-bold text-slate-800 text-sm">₹ {calc.hallAmount}</div>
                </div>
                {/* Discount */}
                <div className="bg-purple-50/50 rounded-lg p-3 flex flex-col justify-center border border-purple-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Tag className="h-3 w-3 text-purple-500" />
                    <span className="text-[10px] font-semibold text-purple-700 uppercase">
                      Discount <span className="text-black">0%</span>
                    </span>
                  </div>
                  <div className="font-bold text-slate-800 text-sm">₹ {calc.discount}</div>
                </div>
                {/* Net Amount */}
                <div className="bg-orange-50/50 rounded-lg p-3 flex flex-col justify-center border border-orange-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Wallet className="h-3 w-3 text-orange-500" />
                    <span className="text-[10px] font-semibold text-orange-600 uppercase">
                      Net Amount
                    </span>
                  </div>
                  <div className="font-bold text-slate-800 text-sm">₹ {calc.netAmount}</div>
                </div>
                {/* GST */}
                <div className="bg-emerald-50/50 rounded-lg p-3 flex flex-col justify-center border border-emerald-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Percent className="h-3 w-3 text-emerald-500" />
                    <span className="text-[10px] font-semibold text-emerald-600 uppercase">
                      GST (18%)
                    </span>
                  </div>
                  <div className="font-bold text-slate-800 text-sm">₹ {calc.gst}</div>
                </div>
                {/* Deposit Amount */}
                <div className="bg-purple-50/50 rounded-lg p-3 flex flex-col justify-center border border-purple-100">
                  <div className="flex items-center gap-2 mb-1">
                    <ArrowUpCircle className="h-3 w-3 text-purple-500" />
                    <span className="text-[10px] font-semibold text-purple-600 uppercase">
                      Deposit Amount
                    </span>
                  </div>
                  <div className="font-bold text-slate-800 text-sm">₹ {calc.deposit}</div>
                </div>
                {/* Total Amount */}
                <div className="bg-[#0f172a] rounded-lg p-3 flex flex-col justify-center shadow-md">
                  <div className="flex items-center gap-2 mb-1">
                    <Banknote className="h-3 w-3 text-white/80" />
                    <span className="text-[10px] font-semibold text-white/90 uppercase">
                      Total Amount
                    </span>
                  </div>
                  <div className="font-bold text-white text-base">₹ {calc.total}</div>
                </div>
              </div>
            </Card>

            {/* Table */}
            <Card className="p-6 bg-white/80 backdrop-blur-md border-white/60 shadow-sm rounded-xl">
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-sm">
                  <thead className="bg-[#f1f5f9]">
                    <tr>
                      <th className="px-5 py-4 text-left font-bold text-slate-700 w-24">S.NO</th>
                      <th className="px-5 py-4 text-left font-bold text-slate-700">Description</th>
                      <th className="px-5 py-4 text-left font-bold text-slate-700 flex items-center gap-1">
                        <IndianRupee className="h-3 w-3" /> Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-slate-200">
                      <td className="px-5 py-4 text-slate-600">1</td>
                      <td className="px-5 py-4 text-slate-600 font-medium">Hall Amount</td>
                      <td className="px-5 py-4 text-slate-800">
                        {calc.hallAmount.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-t border-slate-200">
                      <td className="px-5 py-4 text-slate-600">2</td>
                      <td className="px-5 py-4 text-slate-600 font-medium">Discount</td>
                      <td className="px-5 py-4 text-slate-800">{calc.discount.toLocaleString()}</td>
                    </tr>
                    <tr className="border-t border-slate-200">
                      <td className="px-5 py-4 text-slate-600">3</td>
                      <td className="px-5 py-4 text-slate-600 font-medium">Net Amount</td>
                      <td className="px-5 py-4 text-slate-800">
                        {calc.netAmount.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-t border-slate-200">
                      <td className="px-5 py-4 text-slate-600">4</td>
                      <td className="px-5 py-4 text-slate-600 font-medium">GST%</td>
                      <td className="px-5 py-4 text-slate-800">{calc.gst.toLocaleString()}</td>
                    </tr>
                    <tr className="border-t border-slate-200">
                      <td className="px-5 py-4 text-slate-600">5</td>
                      <td className="px-5 py-4 text-slate-600 font-medium">Deposit Amount</td>
                      <td className="px-5 py-4 text-slate-800">{calc.deposit.toLocaleString()}</td>
                    </tr>
                    <tr className="border-t border-slate-200 bg-[#f8fafc]">
                      <td
                        className="px-5 py-5 text-slate-800 font-bold col-span-2 text-center"
                        colSpan={2}
                      >
                        Total Amount
                      </td>
                      <td className="px-5 py-5 text-slate-800 font-bold">
                        {calc.total.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-6">
                <Button
                  variant="outline"
                  onClick={onBack}
                  className="bg-white border-slate-200 text-slate-700 font-semibold px-6 py-5 rounded-lg shadow-sm"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Previous
                </Button>
                <Button
                  onClick={onBookNow}
                  className="bg-[#bbf7d0] hover:bg-[#86efac] border border-[#4ade80] text-[#166534] font-bold px-8 py-5 rounded-lg shadow-sm"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" /> Book Now
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
