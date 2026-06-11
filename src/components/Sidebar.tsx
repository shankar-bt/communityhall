import { useApp } from "@/contexts/AppContext";
import { useLocation, useRouter, Link } from "@tanstack/react-router";
import {
  Building2,
  ClipboardList,
  MapPin,
  Calculator,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useEffect, useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { booking, halls } = useApp();
  const location = useLocation();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const hallId = booking.hall?.id || halls[0]?.id || "1";
  const pathname = location.pathname;

  // Navigation Items
  const navItems = [
    {
      id: "hall-booking",
      label: "Hall Booking",
      path: `/halls/${hallId}`,
      icon: Building2,
      isActive: (path: string) =>
        path.startsWith("/halls/") &&
        !path.endsWith("/calculator") &&
        !path.endsWith("/book"),
    },
    {
      id: "booking-details",
      label: "Booking Details",
      path: `/halls/${hallId}/book`,
      icon: ClipboardList,
      isActive: (path: string) => path.endsWith("/book"),
    },
    {
      id: "halls-list",
      label: "Community Hall List",
      path: "/",
      icon: MapPin,
      isActive: (path: string) => path === "/",
    },
    {
      id: "calculate-rent",
      label: "Calculate Rent Amount",
      path: `/halls/${hallId}/calculator`,
      icon: Calculator,
      isActive: (path: string) => path.endsWith("/calculator"),
    },
  ];

  // Close sidebar on path change (useful on mobile)
  useEffect(() => {
    onClose();
  }, [pathname]);

  const handleToggle = () => {
    if (window.innerWidth < 768) {
      onClose();
    } else {
      setIsCollapsed((prev) => !prev);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-40 md:z-30 shrink-0 flex flex-col bg-white/30 backdrop-blur-md border-r border-white/20 transition-all duration-300 h-[calc(100vh-68px)] pt-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${isCollapsed ? "w-80 md:w-20" : "w-80"}`}
      >
        {/* Sidebar Header */}
        <div
          className={`bg-[#1e3a8a] text-white px-5 py-4 flex items-center shadow-md transition-all duration-300 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!isCollapsed && (
            <div className="flex items-center gap-2.5 animate-in fade-in duration-300 whitespace-nowrap">
              <Building2 className="h-5 w-5 text-white" />
              <span className="font-extrabold tracking-wide text-sm md:text-base">
                COMMUNITY HALL
              </span>
            </div>
          )}

          {/* Toggle / Close Button */}
          <button
            onClick={handleToggle}
            className="bg-white rounded-full p-1.5 flex items-center justify-center shadow-sm cursor-pointer hover:bg-slate-50 transition-colors focus:outline-none shrink-0 animate-in fade-in duration-300"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-[#1e3a8a] stroke-[3]" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-[#1e3a8a] stroke-[3]" />
            )}
          </button>
        </div>

        {/* Navigation Items List */}
        <nav className="p-4 flex flex-col gap-3.5 overflow-y-auto flex-1">
          {navItems.map((item) => {
            const active = item.isActive(pathname);
            const IconComponent = item.icon;

            return (
              <Link
                key={item.id}
                to={item.path}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center rounded-xl transition-all border ${
                  isCollapsed ? "justify-center p-3" : "justify-between p-3.5"
                } ${
                  active
                    ? "bg-[#e0f2fe] border-blue-200/50 text-[#1e3a8a] font-bold shadow-sm"
                    : "bg-white/60 hover:bg-white/80 border-white/40 text-slate-700 font-semibold hover:border-slate-100 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Icon Container */}
                  <div
                    className={`p-2 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                      active
                        ? "bg-[#1e3a8a] text-white shadow-sm"
                        : "bg-[#e0f2fe]/60 text-[#1e3a8a]"
                    }`}
                  >
                    <IconComponent className="h-5 w-5 stroke-[2.2]" />
                  </div>
                  {/* Text Label */}
                  {!isCollapsed && (
                    <span className="text-[13px] md:text-[14px] whitespace-nowrap animate-in fade-in duration-300">
                      {item.label}
                    </span>
                  )}
                </div>

                {/* Right Arrow */}
                {!isCollapsed && (
                  <ChevronRight
                    className={`h-4 w-4 stroke-[2.5] transition-colors shrink-0 ${
                      active ? "text-[#1e3a8a]" : "text-slate-400"
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
