import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Plus, Menu, CheckCircle2, Circle, ChevronRight, ChevronLeft,
  Check,
} from "lucide-react";
import SupplierSidebar from "../../components/supplier/SupplierSidebar";
import SupplierCatalogue from "./SupplierCatalogue";
import SupplierOrders from "./SupplierOrders";
import SupplierPayments from "./SupplierPayments";
import SupplierUpdates from "./SupplierUpdates";

const FONT = "'Inter', sans-serif";

export default function SupplierDashboard() {
  const [active, setActive] = useState(() => {
    return localStorage.getItem("buildspora_supplier_tab") || "dashboard";
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // 3 states: "new" | "complete" | "active"
  const [dashboardState, setDashboardState] = useState<"new" | "complete" | "active">(() => {
    const saved = localStorage.getItem("buildspora_supplier_state");
    if (saved === "complete" || saved === "active") return saved;
    // When navigating back from profile setup, mark complete
    if (localStorage.getItem("buildspora_supplier_profile_complete") === "true") {
      return "complete";
    }
    return "new";
  });

  const isNew = dashboardState === "new";
  const isComplete = dashboardState === "complete";
  const isActive = dashboardState === "active";

  const cycleState = (dir: "next" | "prev") => {
    const states: ("new" | "complete" | "active")[] = ["new", "complete", "active"];
    const i = states.indexOf(dashboardState);
    let n = dir === "next" ? i + 1 : i - 1;
    if (n >= states.length) n = 0;
    if (n < 0) n = states.length - 1;
    setDashboardState(states[n]);
    localStorage.setItem("buildspora_supplier_state", states[n]);
  };

  useEffect(() => {
    if (location.state?.activeTab) {
      setTimeout(() => setActive(location.state.activeTab), 0);
    }
  }, [location.state]);

  useEffect(() => {
    localStorage.setItem("buildspora_supplier_tab", active);
  }, [active]);

  const desktopMarginClass = desktopOpen ? "md:ml-[240px]" : "md:ml-[68px]";

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: FONT }}>
      <SupplierSidebar
        active={active}
        onNavigate={setActive}
        desktopOpen={desktopOpen}
        onToggleDesktop={() => setDesktopOpen(!desktopOpen)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <main className={`min-h-screen transition-all duration-300 ease-in-out flex flex-col ${desktopMarginClass}`}>

        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between px-4 sm:px-6 h-[64px] border-b border-[#F3F4F6] shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 -ml-2 rounded-xl hover:bg-[#F3F4F6] text-[#0F172A] cursor-pointer"
            >
              <Menu size={20} strokeWidth={1.8} />
            </button>
            <span className="text-[18px] font-bold tracking-tight select-none">
              <span style={{ color: "#0F172A" }}>Build</span>
              <span style={{ color: "#059669" }} className="font-bold">Spora</span>
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 md:px-10 pt-6 pb-16 sm:pt-8 sm:pb-24 max-w-[1000px] mx-auto w-full flex-1">

          {active === "dashboard" ? (
            <>
              {/* ── HEADER ── */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                  <h1 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-[#0F172A] leading-tight">
                    {isNew
                      ? <>Welcome to Build<span className="text-[#059669]">Spora</span>, Dangote Cement!</>
                      : <>Welcome back, Dangote Cement!{isActive ? " 👋" : ""}</>
                    }
                  </h1>
                  <p className="text-[14px] sm:text-[15px] text-[#475569] mt-1.5">
                    {isNew
                      ? "Let's set up your supplier profile."
                      : isComplete
                        ? "Your profile is ready. Start receiving orders."
                        : "Here's what's happening with your business today."}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
                  {/* Dev state toggle */}
                  <div className="flex items-center gap-1 mr-2 bg-[#F8FAFC] p-1 rounded-lg border border-[#E2E8F0]">
                    <button onClick={() => cycleState("prev")} className="p-1.5 rounded-md text-[#64748B] hover:text-[#0F172A]" title="Prev State">
                      <ChevronLeft size={16} strokeWidth={2.5} />
                    </button>
                    <button onClick={() => cycleState("next")} className="p-1.5 rounded-md text-[#64748B] hover:text-[#0F172A]" title="Next State">
                      <ChevronRight size={16} strokeWidth={2.5} />
                    </button>
                  </div>

                  <button
                    className="flex items-center gap-2 bg-[#0F172A] text-white text-[13.5px] font-medium px-5 py-2.5 rounded-lg hover:bg-black transition-colors shadow-sm"
                    onClick={() => setActive("catalogue")}
                  >
                    <Plus size={16} strokeWidth={2} />
                    Add Item
                  </button>
                </div>
              </div>

              {/* ── STATS (top when complete/active, bottom when new) ── */}
              {!isNew && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6">
                  {(isActive ? [
                    { value: "3", label: "Pending Quotes", desc: "Awaiting your response", color: "#D97706" },
                    { value: "5", label: "Active Orders", desc: "Currently processing", color: "#2563EB" },
                    { value: "₦12,450,000", label: "Revenue", desc: "Total earned", color: "#059669" },
                    { value: "28", label: "Delivered", desc: "Orders fulfilled", color: "#64748B" },
                  ] : [
                    { value: "0", label: "Pending Quotes", desc: "No quotes yet", color: "#0F172A" },
                    { value: "0", label: "Active Orders", desc: "No active orders", color: "#0F172A" },
                    { value: "₦0.00", label: "Revenue", desc: "Your earnings overview", color: "#0F172A" },
                    { value: "0", label: "Delivered", desc: "Orders fulfilled", color: "#0F172A" },
                  ]).map((stat) => (
                    <div key={stat.label} className="bg-white border border-[#E2E8F0] rounded-[4px] p-4 sm:p-6 flex flex-col justify-center min-h-[120px] aspect-square sm:aspect-auto">
                      <h3 className="text-[20px] sm:text-[26px] font-bold leading-none mb-1.5" style={{ color: stat.color }}>{stat.value}</h3>
                      <p className="text-[13px] sm:text-[14px] font-semibold text-[#0F172A] mb-1">{stat.label}</p>
                      <p className="text-[11px] sm:text-[12.5px] text-[#64748B]">{stat.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* ── MIDDLE CARD ── */}
              {isNew ? (
                /* State 1 — Incomplete profile card */
                <div className="bg-white border border-[#E2E8F0] rounded-[4px] p-6 mb-6 flex flex-col lg:flex-row gap-6 lg:gap-8">
                  <div className="flex-1 max-w-[400px]">
                    <h2 className="text-[18px] font-bold text-[#0F172A] mb-2">Complete your supplier profile</h2>
                    <p className="text-[14px] text-[#475569] mb-6 leading-relaxed">
                      A complete profile helps clients trust you and place orders.
                    </p>
                    <div className="mb-2">
                      <span className="text-[14px] font-bold text-[#10B981]">25% complete</span>
                    </div>
                    <div className="w-full h-[8px] bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div className="h-full bg-[#10B981] rounded-full w-[25%]" />
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-3">
                    {[
                      { title: "Add business photo / logo", desc: "Help clients recognise you", done: true },
                      { title: "Add your catalogue items", desc: "List what you sell with prices", done: false },
                      { title: "Add your service areas", desc: "Set cities and states you cover", done: false },
                      { title: "Verify your business (CAC)", desc: "Upload CAC certificate", done: false },
                      { title: "Add payout account", desc: "Where you'll receive payments", done: false },
                    ].map((item) => (
                      <div key={item.title} className="flex items-start gap-3">
                        <div className="mt-0.5 shrink-0">
                          {item.done ? (
                            <div className="w-[18px] h-[18px] rounded-full bg-[#10B981] flex items-center justify-center">
                              <Check size={12} strokeWidth={3} className="text-white" />
                            </div>
                          ) : (
                            <Circle size={18} className="text-[#CBD5E1]" />
                          )}
                        </div>
                        <div>
                          <p className={`text-[13.5px] font-semibold ${item.done ? "text-[#0F172A]" : "text-[#334155]"}`}>{item.title}</p>
                          <p className="text-[12.5px] text-[#64748B] mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col items-start lg:items-center justify-center lg:border-l lg:border-[#F1F5F9] lg:pl-8">
                    <h3 className="text-[15.5px] font-bold text-[#0F172A] mb-1">Complete your profile</h3>
                    <p className="text-[13.5px] text-[#475569] mb-5">Stand out and get more orders.</p>
                    <button
                      onClick={() => navigate("/dashboard/supplier/profile-setup")}
                      className="px-5 py-2 rounded-lg border border-[#10B981] text-[#10B981] text-[14px] font-semibold hover:bg-[#ECFDF5] transition-colors w-full sm:w-auto"
                    >
                      Update Profile
                    </button>
                  </div>
                </div>
              ) : isComplete ? (
                /* State 2 — Profile complete, no orders */
                <div className="bg-white border border-[#E2E8F0] rounded-[4px] p-6 lg:p-8 mb-6 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                  <div className="flex items-center gap-6">
                    <div className="relative w-[100px] h-[100px] rounded-full border-[6px] border-[#10B981] flex items-center justify-center shrink-0">
                      <span className="text-[22px] font-bold text-[#0F172A]">100%</span>
                    </div>
                    <div>
                      <h2 className="text-[18px] font-bold text-[#0F172A] mb-1.5">Profile 100% Complete!</h2>
                      <p className="text-[14px] text-[#475569] max-w-[200px] leading-relaxed">
                        You are now visible to clients on the marketplace
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 lg:border-l lg:border-[#E2E8F0] lg:pl-16">
                    {[
                      "Business logo added",
                      "Catalogue items added",
                      "Service areas set",
                      "CAC verified",
                      "Payout account linked",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <CheckCircle2 size={18} className="text-[#10B981] shrink-0" />
                        <span className="text-[13.5px] font-semibold text-[#0F172A]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* State 3 — Active: Quote Requests + Active Orders */
                <div className="flex flex-col gap-6 mb-6">
                  {/* Quote Requests */}
                  <div className="bg-white border border-[#E2E8F0] rounded-[4px] p-6">
                    <div className="flex justify-between items-center mb-5">
                      <h3 className="text-[16px] font-bold text-[#0F172A]">Quote Requests</h3>
                      <button className="text-[13.5px] font-bold text-[#059669] hover:underline">View All Quote Requests →</button>
                    </div>
                    <div className="overflow-x-auto">
                      <div className="min-w-[500px]">
                        <div className="grid grid-cols-4 text-[12.5px] text-[#64748B] pb-3 border-b border-[#F1F5F9]">
                          <span>Client</span><span>Item</span><span>Qty</span><span className="text-right">Date</span>
                        </div>
                        {[
                          { client: "Chioma Adeyemi", item: "Cement 50kg", qty: "200 bags", date: "Today" },
                          { client: "Tunde Bakare", item: "BUA Cement", qty: "150 bags", date: "June 21" },
                          { client: "Adaeze Nwosu", item: "Bulk Cement", qty: "2 tonnes", date: "June 20" },
                        ].map((r) => (
                          <div key={r.client} className="grid grid-cols-4 items-center text-[13.5px] py-3.5 border-b border-[#F1F5F9] last:border-0">
                            <span className="font-semibold text-[#0F172A]">{r.client}</span>
                            <span className="text-[#475569]">{r.item}</span>
                            <span className="text-[#475569]">{r.qty}</span>
                            <span className="text-right text-[#94A3B8]">{r.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Active Orders */}
                  <div className="bg-white border border-[#E2E8F0] rounded-[4px] p-6">
                    <div className="flex justify-between items-center mb-5">
                      <h3 className="text-[16px] font-bold text-[#0F172A]">Active Orders</h3>
                      <button className="text-[13.5px] font-bold text-[#059669] hover:underline">View All Orders →</button>
                    </div>
                    <div className="overflow-x-auto">
                      <div className="min-w-[560px]">
                        <div className="grid grid-cols-5 text-[12.5px] text-[#64748B] pb-3 border-b border-[#F1F5F9]">
                          <span>#</span><span>Client</span><span>Item</span><span>Amount</span><span className="text-right">Status</span>
                        </div>
                        {[
                          { id: "001", client: "Chioma", item: "200 bags Cement", amount: "₦900,000", status: "In Delivery", statusColor: "text-[#2563EB] bg-[#EFF6FF]" },
                          { id: "002", client: "Ngozi", item: "Iron Rods 5T", amount: "₦425,000", status: "Paid", statusColor: "text-[#059669] bg-[#ECFDF5]" },
                          { id: "003", client: "Emeka", item: "Roofing Sheets", amount: "₦320,000", status: "Delivered", statusColor: "text-[#64748B] bg-[#F1F5F9]" },
                        ].map((o) => (
                          <div key={o.id} className="grid grid-cols-5 items-center text-[13.5px] py-3.5 border-b border-[#F1F5F9] last:border-0">
                            <span className="font-semibold text-[#0F172A]">#{o.id}</span>
                            <span className="text-[#475569]">{o.client}</span>
                            <span className="text-[#475569]">{o.item}</span>
                            <span className="font-semibold text-[#0F172A]">{o.amount}</span>
                            <div className="flex justify-end">
                              <span className={`text-[12px] font-bold px-3 py-1 rounded-md ${o.statusColor}`}>{o.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── STATS (bottom when new) ── */}
              {isNew && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
                  {[
                    { value: "0", label: "Pending Quotes", desc: "No quotes yet" },
                    { value: "0", label: "Active Orders", desc: "No active orders" },
                    { value: "₦0.00", label: "Revenue", desc: "Your earnings overview" },
                    { value: "0", label: "Delivered", desc: "Orders fulfilled" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white border border-[#E2E8F0] rounded-[4px] p-6 flex flex-col justify-center min-h-[120px]">
                      <h3 className="text-[26px] font-bold text-[#0F172A] leading-none mb-1.5">{stat.value}</h3>
                      <p className="text-[14px] font-semibold text-[#0F172A] mb-1">{stat.label}</p>
                      <p className="text-[12.5px] text-[#64748B]">{stat.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* ── BOTTOM GRID ── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Left panel */}
                {(isNew || isComplete) ? (
                  <div>
                    <h2 className="text-[17px] font-bold text-[#0F172A] mb-1.5">Getting started</h2>
                    <p className="text-[13.5px] text-[#475569] mb-5">Follow these steps to start receiving orders on BuildSpora.</p>
                    <div className="flex flex-col gap-3">
                      {[
                        { num: 1, title: "Complete your profile", desc: "Add your details and business info", done: true },
                        { num: 2, title: "Add catalogue items", desc: "List what you sell with prices", done: isComplete },
                        { num: 3, title: "Get verified", desc: "Upload CAC certificate", done: isComplete },
                        { num: 4, title: "Start receiving orders", desc: "Clients will find and contact you", done: false },
                      ].map((step) => (
                        <div key={step.num} className="flex items-center justify-between p-4 bg-white border border-[#E2E8F0] rounded-[4px] cursor-pointer hover:border-[#CBD5E1] transition-all group">
                          <div className="flex items-center gap-3.5">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12.5px] font-bold shrink-0 ${step.done ? "bg-[#ECFDF5] text-[#10B981]" : "bg-[#F1F5F9] text-[#64748B]"}`}>
                              {step.num}
                            </div>
                            <div>
                              <h4 className="text-[14px] font-bold text-[#0F172A]">{step.title}</h4>
                              <p className="text-[12.5px] text-[#64748B] mt-0.5">{step.desc}</p>
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-[#94A3B8] group-hover:text-[#64748B] transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Active state: Recent Activity */
                  <div>
                    <h2 className="text-[17px] font-bold text-[#0F172A] mb-1.5">Recent Activity</h2>
                    <p className="text-[13.5px] text-[#475569] mb-5">Latest updates on your orders and quotes.</p>
                    <div className="flex flex-col gap-3">
                      {[
                        { text: "Chioma Adeyemi placed an order for 200 bags", time: "2 min ago", dot: "bg-[#059669]" },
                        { text: "Tunde Bakare sent a quote request", time: "1 hour ago", dot: "bg-[#2563EB]" },
                        { text: "Order #002 marked as Paid", time: "Yesterday", dot: "bg-[#059669]" },
                        { text: "Order #003 delivered successfully", time: "June 20", dot: "bg-[#64748B]" },
                      ].map((a, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 bg-white border border-[#E2E8F0] rounded-[4px]">
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${a.dot}`} />
                          <div>
                            <p className="text-[13.5px] font-semibold text-[#0F172A]">{a.text}</p>
                            <p className="text-[12px] text-[#94A3B8] mt-0.5">{a.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Right panel */}
                {isNew ? (
                  /* State 1: Opportunities empty */
                  <div>
                    <h2 className="text-[17px] font-bold text-[#0F172A] mb-1.5">Opportunities</h2>
                    <p className="text-[13.5px] text-[#475569] mb-5">Quote requests that match your catalogue.</p>
                    <div className="bg-white border border-dashed border-[#E2E8F0] rounded-[24px] p-8 flex flex-col items-center justify-center text-center min-h-[260px]">
                      <h3 className="text-[15.5px] font-bold text-[#0F172A] mb-2">No order requests yet</h3>
                      <p className="text-[13.5px] text-[#475569] mb-6 max-w-[280px] leading-relaxed">
                        Complete your profile to start receiving quote requests from clients.
                      </p>
                      <button
                        onClick={() => setActive("catalogue")}
                        className="px-5 py-2 rounded-lg border border-[#10B981] text-[#10B981] text-[14px] font-semibold hover:bg-[#ECFDF5] transition-colors bg-white"
                      >
                        Go to Catalogue
                      </button>
                    </div>
                  </div>
                ) : (
                  /* State 2 & 3: Catalogue preview */
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-[17px] font-bold text-[#0F172A]">Catalogue Preview</h2>
                      <button className="text-[13.5px] font-bold text-[#059669] hover:underline">
                        {isActive ? "8 items listed" : "4 items listed"} &nbsp;View All →
                      </button>
                    </div>
                    <div className="flex flex-col gap-3">
                      {[
                        { name: "Dangote Cement 50kg", sku: "SKU: DAN-50KG", price: "₦5,800", unit: "per bag", stock: "In Stock" },
                        { name: "BUA Cement 50kg", sku: "SKU: BUA-50KG", price: "₦5,600", unit: "per bag", stock: "In Stock" },
                        { name: "Iron Rod 12mm (6m)", sku: "SKU: IRN-12MM", price: "₦9,200", unit: "per piece", stock: "Low Stock" },
                      ].map((item) => (
                        <div key={item.name} className="flex items-center justify-between p-4 bg-white border border-[#E2E8F0] rounded-[4px] hover:border-[#CBD5E1] transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] flex items-center justify-center text-[18px]">📦</div>
                            <div>
                              <p className="text-[13.5px] font-bold text-[#0F172A]">{item.name}</p>
                              <p className="text-[12px] text-[#94A3B8]">{item.sku}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[14px] font-bold text-[#0F172A]">{item.price}</p>
                            <p className="text-[11.5px] text-[#64748B]">{item.unit}</p>
                            <span className={`text-[11px] font-bold ${item.stock === "In Stock" ? "text-[#059669]" : "text-[#D97706]"}`}>{item.stock}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : active === "catalogue" ? (
            <SupplierCatalogue />
          ) : active === "orders" ? (
            <SupplierOrders />
          ) : active === "payments" ? (
            <SupplierPayments />
          ) : active === "updates" ? (
            <SupplierUpdates />
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              <p className="text-[#64748B] text-[14.5px] capitalize">{active} coming soon.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
