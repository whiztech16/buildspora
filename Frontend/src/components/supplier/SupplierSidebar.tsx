/* eslint-disable react-refresh/only-export-components */
import { useNavigate } from "react-router-dom";
import {
  Home, Package, CreditCard, Bell,
  MessageSquare, Settings, LogOut, Menu, X, ChevronDown, ShoppingCart,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const SUPPLIER_NAV_ITEMS = [
  { id: "dashboard",  label: "Dashboard",  Icon: Home },
  { id: "catalogue",  label: "Catalogue",  Icon: Package },
  { id: "orders",     label: "Orders",     Icon: ShoppingCart },
  { id: "payments",   label: "Payments",   Icon: CreditCard },
  { id: "updates",    label: "Updates",    Icon: Bell },
  { id: "messages",   label: "Messages",   Icon: MessageSquare },
  { id: "settings",   label: "Settings",   Icon: Settings },
];

interface SupplierSidebarProps {
  active: string;
  onNavigate: (id: string) => void;
  desktopOpen: boolean;
  onToggleDesktop: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  userName?: string;
  userInitials?: string;
}

const LOGO = (
  <span className="text-[18px] font-bold tracking-tight select-none whitespace-nowrap">
    <span style={{ color: "#0F172A" }}>Build</span>
    <span style={{ color: "#059669" }} className="font-bold">Spora</span>
  </span>
);

export default function SupplierSidebar({
  active,
  onNavigate,
  desktopOpen,
  onToggleDesktop,
  mobileOpen,
  onCloseMobile,
  userName = "Dangote Cement",
  userInitials = "DC",
}: SupplierSidebarProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  const renderNavItems = (isMobile: boolean = false) => (
    <>
      {SUPPLIER_NAV_ITEMS.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => { onNavigate(id); if (isMobile) onCloseMobile(); }}
            title={!isMobile && !desktopOpen ? label : undefined}
            className={`
              flex items-center rounded-xl font-medium transition-colors cursor-pointer text-left
              ${isMobile
                ? `w-full gap-3 px-3 py-3 text-[14px] ${isActive ? "bg-[#F1F5F9] text-[#0F172A]" : "text-[#0F172A] hover:bg-[#F9FAFB]"}`
                : `text-[13.5px] ${desktopOpen ? "px-3 py-2.5 gap-3 w-full" : "w-[44px] h-[44px] justify-center mx-auto shrink-0"} ${isActive ? "bg-[#F1F5F9] text-[#0F172A]" : "text-[#0F172A] hover:bg-[#F9FAFB]"}`
              }
            `}
          >
            <Icon
              size={18}
              strokeWidth={1.8}
              className={`shrink-0 ${isActive ? "text-[#0F172A]" : "text-[#475569]"}`}
            />
            {(isMobile || desktopOpen) && (
              <span className="whitespace-nowrap overflow-hidden">{label}</span>
            )}
          </button>
        );
      })}
    </>
  );

  const renderUserFooter = (isMobile: boolean = false) => (
    <div className={`border-t border-[#F1F5F9] flex flex-col gap-2 ${isMobile ? "px-3 pb-8 pt-4" : "px-3 pb-6 pt-2"}`}>
      {(isMobile || desktopOpen) ? (
        <div className={`flex items-center ${isMobile ? "gap-3 px-3 mb-2" : "justify-between p-2 rounded-xl hover:bg-[#F9FAFB] cursor-pointer transition-colors mb-2"}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0F172A] text-white flex items-center justify-center text-[14px] font-bold shrink-0">
              {userInitials}
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-bold text-[#0F172A] leading-tight">{userName}</span>
              <span className="text-[12px] text-[#64748B]">Supplier</span>
            </div>
          </div>
          {!isMobile && <ChevronDown size={16} className="text-[#64748B]" />}
        </div>
      ) : (
        <div className="w-10 h-10 rounded-full bg-[#0F172A] text-white flex items-center justify-center text-[14px] font-bold shrink-0 mx-auto mb-2 cursor-pointer">
          {userInitials}
        </div>
      )}

      <button
        onClick={handleLogout}
        title={!isMobile && !desktopOpen ? "Log out" : undefined}
        className={`
          flex items-center rounded-xl text-[13.5px] font-medium
          text-[#0F172A] hover:bg-[#F9FAFB] transition-colors cursor-pointer
          ${isMobile ? "w-full gap-3 px-3 py-3" : desktopOpen ? "px-3 py-2.5 gap-3 w-full" : "w-[44px] h-[44px] justify-center mx-auto shrink-0"}
        `}
      >
        <LogOut size={18} strokeWidth={1.8} className="shrink-0 text-[#475569]" />
        {(isMobile || desktopOpen) && <span className="whitespace-nowrap overflow-hidden">Log out</span>}
      </button>
    </div>
  );

  return (
    <>
      {/* ── DESKTOP SIDEBAR ─────────────────────────────────────── */}
      <aside
        className={`
          hidden md:flex flex-col fixed top-0 left-0 h-[100dvh] bg-white border-r border-[#E5E7EB] z-40
          transition-all duration-300 ease-in-out
          ${desktopOpen ? "w-[240px]" : "w-[68px]"}
        `}
      >
        <div className={`flex items-center h-[72px] shrink-0 ${desktopOpen ? "px-5 justify-between" : "justify-center"}`}>
          {desktopOpen && LOGO}
          <button
            onClick={onToggleDesktop}
            className="p-2 rounded-xl hover:bg-[#F3F4F6] text-[#0F172A] cursor-pointer transition-colors shrink-0"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} strokeWidth={1.8} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-3 py-2 flex-1 overflow-hidden">
          {renderNavItems()}
        </nav>

        {renderUserFooter()}
      </aside>

      {/* ── MOBILE OVERLAY ──────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* ── MOBILE SIDEBAR ──────────────────────────────────────── */}
      <aside
        className={`
          md:hidden fixed top-0 left-0 bottom-0 bg-white border-r border-[#E5E7EB] z-50
          flex flex-col w-[260px] transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between px-5 h-[72px] shrink-0 border-b border-[#F3F4F6]">
          {LOGO}
          <button
            onClick={onCloseMobile}
            className="p-2 -mr-2 rounded-xl hover:bg-[#F3F4F6] text-[#0F172A] cursor-pointer"
          >
            <X size={20} strokeWidth={1.8} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-3 py-4 flex-1 overflow-y-auto">
          {renderNavItems(true)}
        </nav>

        {renderUserFooter(true)}
      </aside>
    </>
  );
}
