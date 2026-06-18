import React from "react";
import {
  Building2,
  User,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Paperclip,
  MessageSquare,
  ShieldCheck,
  Zap,
  ArrowLeft,
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
  status?: string;
  bookingDate?: string;
  comment?: string;
}

interface BookingViewDetailsProps {
  booking: BookingItem;
  onBack: () => void;
  onEbDetails: () => void;
}

export function BookingViewDetails({ booking, onBack, onEbDetails }: BookingViewDetailsProps) {
  // Helper to format booking ID to three digits (e.g. BK-001 -> 001)
  const formatBookingId = (id: string) => {
    const numericPart = id.replace(/^[^\d]+/, "");
    return numericPart || id;
  };

  const getHallAddress = (hallName: string) => {
    if (hallName.includes("Annanagar") || hallName.includes("Anna Nagar")) {
      return "4/7 Karpagam Gardens, Adyar, Chennai 600009";
    } else if (hallName.includes("KK Nagar")) {
      return "12/3 Jawaharlal Nehru Road, KK Nagar, Chennai 600078";
    } else {
      return "45/1 Mount Road, Nandanam, Chennai 600035";
    }
  };

  const calculateDays = (start: string, end: string) => {
    try {
      const partsStart = start.split("/");
      const partsEnd = end.split("/");
      if (partsStart.length === 3 && partsEnd.length === 3) {
        const startDateObj = new Date(
          parseInt(partsStart[2]),
          parseInt(partsStart[1]) - 1,
          parseInt(partsStart[0])
        );
        const endDateObj = new Date(
          parseInt(partsEnd[2]),
          parseInt(partsEnd[1]) - 1,
          parseInt(partsEnd[0])
        );
        const diffTime = Math.abs(endDateObj.getTime() - startDateObj.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays || 1;
      }
    } catch (e) {
      // ignore
    }
    return 1;
  };

  const formattedStartDate = booking.startDate.includes("/")
    ? booking.startDate.replace(/\//g, "-")
    : booking.startDate;

  const formattedEndDate = booking.endDate.includes("/")
    ? booking.endDate.replace(/\//g, "-")
    : booking.endDate;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. TOP CARDS BAR */}
      <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Hall Name & Address */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1e3a8a] shrink-0 shadow-sm">
              <Building2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hall Name</p>
              <h2 className="text-base font-extrabold text-[#1e3b8a] mt-0.5 leading-tight">{booking.hallName}</h2>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1e3a8a] shrink-0 shadow-sm">
              <MapPin className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Address</p>
              <p className="text-sm font-extrabold text-[#1e3b8a] mt-0.5 leading-relaxed">{getHallAddress(booking.hallName)}</p>
            </div>
          </div>
        </div>

        {/* Applicant Details */}
        <div className="space-y-4 md:border-l md:border-slate-100 md:pl-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1e3a8a] shrink-0 shadow-sm">
              <User className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Name</p>
              <h3 className="text-base font-extrabold text-[#1e3b8a] mt-0.5 leading-tight">{booking.applicantName}</h3>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1e3a8a] shrink-0 shadow-sm">
              <Phone className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mobile Number</p>
              <p className="text-sm font-extrabold text-[#1e3b8a] mt-0.5 leading-none">{booking.mobile || "9876789809"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BOOKING DETAILS MAIN PANEL */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Header Tab */}
        <div className="bg-blue-50/70 border-b border-slate-100 px-6 py-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#1e3a8a] stroke-[2.2]" />
          <span className="text-sm font-black text-[#1e3a8a] border-b-2 border-[#1e3a8a] pb-1.5 pt-0.5 px-0.5">
            Booking Details
          </span>
        </div>

        {/* Details Grid */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
          
          {/* Left Column Fields */}
          <div className="space-y-4">
            {/* Booking ID */}
            <div className="flex items-center justify-between py-2.5 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                  <Building2 size={16} />
                </div>
                <span className="text-xs font-bold text-slate-600">Booking ID</span>
              </div>
              <span className="text-xs font-extrabold text-slate-900">{formatBookingId(booking.id)}</span>
            </div>

            {/* Starting Date */}
            <div className="flex items-center justify-between py-2.5 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                  <Calendar size={16} />
                </div>
                <span className="text-xs font-bold text-slate-600">Starting Date</span>
              </div>
              <span className="text-xs font-extrabold text-slate-900">{formattedStartDate}</span>
            </div>

            {/* Starting Time */}
            <div className="flex items-center justify-between py-2.5 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                  <Calendar size={16} />
                </div>
                <span className="text-xs font-bold text-slate-600">Starting Time</span>
              </div>
              <span className="text-xs font-extrabold text-slate-900">{booking.startTime}</span>
            </div>

            {/* No. of Days Booked */}
            <div className="flex items-center justify-between py-2.5 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                  <Calendar size={16} />
                </div>
                <span className="text-xs font-bold text-slate-600">No.of days Booked</span>
              </div>
              <span className="text-xs font-extrabold text-slate-900">{calculateDays(booking.startDate, booking.endDate)}</span>
            </div>

            {/* Booking Status */}
            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                  <ShieldCheck size={16} />
                </div>
                <span className="text-xs font-bold text-slate-600">Booking Status</span>
              </div>
              <span className="px-6 py-1 rounded-xl bg-blue-100 border border-blue-200 text-xs font-black text-[#1e3a8a] text-center min-w-[100px]">
                {booking.status || "Completed"}
              </span>
            </div>
          </div>

          {/* Right Column Fields */}
          <div className="space-y-4">
            {/* Booking Date */}
            <div className="flex items-center justify-between py-2.5 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                  <Calendar size={16} />
                </div>
                <span className="text-xs font-bold text-slate-600">Booking Date</span>
              </div>
              <span className="text-xs font-extrabold text-slate-900">{booking.bookingDate || "01-04-2026"}</span>
            </div>

            {/* Ending Date */}
            <div className="flex items-center justify-between py-2.5 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                  <Calendar size={16} />
                </div>
                <span className="text-xs font-bold text-slate-600">Ending Date</span>
              </div>
              <span className="text-xs font-extrabold text-slate-900">{formattedEndDate}</span>
            </div>

            {/* Ending Time */}
            <div className="flex items-center justify-between py-2.5 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                  <Calendar size={16} />
                </div>
                <span className="text-xs font-bold text-slate-600">Ending Time</span>
              </div>
              <span className="text-xs font-extrabold text-slate-900">{booking.endTime}</span>
            </div>

            {/* Reason for Booking */}
            <div className="flex items-center justify-between py-2.5 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                  <Paperclip size={16} />
                </div>
                <span className="text-xs font-bold text-slate-600">Reason for Booking</span>
              </div>
              <span className="text-xs font-extrabold text-slate-900">{booking.reason || "Marriage"}</span>
            </div>

            {/* Comment */}
            <div className="flex items-center justify-between py-2.5 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                  <MessageSquare size={16} />
                </div>
                <span className="text-xs font-bold text-slate-600">Comment</span>
              </div>
              <span className="text-xs font-extrabold text-red-500">{booking.comment || "-"}</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. BUTTONS ACTION BAR */}
      <div className="flex justify-end items-center gap-4">
        <button
          onClick={onBack}
          className="px-8 py-2.5 rounded-lg bg-[#001f3f] hover:bg-[#002f5f] active:scale-95 text-white font-extrabold text-xs shadow-sm transition-all flex items-center gap-2"
        >
          <ArrowLeft size={13} /> Back
        </button>

        <button
          onClick={onEbDetails}
          className="px-8 py-2.5 rounded-lg bg-[#001f3f] hover:bg-[#002f5f] active:scale-95 text-white font-extrabold text-xs shadow-sm transition-all flex items-center gap-2 border border-blue-900/50"
        >
          <Zap size={12} className="fill-yellow-400 text-yellow-400" /> EB Details
        </button>
      </div>
    </div>
  );
}
