import { useApp } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFontSize } from "@/contexts/FontSizeContext";
import { Building2, LogOut, Menu } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import LanguageSwitch from "./LanguageSwitch";

export function TopBar({
  onLogout,
  onToggleSidebar,
  onLogin,
}: {
  onLogout?: () => void;
  onToggleSidebar?: () => void;
  onLogin?: () => void;
}) {
  const { t } = useLanguage();
  const { user } = useApp();
  const { fontSize, setFontSize } = useFontSize();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] w-full">
        <div className="container mx-auto max-w-7xl flex items-center justify-between px-4 py-3 lg:px-8">
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-1.5 rounded-lg text-[#1e3a8a] hover:bg-slate-50 transition-colors focus:outline-none"
                title="Toggle Sidebar"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}
            <img
              src="/chennai_corporation_emblem.png"
              alt="Chennai Corporation"
              className="h-10 w-10 lg:h-11 lg:w-11 object-contain"
            />
            <div className="leading-tight text-[#1e3a8a]">
              <h1 className="text-[12px] lg:text-[14px] font-bold tracking-tight">{t("gccName")}</h1>
              <p className="text-[10px] lg:text-[11px] font-tamil font-semibold mt-0.5">
                {t("gccTamil")}
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[#1e3a8a] absolute left-1/2 -translate-x-1/2">
            <Building2 className="h-6 w-6 stroke-[2.5]" />
            <h2 className="text-xl font-bold tracking-tight">{t("appName")}</h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex border border-slate-200 rounded-lg overflow-hidden text-[10px] sm:text-[12px] font-bold bg-white shadow-sm">
              <button
                onClick={() => setFontSize("small")}
                className={`px-1.5 sm:px-3 py-1 sm:py-1.5 hover:bg-slate-50 transition ${fontSize === "small" ? "bg-slate-100 text-[#1e3a8a]" : "text-slate-600"}`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize("medium")}
                className={`px-1.5 sm:px-3 py-1 sm:py-1.5 hover:bg-slate-50 transition border-l border-slate-200 ${fontSize === "medium" ? "bg-slate-100 text-[#1e3a8a]" : "text-slate-600"}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize("large")}
                className={`px-1.5 sm:px-3 py-1 sm:py-1.5 hover:bg-slate-50 transition border-l border-slate-200 ${fontSize === "large" ? "bg-slate-100 text-[#1e3a8a]" : "text-slate-600"}`}
              >
                A+
              </button>
            </div>

            <LanguageSwitch />

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <div
                  className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden shadow-sm border border-slate-200">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                      alt="User"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="hidden sm:block leading-tight text-left">
                    <p className="text-[13px] font-bold text-[#1e293b]">{user.name}</p>
                    <p className="text-[11px] font-semibold text-slate-400 capitalize">{user.role || "Citizen"}</p>
                  </div>
                </div>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-50">
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      onClick={() => {
                        setShowDropdown(false);
                        setShowLogoutModal(true);
                      }}
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="px-4 py-1.5 sm:py-2 bg-[#1e3a8a] text-white rounded-lg text-[12px] sm:text-sm font-semibold hover:bg-[#1e3a8a]/90 transition shadow-sm"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Confirm Logout</h3>
            <p className="text-slate-600 text-sm mb-6">Are you sure you want to log out of your account?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  if (onLogout) onLogout();
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
