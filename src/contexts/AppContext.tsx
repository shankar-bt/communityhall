import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { fetchHalls, HallDetailsApi } from "@/lib/hallsApi";
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
  halls: Hall[];
  loadingHalls: boolean;
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
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loadingHalls, setLoadingHalls] = useState(true);

  useEffect(() => {
    fetchHalls()
      .then((data) => {
        if (data && data.length > 0) {
          const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8062";
          const apiHalls: Hall[] = data.map((d: HallDetailsApi) => {
            const rawImages = d.hallImagesList?.map((img: any) => img.hallImage).filter(Boolean) || [];
            const fullImages = rawImages.map(url => url.startsWith("http") ? url : `${BACKEND_URL}${url.startsWith('/') ? '' : '/'}${url}`);
            const defaultImg = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80";

            return {
              id: String(d.hallId),
              name: d.hallName || "Community Hall",
              image: fullImages.length > 0 ? fullImages[0] : defaultImg,
              rating: 4.5,
              rent: d.fullDayRent || 0,
              halfDayRent: d.halfDayRent || 0,
              deposit: d.depositAmount || 0,
              halfDayDeposit: d.halfDepositAmount || 0,
              zone: d.zone || "",
              division: d.division || "",
              landmark: d.landMark || "",
              capacity: d.seatingCapacity || 500,
              images: fullImages.length > 0 ? fullImages : [defaultImg],
              address: `${d.doorNo ? d.doorNo + ", " : ""}${d.street ? d.street + ", " : ""}${d.area || ""}, ${d.division || ""}, ${d.zone || ""}`,
              totalArea: String(d.hallArea || ""),
              parkingCapacity: String(d.parkingCapacity || ""),
              gstPercentage: d.gst || 18,
              ebChargePerUnit: d.ebCostPerUnit || 10,
              caretakerNumber: String(d.hallInchargeMobno || "")
            };
          });
          setHalls(apiHalls);
        }
      })
      .catch((err) => console.error("Failed to fetch halls", err))
      .finally(() => setLoadingHalls(false));
  }, []);

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
      halls,
      loadingHalls,
    }),
    [theme, lang, fontSize, user, booking, isInitialized, halls, loadingHalls],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const v = useContext(AppCtx);
  if (!v) throw new Error("useApp must be used within AppProvider");
  return v;
}
