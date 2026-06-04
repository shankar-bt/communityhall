import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { dict, type Lang, type TKey } from "@/lib/i18n";
import { useLanguage } from "./LanguageContext";

type Theme = "light" | "dark";
type FontSize = "small" | "default" | "large";

export interface Hall {
  id: string;
  name: string;
  image: string;
  rating: number;
  rent: number;
  halfDayRent: number;
  deposit: number;
  halfDayDeposit: number;
  zone: string;
  division: string;
  landmark: string;
  capacity: number;
  images: string[];
  address: string;
  totalArea: string;
  parkingCapacity: string;
  gstPercentage: number;
  ebChargePerUnit: number;
  caretakerNumber: string;
}

export interface UploadedDoc {
  id: string;
  type: string;
  name: string;
  fileName: string;
}

export interface BookingState {
  hall: Hall | null;
  reason: string;
  numDays: number;
  startPeriod: string;
  endPeriod: string;
  calc: null | {
    hallAmount: number;
    discount: number;
    netAmount: number;
    gst: number;
    deposit: number;
    total: number;
  };
  functionary: string;
  bookingReason: string;
  fromDate: string;
  toDate: string;
  docs: UploadedDoc[];
  agreed: boolean;
  payment: {
    method: "card" | "upi" | "netbanking";
    card: { number: string; name: string; expiry: string; cvv: string };
  };
  txnId: string;
}

interface User {
  name: string;
  contact: string;
  role: string;
}

interface Ctx {
  theme: Theme;
  setTheme: (t: Theme) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  fontSize: FontSize;
  setFontSize: (f: FontSize) => void;
  t: (k: TKey) => string;
  user: User | null;
  setUser: (u: User | null) => void;
  booking: BookingState;
  setBooking: React.Dispatch<React.SetStateAction<BookingState>>;
  isInitialized: boolean;
}

const AppCtx = createContext<Ctx | null>(null);

const initialBooking: BookingState = {
  hall: null,
  reason: "Marriage",
  numDays: 1,
  startPeriod: "Morning (6:00 AM)",
  endPeriod: "Morning (2:00 PM)",
  calc: null,
  functionary: "",
  bookingReason: "",
  fromDate: "",
  toDate: "",
  docs: [],
  agreed: false,
  payment: { method: "card", card: { number: "", name: "", expiry: "", cvv: "" } },
  txnId: "",
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const { lang, setLang } = useLanguage();
  const [fontSize, setFontSize] = useState<FontSize>("default");

  const [user, setUser] = useState<User | null>(null);
  const [booking, setBooking] = useState<BookingState>(initialBooking);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage once on mount (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      const savedBooking = localStorage.getItem("booking");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("Failed to parse saved user", e);
        }
      }
      if (savedBooking) {
        try {
          setBooking(JSON.parse(savedBooking));
        } catch (e) {
          console.error("Failed to parse saved booking", e);
        }
      }
    }
    setIsInitialized(true);
  }, []);

  // Write changes to localStorage, but only after initialization
  useEffect(() => {
    if (!isInitialized) return;
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem("booking", JSON.stringify(booking));
  }, [booking, isInitialized]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const size = fontSize === "small" ? "14px" : fontSize === "large" ? "18px" : "16px";
    document.documentElement.style.setProperty("--app-font-size", size);
  }, [fontSize]);

  const value = useMemo<Ctx>(
    () => ({
      theme,
      setTheme,
      lang,
      setLang,
      fontSize,
      setFontSize,
      t: (k) => dict[lang][k] ?? dict.en[k],
      user,
      setUser,
      booking,
      setBooking,
      isInitialized,
    }),
    [theme, lang, fontSize, user, booking, isInitialized],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const v = useContext(AppCtx);
  if (!v) throw new Error("useApp must be used within AppProvider");
  return v;
}
