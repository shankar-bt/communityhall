import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Clock,
  List,
  Search,
  Eye,
  MapPin,
  Calendar,
  ChevronRight,
  Users,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/hooks/useAuth";
import { CurrentBookings } from "./CurrentBookings";
import { EbDamageDetails } from "./EbDamageDetails";
import { BookingViewDetails } from "./BookingViewDetails";
import { SettlementList } from "./SettlementList";

interface BookingItem {
  id: string;
  hallName: string;
  eventName: string;
  applicantName: string;
  date: string;
  timing: string;
  status: "Completed" | "Cancelled" | "Upcoming";
  amount: number;
  mobile: string;
  reason: string;
}

export function OfficialHome({ currentView = "dashboard" }: { currentView?: string }) {
  const { user } = useApp();
  const { logout } = useAuth();

  // Table filters & search
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [activeEbBooking, setActiveEbBooking] = useState<any>(null);

  const handleSaveEb = (data: { ebTotal: number; damageTotal: number; settlementTotal: number }) => {
    alert(`Bill Raised Successfully!\nTotal Settlement Amount: ₹${data.settlementTotal.toLocaleString("en-IN")}`);
    setActiveEbBooking(null);
  };

  // Selected booking modal state
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [viewingBookingDetails, setViewingBookingDetails] = useState<any>(null);

  // Table bookings data matching the screenshot and adding helper info
  const [bookings, setBookings] = useState<BookingItem[]>([
    {
      id: "BK-001",
      hallName: "Annanagar Community Hall",
      eventName: "Wedding Reception",
      applicantName: "V.Krishnan",
      date: "2026-05-20",
      timing: "06:00 PM to 11:00 PM",
      status: "Completed",
      amount: 2000,
      mobile: "9840123456",
      reason: "Marriage Reception function",
    },
    {
      id: "BK-002",
      hallName: "KK Nagar Community Hall",
      eventName: "Corporate Meeting",
      applicantName: "Moulidharan",
      date: "2026-05-21",
      timing: "10:00 AM to 01:00 PM",
      status: "Cancelled",
      amount: 3000,
      mobile: "9444098765",
      reason: "Quarterly review conference",
    },
    {
      id: "BK-003",
      hallName: "Annanagar Community Hall",
      eventName: "Birthday Celebration",
      applicantName: "Ramkumar",
      date: "2026-05-21",
      timing: "06:00 PM to 10:00 PM",
      status: "Upcoming",
      amount: 2500,
      mobile: "9789123456",
      reason: "1st year birthday party celebration",
    },
    {
      id: "BK-004",
      hallName: "Nehru Community Hall",
      eventName: "Cultural Event",
      applicantName: "S. Anbarasan",
      date: "2026-05-22",
      timing: "09:00 AM to 05:00 PM",
      status: "Upcoming",
      amount: 4000,
      mobile: "9003123456",
      reason: "Annual cultural program music festival",
    },
    {
      id: "BK-005",
      hallName: "Kovur Multipurpose Hall",
      eventName: "Family Gathering",
      applicantName: "Priya S.",
      date: "2026-05-24",
      timing: "02:00 PM to 08:00 PM",
      status: "Completed",
      amount: 2200,
      mobile: "9566123456",
      reason: "Family reunion event and lunch",
    },
  ]);

  // Today's Events mock data for left panel
  const todayEvents = [
    {
      hallName: "Anna Nagar Community Hall",
      title: "Sangeetha Mahotsavam (Cultural)",
      time: "09:00 AM to 2:00 PM",
      footfall: 250,
      amount: 4000,
      day: "22",
      month: "MAY",
    },
    {
      hallName: "Model School Road Community Hall",
      title: "Birthday Party (Private)",
      time: "07:00 PM to 10:00 PM",
      footfall: 100,
      amount: 4000,
      day: "23",
      month: "MAY",
    },
  ];

  // Horizontal bar data for middle panel (Hall Wise Booking Load)
  const bookingLoad = [
    { name: "Nehru Hall", count: 22, percentage: 88, color: "bg-[#ef4444]" },
    { name: "Annanagar Community Hall", count: 19, percentage: 76, color: "bg-[#f97316]" },
    { name: "KK Nagar Hall", count: 16, percentage: 64, color: "bg-[#eab308]" },
    { name: "Kovur Hall", count: 13, percentage: 52, color: "bg-[#10b981]" },
    { name: "Model School Road Community Hall", count: 9, percentage: 36, color: "bg-[#06b6d4]" },
  ];

  // Vertical bar data for right panel (Monthly Booking Trends)
  const bookingTrends = [
    { month: "JAN", count: 15, height: "60%" },
    { month: "FEB", count: 18, height: "72%" },
    { month: "MAR", count: 22, height: "88%" },
    { month: "APR", count: 11, height: "44%" },
    { month: "MAY", count: 24, height: "96%", active: true },
  ];

  const handleUpdateStatus = (id: string, newStatus: "Completed" | "Cancelled" | "Upcoming") => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const filteredBookings = bookings.filter((b) => {
    // Apply sidebar view filter
    if (currentView === "current") {
      // Mock ongoing events on May 21st (BK-002, BK-003)
      if (b.date !== "2026-05-21") return false;
    } else if (currentView === "past") {
      if (b.status !== "Completed") return false;
    } else if (currentView === "future") {
      if (b.status !== "Upcoming") return false;
    }

    const matchesSearch =
      b.hallName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFromDate = fromDate ? b.date >= fromDate : true;
    const matchesToDate = toDate ? b.date <= toDate : true;

    return matchesSearch && matchesFromDate && matchesToDate;
  });

  const formatDateString = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  };

  // Get dynamic header texts
  const getHeaderTitle = () => {
    switch (currentView) {
      case "current":
        return "Current Events Portal";
      case "past":
        return "Past Completed Bookings";
      case "future":
        return "Upcoming Future Bookings";
      case "settlement":
        return "Financial Settlement List";
      default:
        return `Welcome back ${user?.name || "Gokul"} !`;
    }
  };

  const getHeaderSubtitle = () => {
    switch (currentView) {
      case "current":
        return "Currently active hall bookings in your zone today";
      case "past":
        return "View and audit all successfully completed events";
      case "future":
        return "Check scheduled and approved future events";
      case "settlement":
        return "Consolidated payment details and settlement status";
      default:
        return "Here's what's happening in your zone today";
    }
  };

  // Calculate settlement total
  const totalSettlementAmount = bookings.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gradient-to-tr from-[#ccfbf1]/40 via-[#fff7ed]/50 to-[#dbeafe]/40 min-h-screen">

      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-transparent rounded-2xl py-2 px-1">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1e3b8a] tracking-tight">
            {getHeaderTitle()}
          </h1>
          <p className="text-xs text-slate-500 font-bold mt-1">
            {getHeaderSubtitle()}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-800">21 May, 2026 ,Thursday</p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-red-500 mt-0.5">
              <MapPin size={12} className="fill-red-500 text-red-500" /> North Zone
            </span>
          </div>
          <button
            onClick={logout}
            className="px-3.5 py-1.5 rounded-lg bg-red-50/80 hover:bg-red-100 text-red-600 font-bold text-xs border border-red-100 transition-all active:scale-95 ml-2"
          >
            Logout
          </button>
        </div>
      </div>

      {activeEbBooking ? (
        <EbDamageDetails
          booking={activeEbBooking}
          onSave={handleSaveEb}
          onClose={() => setActiveEbBooking(null)}
        />
      ) : viewingBookingDetails ? (
        <BookingViewDetails
          booking={viewingBookingDetails}
          onBack={() => setViewingBookingDetails(null)}
          onEbDetails={() => {
            setActiveEbBooking(viewingBookingDetails);
            setViewingBookingDetails(null);
          }}
        />
      ) : currentView === "settlement" ? (
        <SettlementList />
      ) : currentView === "current" || currentView === "past" || currentView === "future" ? (
        <CurrentBookings
          type={currentView}
          onViewBooking={(booking) => setViewingBookingDetails(booking)}
          onEbDetails={(booking) => setActiveEbBooking(booking)}
        />
      ) : (
        <>
          {/* 2. FOUR TOP CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Approved Bookings */}
            <div className="bg-white rounded-2xl p-4 border border-[#10b981]/20 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#10b981]/10 flex items-center justify-center border border-[#10b981]/25">
                  <Check className="text-[#10b981]" size={22} strokeWidth={3} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500">Approved Bookings</p>
                  <h3 className="text-3xl font-extrabold text-slate-800 mt-0.5">18</h3>
                  <button className="text-[10px] font-bold text-blue-500 hover:underline flex items-center gap-0.5 mt-1">
                    View all Bookings <ChevronRight size={10} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>

            {/* Rejected Bookings */}
            <div className="bg-white rounded-2xl p-4 border border-[#ef4444]/20 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#ef4444]/10 flex items-center justify-center border border-[#ef4444]/25">
                  <X className="text-[#ef4444]" size={22} strokeWidth={3} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500">Rejected Bookings</p>
                  <h3 className="text-3xl font-extrabold text-slate-800 mt-0.5">05</h3>
                  <button className="text-[10px] font-bold text-blue-500 hover:underline flex items-center gap-0.5 mt-1">
                    View all Bookings <ChevronRight size={10} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>

            {/* Upcoming Bookings */}
            <div className="bg-white rounded-2xl p-4 border border-[#f97316]/20 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#f97316]/10 flex items-center justify-center border border-[#f97316]/25">
                  <Clock className="text-[#f97316]" size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500">Upcoming Bookings</p>
                  <h3 className="text-3xl font-extrabold text-slate-800 mt-0.5">03</h3>
                  <button className="text-[10px] font-bold text-blue-500 hover:underline flex items-center gap-0.5 mt-1">
                    View all Bookings <ChevronRight size={10} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>

            {/* Total Bookings */}
            <div className="bg-white rounded-2xl p-4 border border-[#3b82f6]/20 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#3b82f6]/10 flex items-center justify-center border border-[#3b82f6]/25">
                  <List className="text-[#3b82f6]" size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500">Total Bookings</p>
                  <h3 className="text-3xl font-extrabold text-slate-800 mt-0.5">26</h3>
                  <button className="text-[10px] font-bold text-blue-500 hover:underline flex items-center gap-0.5 mt-1">
                    View all Bookings <ChevronRight size={10} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. THREE COLUMN SECTION (Booking Overview & Today's Events stacked on Left; Today's Summary & Charts on Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* LEFT COLUMN: Booking Overview & Today's Events stacked (4/12 wide) */}
            <div className="lg:col-span-4 space-y-6">

              {/* Booking Overview (Pie Chart) */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-extrabold text-slate-800">Booking Overview</h3>
                  <div className="flex gap-1">
                    <select className="text-[10px] font-bold bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-600 focus:outline-none">
                      <option>Hall</option>
                    </select>
                    <select className="text-[10px] font-bold bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-600 focus:outline-none">
                      <option>This Month</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-around gap-4 py-2">
                  {/* Conic Donut Chart */}
                  <div
                    className="relative w-32 h-32 rounded-full flex items-center justify-center shadow-inner shrink-0"
                    style={{
                      background: "conic-gradient(#f43f5e 0% 42%, #f97316 42% 73%, #eab308 73% 100%)",
                    }}
                  >
                    <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-lg font-extrabold text-slate-800 dark:text-white">100%</span>
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Bookings</p>
                      </div>
                    </div>
                  </div>

                  {/* Donut Legend */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]" />
                      <span className="font-bold text-slate-600">Marriage Function</span>
                      <span className="font-bold text-slate-400">42.0%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#f97316]" />
                      <span className="font-bold text-slate-600">Birthday Function</span>
                      <span className="font-bold text-slate-400">31.0%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />
                      <span className="font-bold text-slate-600">Corporate Meetings</span>
                      <span className="font-bold text-slate-400">27.0%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Today's Events List */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-extrabold text-slate-800">Today's Events</h3>
                  <div className="flex gap-1">
                    <select className="text-[10px] font-bold bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-600 focus:outline-none">
                      <option>Hall</option>
                    </select>
                    <select className="text-[10px] font-bold bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-600 focus:outline-none">
                      <option>This Month</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  {todayEvents.map((evt, idx) => (
                    <div key={idx} className="flex gap-3 items-center bg-[#f8fafc] border border-slate-100 rounded-xl p-2.5">
                      {/* Date Pill (Solid Purple) */}
                      <div className="w-12 h-12 bg-[#4f46e5] rounded-xl flex flex-col items-center justify-center shrink-0 shadow-sm">
                        <span className="text-[8px] font-black text-indigo-100 uppercase leading-none">{evt.month}</span>
                        <span className="text-sm font-black text-white leading-none mt-0.5">{evt.day}</span>
                      </div>
                      {/* Event Detail */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-black text-slate-800 truncate">{evt.hallName}</h4>
                        <p className="text-[10px] text-slate-500 font-bold truncate mt-0.5">{evt.title}</p>
                        <div className="flex items-center justify-between mt-1 text-[9px] text-slate-400 font-semibold">
                          <span>{evt.time}</span>
                          <span>Expected Footfall: {evt.footfall}</span>
                        </div>
                      </div>
                      {/* Price Tag */}
                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-[#16a34a]">₹ {evt.amount.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Today's Summary & Charts grid (8/12 wide) */}
            <div className="lg:col-span-8 space-y-6">

              {/* Today's Summary Card */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h2 className="text-base font-extrabold text-slate-800 mb-4">Today's Summary</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Events */}
                  <div className="bg-[#f8fafc] border border-[#10b981]/20 rounded-xl p-3.5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#10b981]/10 flex items-center justify-center">
                      <Check className="text-[#10b981]" size={18} strokeWidth={3} />
                    </div>
                    <div>
                      <h4 className="text-lg font-extrabold text-slate-800 leading-tight">02</h4>
                      <p className="text-[10px] font-bold text-slate-500">Events</p>
                    </div>
                  </div>

                  {/* Expected Footfall */}
                  <div className="bg-[#f8fafc] border border-[#8b5cf6]/20 rounded-xl p-3.5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center">
                      <Users className="text-[#8b5cf6]" size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 className="text-lg font-extrabold text-slate-800 leading-tight">120</h4>
                      <p className="text-[10px] font-bold text-slate-500">Expected Footfall</p>
                    </div>
                  </div>

                  {/* Total Collection */}
                  <div className="bg-[#f8fafc] border border-[#f97316]/20 rounded-xl p-3.5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#f97316]/10 flex items-center justify-center">
                      <span className="text-[#f97316] font-bold text-base">₹</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-extrabold text-slate-800 leading-tight">
                        {currentView === "settlement" ? totalSettlementAmount.toLocaleString("en-IN") : "6,000"}
                      </h4>
                      <p className="text-[10px] font-bold text-slate-500">Total Collection</p>
                    </div>
                  </div>

                  {/* Pending Reviews */}
                  <div className="bg-[#f8fafc] border border-[#3b82f6]/20 rounded-xl p-3.5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#3b82f6]/10 flex items-center justify-center">
                      <List className="text-[#3b82f6]" size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 className="text-lg font-extrabold text-slate-800 leading-tight">01</h4>
                      <p className="text-[10px] font-bold text-slate-500">Pending Reviews</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hall Wise Booking Load & Monthly Booking Trends Grid side-by-side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Hall Wise Booking Load */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-sm font-extrabold text-slate-800">Hall Wise Booking Load</h2>
                    <select className="text-[10px] font-bold bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-600 focus:outline-none">
                      <option>This Month</option>
                    </select>
                  </div>

                  {/* Horizontal Bar Chart */}
                  <div className="space-y-4 flex-1 flex flex-col justify-center">
                    {bookingLoad.map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-600">
                          <span className="truncate max-w-[160px]">{item.name}</span>
                          <span className="font-extrabold text-slate-800">{item.count}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${item.color} transition-all duration-500`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Monthly Booking Trends (2026) */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-sm font-extrabold text-slate-800">Monthly Booking Trends (2026)</h2>
                    <select className="text-[10px] font-bold bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-600 focus:outline-none">
                      <option>Year</option>
                    </select>
                  </div>

                  {/* Bar Chart Visualization */}
                  <div className="flex items-end justify-between h-44 px-1 relative">
                    {/* Background dashed gridlines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pr-1">
                      {[25, 20, 15, 10, 5].map((val) => (
                        <div key={val} className="w-full border-t border-dashed border-slate-100 flex items-center justify-between text-[8px] font-bold text-slate-400">
                          <span className="bg-white pr-1 z-10">{val}</span>
                          <div className="w-full border-t border-dashed border-slate-100" />
                        </div>
                      ))}
                    </div>

                    {/* Vertical Bars */}
                    <div className="w-full flex items-end justify-around z-10 mt-4">
                      {bookingTrends.map((trend, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-2 w-8 group cursor-pointer">
                          {/* Tooltip on hover */}
                          <div className="opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded absolute -translate-y-8 font-bold transition-opacity shadow-sm pointer-events-none">
                            {trend.count}
                          </div>
                          <div
                            className={`w-5 rounded-t-md transition-all duration-300 ${trend.active
                              ? "bg-[#1e3a8a] shadow-md shadow-blue-900/10"
                              : "bg-[#cbd5e1] hover:bg-slate-400"
                              }`}
                            style={{ height: trend.height }}
                          />
                          <span className="text-[9px] font-black text-slate-500">{trend.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* 4. ALL BOOKINGS (Full width) */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm overflow-hidden">

            {/* Header & Table Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <h2 className="text-base font-extrabold text-slate-800">All Bookings</h2>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                  <input
                    type="text"
                    placeholder="Search Hall Name etc..."
                    className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-48 font-semibold text-slate-700 placeholder-slate-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Date Filters */}
                <div className="flex items-center gap-1.5">
                  <input
                    type="date"
                    className="px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-500 font-semibold focus:outline-none"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                  <span className="text-xs text-slate-400 font-bold">to</span>
                  <input
                    type="date"
                    className="px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-500 font-semibold focus:outline-none"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-black text-slate-400 uppercase">
                    <th className="py-3 px-4">Booking ID</th>
                    <th className="py-3 px-4">Hall</th>
                    <th className="py-3 px-4">Event Name</th>
                    <th className="py-3 px-4">Applicant Name</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Timing</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((b) => (
                      <tr key={b.id} className="border-b border-slate-50/50 hover:bg-slate-50/50 text-xs text-slate-700 font-semibold transition-colors">
                        <td className="py-3.5 px-4 font-mono font-extrabold text-blue-600">{b.id}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{b.hallName}</td>
                        <td className="py-3.5 px-4">{b.eventName}</td>
                        <td className="py-3.5 px-4">{b.applicantName}</td>
                        <td className="py-3.5 px-4 whitespace-nowrap">{formatDateString(b.date)}</td>
                        <td className="py-3.5 px-4 whitespace-nowrap">{b.timing}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`font-black uppercase tracking-wider text-[9px] ${b.status === "Completed"
                              ? "text-green-600"
                              : b.status === "Cancelled"
                                ? "text-red-500"
                                : "text-amber-500"
                              }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-extrabold text-slate-900">
                          ₹{b.amount.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => setSelectedBooking(b)}
                            className="inline-flex items-center gap-1 text-[10px] font-black text-blue-500 hover:text-blue-700 hover:underline"
                          >
                            <Eye size={12} strokeWidth={2.5} /> View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400 font-bold">
                        No matching bookings found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </>
      )}

      {/* 5. VIEW BOOKING DETAIL MODAL */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBooking(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 z-10"
            >
              {/* Header */}
              <div className="bg-[#1e3a8a] text-white p-5">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest bg-white/10 px-2 py-0.5 rounded-full border border-white/20 uppercase">
                      {selectedBooking.status}
                    </span>
                    <h3 className="text-lg font-black mt-2">{selectedBooking.hallName}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white"
                  >
                    <X size={20} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Booking ID</p>
                    <p className="font-mono text-slate-900 mt-0.5">{selectedBooking.id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Amount Paid</p>
                    <p className="text-slate-900 font-extrabold text-sm mt-0.5">₹{selectedBooking.amount.toLocaleString("en-IN")}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Applicant Name</p>
                    <p className="text-slate-900 mt-0.5">{selectedBooking.applicantName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Contact Mobile</p>
                    <p className="text-slate-900 mt-0.5">{selectedBooking.mobile}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Event Date</p>
                    <p className="text-slate-900 mt-0.5">{formatDateString(selectedBooking.date)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Timing Duration</p>
                    <p className="text-slate-900 mt-0.5">{selectedBooking.timing}</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Purpose / Reason</p>
                  <p className="text-xs text-slate-700 font-medium mt-1 leading-relaxed">
                    {selectedBooking.reason}
                  </p>
                </div>

                {/* Status Switcher Actions */}
                <div className="border-t border-slate-100 pt-4 flex gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedBooking.id, "Completed")}
                    className="flex-1 py-2 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 text-xs font-black border border-green-200 transition-all active:scale-95"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedBooking.id, "Cancelled")}
                    className="flex-1 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-black border border-red-200 transition-all active:scale-95"
                  >
                    Cancel Booking
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedBooking.id, "Upcoming")}
                    className="flex-1 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-black border border-amber-200 transition-all active:scale-95"
                  >
                    Set Upcoming
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
