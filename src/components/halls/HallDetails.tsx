import { useState } from "react";
import { useApp, type Hall } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { HALLS } from "@/lib/halls";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Image as ImageIcon,
  Calendar as CalendarIcon,
  Building2,
  IndianRupee,
  Calculator,
  MapPin,
  Map,
  Navigation,
  Maximize,
  Users,
  Car,
} from "lucide-react";

export function HallDetails({
  hall,
  onBack,
  onCalculate,
}: {
  hall: Hall;
  onBack: () => void;
  onCalculate: () => void;
}) {
  const { t } = useLanguage();
  const { setBooking } = useApp();
  const [idx, setIdx] = useState(0);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const selectedHall = hall;

  return (
    <div className="min-h-full bg-gradient-to-br from-orange-50/90 via-white/90 to-blue-100/90 pb-20">
      <div className="container mx-auto px-4 py-6 max-w-6xl animate-in fade-in slide-in-from-right-4 duration-300">
        {/* Header / Select Hall */}
        <Card className="p-4 mb-6 flex items-center gap-4 bg-white/70 backdrop-blur-md border-white/60 shadow-sm rounded-xl">
          <div className="bg-blue-50 p-3 rounded-lg text-[#1e3a8a]">
            <Building2 className="h-7 w-7" />
          </div>
          <div className="flex-1 max-w-md">
            <h2 className="text-sm font-bold text-slate-800 mb-1">Select Hall</h2>
            <Select
              value={selectedHall.id}
              onValueChange={(val) => {
                const newHall = HALLS.find((h) => h.id === val);
                if (newHall) setBooking((b) => ({ ...b, hall: newHall }));
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
          <div className="ml-auto">
            <Button variant="outline" onClick={onBack} className="bg-white/50">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          </div>
        </Card>

        {/* 2x2 Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Card 1: Hall Images */}
          <Card className="bg-white/70 backdrop-blur-md border-white/60 shadow-sm rounded-xl p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-4 text-[#1e3a8a]">
              <ImageIcon className="h-5 w-5" />
              <h3 className="font-bold text-lg">Hall Images</h3>
            </div>

            <div className="relative aspect-[16/9] bg-slate-100 rounded-lg overflow-hidden border border-slate-200 mb-3 group">
              <img
                src={selectedHall.images[idx]}
                alt={selectedHall.name}
                className="h-full w-full object-cover transition-opacity duration-300"
              />
              <button
                onClick={() =>
                  setIdx((idx - 1 + selectedHall.images.length) % selectedHall.images.length)
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 grid place-items-center h-10 w-10 rounded-full bg-white/90 shadow text-slate-700 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => setIdx((idx + 1) % selectedHall.images.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center h-10 w-10 rounded-full bg-white/90 shadow text-slate-700 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-1 mt-auto">
              {selectedHall.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`shrink-0 h-16 w-24 rounded-lg overflow-hidden border-2 transition-all ${i === idx ? "border-blue-600" : "border-transparent opacity-70 hover:opacity-100"}`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </Card>

          {/* Card 2: Availability Calendar */}
          <Card className="bg-white/70 backdrop-blur-md border-white/60 shadow-sm rounded-xl p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-4 text-[#1e3a8a]">
              <CalendarIcon className="h-5 w-5" />
              <h3 className="font-bold text-lg">Availability Calendar</h3>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center pointer-events-auto py-2">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={{ before: new Date(new Date().setHours(0, 0, 0, 0)) }}
                className="rounded-md border-0 pointer-events-auto bg-transparent p-0 transform scale-[1.05]"
              />
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-slate-200/60 flex flex-wrap gap-x-4 gap-y-2 justify-center text-[11px] text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-green-500"></span>Day (Available)
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-purple-500"></span>Morning (Available)
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-yellow-400"></span>Evening (Available)
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500"></span>Not Available
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-blue-500"></span>GCC Blocked
              </div>
            </div>
          </Card>

          {/* Card 3: Hall details */}
          <Card className="bg-white/70 backdrop-blur-md border-white/60 shadow-sm rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4 text-[#1e3a8a]">
              <Building2 className="h-5 w-5" />
              <h3 className="font-bold text-lg">Hall details</h3>
            </div>

            <div className="divide-y divide-slate-200/60 text-[13px]">
              <div className="flex py-2.5">
                <div className="w-[140px] flex items-center gap-2 text-slate-600">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  Zone
                </div>
                <div className="flex-1 font-medium text-slate-800">{selectedHall.zone}</div>
              </div>
              <div className="flex py-2.5">
                <div className="w-[140px] flex items-center gap-2 text-slate-600">
                  <Map className="h-4 w-4 text-blue-500" />
                  Division
                </div>
                <div className="flex-1 font-medium text-slate-800">{selectedHall.division}</div>
              </div>
              <div className="flex py-2.5">
                <div className="w-[140px] flex items-center gap-2 text-slate-600">
                  <Navigation className="h-4 w-4 text-blue-500" />
                  Address
                </div>
                <div className="flex-1 font-medium text-slate-800">{selectedHall.address}</div>
              </div>
              <div className="flex py-2.5">
                <div className="w-[140px] flex items-center gap-2 text-slate-600">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  Landmark
                </div>
                <div className="flex-1 font-medium text-slate-800">{selectedHall.landmark}</div>
              </div>
              <div className="flex py-2.5">
                <div className="w-[140px] flex items-center gap-2 text-slate-600">
                  <Maximize className="h-4 w-4 text-blue-500" />
                  Total Area
                </div>
                <div className="flex-1 font-medium text-slate-800">{selectedHall.totalArea}</div>
              </div>
              <div className="flex py-2.5">
                <div className="w-[140px] flex items-center gap-2 text-slate-600">
                  <Users className="h-4 w-4 text-blue-500" />
                  Seating capacity
                </div>
                <div className="flex-1 font-medium text-slate-800">{selectedHall.capacity}</div>
              </div>
              <div className="flex py-2.5">
                <div className="w-[140px] flex items-center gap-2 text-slate-600">
                  <Car className="h-4 w-4 text-blue-500" />
                  Parking capacity
                </div>
                <div className="flex-1 font-medium text-slate-800">
                  {selectedHall.parkingCapacity}
                </div>
              </div>
            </div>
          </Card>

          {/* Card 4: Amount Details & Action Button */}
          <div className="flex flex-col gap-4">
            <Card className="bg-white/70 backdrop-blur-md border-white/60 shadow-sm rounded-xl p-5 flex-1">
              <div className="flex items-center gap-2 mb-4 text-[#1e3a8a]">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <IndianRupee className="h-3 w-3" />
                </div>
                <h3 className="font-bold text-lg">Amount Details</h3>
              </div>

              <div className="divide-y divide-slate-200/60 text-[13px]">
                <div className="flex py-2.5">
                  <div className="flex-1 text-slate-600 font-medium">Full Day Security Deposit</div>
                  <div className="font-medium text-slate-800">Rs {selectedHall.deposit}</div>
                </div>
                <div className="flex py-2.5">
                  <div className="flex-1 text-slate-600 font-medium">Full Day Rent</div>
                  <div className="font-medium text-slate-800">Rs {selectedHall.rent}</div>
                </div>
                <div className="flex py-2.5">
                  <div className="flex-1 text-slate-600 font-medium pr-4">
                    Half Day Security Deposit
                  </div>
                  <div className="font-medium text-slate-800">Rs {selectedHall.halfDayDeposit}</div>
                </div>
                <div className="flex py-2.5">
                  <div className="flex-1 text-slate-600 font-medium">Half Day Rent</div>
                  <div className="font-medium text-slate-800">Rs {selectedHall.halfDayRent}</div>
                </div>
                <div className="flex py-2.5">
                  <div className="flex-1 text-slate-600 font-medium">Total GST</div>
                  <div className="font-medium text-slate-800">{selectedHall.gstPercentage}%</div>
                </div>
                <div className="flex py-2.5">
                  <div className="flex-1 text-slate-600 font-medium">EB for 1 Unit</div>
                  <div className="font-medium text-slate-800">
                    Rs {selectedHall.ebChargePerUnit}
                  </div>
                </div>
                <div className="flex py-2.5">
                  <div className="flex-1 text-slate-600 font-medium">Caretaker Number</div>
                  <div className="font-medium text-slate-800">{selectedHall.caretakerNumber}</div>
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={onCalculate}
                className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-8 py-6 rounded-lg text-[15px] font-bold shadow-lg"
              >
                <Calculator className="h-5 w-5 mr-2" />
                Calculate Hall Rent
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
