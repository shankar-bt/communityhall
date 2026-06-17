import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Eye,
  Calendar,
  Zap,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
} from "lucide-react";

interface BookingItem {
  id: string;
  hallName: string;
  eventName: string;
  applicantName: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  amount: number;
  mobile: string;
  reason: string;
  // EB details fields
  ebInitialReading?: number;
  ebFinalReading?: number;
  ebGenHours?: number;
  ebRatePerUnit?: number;
}

interface CurrentBookingsProps {
  onViewBooking: (booking: any) => void;
  onEbDetails: (booking: any) => void;
  type?: string;
}

export function CurrentBookings({ onViewBooking, onEbDetails, type = "current" }: CurrentBookingsProps) {
  // Table filters & search
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Current Bookings list matching the screenshot exactly
  const [bookings, setBookings] = useState<BookingItem[]>([
    {
      id: "BK-001",
      hallName: "Annanagar Community Hall",
      eventName: "Wedding",
      applicantName: "V.Krishnan",
      startDate: "20/05/2026",
      startTime: "06:00 PM",
      endDate: "21/05/2026",
      endTime: "03:00 PM",
      amount: 2000,
      mobile: "9840123456",
      reason: "Marriage Reception and dinner banquet.",
      ebInitialReading: 12450,
      ebFinalReading: 12510,
      ebGenHours: 1.5,
      ebRatePerUnit: 15,
    },
    {
      id: "BK-002",
      hallName: "KK Nagar Community Hall",
      eventName: "Corporate Meeting",
      applicantName: "Moulidharan",
      startDate: "21/05/2026",
      startTime: "10:00 AM",
      endDate: "21/05/2026",
      endTime: "01:00 PM",
      amount: 3000,
      mobile: "9444098765",
      reason: "Quarterly corporate board review meeting.",
      ebInitialReading: 8520,
      ebFinalReading: 8545,
      ebGenHours: 0,
      ebRatePerUnit: 15,
    },
    {
      id: "BK-003",
      hallName: "Annanagar Community Hall",
      eventName: "Birthday Celebration",
      applicantName: "Ramkumar",
      startDate: "21/05/2026",
      startTime: "06:00 PM",
      endDate: "21/05/2026",
      endTime: "10:00 PM",
      amount: 2500,
      mobile: "9789123456",
      reason: "First year birthday celebration event.",
      ebInitialReading: 12515,
      ebFinalReading: 12540,
      ebGenHours: 1.0,
      ebRatePerUnit: 15,
    },
  ]);

  const handleOpenEbModal = (b: BookingItem) => {
    onEbDetails(b);
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.hallName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase());

    // Date filters (simple text matching for now, since we have pre-defined values)
    const matchesFromDate = fromDate ? b.startDate.includes(fromDate.split("-").reverse().slice(1).join("/")) : true;
    const matchesToDate = toDate ? b.endDate.includes(toDate.split("-").reverse().slice(1).join("/")) : true;

    return matchesSearch && matchesFromDate && matchesToDate;
  });

  return (
    <div className="space-y-6">
      {/* 1. TOP BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-50/70 to-indigo-100/50 border border-slate-100 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center min-h-[160px] gap-6 shadow-sm">
        <div className="flex items-center gap-5 z-10">
          <div className="w-16 h-16 bg-[#e0f2fe] border border-blue-200 rounded-2xl flex items-center justify-center text-[#1e3a8a] shadow-sm shrink-0">
            <Calendar className="w-8 h-8 stroke-[2]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1e293b] tracking-tight">
              {type === "past" ? "Past Bookings" : type === "future" ? "Future Bookings" : "Current Bookings"}
            </h1>
            <p className="text-xs md:text-sm text-slate-500 font-bold mt-1.5">
              {type === "past"
                ? "Past reservation of halls for hosting an event"
                : type === "future"
                  ? "Future reservation of halls for hosting an event"
                  : "Reservation of halls for hosting an event"}
            </p>
          </div>
        </div>

        {/* Building Illustration on Right */}
        <div className="absolute right-0 bottom-0 top-0 w-full md:w-1/2 opacity-25 md:opacity-100 pointer-events-none flex justify-end items-end overflow-hidden">
          <img
            src="/ripon_building.png"
            alt="Government Building"
            className="h-[140px] md:h-[180px] w-auto object-contain object-right-bottom transform translate-y-3 pr-4"
            onError={(e) => {
              // Fallback if image doesn't exist
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      </div>

      {/* 2. TABLE CARD CONTAINER */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">

        {/* Header and filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <h2 className="text-base font-extrabold text-slate-800 tracking-tight">
            All Bookings (North zone)
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search Hall Name etc..."
                className="pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-52 font-semibold text-slate-700 placeholder-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Date Filters */}
            <div className="flex items-center gap-2">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="From date"
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => (e.target.type = "text")}
                  className="pl-3 pr-2 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-500 font-semibold focus:outline-none w-28"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="To date"
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => (e.target.type = "text")}
                  className="pl-3 pr-2 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-500 font-semibold focus:outline-none w-28"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-black text-slate-400 uppercase">
                <th className="py-4 px-3 w-10"></th>
                <th className="py-4 px-4 w-28">Booking ID</th>
                <th className="py-4 px-4 w-52">Hall</th>
                <th className="py-4 px-4">Event Name</th>
                <th className="py-4 px-4">Applicant Name</th>
                <th className="py-4 px-4">{type === "past" ? "Started Date" : "Starting Date"}</th>
                <th className="py-4 px-4">{type === "past" ? "Started Timing" : "Starting Timing"}</th>
                <th className="py-4 px-4">{type === "past" ? "Ended Date" : "Ending Date"}</th>
                <th className="py-4 px-4">{type === "past" ? "Ended Timing" : "Ending Timing"}</th>
                <th className="py-4 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b, index) => (
                  <tr key={b.id} className="border-b border-slate-50 hover:bg-slate-50/50 text-xs text-slate-700 font-bold transition-colors">
                    <td className="py-4 px-3 text-slate-400 text-right font-medium">{index + 1}.</td>
                    <td className="py-4 px-4 font-mono font-extrabold text-blue-600">{b.id}</td>
                    <td className="py-4 px-4 font-extrabold text-slate-800 leading-normal">{b.hallName}</td>
                    <td className="py-4 px-4 font-semibold text-slate-600">{b.eventName}</td>
                    <td className="py-4 px-4 text-slate-600">{b.applicantName}</td>
                    <td className="py-4 px-4 text-slate-600 font-medium">{b.startDate}</td>
                    <td className="py-4 px-4 text-slate-600 font-medium">{b.startTime}</td>
                    <td className="py-4 px-4 text-slate-600 font-medium">{b.endDate}</td>
                    <td className="py-4 px-4 text-slate-600 font-medium">{b.endTime}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* View Button */}
                        <button
                          onClick={() => onViewBooking(b)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#22c55e]/30 bg-[#22c55e]/5 text-[#16a34a] font-extrabold hover:bg-[#22c55e]/15 active:scale-95 transition-all text-[11px]"
                        >
                          <Eye size={12} strokeWidth={2.5} /> View
                        </button>

                        {/* EB Details Button */}
                        <button
                          onClick={() => handleOpenEbModal(b)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50/50 text-blue-700 font-extrabold hover:bg-blue-100/60 active:scale-95 transition-all text-[11px]"
                        >
                          <Zap size={11} className="fill-blue-700 text-blue-700" /> EB Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400 font-bold">
                    No matching bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 3. PAGINATION */}
        <div className="flex justify-end items-center gap-2 mt-5">
          <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors">
            <ChevronLeft size={16} strokeWidth={2.5} />
          </button>
          <button className="w-8 h-8 rounded-lg bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-xs shadow-sm">
            1
          </button>
          <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors">
            <ChevronRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>

    </div>
  );
}
