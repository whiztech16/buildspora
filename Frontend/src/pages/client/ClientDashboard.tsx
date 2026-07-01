import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import {
  Home, Flag, CreditCard, ShoppingBag, Users,
  FileText, Truck, User, Settings, LogOut,
  Plus, Lightbulb, Menu, X,
} from "lucide-react";
import CreateProjectModal from "../../components/client/CreateProjectModal";
import PaymentsEmpty from "./PaymentsScreen";
import MilestonesTab from "./MilestoneDetail";
import Marketplace from "./MarketplacePage";
import Talents from "./TalentsPage";
import SettingsPage from "./SettingsPage";
import UpdatesPage from "./UpdatesPage";

const FONT = "'Inter', sans-serif";

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

export default function DashboardEmpty() {
  const [active, setActive] = useState(() => {
    return localStorage.getItem('buildspora_active_tab') || "projects";
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [devPopulated, setDevPopulated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.activeTab) {
      setTimeout(() => setActive(location.state.activeTab), 0);
    }
  }, [location.state]);

  useEffect(() => {
    localStorage.setItem('buildspora_active_tab', active);
  }, [active]);

  const desktopMarginClass = desktopOpen ? "md:ml-[240px]" : "md:ml-[68px]";

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: FONT }}>

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
              <span style={{ color: "#059669" }}>Spora</span>
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
                onClick={() => setActive(id)}
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
            onClick={() => navigate("/")}
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
          md:hidden fixed top-0 left-0 bottom-0 bg-white border-r border-[#E5E7EB] z-50
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
        <nav className="flex flex-col gap-1 px-3 py-4 flex-1 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => { setActive(id); setMobileOpen(false); }}
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
        <div className="px-3 pb-8">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[14px] font-medium text-[#0F172A] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
          >
            <LogOut size={18} strokeWidth={1.8} color="#0F172A" className="shrink-0" />
            Log out
          </button>
        </div>
      </aside>

      {/* ══ MAIN CONTENT ════════════════════════════════════════════ */}
      <main className={`min-h-screen bg-white transition-all duration-300 ease-in-out flex flex-col ${desktopMarginClass}`}>
        
        {/* Mobile Top Bar (only visible on small screens) */}
        <div className="md:hidden flex items-center justify-between px-4 sm:px-6 h-[64px] border-b border-[#F3F4F6] shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 -ml-2 rounded-xl hover:bg-[#F3F4F6] text-[#0F172A] cursor-pointer"
            >
              <Menu size={20} strokeWidth={1.8} />
            </button>
            <span className="text-[18px] font-bold tracking-tight select-none">
              <span style={{ color: "#0F172A" }}>Build</span>
              <span style={{ color: "#059669" }}>Spora</span>
            </span>
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="px-4 sm:px-6 md:px-10 pt-10 pb-16 sm:pt-16 sm:pb-24 max-w-[1000px] mx-auto w-full flex-1">
          
          {/* DEV STATE TOGGLE (TEMP) */}
          <div className="flex items-center gap-2 mb-6 justify-end opacity-30 hover:opacity-100 transition-opacity">
            <button 
              onClick={() => setDevPopulated(false)}
              disabled={!devPopulated}
              className={`p-1.5 rounded-full transition-colors ${!devPopulated ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
              title="Previous State (Empty)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button 
              onClick={() => setDevPopulated(true)}
              disabled={devPopulated}
              className={`p-1.5 rounded-full transition-colors ${devPopulated ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
              title="Next State (Populated)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>

          {active === 'payments' ? (
            <PaymentsEmpty />
          ) : active === 'milestones' ? (
            <>
              <div className="flex items-center justify-between mb-8 sm:mb-10">
                <h1 className="text-[22px] sm:text-[26px] md:text-[28px] font-bold tracking-tight text-[#0F172A] leading-tight">
                  Milestones
                </h1>
              </div>
              <MilestonesTab hasContractor={devPopulated} />
            </>
          ) : active === 'marketplace' ? (
            <Marketplace />
          ) : active === 'talents' ? (
            <Talents />
          ) : active === 'settings' ? (
            <SettingsPage />
          ) : active === 'updates' ? (
            <UpdatesPage />
          ) : active !== 'projects' ? (
            <>
              {/* Generic Empty State for Other Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 sm:mb-10 gap-4">
                <div>
                  <h1 className="text-[22px] sm:text-[26px] md:text-[28px] font-bold tracking-tight text-[#0F172A] leading-tight capitalize">
                    {active}
                  </h1>
                  <p className="text-[13px] sm:text-[14px] md:text-[15px] text-[#6B7280] mt-1.5">
                    Manage your {active} across all projects.
                  </p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex self-end sm:self-auto w-fit items-center gap-1.5 bg-[#059669] text-white text-[13px] font-semibold px-4 py-2.5 rounded-full hover:bg-[#047857] transition-colors cursor-pointer shrink-0"
                >
                  <Plus size={14} strokeWidth={2.5} />
                  <span className="hidden sm:inline">New Project</span>
                  <span className="sm:hidden">New</span>
                </button>
              </div>

              <div className="border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 md:p-10 mb-6">
                <div className="flex flex-col items-center justify-center py-8 sm:py-10">
                  <div className="w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] rounded-full bg-[#F5F5F5] flex items-center justify-center mb-5">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path d="M3 21V9.5L12 3l9 6.5V21H14v-7h-4v7H3z" stroke="#0F172A" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="text-[15px] sm:text-[17px] font-semibold text-[#0F172A] mb-2.5 capitalize">You don't have any {active} yet</h3>
                  <p className="text-[13px] sm:text-[14px] text-[#6B7280] mb-6 text-center max-w-[340px] sm:max-w-[400px] leading-relaxed">
                    Create your first project to unlock this feature and start managing your {active}.
                  </p>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-[#059669] text-white text-[13px] sm:text-[14px] font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-[#047857] transition-colors cursor-pointer"
                  >
                    <Plus size={14} strokeWidth={2.5} />
                    Create Your First Project
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 sm:mb-10 gap-4">
                <div>
                  <h1 className="text-[22px] sm:text-[26px] md:text-[28px] font-bold tracking-tight text-[#0F172A] leading-tight">
                    Welcome to Build<span style={{ color: "#059669" }}>Spora!</span>
                  </h1>
                  <p className="text-[13px] sm:text-[14px] md:text-[15px] text-[#6B7280] mt-1.5">
                    Let's get your construction project up and running.
                  </p>
                </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex self-end sm:self-auto w-fit items-center gap-1.5 bg-[#059669] text-white text-[13px] font-semibold px-4 py-2.5 rounded-full hover:bg-[#047857] transition-colors cursor-pointer shrink-0"
            >
              <Plus size={14} strokeWidth={2.5} />
              <span className="hidden sm:inline">New Project</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>

          {/* Your Projects */}
          <div className={`border border-[#E5E7EB] rounded-2xl ${devPopulated ? 'p-0 border-none' : 'p-6 sm:p-8 md:p-10'} mb-6`}>
            {!devPopulated ? (
              <>
                <h2 className="text-[15px] sm:text-[16px] font-semibold text-[#0F172A] mb-6">Your Projects</h2>
                <div className="flex flex-col items-center justify-center py-8 sm:py-10">
                  <div className="w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] rounded-full bg-[#F5F5F5] flex items-center justify-center mb-5">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path d="M3 21V9.5L12 3l9 6.5V21H14v-7h-4v7H3z" stroke="#0F172A" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="text-[15px] sm:text-[17px] font-semibold text-[#0F172A] mb-2.5">You don't have any projects yet</h3>
                  <p className="text-[13px] sm:text-[14px] text-[#6B7280] mb-6 text-center max-w-[340px] sm:max-w-[400px] leading-relaxed">
                    Create your first project to start managing milestones, payments, and your team.
                  </p>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-[#059669] text-white text-[13px] sm:text-[14px] font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-[#047857] transition-colors cursor-pointer"
                  >
                    <Plus size={14} strokeWidth={2.5} />
                    Create Your First Project
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[16px] sm:text-[18px] font-bold text-[#0F172A]">Active Projects</h2>
                  <a href="#" className="text-[#059669] text-[13.5px] font-semibold hover:underline">View All</a>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Mock Populated Project Card */}
                  <div 
                    onClick={() => navigate('/dashboard/client/project/1')}
                    className="group border border-gray-200 rounded-[20px] overflow-hidden hover:border-[#16A34A]/30 hover:shadow-lg transition-all cursor-pointer bg-white"
                  >
                    <div className="h-[140px] bg-gray-100 relative overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[12px] font-bold text-[#0F172A] shadow-sm">
                        Victoria Island
                      </div>
                      <div className="absolute top-4 right-4 bg-[#DCFCE7] px-2.5 py-1 rounded-full text-[11px] font-bold text-[#16A34A] shadow-sm">
                        Active
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-[#0F172A] text-[16px] mb-1">Luxury Duplex Build</h3>
                      <p className="text-[13px] text-gray-500 mb-4 flex items-center gap-1">
                        <Flag size={12} /> 2 of 8 milestones completed
                      </p>
                      
                      <div className="flex-1 h-[6px] bg-[#F1F5F9] rounded-full overflow-hidden mb-4">
                        <div className="h-full bg-[#16A34A] rounded-full" style={{ width: '25%' }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-[12px] font-medium text-gray-500">Total Value</span>
                        <span className="text-[14px] font-bold text-[#0F172A]">₦25,000,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bottom grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">

            {/* Getting Started */}
            <div className="border border-[#E5E7EB] rounded-2xl p-5 sm:p-6">
              <h2 className="text-[15px] sm:text-[16px] font-semibold text-[#0F172A]">Getting Started</h2>
              <p className="text-[13px] sm:text-[14px] text-[#6B7280] mt-1 mb-5">Follow these simple steps to get started.</p>
              <div className="flex flex-col gap-3">
                {[
                  { num: 1, title: "Create your first project",  desc: "Set up your project details",             Icon: Plus },
                  { num: 2, title: "Add project milestones",     desc: "Break your project into actionable steps", Icon: Flag },
                  { num: 3, title: "Invite your team",           desc: "Collaborate with your team members",       Icon: Users },
                ].map(({ num, title, desc, Icon }) => (
                  <div key={num} className="flex items-center justify-between border border-[#E5E7EB] rounded-xl p-3.5 sm:p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[12px] sm:text-[13px] font-semibold text-[#374151] shrink-0">{num}</div>
                      <div>
                        <p className="text-[13px] sm:text-[14px] font-semibold text-[#0F172A]">{title}</p>
                        <p className="text-[12px] sm:text-[13px] text-[#6B7280] mt-0.5">{desc}</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-xl border border-[#E5E7EB] flex items-center justify-center shrink-0">
                      <Icon size={15} strokeWidth={1.7} color="#0F172A" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-5 sm:gap-6">
              {/* Account Overview */}
              <div className="border border-[#E5E7EB] rounded-2xl p-5 sm:p-6">
                <h2 className="text-[15px] sm:text-[16px] font-semibold text-[#0F172A]">Account Overview</h2>
                <p className="text-[13px] sm:text-[14px] text-[#6B7280] mt-1 mb-4">Here's a quick overview of your account.</p>
                <div className="flex flex-col">
                  {[
                    { label: "Active Projects",  value: devPopulated ? "1" : "0",  Icon: Home },
                    { label: "Pending Payments", value: "₦0", Icon: CreditCard },
                    { label: "Team Members",     value: devPopulated ? "3" : "0",  Icon: Users },
                  ].map(({ label, value, Icon }, i, arr) => (
                    <div key={label} className={`flex items-center justify-between py-3 sm:py-3.5 ${i < arr.length - 1 ? "border-b border-[#F0F0F0]" : ""}`}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#F3F4F6] flex items-center justify-center shrink-0">
                          <Icon size={15} strokeWidth={1.7} color="#0F172A" />
                        </div>
                        <span className="text-[13px] sm:text-[14px] text-[#374151]">{label}</span>
                      </div>
                      <span className="text-[13px] sm:text-[14px] font-semibold text-[#0F172A]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pro Tip */}
              <div className="border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 flex gap-3 sm:gap-4">
                <div className="w-8 h-8 rounded-xl bg-[#F3F4F6] flex items-center justify-center shrink-0">
                  <Lightbulb size={15} strokeWidth={1.7} color="#0F172A" />
                </div>
                <div>
                  <h3 className="text-[13px] sm:text-[14px] font-semibold text-[#0F172A] mb-1">Pro Tip</h3>
                  <p className="text-[12px] sm:text-[13px] text-[#6B7280] leading-relaxed">
                    Set up your project milestones early to keep your construction on track and on budget.
                  </p>
                </div>
              </div>
            </div>
            </div>
            </>
          )}
        </div>
      </main>

      {/* Modals */}
      <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}