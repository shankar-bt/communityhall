import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, FileText, Trash2, Upload, CreditCard, Smartphone, Building, CheckCircle2, Download, Printer } from "lucide-react";
import { toast } from "sonner";

const STEPS = ["s1", "s2", "s3", "s4", "s5"] as const;

export function BookingWizard({ onExit }: { onExit: () => void }) {
  const { t, user, booking, setBooking } = useApp();
  const [step, setStep] = useState(1);
  const [showAck, setShowAck] = useState(false);

  const hall = booking.hall!;
  const calc = booking.calc!;

  const next = () => setStep(s => Math.min(5, s + 1));
  const back = () => setStep(s => Math.max(1, s - 1));

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl animate-in fade-in duration-300">
      <ProgressBar step={step} />

      {step === 1 && <Step1 onNext={next} />}
      {step === 2 && <Step2 onNext={next} onBack={back} />}
      {step === 3 && <Step3 onNext={() => { setBooking(b => ({...b, txnId: "TXN" + Date.now().toString().slice(-8)})); next(); }} onBack={back} />}
      {step === 4 && <Step4 onNext={() => { toast.success("Payment Successful"); next(); }} onBack={back} />}
      {step === 5 && (
        showAck
          ? <Acknowledgment onExit={onExit} />
          : <Step5Success onView={() => setShowAck(true)} onExit={onExit} />
      )}
    </div>
  );

  function ProgressBar({ step }: { step: number }) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((k, i) => {
            const n = i + 1;
            const done = n < step, current = n === step;
            return (
              <div key={k} className="flex-1 flex items-center">
                <div className={`grid place-items-center h-9 w-9 rounded-full text-sm font-semibold shrink-0 transition-all ${done ? "bg-success text-success-foreground" : current ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : "bg-muted text-muted-foreground"}`}>
                  {done ? <Check className="h-4 w-4" /> : n}
                </div>
                {i < STEPS.length - 1 && <div className={`h-1 flex-1 mx-1 rounded transition-colors ${n < step ? "bg-success" : "bg-muted"}`} />}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          {STEPS.map((k, i) => <span key={k} className={`flex-1 text-center ${i + 1 === step ? "text-foreground font-medium" : ""}`}>{t(k)}</span>)}
        </div>
      </div>
    );
  }

  function Step1({ onNext }: { onNext: () => void }) {
    const [func, setFunc] = useState(booking.functionary);
    const [reason, setReason] = useState(booking.bookingReason || booking.reason);
    const [from, setFrom] = useState(booking.fromDate || new Date().toISOString().slice(0,10));
    const [to, setTo] = useState(booking.toDate || new Date().toISOString().slice(0,10));
    const [start, setStart] = useState(booking.startPeriod);
    const [end, setEnd] = useState(booking.endPeriod);

    const submit = () => {
      if (!func || !reason) return toast.error("Fill all required fields");
      setBooking(b => ({...b, functionary: func, bookingReason: reason, fromDate: from, toDate: to, startPeriod: start, endPeriod: end}));
      onNext();
    };

    return (
      <Card className="p-6 space-y-5">
        <h2 className="text-xl font-bold">{t("s1")}</h2>
        <div className="grid sm:grid-cols-3 gap-3 rounded-md bg-muted p-3">
          <Field label="Hall Name" value={hall.name} />
          <Field label={t("zone")} value={hall.zone} />
          <Field label={t("division")} value={hall.division} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1 sm:col-span-2"><Label>{t("functionary")}</Label>
            <Select value={func} onValueChange={setFunc}>
              <SelectTrigger><SelectValue placeholder="Select relationship" /></SelectTrigger>
              <SelectContent>
                {["Self","Family","Organization","Government Body"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1 sm:col-span-2"><Label>{t("bookingReason")}</Label><Textarea rows={2} value={reason} onChange={e => setReason(e.target.value)} /></div>
          <div className="space-y-1"><Label>{t("fromDate")}</Label><Input type="date" value={from} onChange={e => setFrom(e.target.value)} /></div>
          <div className="space-y-1"><Label>{t("toDate")}</Label><Input type="date" value={to} onChange={e => setTo(e.target.value)} /></div>
          <div className="space-y-1"><Label>{t("startPeriod")}</Label><Input type="time" value={start} onChange={e => setStart(e.target.value)} /></div>
          <div className="space-y-1"><Label>{t("endPeriod")}</Label><Input type="time" value={end} onChange={e => setEnd(e.target.value)} /></div>
        </div>
        <Badge variant="secondary" className="text-sm p-2 rounded-md w-full justify-start sm:w-auto">
          {t("bookingSummary")}: {booking.numDays} day(s) • {start} – {end}
        </Badge>
        <div className="flex justify-end"><Button onClick={submit}>{t("next")}</Button></div>
      </Card>
    );
  }

  function Step2({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
    const [type, setType] = useState("");
    const [name, setName] = useState("");
    const [fileName, setFileName] = useState("");

    const add = () => {
      if (!type || !name || !fileName) return toast.error("Fill all fields");
      setBooking(b => ({...b, docs: [...b.docs, { id: crypto.randomUUID(), type, name, fileName }]}));
      setType(""); setName(""); setFileName("");
      toast.success("Document added");
    };
    const remove = (id: string) => setBooking(b => ({...b, docs: b.docs.filter(d => d.id !== id)}));

    return (
      <Card className="p-6 space-y-5">
        <h2 className="text-xl font-bold">{t("s2")}</h2>
        <div className="grid sm:grid-cols-4 gap-3 items-end">
          <div className="space-y-1"><Label>{t("docType")}</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {["Aadhar","PAN","Address Proof","NOC","Other"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1"><Label>{t("docName")}</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
          <div className="space-y-1"><Label>{t("chooseFile")}</Label><Input type="file" onChange={e => setFileName(e.target.files?.[0]?.name || "")} /></div>
          <Button onClick={add}><Upload className="h-4 w-4 mr-1" />{t("upload")}</Button>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">{t("uploadedDocs")} ({booking.docs.length})</h3>
          <div className="space-y-2">
            {booking.docs.length === 0 && <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>}
            {booking.docs.map(d => (
              <div key={d.id} className="flex items-center gap-3 p-3 rounded-md border bg-card">
                <FileText className="h-5 w-5 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{d.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{d.type} • {d.fileName}</p>
                </div>
                <Button size="icon" variant="ghost" onClick={() => remove(d.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between"><Button variant="outline" onClick={onBack}>{t("back")}</Button><Button onClick={onNext} disabled={booking.docs.length === 0}>{t("next")}</Button></div>
      </Card>
    );
  }

  function Step3({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
    return (
      <Card className="p-6 space-y-5">
        <h2 className="text-xl font-bold">{t("s3")}</h2>

        <Section title="User Details">
          <Field label={t("username")} value={user?.name || "-"} />
          <Field label={t("mailId")} value={user?.contact || "-"} />
          <Field label={t("role")} value={user?.role || "-"} />
        </Section>

        <Section title="Booking Schedule">
          <Field label="Hall" value={hall.name} />
          <Field label={t("zone")} value={hall.zone} />
          <Field label="Dates" value={`${booking.fromDate} → ${booking.toDate}`} />
          <Field label="Slot" value={`${booking.startPeriod} – ${booking.endPeriod}`} />
        </Section>

        <Section title="Payment Breakdown">
          <Field label={t("netAmount")} value={`₹${calc.netAmount.toLocaleString()}`} />
          <Field label={t("gst")} value={`₹${calc.gst.toLocaleString()}`} />
          <Field label={t("depositAmt")} value={`₹${calc.deposit.toLocaleString()}`} />
          <Field label={t("totalAmount")} value={`₹${calc.total.toLocaleString()}`} highlight />
        </Section>

        {booking.docs.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-2">{t("uploadedDocs")}</h3>
            <div className="flex flex-wrap gap-2">
              {booking.docs.map(d => (
                <div key={d.id} className="flex items-center gap-2 p-2 rounded-md border bg-muted/40 min-w-[140px]">
                  <div className="h-10 w-10 rounded grid place-items-center bg-primary/10 text-primary"><FileText className="h-5 w-5" /></div>
                  <div className="min-w-0"><p className="text-xs font-medium truncate">{d.name}</p><p className="text-[10px] text-muted-foreground">{d.type}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}

        <label className="flex items-center gap-2 p-3 rounded-md border bg-muted/30 cursor-pointer">
          <Checkbox checked={booking.agreed} onCheckedChange={v => setBooking(b => ({...b, agreed: !!v}))} />
          <span className="text-sm">{t("agree")}</span>
        </label>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>{t("back")}</Button>
          <Button onClick={onNext} disabled={!booking.agreed}>{t("confirmPayment")}</Button>
        </div>
      </Card>
    );
  }

  function Step4({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
    const [method, setMethod] = useState<"netbanking"|"upi"|"card">(booking.payment.method);
    const [card, setCard] = useState(booking.payment.card);

    const pay = () => {
      if (method === "card") {
        if (card.number.replace(/\s/g,"").length < 12 || !card.name || !card.expiry || card.cvv.length < 3)
          return toast.error("Enter valid card details");
      }
      setBooking(b => ({...b, payment: { method, card }}));
      onNext();
    };

    const tabs = [
      { id: "netbanking", label: t("netBanking"), icon: Building },
      { id: "upi", label: t("upi"), icon: Smartphone },
      { id: "card", label: t("card"), icon: CreditCard },
    ] as const;

    return (
      <Card className="p-6 space-y-5">
        <h2 className="text-xl font-bold">{t("s4")}</h2>
        <div className="rounded-md bg-primary/10 p-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{t("totalAmount")}</span>
          <span className="text-2xl font-bold text-primary">₹{calc.total.toLocaleString()}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-md bg-muted p-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setMethod(id)} className={`flex items-center justify-center gap-2 py-2.5 rounded text-sm font-medium transition-all ${method === id ? "bg-card shadow text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              <Icon className="h-4 w-4" />{label}
            </button>
          ))}
        </div>

        {method === "card" && (
          <div className="grid sm:grid-cols-2 gap-3 animate-in fade-in duration-200">
            <div className="space-y-1 sm:col-span-2"><Label>{t("cardNumber")}</Label><Input maxLength={19} placeholder="1234 5678 9012 3456" value={card.number} onChange={e => setCard({...card, number: e.target.value})} /></div>
            <div className="space-y-1 sm:col-span-2"><Label>{t("cardName")}</Label><Input value={card.name} onChange={e => setCard({...card, name: e.target.value})} /></div>
            <div className="space-y-1"><Label>{t("expiry")}</Label><Input placeholder="MM/YY" maxLength={5} value={card.expiry} onChange={e => setCard({...card, expiry: e.target.value})} /></div>
            <div className="space-y-1"><Label>{t("cvv")}</Label><Input type="password" maxLength={4} value={card.cvv} onChange={e => setCard({...card, cvv: e.target.value.replace(/\D/g,"")})} /></div>
          </div>
        )}
        {method === "upi" && (
          <div className="space-y-1 animate-in fade-in duration-200">
            <Label>UPI ID</Label><Input placeholder="name@upi" defaultValue="user@okhdfc" />
          </div>
        )}
        {method === "netbanking" && (
          <div className="space-y-1 animate-in fade-in duration-200">
            <Label>Select Bank</Label>
            <Select defaultValue="sbi"><SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["sbi","hdfc","icici","axis"].map(b => <SelectItem key={b} value={b}>{b.toUpperCase()}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>{t("back")}</Button>
          <Button onClick={pay} className="bg-success hover:bg-success/90 text-success-foreground">{t("payNow")} ₹{calc.total.toLocaleString()}</Button>
        </div>
      </Card>
    );
  }

  function Step5Success({ onView, onExit }: { onView: () => void; onExit: () => void }) {
    return (
      <Card className="p-8 text-center space-y-5 animate-in zoom-in-95 duration-500">
        <div className="mx-auto grid place-items-center h-20 w-20 rounded-full bg-success/15 text-success">
          <CheckCircle2 className="h-12 w-12" />
        </div>
        <div className="rounded-md bg-success text-success-foreground py-3 px-4 font-semibold">{t("paySuccess")}</div>
        <div className="text-left max-w-md mx-auto space-y-2">
          <Field label="Payer" value={user?.name || "-"} />
          <Field label={t("mailId")} value={user?.contact || "-"} />
          <Field label={t("txnId")} value={booking.txnId} />
          <Field label={t("totalAmount")} value={`₹${calc.total.toLocaleString()}`} highlight />
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          <Button onClick={onView}>{t("viewAck")}</Button>
          <Button variant="outline" onClick={onExit}>Done</Button>
        </div>
      </Card>
    );
  }

  function Acknowledgment({ onExit }: { onExit: () => void }) {
    const print = () => window.print();
    return (
      <Card className="p-8 space-y-5 print:shadow-none print:border-0">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-2xl font-bold">{t("ackCopy")}</h2>
            <p className="text-xs text-muted-foreground">{t("gov")}</p>
          </div>
          <Badge className="bg-success text-success-foreground">PAID</Badge>
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

        <div className="flex flex-wrap gap-2 justify-end print:hidden">
          <Button variant="outline" onClick={onExit}>Close</Button>
          <Button variant="outline" onClick={print}><Printer className="h-4 w-4 mr-1" />Print</Button>
          <Button onClick={print}><Download className="h-4 w-4 mr-1" />{t("downloadPdf")}</Button>
        </div>
      </Card>
    );
  }
}

function Field({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between gap-3 text-sm py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium text-right ${highlight ? "text-primary font-bold" : ""}`}>{value}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border p-4">
      <h3 className="text-sm font-semibold mb-2 text-primary">{title}</h3>
      <div className="grid sm:grid-cols-2 gap-x-6">{children}</div>
    </div>
  );
}
