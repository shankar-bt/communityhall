import { useState } from "react";
import {
  Search,
  Eye,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  Download,
  ChevronsUpDown,
  User,
  Zap,
  AlertTriangle,
  QrCode,
  RotateCcw,
} from "lucide-react";

interface SettlementItem {
  id: string;
  bookingDate: string;
  softwareId: string;
  settlementRaisedDate: string;
  depositAmt: number;
  collectionPending: number;
  refundAmt: number;
  refundStatus: "Approved" | "Rejected" | "Pending";
  // User details
  applicantName: string;
  mobile: string;
  userType: string;
  address: string;
  // Booking details
  startDate: string;
  endDate: string;
  startSlot: string;
  endSlot: string;
  hallAmount: number;
  gstAmount: number;
  totalAmount: number;
  // EB details
  consumerNumber: string;
  ebStartReading: number;
  ebEndReading: number;
  ebRatePerUnit: number;
  ebUnitsConsumed: number;
  ebAmount: number;
  // Damage details
  damageItems: Array<{
    name: string;
    cost: number;
    qty: number;
    amount: number;
  }>;
}

interface SettlementListProps {
  onBackToDashboard?: () => void;
}

export function SettlementList({ onBackToDashboard }: SettlementListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSettlement, setSelectedSettlement] = useState<SettlementItem | null>(null);

  // Mock data matching the screenshot
  const settlements: SettlementItem[] = [
    {
      id: "BK-001",
      bookingDate: "03/04/2026",
      softwareId: "11",
      settlementRaisedDate: "05/04/2026",
      depositAmt: 10.0,
      collectionPending: 0.0,
      refundAmt: 10.0,
      refundStatus: "Approved",
      applicantName: "V.Krishnan",
      mobile: "9840123456",
      userType: "PUBLIC",
      address: "12, Park Street, Annanagar, Chennai - 600040",
      startDate: "2026-05-20",
      endDate: "2026-05-21",
      startSlot: "Morning",
      endSlot: "Evening",
      hallAmount: 2000.0,
      gstAmount: 360.0,
      totalAmount: 2360.0,
      consumerNumber: "1001001001",
      ebStartReading: 12450,
      ebEndReading: 12510,
      ebRatePerUnit: 2.0,
      ebUnitsConsumed: 60,
      ebAmount: 120.0,
      damageItems: [],
    },
    {
      id: "BK-002",
      bookingDate: "04/04/2026",
      softwareId: "26",
      settlementRaisedDate: "07/04/2026",
      depositAmt: 10.0,
      collectionPending: 0.0,
      refundAmt: 9.0,
      refundStatus: "Rejected",
      applicantName: "Moulidharan",
      mobile: "8667881667",
      userType: "PUBLIC",
      address: "67, Test Street, Test Area, Chennai , Chennai-600003",
      startDate: "2026-05-21",
      endDate: "2026-05-21",
      startSlot: "Morning",
      endSlot: "Morning",
      hallAmount: 2.0,
      gstAmount: 0.36,
      totalAmount: 4.36,
      consumerNumber: "1001001000",
      ebStartReading: 12,
      ebEndReading: 13,
      ebRatePerUnit: 2.0,
      ebUnitsConsumed: 1,
      ebAmount: 2.0,
      damageItems: [],
    },
    {
      id: "BK-003",
      bookingDate: "05/04/2026",
      softwareId: "60",
      settlementRaisedDate: "08/04/2026",
      depositAmt: 10.0,
      collectionPending: 12.0,
      refundAmt: 0.0,
      refundStatus: "Pending",
      applicantName: "Ramkumar",
      mobile: "9789123456",
      userType: "PUBLIC",
      address: "45, Main Road, KK Nagar, Chennai - 600078",
      startDate: "2026-05-21",
      endDate: "2026-05-21",
      startSlot: "Evening",
      endSlot: "Evening",
      hallAmount: 2500.0,
      gstAmount: 450.0,
      totalAmount: 2950.0,
      consumerNumber: "1001001002",
      ebStartReading: 12515,
      ebEndReading: 12540,
      ebRatePerUnit: 2.0,
      ebUnitsConsumed: 25,
      ebAmount: 50.0,
      damageItems: [
        {
          name: "Table",
          cost: 12.0,
          qty: 1,
          amount: 12.0,
        },
      ],
    },
  ];

  const filteredSettlements = settlements.filter((s) => {
    const matchesSearch =
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.softwareId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFromDate = fromDate ? s.bookingDate >= fromDate : true;
    const matchesToDate = toDate ? s.bookingDate <= toDate : true;

    return matchesSearch && matchesFromDate && matchesToDate;
  });

  if (selectedSettlement) {
    return (
      <SettlementDetails
        settlement={selectedSettlement}
        onClose={() => setSelectedSettlement(null)}
      />
    );
  }

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
              Settlement List
            </h1>
            <p className="text-xs md:text-sm text-slate-500 font-bold mt-1.5">
              Manage and Track Settlement Transactions
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
                <th className="py-4 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    Booking ID <ChevronsUpDown size={12} className="text-slate-400" />
                  </div>
                </th>
                <th className="py-4 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    Booking Date <ChevronsUpDown size={12} className="text-slate-400" />
                  </div>
                </th>
                <th className="py-4 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    Software ID <ChevronsUpDown size={12} className="text-slate-400" />
                  </div>
                </th>
                <th className="py-4 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    Settlement Raised Date <ChevronsUpDown size={12} className="text-slate-400" />
                  </div>
                </th>
                <th className="py-4 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    Deposit Amt <ChevronsUpDown size={12} className="text-slate-400" />
                  </div>
                </th>
                <th className="py-4 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    Collection Pending (If any) <ChevronsUpDown size={12} className="text-slate-400" />
                  </div>
                </th>
                <th className="py-4 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    Refund Amt <ChevronsUpDown size={12} className="text-slate-400" />
                  </div>
                </th>
                <th className="py-4 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    Refund Status <ChevronsUpDown size={12} className="text-slate-400" />
                  </div>
                </th>
                <th className="py-4 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSettlements.length > 0 ? (
                filteredSettlements.map((s, index) => (
                  <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/50 text-xs text-slate-700 font-bold transition-colors">
                    <td className="py-4 px-3 text-slate-400 text-right font-medium">{index + 1}.</td>
                    <td className="py-4 px-4 font-mono font-extrabold text-blue-600">{s.id}</td>
                    <td className="py-4 px-4 font-semibold text-slate-600">{s.bookingDate}</td>
                    <td className="py-4 px-4 text-slate-600">{s.softwareId}</td>
                    <td className="py-4 px-4 text-slate-600">{s.settlementRaisedDate}</td>
                    <td className="py-4 px-4 text-emerald-600 font-extrabold">₹{s.depositAmt.toFixed(1)}</td>
                    <td className="py-4 px-4 text-amber-600 font-extrabold">₹{s.collectionPending === 0 ? "0" : s.collectionPending.toFixed(1)}</td>
                    <td className="py-4 px-4 text-emerald-600 font-extrabold">₹{s.refundAmt.toFixed(1)}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-md text-[10px] font-black uppercase border ${s.refundStatus === "Approved"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                            : s.refundStatus === "Rejected"
                              ? "bg-red-50 border-red-200 text-red-500"
                              : "bg-amber-50 border-amber-200 text-amber-500"
                          }`}
                      >
                        {s.refundStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* View Button */}
                        <button
                          onClick={() => setSelectedSettlement(s)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#22c55e]/30 bg-[#22c55e]/5 text-[#16a34a] font-extrabold hover:bg-[#22c55e]/15 active:scale-95 transition-all text-[11px]"
                        >
                          <Eye size={12} strokeWidth={2.5} /> View
                        </button>

                        {/* Condition-based action buttons */}
                        {s.refundStatus === "Rejected" && (
                          <button
                            onClick={() => alert(`Re-raising settlement for ${s.id}`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#f97316]/30 bg-[#f97316]/5 text-[#f97316] font-extrabold hover:bg-[#f97316]/15 active:scale-95 transition-all text-[11px]"
                          >
                            <RotateCcw size={11} /> Raise Again
                          </button>
                        )}

                        {s.refundStatus === "Pending" && (
                          <button
                            onClick={() => alert(`Showing QR code for ${s.id}`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-200 bg-purple-50 text-purple-700 font-extrabold hover:bg-purple-100 active:scale-95 transition-all text-[11px]"
                          >
                            <QrCode size={11} /> QR
                          </button>
                        )}
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

interface SettlementDetailsProps {
  settlement: SettlementItem;
  onClose: () => void;
}

function SettlementDetails({ settlement, onClose }: SettlementDetailsProps) {
  const totalRefundable =
    settlement.depositAmt - settlement.ebAmount - settlement.damageItems.reduce((sum, item) => sum + item.amount, 0);

  const finalRefundAmt = totalRefundable > 0 ? totalRefundable : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* HEADER BAR */}
      <div className="flex justify-between items-center bg-[#1e3a8a] text-white rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white fill-white" />
          </div>
          <h1 className="text-md font-extrabold tracking-tight">Settlement Amount</h1>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <X size={16} strokeWidth={3} />
        </button>
      </div>

      {/* USER DETAILS CARD */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#1e3a8a]">
            <User size={16} className="fill-[#1e3a8a]" />
          </div>
          <h2 className="text-sm font-extrabold text-slate-800">User Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase">User Name</label>
            <p className="text-xs font-bold text-slate-700">{settlement.applicantName}</p>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase">Mobile Number</label>
            <p className="text-xs font-bold text-slate-700">{settlement.mobile}</p>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase">User Type</label>
            <div>
              <span className="inline-flex px-2 py-0.5 bg-purple-100 text-purple-700 font-extrabold rounded-md text-[9px] uppercase tracking-wider">
                {settlement.userType}
              </span>
            </div>
          </div>
          <div className="space-y-1 md:col-span-1">
            <label className="text-[10px] font-black text-slate-400 uppercase">User Address</label>
            <p className="text-xs font-bold text-slate-600 leading-normal">{settlement.address}</p>
          </div>
        </div>
      </div>

      {/* BOOKING DETAILS CARD */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-blue-50/50 border-b border-slate-100 px-6 py-4">
          <h2 className="text-xs font-black text-blue-800 uppercase tracking-wider">
            Booking Details (Booking Id: {settlement.softwareId})
          </h2>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column Fields */}
          <div className="grid grid-cols-2 gap-y-5 gap-x-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Booking Date</label>
              <p className="text-xs font-bold text-slate-700">{settlement.bookingDate}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Start Date</label>
              <p className="text-xs font-bold text-slate-700">{settlement.startDate}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">END Date</label>
              <p className="text-xs font-bold text-slate-700">{settlement.endDate}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Starting Slot</label>
              <p className="text-xs font-bold text-slate-700">{settlement.startSlot}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Ending Slot</label>
              <p className="text-xs font-bold text-slate-700">{settlement.endSlot}</p>
            </div>
          </div>

          {/* Right Column Money Values */}
          <div className="space-y-3.5 border-l border-slate-100 pl-8">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-500">Deposit Amount</span>
              <span className="text-emerald-600 font-extrabold">₹ {settlement.depositAmt.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-500">Hall Amount</span>
              <span className="text-emerald-600 font-extrabold">₹ {settlement.hallAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-500">GST-18%</span>
              <span className="text-emerald-600 font-extrabold">₹ {settlement.gstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center bg-blue-50/60 border border-blue-100 rounded-xl px-4 py-2.5 text-xs font-black text-[#1e3a8a]">
              <span>Total Amount</span>
              <span>₹ {settlement.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* EB DETAILS CARD */}
      <div className="bg-white rounded-3xl border border-emerald-100 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-emerald-50">
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Zap size={16} className="fill-emerald-600 text-emerald-600" />
          </div>
          <h2 className="text-sm font-extrabold text-emerald-800">EB Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-emerald-800 uppercase">Consumer Number</label>
              <p className="text-xs font-bold text-slate-700">{settlement.consumerNumber}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-emerald-800 uppercase">Start Reading</label>
              <p className="text-xs font-bold text-slate-700">{settlement.ebStartReading}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-emerald-800 uppercase">End Reading</label>
              <p className="text-xs font-bold text-slate-700">{settlement.ebEndReading}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-l border-slate-100 pl-8">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-emerald-800 uppercase">EB Amt Per Unit</label>
              <p className="text-xs font-bold text-slate-700">₹ {settlement.ebRatePerUnit.toFixed(2)}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-emerald-800 uppercase">Unit Consumed</label>
              <p className="text-xs font-bold text-slate-700">{settlement.ebUnitsConsumed}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-emerald-800 uppercase">EB Amount</label>
              <p className="text-xs font-extrabold text-emerald-600">₹ {settlement.ebAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* DAMAGE DETAILS CARD */}
      <div className="bg-white rounded-3xl border border-amber-100 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-amber-50">
          <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <AlertTriangle size={16} />
          </div>
          <h2 className="text-sm font-extrabold text-amber-800">Damage Details (if any)</h2>
        </div>

        {settlement.damageItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-semibold text-slate-600">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase">
                  <th className="py-2 px-3">S.No</th>
                  <th className="py-2 px-4">Asset Name</th>
                  <th className="py-2 px-4">Damage Img</th>
                  <th className="py-2 px-4">Cost</th>
                  <th className="py-2 px-4">Qty</th>
                  <th className="py-2 px-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                {settlement.damageItems.map((item, index) => (
                  <tr key={index} className="border-b border-slate-50 last:border-0">
                    <td className="py-3 px-3">{index + 1}</td>
                    <td className="py-3 px-4 text-slate-800 font-bold">{item.name}</td>
                    <td className="py-3 px-4 text-slate-400 italic">No Image uploaded</td>
                    <td className="py-3 px-4">₹{item.cost.toFixed(2)}</td>
                    <td className="py-3 px-4">{item.qty}</td>
                    <td className="py-3 px-4 text-slate-900 font-bold">₹{item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-slate-400"
              >
                <path d="M21 7.5L12 3L3 7.5L12 12L21 7.5Z" />
                <path d="M3 7.5V16.5L12 21V12L3 7.5Z" />
                <path d="M21 7.5V16.5L12 21V12L21 7.5Z" />
              </svg>
            </div>
            <p className="text-xs text-slate-400 font-bold">No Damaged Items</p>
          </div>
        )}
      </div>

      {/* AMOUNT TO BE REFUNDED */}
      <div className="bg-white rounded-3xl border border-indigo-100 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-indigo-50">
          <div className="w-8 h-8 rounded-full bg-indigo-50/50 flex items-center justify-center text-indigo-600">
            <Zap size={16} />
          </div>
          <h2 className="text-sm font-extrabold text-indigo-800">Amount to be Refunded</h2>
        </div>

        <div className="space-y-3.5 max-w-md ml-auto">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-500">Deposit Amount</span>
            <span className="text-slate-700">₹ {settlement.depositAmt.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-500">EB Amount</span>
            <span className="text-red-500">-₹ {settlement.ebAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-500">Damage (if any)</span>
            <span className="text-red-500">
              ₹ {settlement.damageItems.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center bg-[#faf5ff] border border-purple-100 rounded-xl px-4 py-2.5 text-xs font-black">
            <span className="text-purple-800">Actual refundable Amount</span>
            <span className="text-emerald-600">₹ {finalRefundAmt.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-center gap-4 pt-6 border-t border-slate-100">
        <button
          onClick={onClose}
          className="px-8 py-3 bg-[#0f172a] hover:bg-[#1e293b] text-white text-sm font-black rounded-xl shadow-sm hover:shadow active:scale-95 transition-all"
        >
          Close
        </button>
        <button
          onClick={() => alert("Downloading Settlement Details PDF...")}
          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-black rounded-xl shadow-sm hover:shadow active:scale-95 transition-all flex items-center gap-2"
        >
          <Download size={16} /> Download PDF
        </button>
      </div>
    </div>
  );
}
