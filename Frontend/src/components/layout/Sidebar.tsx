import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Home, Flag, CreditCard, ShoppingBag, Users,
  FileText, Truck, User, Settings, LogOut, Menu, X
} from "lucide-react";

const NAV_ITEMS = [
  { id: "projects",    label: "Projects",    Icon: Home },
  { id: "milestones",  label: "Milestones",  Icon: Flag },
  { id: "payments",    label: "Payments",    Icon: CreditCard },
  { id: "marketplace", label: "Marketplace", Icon: ShoppingBag },
  { id: "talents",     label: "Talents",     Icon: Users },
  { id: "updates",     label: "Updates",     Icon: FileText },
  { id: "suppliers",   label: "Suppliers",   Icon: Truck },
  { id: "team",        label: "Team",        Icon: User },
  { id: "settings",    label: "Settings",    Icon: Settings },
];

interface ClientSidebarProps {
  active: string;
  setActive: (id: string) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  desktopOpen: boolean;
  setDesktopOpen: (open: boolean) => void;
}

export default function ClientSidebar({
  active,
  setActive,
  mobileOpen,
  setMobileOpen,
  desktopOpen,
  setDesktopOpen
}: ClientSidebarProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  const handleNavClick = (tabId: string) => {
    setActive(tabId);
    if (tabId === "projects") {
      navigate(`/dashboard/client`);
    } else {
      // Navigate to the dashboard and pass the tabId in state
      navigate(`/dashboard/client`, { state: { activeTab: tabId } });
    }
  };

  return (
    <>
      {/* ══ DESKTOP SIDEBAR ═════════════════════════════════════════ */}
      <aside
        className={`
          hidden md:flex flex-col fixed top-0 left-0 h-screen bg-white border-r border-[#E5E7EB] z-40
          transition-all duration-300 ease-in-out
          ${desktopOpen ? "w-[240px]" : "w-[68px]"}
        `}
      >
        <div className={`flex items-center h-[72px] shrink-0 ${desktopOpen ? "px-5 justify-between" : "justify-center"}`}>
          {desktopOpen && (
            <span className="text-[18px] font-bold tracking-tight select-none whitespace-nowrap overflow-hidden">
              <span style={{ color: "#0F172A" }}>Build</span>
              <span style={{ color: "#059669" }} className="font-bold">Spora</span>
            </span>
          )}
          <button
            onClick={() => setDesktopOpen(!desktopOpen)}
            className="p-2 rounded-xl hover:bg-[#F3F4F6] text-[#0F172A] cursor-pointer transition-colors shrink-0"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} strokeWidth={1.8} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-3 py-2 flex-1 overflow-hidden">
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => handleNavClick(id)}
                title={!desktopOpen ? label : undefined}
                className={`
                  flex items-center rounded-xl text-[13.5px] font-medium
                  transition-colors cursor-pointer text-left
                  ${desktopOpen ? "px-3 py-2.5 gap-3 w-full" : "w-[44px] h-[44px] justify-center mx-auto shrink-0"}
                  ${isActive ? "bg-[#F3F4F6] text-[#0F172A]" : "text-[#0F172A] hover:bg-[#F9FAFB]"}
                `}
              >
                <Icon size={18} strokeWidth={1.8} color="#0F172A" className="shrink-0" />
                {desktopOpen && <span className="whitespace-nowrap overflow-hidden">{label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="px-3 pb-6 pt-2">
          <button
            onClick={handleLogout}
            title={!desktopOpen ? "Log out" : undefined}
            className={`
              flex items-center rounded-xl text-[13.5px] font-medium
              text-[#0F172A] hover:bg-[#F9FAFB] transition-colors cursor-pointer
              ${desktopOpen ? "px-3 py-2.5 gap-3 w-full" : "w-[44px] h-[44px] justify-center mx-auto shrink-0"}
            `}
          >
            <LogOut size={18} strokeWidth={1.8} color="#0F172A" className="shrink-0" />
            {desktopOpen && <span className="whitespace-nowrap overflow-hidden">Log out</span>}
          </button>
        </div>
      </aside>

      {/* ══ MOBILE SIDEBAR ══════════════════════════════════════════ */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`
          md:hidden fixed top-0 left-0 h-screen bg-white border-r border-[#E5E7EB] z-50
          flex flex-col w-[260px] transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between px-5 h-[72px] shrink-0 border-b border-[#F3F4F6]">
          <span className="text-[18px] font-bold tracking-tight select-none">
            <span style={{ color: "#0F172A" }}>Build</span>
            <span style={{ color: "#059669" }} className="font-bold">Spora</span>
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 -mr-2 rounded-xl hover:bg-[#F3F4F6] text-[#0F172A] cursor-pointer"
          >
            <X size={20} strokeWidth={1.8} />
          </button>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex flex-col gap-1 px-3 py-4">
            {NAV_ITEMS.map(({ id, label, Icon }) => {
              const isActive = active === id;
              return (
                <button
                key={id}
                onClick={() => { handleNavClick(id); setMobileOpen(false); }}
                className={`
                    w-full flex items-center gap-3 px-3 py-3 rounded-xl
                    text-[14px] font-medium transition-colors cursor-pointer text-left
                    ${isActive ? "bg-[#F3F4F6] text-[#0F172A]" : "text-[#0F172A] hover:bg-[#F9FAFB]"}
                  `}
                >
                  <Icon size={18} strokeWidth={1.8} color="#0F172A" className="shrink-0" />
                  {label}
                </button>
              );
            })}
          </nav>
          <div className="px-3 pb-6 mt-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[14px] font-medium text-[#0F172A] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
            >
              <LogOut size={18} strokeWidth={1.8} color="#0F172A" className="shrink-0" />
              Log out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
