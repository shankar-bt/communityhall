import { useApp } from "@/contexts/AppContext";
import { Globe, Building2 } from "lucide-react";

export function TopBar({ onLogout }: { onLogout?: () => void }) {
  const { user, t, lang, setLang } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
      <div className="container mx-auto max-w-7xl flex items-center justify-between px-4 py-3 lg:px-8">

        {/* Left: Logo and App Name */}
        <div className="flex items-center gap-3">
          <img src="/chennai_corporation_emblem.png" alt="Chennai Corporation" className="h-10 w-10 lg:h-11 lg:w-11 object-contain" />
          <div className="leading-tight text-[#1e3a8a]">
            <h1 className="text-[12px] lg:text-[14px] font-bold tracking-tight">{t("gccName")}</h1>
            <p className="text-[10px] lg:text-[11px] font-tamil font-semibold mt-0.5">{t("gccTamil")}</p>
          </div>
        </div>

        {/* Center: Title */}
        <div className="hidden md:flex items-center gap-2 text-[#1e3a8a] absolute left-1/2 -translate-x-1/2">
          <Building2 className="h-6 w-6 stroke-[2.5]" />
          <h2 className="text-xl font-bold tracking-tight">{t("appName")}</h2>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLang(lang === "en" ? "ta" : "en")}
            className="flex items-center gap-2 bg-[#2a3c5a] text-white px-3.5 py-2 rounded-[0.5rem] text-[13px] font-semibold hover:bg-[#1f2d43] transition-colors"
          >
            <Globe className="h-4 w-4" /> {lang === "en" ? "தமிழ்" : "English"}
          </button>

          {user ? (
            <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition" onClick={onLogout}>
              <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden shadow-sm border border-slate-200">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="User" className="h-full w-full object-cover" />
              </div>
              <div className="hidden sm:block leading-tight text-left">
                <p className="text-[13px] font-bold text-[#1e293b]">{user.name}</p>
                <p className="text-[11px] font-semibold text-slate-400">Citizen ID-001</p>
              </div>
            </div>
          ) : null}
        </div>

      </div>
    </header>
  );
}
