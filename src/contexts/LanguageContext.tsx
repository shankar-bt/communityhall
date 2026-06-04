import { createContext, useContext, useState } from "react";
import en from "../locales/en.json";
import ta from "../locales/ta.json";

type TranslationMap = Record<string, string>;

const translations: Record<"en" | "ta", TranslationMap> = {
  en,
  ta,
};

interface LanguageContextType {
  lang: "en" | "ta";
  setLang: (value: "en" | "ta") => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<"en" | "ta">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("lang") as "en" | "ta") || "en";
    }
    return "en";
  });

  const changeLanguage = (value: "en" | "ta") => {
    setLang(value);
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", value);
    }
  };

  const t = (key: string): string => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang: changeLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
