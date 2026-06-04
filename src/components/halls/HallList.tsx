import { useState } from "react";
import { useApp, type Hall } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { HALLS } from "@/lib/halls";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, MapPin, Search, Calendar, Heart, Lock, Eye, Building } from "lucide-react";

const getTodayString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export function HallList({
  onSelect,
  onBook,
}: {
  onSelect: (h: Hall) => void;
  onBook: (h: Hall) => void;
}) {
  const { setBooking } = useApp();
  const { t } = useLanguage();
  const [filters, setFilters] = useState({ from: "", to: "", start: "", end: "" });
  const todayStr = getTodayString();

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8 max-w-7xl animate-in fade-in duration-500">
      {/* Search Filter Card */}
      <Card className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border-white/50 mb-10 overflow-hidden">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            {t("Find & Book a Community Hall")}
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            {t("Select your preferred date, time slot and check availability.")}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-1.5 flex-1 min-w-[140px] max-w-full">
            <Label className="text-[13px] font-bold text-slate-700">{t("From Date")}</Label>
            <div className="relative w-full">
              <Input
                type="date"
                className="h-[46px] rounded-xl border-slate-200 shadow-sm w-full pr-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:w-6 [&::-webkit-calendar-picker-indicator]:h-6 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                value={filters.from}
                min={todayStr}
                onChange={(e) => {
                  const val = e.target.value;
                  setFilters((prev) => {
                    const updated = { ...prev, from: val };
                    if (prev.to && prev.to < val) {
                      updated.to = val;
                    }
                    return updated;
                  });
                }}
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5 flex-1 min-w-[140px] max-w-full">
            <Label className="text-[13px] font-bold text-slate-700">{t("To Date")}</Label>
            <div className="relative w-full">
              <Input
                type="date"
                className="h-[46px] rounded-xl border-slate-200 shadow-sm w-full pr-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:w-6 [&::-webkit-calendar-picker-indicator]:h-6 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                value={filters.to}
                min={filters.from || todayStr}
                onChange={(e) => setFilters({ ...filters, to: e.target.value })}
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5 flex-1 min-w-[140px] max-w-full">
            <Label className="text-[13px] font-bold text-slate-700">{t("Starting slot")}</Label>
            <Select
              value={filters.start}
              onValueChange={(v) => setFilters({ ...filters, start: v })}
            >
              <SelectTrigger className="h-[46px] rounded-xl border-slate-200 shadow-sm w-full">
                <SelectValue placeholder={t("Select")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">{t("Morning (06:00 AM)")}</SelectItem>
                <SelectItem value="evening">{t("Evening (02:00 PM)")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 flex-1 min-w-[140px] max-w-full">
            <Label className="text-[13px] font-bold text-slate-700">{t("Ending slot")}</Label>
            <Select value={filters.end} onValueChange={(v) => setFilters({ ...filters, end: v })}>
              <SelectTrigger className="h-[46px] rounded-xl border-slate-200 shadow-sm w-full">
                <SelectValue placeholder={t("Select")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="afternoon">{t("Afternoon (02:00 PM)")}</SelectItem>
                <SelectItem value="evening">{t("Evening (10:00 PM)")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2.5 mt-2 lg:mt-0 w-full xl:w-auto">
            <Button
              variant="outline"
              className="h-[46px] w-[46px] p-0 rounded-xl border-slate-200 shadow-sm shrink-0 text-slate-500"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
            </Button>
            <Button
              className="h-[46px] rounded-xl px-5 sm:px-6 bg-red-500 hover:bg-red-600 text-white shadow-sm font-bold shrink-0"
              onClick={() => setFilters({ from: "", to: "", start: "", end: "" })}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1.5 hidden sm:inline"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              {t("Reset")}
            </Button>
            <Button
              className="h-[46px] rounded-xl px-6 sm:px-8 bg-[#0f172a] hover:bg-[#1e293b] text-white shadow-sm font-bold flex-1 xl:flex-none"
              onClick={() =>
                setBooking((b) => ({
                  ...b,
                  fromDate: filters.from,
                  toDate: filters.to,
                  startPeriod: filters.start || "09:00",
                  endPeriod: filters.end || "18:00",
                }))
              }
            >
              <Search className="h-4 w-4 mr-2" />{" "}
              <span className="whitespace-nowrap">{t("Check Availability")}</span>
            </Button>
          </div>
        </div>

        <div className="mt-6 flex items-center text-[#1e3a8a] font-bold text-sm cursor-pointer hover:underline w-fit">
          <MapPin className="h-4 w-4 mr-1.5" /> {t("View Map Centers")}
        </div>
      </Card>

      {/* List Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
            <h2 className="text-[1.35rem] font-bold text-slate-800 tracking-tight">
              {t("Available Community Halls")}
            </h2>
          </div>
          <p className="text-sm text-slate-500 font-medium mt-1 ml-3.5">
            {t("Choose a hall to view details and make a booking")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-700">{t("Sort by :")}</span>
          <Select defaultValue="name">
            <SelectTrigger className="h-10 w-[160px] bg-white rounded-xl shadow-sm border-slate-200 font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">{t("Name A-Z")}</SelectItem>
              <SelectItem value="rating">{t("Rating")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {HALLS.map((h) => (
          <Card
            key={h.id}
            className="overflow-hidden bg-white/95 backdrop-blur-sm border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all rounded-[1.25rem] flex flex-col group"
          >
            <div className="relative aspect-[4/2.5] overflow-hidden bg-slate-100 p-3">
              <div className="absolute inset-3 rounded-[0.85rem] overflow-hidden z-0">
                <img
                  src={h.image}
                  alt={t(h.name)}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              <button className="absolute top-5 right-5 z-10 h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400 hover:text-red-500 transition-colors">
                <Heart className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-bold text-[15px] leading-tight text-slate-800 mb-1.5">
                {t(h.name)}
              </h3>
              <div className="flex items-center gap-1.5 mb-5">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i <= Math.floor(h.rating) ? "fill-orange-400 text-orange-400" : "fill-slate-200 text-slate-200"}`}
                    />
                  ))}
                </div>
                <span className="text-[12px] font-bold text-blue-600">{h.rating}</span>
                <span className="text-[12px] font-bold text-slate-500">(22)</span>
              </div>

              <div className="space-y-2 mb-6 mt-auto">
                <div className="flex justify-between items-center text-[12px] border-b border-slate-100 pb-1.5">
                  <span className="flex items-center text-slate-600">
                    <Lock className="h-3 w-3 mr-1.5 text-green-600" strokeWidth={3} />{" "}
                    {t("Full day Rent")}
                  </span>
                  <span className="font-bold text-slate-800">₹{h.rent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[12px] border-b border-slate-100 pb-1.5">
                  <span className="flex items-center text-slate-600">
                    <Lock className="h-3 w-3 mr-1.5 text-green-600" strokeWidth={3} />{" "}
                    {t("Half day Rent")}
                  </span>
                  <span className="font-bold text-slate-800">
                    ₹{h.halfDayRent?.toLocaleString() ?? 1900}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[12px] border-b border-slate-100 pb-1.5">
                  <span className="flex items-center text-slate-600">
                    <Lock className="h-3 w-3 mr-1.5 text-green-600" strokeWidth={3} />{" "}
                    {t("Full day security Deposit")}
                  </span>
                  <span className="font-bold text-slate-800">₹{h.deposit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[12px]">
                  <span className="flex items-center text-slate-600">
                    <Lock className="h-3 w-3 mr-1.5 text-green-600" strokeWidth={3} />{" "}
                    {t("Half day security Deposit")}
                  </span>
                  <span className="font-bold text-slate-800">
                    ₹{h.halfDayDeposit?.toLocaleString() ?? 1500}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <Button
                  variant="outline"
                  className="w-full rounded-xl h-10 border-[#c7d2fe] bg-[#f5f7ff] text-[#4f46e5] hover:bg-[#e0e7ff] font-bold text-[13px] shadow-sm"
                  onClick={() => onSelect(h)}
                >
                  <Eye className="h-4 w-4 mr-1.5" /> {t("View Details")}
                </Button>
                <Button
                  className="w-full rounded-xl h-10 bg-[#dcfce7] hover:bg-[#bbf7d0] text-[#166534] font-bold text-[13px] shadow-sm border border-[#bbf7d0]"
                  onClick={() => onBook(h)}
                >
                  <Building className="h-4 w-4 mr-1.5" /> {t("Book")}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
