import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Check,
  Calendar,
  FileText,
  Trash2,
  Upload,
  CreditCard,
  Smartphone,
  Building2,
  CheckCircle2,
  Download,
  Printer,
  User,
  MapPin,
  Grid,
  CalendarDays,
  Clock,
  ArrowRight,
  RotateCcw,
  ArrowLeft,
  Phone,
  Mail,
  FileUp,
  Image as ImageIcon,
  Banknote,
  ShieldCheck,
  Users,
  IndianRupee,
  Tag,
  Wallet,
  Percent,
  ArrowUpCircle,
} from "lucide-react";
import { toast } from "sonner";

const STEPS = [1, 2, 3, 4, 5] as const;

const getTodayString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export function BookingWizard({ onExit }: { onExit: () => void }) {
  const { t, user, booking, setBooking } = useApp();
  const [step, setStep] = useState(1);
  const [showAck, setShowAck] = useState(false);

  const hall = booking.hall!;
  const calc = booking.calc!;

  const next = () => setStep((s) => Math.min(5, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className="min-h-full bg-gradient-to-br from-orange-50/40 via-white to-blue-50/40 pb-20 pt-8">
      <div className="container mx-auto px-4 max-w-5xl animate-in fade-in duration-300">
        <ProgressBar step={step} />

        {step === 1 && <Step1 onNext={next} />}
        {step === 2 && <Step2 onNext={next} onBack={back} />}
        {step === 3 && (
          <Step3
            onNext={() => {
              setBooking((b) => ({ ...b, txnId: "TXN" + Date.now().toString().slice(-8) }));
              next();
            }}
            onBack={back}
          />
        )}
        {step === 4 && (
          <Step4
            onNext={() => {
              toast.success("Payment Successful");
              next();
            }}
            onBack={back}
          />
        )}
        {step === 5 &&
          (showAck ? (
            <Acknowledgment onExit={onExit} />
          ) : (
            <Step5Success onView={() => setShowAck(true)} onExit={onExit} />
          ))}
      </div>
    </div>
  );

  function ProgressBar({ step }: { step: number }) {
    return (
      <div className="mb-10 w-full max-w-3xl mx-auto">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-300 -z-10"></div>
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#0f172a] -z-10 transition-all duration-300"
            style={{ width: `${(step - 1) * 25}%` }}
          ></div>
          {STEPS.map((n) => {
            const done = n < step,
              current = n === step;
            return (
              <div
                key={n}
                className={`grid place-items-center h-10 w-10 rounded-full text-sm font-bold transition-all z-10 ${done ? "bg-[#0f172a] text-white" : current ? "bg-[#0f172a] text-white shadow-lg shadow-blue-900/20" : "bg-slate-300 text-slate-500"}`}
              >
                {n}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function HeaderBanner() {
    return (
      <div className="bg-[#1e3a8a] text-white rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-800/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="flex items-center gap-4 flex-1">
          <div className="bg-blue-100/80 p-3 rounded-lg text-blue-900">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-300 uppercase">Hall Name</div>
            <div className="font-bold text-white text-base">{hall.name}</div>
          </div>
        </div>
        <div className="hidden sm:block w-px h-12 bg-blue-700/50"></div>
        <div className="flex items-center gap-4 flex-1 justify-center">
          <div className="bg-blue-100/80 p-2.5 rounded-lg text-blue-900">
            <MapPin className="h-5 w-5" />
          </div>
          <div className="font-bold text-blue-50 text-sm">Zone : {hall.zone}</div>
        </div>
        <div className="hidden sm:block w-px h-12 bg-blue-700/50"></div>
        <div className="flex items-center gap-4 flex-1 justify-end pr-4">
          <div className="bg-blue-100/80 p-2.5 rounded-lg text-blue-900">
            <Grid className="h-5 w-5" />
          </div>
          <div className="font-bold text-blue-50 text-sm">Division : {hall.division}</div>
        </div>
      </div>
    );
  }

  function UserBanner() {
    return (
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 sm:gap-12 mb-8 shadow-sm">
        <div className="flex items-center gap-3 flex-1 pl-4">
          <div className="bg-blue-50 p-3 rounded-full text-blue-800 border border-blue-100">
            <User className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Name</div>
            <div className="font-bold text-[#0f172a] text-lg">{user?.name || "Moulidharan"}</div>
          </div>
        </div>
        <div className="hidden sm:block w-px h-12 bg-slate-200"></div>
        <div className="flex items-center gap-3 flex-1 justify-center">
          <div className="bg-blue-50 p-3 rounded-full text-blue-800 border border-blue-100">
            <Phone className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Mobile Number</div>
            <div className="font-bold text-[#0f172a] text-base">
              {user?.contact || "9867578933"}
            </div>
          </div>
        </div>
        <div className="hidden sm:block w-px h-12 bg-slate-200"></div>
        <div className="flex items-center gap-3 flex-1 justify-end pr-8">
          <div className="bg-blue-50 p-3 rounded-full text-blue-800 border border-blue-100">
            <Users className="h-5 w-5" />
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold text-slate-500">User Type</div>
            <div className="font-bold text-[#0f172a] text-base">{user?.role || "Public"}</div>
          </div>
        </div>
      </div>
    );
  }

  function Step1({ onNext }: { onNext: () => void }) {
    const todayStr = getTodayString();
    const [func, setFunc] = useState(booking.functionary);
    const [reason, setReason] = useState(booking.bookingReason || booking.reason || "Marriage");
    const [from, setFrom] = useState(booking.fromDate || todayStr);
    const [to, setTo] = useState(booking.toDate || todayStr);
    const [start, setStart] = useState(booking.startPeriod || "Morning (6:00 AM)");
    const [end, setEnd] = useState(booking.endPeriod || "Morning (2:00 PM)");

    const submit = () => {
      if (!func || !reason) return toast.error("Fill all required fields");
      setBooking((b) => ({
        ...b,
        functionary: func,
        bookingReason: reason,
        fromDate: from,
        toDate: to,
        startPeriod: start,
        endPeriod: end,
      }));
      onNext();
    };

    return (
      <div className="space-y-6">
        <HeaderBanner />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-700 font-bold">
                  <User className="h-4 w-4 text-blue-500 bg-blue-100 p-0.5 rounded-full" />{" "}
                  Relationship of the Functionary
                </Label>
                <Select value={func} onValueChange={setFunc}>
                  <SelectTrigger className="bg-white py-6 border-slate-200">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Self", "Family", "Organization", "Government Body"].map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-700 font-bold">
                  <User className="h-4 w-4 text-blue-500 bg-blue-100 p-0.5 rounded-full" /> Reason
                  For Booking
                </Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger className="bg-white py-6 border-slate-200">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Marriage", "Meeting", "Exhibition", "Family Function", "Other"].map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-700 font-bold">
                  <CalendarDays className="h-4 w-4 text-blue-500 bg-blue-100 p-0.5 rounded-full" />{" "}
                  Start Date
                </Label>
                <div className="relative w-full">
                  <Input
                    type="date"
                    value={from}
                    min={todayStr}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFrom(val);
                      if (to < val) {
                        setTo(val);
                      }
                    }}
                    className="bg-white py-6 border-slate-200 pr-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:w-6 [&::-webkit-calendar-picker-indicator]:h-6 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-700 font-bold">
                  <CalendarDays className="h-4 w-4 text-blue-500 bg-blue-100 p-0.5 rounded-full" />{" "}
                  End Date
                </Label>
                <div className="relative w-full">
                  <Input
                    type="date"
                    value={to}
                    min={from || todayStr}
                    onChange={(e) => setTo(e.target.value)}
                    className="bg-white py-6 border-slate-200 pr-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:w-6 [&::-webkit-calendar-picker-indicator]:h-6 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-700 font-bold">
                  <Clock className="h-4 w-4 text-blue-500 bg-blue-100 p-0.5 rounded-full" /> Start
                  Period
                </Label>
                <Select value={start} onValueChange={setStart}>
                  <SelectTrigger className="bg-white py-6 border-slate-200">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Morning (6:00 AM)">Morning (6:00 AM)</SelectItem>
                    <SelectItem value="Evening (2:00 PM)">Evening (2:00 PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-700 font-bold">
                  <Clock className="h-4 w-4 text-blue-500 bg-blue-100 p-0.5 rounded-full" /> End
                  Period
                </Label>
                <Select value={end} onValueChange={setEnd}>
                  <SelectTrigger className="bg-white py-6 border-slate-200">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Morning (2:00 PM)">Morning (2:00 PM)</SelectItem>
                    <SelectItem value="Evening (10:00 PM)">Evening (10:00 PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card className="p-4 border-slate-200 bg-white/60 shadow-sm flex items-center justify-between mt-4">
              <div>
                <Label className="flex items-center gap-2 text-slate-800 font-bold mb-2">
                  <FileText className="h-4 w-4 text-blue-600 bg-blue-100 p-0.5 rounded-sm" />{" "}
                  Selected Slots
                </Label>
                <div className="text-sm text-slate-700 pl-6">
                  {from} ({start.toLowerCase()}) to {to} ({end.toLowerCase()})
                </div>
              </div>
              <div className="bg-blue-200 text-blue-800 font-bold text-xs px-3 py-1 rounded-sm">
                1 Day
              </div>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card className="p-5 bg-white/80 border-slate-200 shadow-sm rounded-xl">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
                <Building2 className="h-5 w-5 text-[#0f172a]" /> Booking Summary
              </h3>
              <p className="text-xs text-slate-500 mb-6 font-medium">
                You have selected the following slots
              </p>

              <Card className="p-5 border border-slate-100 bg-white shadow-sm rounded-lg text-center space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">From</div>
                    <div className="font-bold text-slate-800 text-sm mt-1">{from}</div>
                    <div className="text-[10px] text-slate-500 mt-1">Afternoon(02:00 PM)</div>
                  </div>
                  <div className="bg-blue-50 p-2 rounded-full text-blue-500">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">To</div>
                    <div className="font-bold text-slate-800 text-sm mt-1">{to}</div>
                    <div className="text-[10px] text-slate-500 mt-1">Evening(10:00 PM)</div>
                  </div>
                </div>
                <div className="h-px bg-slate-200 w-full"></div>
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-800 text-sm">Total Duration</div>
                  <div className="bg-blue-200 text-blue-800 font-bold text-xs px-3 py-1 rounded-sm">
                    1 Day
                  </div>
                </div>
              </Card>
            </Card>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12">
          <Button
            variant="outline"
            className="bg-white px-6 py-6 rounded-lg shadow-sm font-semibold text-slate-700 border-slate-200 w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Previous
          </Button>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Button
              variant="outline"
              className="bg-red-50 text-red-500 border-red-100 hover:bg-red-100 px-8 py-6 rounded-lg shadow-sm font-semibold flex-1 sm:flex-none"
            >
              <RotateCcw className="h-4 w-4 mr-2" /> Reset
            </Button>
            <Button
              onClick={submit}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-200 px-10 py-6 rounded-lg shadow-sm font-semibold flex-1 sm:flex-none"
            >
              Next <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  function Step2({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
    const [type, setType] = useState("");
    const [name, setName] = useState("");
    const [fileName, setFileName] = useState("");

    const add = () => {
      if (!type || !name || !fileName) return toast.error("Fill all fields");
      setBooking((b) => ({
        ...b,
        docs: [...b.docs, { id: crypto.randomUUID(), type, name, fileName }],
      }));
      setType("");
      setName("");
      setFileName("");
      toast.success("Document added");
    };

    return (
      <div className="space-y-6">
        <HeaderBanner />

        <div className="bg-blue-50/40 border border-blue-100 rounded-xl p-5 space-y-5 shadow-sm">
          <div className="space-y-2 max-w-sm">
            <Label className="flex items-center gap-2 text-slate-700 font-bold">
              <User className="h-4 w-4 text-blue-500 bg-blue-100 p-0.5 rounded-full" /> Upload
              Document for Booking
            </Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="bg-white py-6 border-slate-200">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {["Aadhar", "PAN", "Address Proof", "NOC", "Other"].map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 items-end mt-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-slate-700 font-bold">
              <User className="h-4 w-4 text-blue-500 bg-blue-100 p-0.5 rounded-full" /> Name
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="bg-white py-6 border-slate-200"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label className="flex items-center gap-2 text-slate-700 font-bold">
              <FileUp className="h-4 w-4 text-blue-500 bg-blue-100 p-0.5 rounded-full" /> Photo/Doc
            </Label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full flex items-center bg-white border border-slate-200 rounded-md overflow-hidden">
                <div className="bg-blue-100 text-blue-700 px-4 py-3 text-sm font-semibold border-r border-slate-200 whitespace-nowrap">
                  Choose file
                </div>
                <div className="px-4 py-3 text-sm text-slate-600 flex-1 truncate">
                  {fileName || "No file chosen"}
                </div>
                <ImageIcon className="h-4 w-4 text-slate-400 mr-4" />
                <input
                  type="file"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <Button
                onClick={add}
                variant="outline"
                className="border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 w-full sm:w-auto h-[46px] px-8"
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        {booking.docs.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            {booking.docs.map((d) => (
              <div key={d.id} className="flex flex-col gap-3">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-slate-700 font-bold">
                    <User className="h-4 w-4 text-blue-500 bg-blue-100 p-0.5 rounded-full" /> Name
                  </Label>
                  <Input
                    value={d.name}
                    readOnly
                    className="bg-white text-slate-700 py-6 border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-slate-700 font-bold">
                    <FileUp className="h-4 w-4 text-blue-500 bg-blue-100 p-0.5 rounded-full" />{" "}
                    Photo/Doc
                  </Label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1 flex items-center bg-white border border-slate-200 rounded-md overflow-hidden">
                      <div className="bg-blue-100 text-blue-700 px-4 py-3 text-sm font-semibold border-r border-slate-200 whitespace-nowrap">
                        Choose file
                      </div>
                      <div className="px-4 py-3 text-sm text-slate-600 flex-1 truncate">
                        {d.fileName}
                      </div>
                      <ImageIcon className="h-4 w-4 text-slate-400 mr-4" />
                    </div>
                    <Button
                      onClick={() =>
                        setBooking((b) => ({ ...b, docs: b.docs.filter((x) => x.id !== d.id) }))
                      }
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12">
          <Button
            variant="outline"
            onClick={onBack}
            className="bg-white px-6 py-6 rounded-lg shadow-sm font-semibold text-slate-700 border-slate-200 w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Previous
          </Button>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Button
              variant="outline"
              className="bg-red-50 text-red-500 border-red-100 hover:bg-red-100 px-8 py-6 rounded-lg shadow-sm font-semibold flex-1 sm:flex-none"
            >
              <RotateCcw className="h-4 w-4 mr-2" /> Reset
            </Button>
            <Button
              onClick={onNext}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-200 px-10 py-6 rounded-lg shadow-sm font-semibold flex-1 sm:flex-none"
              disabled={booking.docs.length === 0}
            >
              Next <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  function Step3({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
    return (
      <div className="space-y-6">
        <UserBanner />

        <div className="grid md:grid-cols-2 gap-6 items-start">
          <Card className="p-6 bg-white/80 border-slate-200 shadow-sm rounded-xl">
            <h3 className="font-bold text-slate-800 flex items-center gap-3 mb-6">
              <CalendarDays className="h-8 w-8 text-blue-900 bg-blue-100 p-2 rounded-lg" /> Booking
              Details
            </h3>

            <div className="space-y-4">
              <Field2
                icon={<Building2 className="h-4 w-4 text-slate-400" />}
                label="Hall Name"
                value={hall.name}
              />
              <div className="h-px bg-slate-100"></div>
              <Field2
                icon={<CalendarDays className="h-4 w-4 text-slate-400" />}
                label="No.of.Days"
                value={String(booking.numDays)}
              />
              <div className="h-px bg-slate-100"></div>
              <Field2
                icon={<CalendarDays className="h-4 w-4 text-slate-400" />}
                label="Start Date"
                value={booking.fromDate}
              />
              <div className="h-px bg-slate-100"></div>
              <Field2
                icon={<CalendarDays className="h-4 w-4 text-slate-400" />}
                label="End Date"
                value={booking.toDate}
              />
              <div className="h-px bg-slate-100"></div>
              <Field2
                icon={<Clock className="h-4 w-4 text-slate-400" />}
                label="Starting Slot and Ending Slot"
                value={`${booking.startPeriod.split(" ")[0]} to ${booking.endPeriod.split(" ")[0]}`}
              />
              <div className="h-px bg-slate-100"></div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-blue-50/50 p-3 rounded-lg border border-blue-100 mt-4">
                <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap">
                  <FileText className="h-4 w-4" /> Uploaded Documents
                </div>
                <div className="flex items-center gap-2 flex-1 overflow-x-auto w-full">
                  {booking.docs.map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center gap-1.5 bg-white border border-slate-200 rounded px-2 py-1 flex-shrink-0"
                    >
                      <ImageIcon className="h-3 w-3 text-orange-500" />
                      <span className="text-[10px] text-slate-600 truncate max-w-[60px]">
                        {d.fileName}
                      </span>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-[10px] h-7 px-3 border-blue-200 shrink-0"
                >
                  View All <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/80 border-slate-200 shadow-sm rounded-xl">
            <h3 className="font-bold text-slate-800 flex items-center gap-3 mb-6">
              <CreditCard className="h-8 w-8 text-blue-900 bg-blue-100 p-2 rounded-lg" /> Payment
              Details
            </h3>

            <div className="space-y-4">
              <Field2
                icon={
                  <FileText className="h-4 w-4 text-slate-400 bg-slate-200 rounded-full p-0.5" />
                }
                label="Reason for Booking"
                value={booking.reason}
              />
              <div className="h-px bg-slate-100"></div>
              <Field2
                icon={
                  <Percent className="h-4 w-4 text-slate-400 bg-slate-200 rounded-full p-0.5" />
                }
                label="Hall Amount"
                value={`₹${calc.hallAmount.toLocaleString()}`}
              />
              <div className="h-px bg-slate-100"></div>
              <Field2
                icon={
                  <Percent className="h-4 w-4 text-slate-400 bg-slate-800 text-white rounded-full p-0.5" />
                }
                label="Discount"
                value={`${calc.discount === 0 ? "0%" : "₹" + calc.discount}`}
              />
              <div className="h-px bg-slate-100"></div>
              <Field2
                icon={
                  <IndianRupee className="h-4 w-4 text-slate-400 bg-slate-200 rounded-full p-0.5" />
                }
                label="Net Amount"
                value={`₹${calc.netAmount.toLocaleString()}`}
              />
              <div className="h-px bg-slate-100"></div>
              <Field2
                icon={
                  <IndianRupee className="h-4 w-4 text-slate-400 bg-slate-200 rounded-full p-0.5" />
                }
                label="GST Amount"
                value={`₹${calc.gst.toLocaleString()}`}
              />
              <div className="h-px bg-slate-100"></div>
              <Field2
                icon={
                  <IndianRupee className="h-4 w-4 text-slate-400 bg-slate-200 rounded-full p-0.5" />
                }
                label="Deposit Amount"
                value={`₹${calc.deposit.toLocaleString()}`}
              />

              <div className="bg-blue-100/50 p-4 rounded-xl flex justify-between items-center mt-6">
                <div className="flex items-center gap-2 font-bold text-blue-900">
                  <div className="bg-white p-1.5 rounded-full border border-blue-200">
                    <Banknote className="h-4 w-4 text-blue-600" />
                  </div>{" "}
                  Total Amount
                </div>
                <div className="font-bold text-lg text-slate-800">
                  ₹{calc.total.toLocaleString()}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="bg-white/60 backdrop-blur-md p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 shadow-sm">
          <label className="flex items-center gap-3 cursor-pointer pl-2 w-full sm:w-auto">
            <Checkbox
              checked={booking.agreed}
              onCheckedChange={(v) => setBooking((b) => ({ ...b, agreed: !!v }))}
              className="h-6 w-6 rounded bg-white border-slate-300"
            />
            <span className="text-sm font-medium text-slate-700">
              I agree to the{" "}
              <span className="text-blue-600 hover:underline">Terms and conditions</span>
            </span>
          </label>
          <div className="flex gap-4 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={onBack}
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 font-bold px-8 py-6 rounded-lg w-full sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Previous
            </Button>
            <Button
              onClick={onNext}
              disabled={!booking.agreed}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-6 rounded-lg shadow-md w-full sm:w-auto"
            >
              <ShieldCheck className="h-5 w-5 mr-2" /> Confirm Payment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  function Step4({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
    const [method, setMethod] = useState<"netbanking" | "upi" | "card">("netbanking");
    const [card, setCard] = useState(booking.payment.card);

    const pay = () => {
      setBooking((b) => ({ ...b, payment: { method, card } }));
      onNext();
    };

    return (
      <div className="space-y-6">
        <UserBanner />

        <div className="grid md:grid-cols-2 gap-6 items-start">
          <Card className="p-6 bg-white/80 border-slate-200 shadow-sm rounded-xl">
            <h3 className="font-bold text-blue-900 flex items-center gap-3 mb-6 text-lg">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Emblem_of_Chennai_Corporation.png"
                alt="GCC"
                className="h-10 w-auto opacity-80"
              />
              Payment Details
            </h3>

            <div className="space-y-4">
              <Field2
                icon={
                  <Percent className="h-4 w-4 text-slate-400 bg-slate-200 rounded-full p-0.5" />
                }
                label="Hall Amount"
                value={`₹${calc.hallAmount.toLocaleString()}`}
              />
              <div className="h-px bg-slate-100"></div>
              <Field2
                icon={
                  <Percent className="h-4 w-4 text-slate-400 bg-slate-800 text-white rounded-full p-0.5" />
                }
                label="Discount"
                value={`${calc.discount === 0 ? "0%" : "₹" + calc.discount}`}
              />
              <div className="h-px bg-slate-100"></div>
              <Field2
                icon={
                  <IndianRupee className="h-4 w-4 text-slate-400 bg-slate-200 rounded-full p-0.5" />
                }
                label="Net Amount"
                value={`₹${calc.netAmount.toLocaleString()}`}
              />
              <div className="h-px bg-slate-100"></div>
              <Field2
                icon={
                  <IndianRupee className="h-4 w-4 text-slate-400 bg-slate-200 rounded-full p-0.5" />
                }
                label="GST Amount"
                value={`₹${calc.gst.toLocaleString()}`}
              />
              <div className="h-px bg-slate-100"></div>
              <Field2
                icon={
                  <IndianRupee className="h-4 w-4 text-slate-400 bg-slate-200 rounded-full p-0.5" />
                }
                label="Deposit Amount"
                value={`₹${calc.deposit.toLocaleString()}`}
              />

              <div className="bg-blue-100/50 p-4 rounded-xl flex justify-between items-center mt-6">
                <div className="flex items-center gap-2 font-bold text-blue-900">
                  <div className="bg-white p-1.5 rounded-full border border-blue-200">
                    <Banknote className="h-4 w-4 text-blue-600" />
                  </div>{" "}
                  Total Amount
                </div>
                <div className="font-bold text-lg text-slate-800">
                  ₹{calc.total.toLocaleString()}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/80 border-slate-200 shadow-sm rounded-xl">
            <h3 className="font-bold text-slate-800 flex items-center gap-3 mb-6 text-lg">
              <CreditCard className="h-8 w-8 text-blue-900 bg-blue-100 p-2 rounded-lg" /> Payment
            </h3>

            <div className="space-y-6">
              <div>
                <Label className="text-slate-700 font-bold mb-3 block">Payment Method</Label>
                <div className="grid grid-cols-2 bg-white rounded-lg border border-slate-200 overflow-hidden text-sm font-semibold">
                  <button
                    onClick={() => setMethod("netbanking")}
                    className={`py-3 text-center transition-colors ${method === "netbanking" ? "bg-green-100 text-green-700 border-b-2 border-green-500" : "text-slate-500 hover:bg-slate-50"}`}
                  >
                    Net Banking
                  </button>
                  <button
                    onClick={() => setMethod("upi")}
                    className={`py-3 text-center transition-colors ${method === "upi" ? "bg-green-100 text-green-700 border-b-2 border-green-500" : "text-slate-500 hover:bg-slate-50 border-l border-slate-200"}`}
                  >
                    UPI
                  </button>
                </div>
              </div>

              {method === "netbanking" && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex gap-2 mb-2">
                    <div className="h-8 w-12 bg-[#1a1f36] rounded flex items-center justify-center text-white text-[10px] font-bold italic tracking-wider">
                      VISA
                    </div>
                    <div className="h-8 w-12 bg-white border border-slate-200 rounded flex items-center justify-center relative overflow-hidden">
                      <div className="absolute w-5 h-5 rounded-full bg-[#eb001b] -left-0.5 opacity-90 mix-blend-multiply"></div>
                      <div className="absolute w-5 h-5 rounded-full bg-[#f79e1b] -right-0.5 opacity-90 mix-blend-multiply"></div>
                    </div>
                    <div className="h-8 w-12 bg-white border border-slate-200 rounded flex items-center justify-center relative overflow-hidden">
                      <div className="absolute w-5 h-5 rounded-full bg-[#eb001b] left-1 opacity-90 mix-blend-multiply"></div>
                      <div className="absolute w-5 h-5 rounded-full bg-[#005197] right-1 opacity-90 mix-blend-multiply"></div>
                    </div>
                  </div>
                  <Input
                    placeholder="Enter your Card Number"
                    value={card.number}
                    onChange={(e) => setCard({ ...card, number: e.target.value })}
                    className="bg-white py-6 border-slate-200"
                  />
                  <Input
                    placeholder="Name on Card"
                    value={card.name}
                    onChange={(e) => setCard({ ...card, name: e.target.value })}
                    className="bg-white py-6 border-slate-200"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="CVV"
                      type="password"
                      maxLength={4}
                      value={card.cvv}
                      onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                      className="bg-white py-6 border-slate-200"
                    />
                    <Input
                      placeholder="MM/YY"
                      maxLength={5}
                      value={card.expiry}
                      onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                      className="bg-white py-6 border-slate-200"
                    />
                  </div>
                </div>
              )}
              {method === "upi" && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <Input
                    placeholder="Enter UPI ID (e.g. name@upi)"
                    defaultValue="user@okhdfc"
                    className="bg-white py-6 border-slate-200"
                  />
                </div>
              )}

              <Button
                onClick={pay}
                className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-6 rounded-lg text-base shadow-md mt-6"
              >
                <CheckCircle2 className="h-5 w-5 mr-2" /> Pay Now
              </Button>
            </div>
          </Card>
        </div>

        <div className="bg-green-50/80 border border-green-100 rounded-xl p-5 flex flex-col sm:flex-row items-center gap-4 mt-8 shadow-sm">
          <div className="bg-green-500 p-2.5 rounded-full text-white">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="text-green-700 font-bold text-sm">Secure Payment</div>
            <div className="text-slate-500 text-xs font-medium">
              Your payment details are encrypted and safe with us
            </div>
          </div>
        </div>
      </div>
    );
  }

  function Step5Success({ onView, onExit }: { onView: () => void; onExit: () => void }) {
    return (
      <div className="space-y-6 animate-in zoom-in-95 duration-500">
        <div className="bg-gradient-to-r from-orange-50 to-green-50 border border-green-100 rounded-xl p-6 flex items-center justify-center gap-4 relative overflow-hidden shadow-sm">
          <div className="absolute left-0 bottom-0 top-0 w-32 flex items-end">
            <span className="text-4xl ml-8 mb-2">🎉</span>
          </div>
          <CheckCircle2 className="h-8 w-8 text-green-600" />
          <h2 className="text-2xl font-bold text-slate-800">Payment Successful</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          <Card className="p-6 bg-white/80 border-slate-200 shadow-sm rounded-xl">
            <h3 className="font-bold text-blue-900 flex items-center gap-3 mb-6 text-lg">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Emblem_of_Chennai_Corporation.png"
                alt="GCC"
                className="h-10 w-auto opacity-80"
              />
              Payment Details
            </h3>

            <div className="space-y-4">
              <Field2
                icon={
                  <Percent className="h-4 w-4 text-slate-400 bg-slate-200 rounded-full p-0.5" />
                }
                label="Hall Amount"
                value={`₹${calc.hallAmount.toLocaleString()}`}
              />
              <div className="h-px bg-slate-100"></div>
              <Field2
                icon={
                  <Percent className="h-4 w-4 text-slate-400 bg-slate-800 text-white rounded-full p-0.5" />
                }
                label="Discount"
                value={`${calc.discount === 0 ? "0%" : "₹" + calc.discount}`}
              />
              <div className="h-px bg-slate-100"></div>
              <Field2
                icon={
                  <IndianRupee className="h-4 w-4 text-slate-400 bg-slate-200 rounded-full p-0.5" />
                }
                label="Net Amount"
                value={`₹${calc.netAmount.toLocaleString()}`}
              />
              <div className="h-px bg-slate-100"></div>
              <Field2
                icon={
                  <IndianRupee className="h-4 w-4 text-slate-400 bg-slate-200 rounded-full p-0.5" />
                }
                label="GST Amount"
                value={`₹${calc.gst.toLocaleString()}`}
              />
              <div className="h-px bg-slate-100"></div>
              <Field2
                icon={
                  <IndianRupee className="h-4 w-4 text-slate-400 bg-slate-200 rounded-full p-0.5" />
                }
                label="Deposit Amount"
                value={`₹${calc.deposit.toLocaleString()}`}
              />

              <div className="bg-green-50 p-4 rounded-xl flex justify-between items-center mt-6 border border-green-100">
                <div className="flex items-center gap-2 font-bold text-green-700">
                  <div className="bg-white p-1.5 rounded-full border border-green-200">
                    <Banknote className="h-4 w-4 text-green-600" />
                  </div>{" "}
                  Total Amount
                </div>
                <div className="font-bold text-lg text-slate-800">
                  ₹{calc.total.toLocaleString()}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/80 border-slate-200 shadow-sm rounded-xl h-full flex flex-col">
            <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-8 text-lg border-b border-blue-900 pb-2 inline-block">
              Payer Details
            </h3>

            <div className="space-y-6 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-slate-600 font-semibold">
                  <User className="h-8 w-8 p-1.5 bg-slate-200 rounded-full text-slate-500" /> User
                  Name
                </div>
                <div className="font-medium text-slate-800 text-sm">
                  {user?.name || "Moulidharan"}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-slate-600 font-semibold">
                  <Phone className="h-8 w-8 p-1.5 bg-slate-200 rounded-full text-slate-500" />{" "}
                  Mobile Number
                </div>
                <div className="font-medium text-slate-800 text-sm">
                  {user?.contact || "9867578933"}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-slate-600 font-semibold">
                  <Mail className="h-8 w-8 p-1.5 bg-slate-200 rounded-full text-slate-500" /> Mail
                  ID
                </div>
                <div className="font-medium text-slate-800 text-sm">mouli123@gmail.com</div>
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <Button
                onClick={onView}
                className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white font-bold py-6 px-10 rounded-lg shadow-md w-full"
              >
                <ShieldCheck className="h-5 w-5 mr-2" /> View Acknowledgment
              </Button>
            </div>
          </Card>
        </div>

        <div className="bg-green-50/80 border border-green-100 rounded-xl p-5 flex flex-col sm:flex-row items-center gap-4 mt-8 shadow-sm">
          <div className="bg-green-500 p-2.5 rounded-full text-white">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="text-green-700 font-bold text-sm">Secure Payment</div>
            <div className="text-slate-500 text-xs font-medium">
              Your payment details are encrypted and safe with us
            </div>
          </div>
        </div>
      </div>
    );
  }

  function Acknowledgment({ onExit }: { onExit: () => void }) {
    const print = () => window.print();
    return (
      <Card className="p-8 space-y-5 print:shadow-none print:border-0 bg-white/90 backdrop-blur-md shadow-lg rounded-2xl border-slate-200">
        <div className="flex items-center justify-between border-b pb-6 border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{t("ackCopy")}</h2>
            <p className="text-sm text-slate-500 mt-1">{t("gov")}</p>
          </div>
          <div className="bg-green-100 text-green-700 font-bold px-6 py-2 rounded-lg border border-green-200 shadow-sm text-lg tracking-wider">
            PAID
          </div>
        </div>

        <Section title="Transaction Details">
          <Field label={t("txnId")} value={booking.txnId} />
          <Field label="Date" value={new Date().toLocaleString()} />
          <Field label="Method" value={booking.payment.method.toUpperCase()} />
          <Field label={t("totalAmount")} value={`₹${calc.total.toLocaleString()}`} highlight />
        </Section>

        <Section title="Hall Details">
          <Field label="Hall" value={hall.name} />
          <Field label={t("zone")} value={hall.zone} />
          <Field label={t("division")} value={hall.division} />
          <Field label={t("capacity")} value={String(hall.capacity)} />
        </Section>

        <Section title="Booking Slot">
          <Field label={t("fromDate")} value={booking.fromDate} />
          <Field label={t("toDate")} value={booking.toDate} />
          <Field label="Time" value={`${booking.startPeriod} – ${booking.endPeriod}`} />
          <Field label={t("reason")} value={booking.bookingReason} />
        </Section>

        <Section title="Payer">
          <Field label={t("username")} value={user?.name || "-"} />
          <Field label={t("mailId")} value={user?.contact || "-"} />
        </Section>

        <div className="flex flex-wrap gap-4 justify-end print:hidden mt-10">
          <Button
            variant="outline"
            onClick={onExit}
            className="font-bold text-slate-700 border-slate-300 py-6 px-8 rounded-xl shadow-sm"
          >
            Close
          </Button>
          <Button
            variant="outline"
            onClick={print}
            className="font-bold text-slate-700 border-slate-300 py-6 px-8 rounded-xl shadow-sm"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button
            onClick={print}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-8 rounded-xl shadow-md"
          >
            <Download className="h-5 w-5 mr-2" />
            {t("downloadPdf")}
          </Button>
        </div>
      </Card>
    );
  }
}

function Field({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between gap-3 text-sm py-3 border-b border-slate-100 last:border-0">
      <span className="text-slate-500 font-medium">{label}</span>
      <span
        className={`font-semibold text-right ${highlight ? "text-blue-700 text-lg" : "text-slate-800"}`}
      >
        {value}
      </span>
    </div>
  );
}

function Field2({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-3 text-slate-500 font-medium">
        {icon} {label}
      </div>
      <div className="font-semibold text-slate-800">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 p-6 bg-slate-50/50 shadow-sm">
      <h3 className="text-base font-bold mb-5 text-blue-900 border-b border-slate-200 pb-3">
        {title}
      </h3>
      <div className="grid sm:grid-cols-2 gap-x-12 gap-y-2">{children}</div>
    </div>
  );
}
