import { useState, useEffect } from "react";
import {
  Zap,
  User,
  AlertTriangle,
  CreditCard,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";

interface DamageItem {
  id: string;
  material: string;
  quantity: number;
  perMaterialAmt: number;
  comments: string;
  photoName?: string;
}

interface EbDamageDetailsProps {
  booking: {
    id: string;
    hallName: string;
    applicantName: string;
    mobile: string;
  };
  onSave: (data: {
    ebTotal: number;
    damageTotal: number;
    settlementTotal: number;
  }) => void;
  onClose: () => void;
}

export function EbDamageDetails({ booking, onSave, onClose }: EbDamageDetailsProps) {
  // EB state variables
  const [consumerNumber, setConsumerNumber] = useState("1000156");
  const [startReading, setStartReading] = useState<number>(12.0);
  const [endReading, setEndReading] = useState<string>("");
  const [ebPhotoName, setEbPhotoName] = useState<string>("");
  const [totalUnits, setTotalUnits] = useState<number>(0);
  const [ebTotalAmount, setEbTotalAmount] = useState<number>(0);

  // Damage items state
  const [damageItems, setDamageItems] = useState<DamageItem[]>([
    {
      id: "1",
      material: "Chair",
      quantity: 0,
      perMaterialAmt: 0,
      comments: "",
    },
  ]);

  // Calculate EB units and amount when endReading changes
  useEffect(() => {
    const end = parseFloat(endReading) || 0;
    if (end > startReading) {
      const units = end - startReading;
      setTotalUnits(units);
      setEbTotalAmount(units * 2.0);
    } else {
      setTotalUnits(0);
      setEbTotalAmount(0);
    }
  }, [endReading, startReading]);

  // Add material row
  const handleAddMaterial = () => {
    setDamageItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        material: "Chair",
        quantity: 0,
        perMaterialAmt: 0,
        comments: "",
      },
    ]);
  };

  // Remove material row
  const handleRemoveMaterial = (id: string) => {
    setDamageItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Update damage item values
  const handleUpdateItem = (id: string, fields: Partial<DamageItem>) => {
    setDamageItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...fields } : item))
    );
  };

  // Calculate damage totals
  const damageTotalAmount = damageItems.reduce((sum, item) => {
    return sum + (item.quantity * item.perMaterialAmt);
  }, 0);

  const totalSettlementAmount = ebTotalAmount + damageTotalAmount;

  const handleRaiseBill = () => {
    onSave({
      ebTotal: ebTotalAmount,
      damageTotal: damageTotalAmount,
      settlementTotal: totalSettlementAmount,
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 1. TOP BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-50/70 to-purple-100/50 border border-slate-100 rounded-3xl p-6 flex items-center gap-5 shadow-sm">
        <div className="w-16 h-16 bg-[#f3e8ff] border border-purple-200 rounded-2xl flex items-center justify-center text-purple-700 shadow-sm shrink-0">
          <Zap className="w-8 h-8 fill-purple-700 text-purple-700" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-[#1e293b] tracking-tight">
            Electricity Bills and Damage Details
          </h1>
          <p className="text-xs text-slate-500 font-bold mt-1">
            Enter Electricity Bill information and any damage details for the event
          </p>
        </div>
      </div>

      {/* 2. USER DETAILS CARD */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#1e3a8a]">
            <User size={16} className="fill-[#1e3a8a]" />
          </div>
          <h2 className="text-sm font-extrabold text-slate-800">User Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase">Booking ID</label>
            <input
              type="text"
              readOnly
              className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 cursor-not-allowed focus:outline-none"
              value={booking.id.replace("BK-", "")}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase">Name</label>
            <input
              type="text"
              readOnly
              className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 cursor-not-allowed focus:outline-none"
              value={booking.applicantName}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase">Mobile Number</label>
            <input
              type="text"
              readOnly
              className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 cursor-not-allowed focus:outline-none"
              value={booking.mobile}
            />
          </div>
        </div>
      </div>

      {/* 3. EB DETAILS CARD (GREEN BORDER) */}
      <div className="bg-white rounded-3xl border-2 border-emerald-100 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Zap size={16} className="fill-emerald-600" />
            </div>
            <h2 className="text-sm font-extrabold text-emerald-800">EB Details</h2>
          </div>
          <div className="text-[11px] font-extrabold text-slate-600 bg-emerald-50/70 border border-emerald-100 rounded-lg px-2.5 py-1">
            EB Cost per unit: <span className="text-emerald-700 font-black">₹2.0</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 items-end">
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-[10px] font-black text-emerald-800 uppercase">Consumer Number</label>
            <input
              type="text"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={consumerNumber}
              onChange={(e) => setConsumerNumber(e.target.value)}
            />
          </div>

          <div className="space-y-1.5 md:col-span-1">
            <label className="text-[10px] font-black text-emerald-800 uppercase">Start Reading</label>
            <input
              type="number"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={startReading}
              onChange={(e) => setStartReading(parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-1.5 md:col-span-1">
            <label className="text-[10px] font-black text-emerald-800 uppercase">End Reading</label>
            <input
              type="number"
              placeholder="Enter the value"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={endReading}
              onChange={(e) => setEndReading(e.target.value)}
            />
          </div>

          {/* Reading Photo File Upload */}
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-[10px] font-black text-emerald-800 uppercase">EB Reading Photo</label>
            <div className="relative flex items-center justify-between border border-slate-200 bg-slate-50 rounded-xl px-3 py-2 cursor-pointer hover:bg-slate-100 transition-colors">
              <span className="text-[10px] font-bold text-slate-600 mr-2">Choose File</span>
              <span className="text-[9px] text-slate-400 font-bold truncate max-w-[80px]">
                {ebPhotoName || "No File chosen"}
              </span>
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setEbPhotoName(e.target.files[0].name);
                  }
                }}
              />
            </div>
          </div>

          <div className="space-y-1.5 md:col-span-1">
            <label className="text-[10px] font-black text-emerald-800 uppercase">Total Units</label>
            <input
              type="text"
              readOnly
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-700 cursor-not-allowed focus:outline-none text-center"
              value={endReading ? totalUnits.toFixed(1) : "-"}
            />
          </div>

          <div className="space-y-1.5 md:col-span-1">
            <label className="text-[10px] font-black text-emerald-800 uppercase">Total Amount</label>
            <input
              type="text"
              readOnly
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-700 cursor-not-allowed focus:outline-none text-center"
              value={endReading ? `₹${ebTotalAmount.toLocaleString("en-IN")}` : "-"}
            />
          </div>
        </div>
      </div>

      {/* 4. DAMAGE DETAILS CARD (ORANGE BORDER) */}
      <div className="bg-white rounded-3xl border-2 border-amber-100 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-amber-50">
          <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <AlertTriangle size={16} />
          </div>
          <h2 className="text-sm font-extrabold text-amber-800">Damage Details</h2>
        </div>

        {/* Dynamic Damage Rows */}
        <div className="space-y-4">
          {damageItems.map((item) => (
            <div key={item.id} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4 items-end border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-black text-amber-800 uppercase">Materials</label>
                <select
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  value={item.material}
                  onChange={(e) => handleUpdateItem(item.id, { material: e.target.value })}
                >
                  <option value="Chair">Chair</option>
                  <option value="Table">Table</option>
                  <option value="Light">Light</option>
                  <option value="Fan">Fan</option>
                  <option value="Glass Pane">Glass Pane</option>
                  <option value="Wall Paint">Wall Paint</option>
                </select>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-black text-amber-800 uppercase">No.of Quantity</label>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  value={item.quantity || ""}
                  onChange={(e) => handleUpdateItem(item.id, { quantity: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-black text-amber-800 uppercase">Per material Amt</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  value={item.perMaterialAmt || ""}
                  onChange={(e) => handleUpdateItem(item.id, { perMaterialAmt: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-black text-amber-800 uppercase">Comments</label>
                <input
                  type="text"
                  placeholder="Enter comments..."
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  value={item.comments}
                  onChange={(e) => handleUpdateItem(item.id, { comments: e.target.value })}
                />
              </div>

              {/* Damaged Item Photo Upload */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-black text-amber-800 uppercase">Damaged Item Photo</label>
                <div className="relative flex items-center justify-between border border-slate-200 bg-slate-50 rounded-xl px-3 py-2 cursor-pointer hover:bg-slate-100 transition-colors">
                  <span className="text-[10px] font-bold text-slate-600 mr-2">Choose File</span>
                  <span className="text-[9px] text-slate-400 font-bold truncate max-w-[80px]">
                    {item.photoName || "No File chosen"}
                  </span>
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleUpdateItem(item.id, { photoName: e.target.files[0].name });
                      }
                    }}
                  />
                </div>
              </div>

              <div className="space-y-1.5 md:col-span-1">
                <label className="text-[10px] font-black text-amber-800 uppercase">Total Amount</label>
                <input
                  type="text"
                  readOnly
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-700 cursor-not-allowed focus:outline-none text-center"
                  value={(item.quantity * item.perMaterialAmt).toFixed(1)}
                />
              </div>

              <div className="flex justify-center md:col-span-1">
                <button
                  onClick={() => handleRemoveMaterial(item.id)}
                  disabled={damageItems.length === 1}
                  className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border border-red-100"
                  title="Delete Row"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Material Button */}
        <div className="pt-2">
          <button
            onClick={handleAddMaterial}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-sm hover:shadow active:scale-95 transition-all"
          >
            <Plus size={14} strokeWidth={3} /> Add Material
          </button>
        </div>
      </div>

      {/* 5. BOTTOM SETTLEMENT SUMMARY */}
      <div className="flex justify-end pt-2">
        <div className="flex items-center gap-4 bg-indigo-50/70 border-2 border-indigo-100 rounded-2xl px-6 py-4 shadow-sm min-w-[320px]">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-[#1e3a8a]">
            <CreditCard size={20} className="fill-indigo-600 text-indigo-600" />
          </div>
          <div>
            <span className="text-[10px] font-black text-indigo-500 uppercase leading-none block">Settlement Amount</span>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs font-bold text-slate-700">Total Settlement Amount:</span>
              <span className="text-lg font-black text-[#1e3a8a]">
                {endReading ? `₹${totalSettlementAmount.toLocaleString("en-IN")}` : "--"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. ACTION BUTTONS */}
      <div className="flex justify-center gap-4 pt-6 border-t border-slate-100">
        <button
          onClick={onClose}
          className="px-8 py-3 bg-[#0f172a] hover:bg-[#1e293b] text-white text-sm font-black rounded-xl shadow-sm hover:shadow active:scale-95 transition-all"
        >
          Close
        </button>
        <button
          onClick={handleRaiseBill}
          disabled={!endReading}
          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-black rounded-xl shadow-sm hover:shadow active:scale-95 transition-all"
        >
          Raise Bill
        </button>
      </div>
    </div>
  );
}
