import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Plus, Menu, CheckCircle2, Circle, ChevronRight, Settings, Check
} from "lucide-react";
import ContractorPayments from "./ContractorPayments";
import ContractorMilestones from "./ContractorMilestones";
import ContractorSidebar from "../../components/contractor/ContractorSidebar";
import ContractorUpdates from "./ContractorUpdates";
import { api } from "../../lib/api";

interface ContractorProfile {
  avatarUrl?: string | null;
  specialty?: string | null;
  bio?: string | null;
  nin?: string | null;
  yearsExp?: number | null;
}

function computeCompletion(profile: ContractorProfile | null): { percent: number; checks: { title: string; desc: string; done: boolean }[] } {
  const checks = [
    { title: "Add profile photo",   desc: "Help clients recognize you",       done: !!profile?.avatarUrl },
    { title: "Add your skills",     desc: "Showcase what you're good at",     done: !!profile?.specialty },
    { title: "Add experience",      desc: "Let clients know your background", done: !!profile?.bio },
    { title: "Add portfolio",       desc: "Upload your work examples",        done: !!profile?.yearsExp },
    { title: "Verify your identity",desc: "Get verified to build trust",      done: !!profile?.nin },
  ];
  const done = checks.filter(c => c.done).length;
  const percent = Math.round((done / checks.length) * 100);
  return { percent, checks };
}

const FONT = "'Inter', sans-serif";

export default function ContractorDashboard() {
  const [active, setActive] = useState(() => {
    return localStorage.getItem('buildspora_contractor_tab') || "dashboard";
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Real profile completion state
  const [profile, setProfile] = useState<ContractorProfile | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const { percent, checks } = computeCompletion(profile);
  const isComplete = percent === 100;
  const hasActiveProject = false; // will be dynamic once jobs are live

  // Fetch profile on mount (and after returning from profile-setup)
  useEffect(() => {
    api.get<{ success: boolean; profile: ContractorProfile | null }>("/api/user/me")
      .then(res => { setProfile(res.profile); })
      .catch(() => {})
      .finally(() => setProfileLoaded(true));
  }, [location.key]); // re-fetch every time the route key changes (i.e. coming back from setup)

  useEffect(() => {
    if (location.state?.activeTab) {
      setTimeout(() => setActive(location.state.activeTab), 0);
    }
  }, [location.state]);

  useEffect(() => {
    localStorage.setItem('buildspora_contractor_tab', active);
  }, [active]);

  const desktopMarginClass = desktopOpen ? "md:ml-[240px]" : "md:ml-[68px]";

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: FONT }}>
      <ContractorSidebar
        active={active}
        onNavigate={setActive}
        desktopOpen={desktopOpen}
        onToggleDesktop={() => setDesktopOpen(!desktopOpen)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* ══ MAIN CONTENT ════════════════════════════════════════════ */}
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

        {/* Content Wrapper */}
        <div className="px-4 sm:px-6 md:px-10 pt-6 pb-16 sm:pt-8 sm:pb-24 max-w-[1000px] mx-auto w-full flex-1">
          
          {active === 'dashboard' ? (
            <>
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                  <h1 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-[#0F172A] leading-tight">
                    {isComplete === false ? (
                      <>Welcome to Build<span className="text-[#059669]">Spora</span>, Emeka!</>
                    ) : (
                      <>Welcome back, Emeka!</>
                    )}
                  </h1>
                  <p className="text-[14px] sm:text-[15px] text-[#475569] mt-1.5">
                    {hasActiveProject ? "Here's what's happening with your work today." : isComplete ? "Your profile is ready. Start getting hired." : "Let's set up your contractor profile and start getting jobs."}
                  </p>
                </div>
                <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
                  <button 
                    onClick={() => navigate('/dashboard/contractor/offer-service')}
                    className="flex items-center gap-2 bg-[#0F172A] text-white text-[13.5px] font-medium px-5 py-2.5 rounded-lg hover:bg-black transition-colors shadow-sm"
                  >
                    <Plus size={16} strokeWidth={2} />
                    Offer a Service
                  </button>
                </div>
              </div>

              {/* Stats Grid (Top if complete) */}
              {isComplete && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6">
                  {(hasActiveProject ? [
                    { value: "1", label: "Active Job", desc: "Keep it up!" },
                    { value: "2", label: "Completed Jobs", desc: "Good work!" },
                    { value: "₦3,200,000", label: "Total Earnings", desc: "See overview" },
                    { value: "4.8", label: "Reviews (4)", desc: "View all reviews" },
                  ] : [
                    { value: "0", label: "Active Jobs", desc: "No active jobs yet" },
                    { value: "0", label: "Completed Jobs", desc: "Keep up the good work" },
                    { value: "₦0.00", label: "Total Earnings", desc: "Your earnings overview" },
                    { value: "0", label: "Reviews", desc: "No reviews yet" },
                  ]).map((stat) => (
                    <div key={stat.label} className="bg-white border border-[#E2E8F0] rounded-[4px] p-4 sm:p-6 flex flex-col justify-center min-h-[120px] aspect-square sm:aspect-auto">
                      <h3 className="text-[20px] sm:text-[26px] font-bold text-[#0F172A] leading-none mb-1.5">{stat.value}</h3>
                      <p className="text-[13px] sm:text-[14px] font-semibold text-[#0F172A] mb-1">{stat.label}</p>
                      <p className="text-[11px] sm:text-[12.5px] text-[#64748B]">{stat.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Middle Section */}
              {hasActiveProject ? (
                <div className="flex flex-col lg:flex-row gap-6 mb-6">
                  {/* Left: Active Project */}
                  <div className="bg-white border border-[#E2E8F0] rounded-[4px] p-6 flex-1 flex flex-col">
                    <p className="text-[15.5px] font-bold text-[#0F172A] mb-5">Active Project</p>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-[18px] font-bold text-[#0F172A] mb-1">Victoria Island Duplex</h3>
                        <p className="text-[13.5px] text-[#475569] mb-1">Client: Chioma Adeyemi</p>
                        <p className="text-[13.5px] text-[#475569]">Lekki Phase 1, Lagos</p>
                      </div>
                      <span className="bg-[#FEF3C7] text-[#D97706] text-[12px] font-bold px-3 py-1 rounded-md">In Review</span>
                    </div>
                    <div className="mt-auto border-t border-[#F1F5F9] pt-4">
                      <p className="text-[13.5px] font-bold text-[#0F172A] mb-3">
                        Current Milestone: <span className="text-[#10B981]">Block Work</span>
                      </p>
                      <p className="text-[12.5px] text-[#64748B] mb-2">Progress</p>
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <div className="flex gap-1.5 flex-1 h-2">
                          <div className="bg-[#10B981] h-full flex-1 rounded-full"></div>
                          <div className="bg-[#10B981] h-full flex-1 rounded-full"></div>
                          <div className="bg-[#10B981] h-full flex-1 rounded-full"></div>
                          <div className="bg-[#10B981] h-full flex-1 rounded-full"></div>
                          <div className="bg-[#E2E8F0] h-full flex-1 rounded-full"></div>
                          <div className="bg-[#E2E8F0] h-full flex-1 rounded-full"></div>
                          <div className="bg-[#E2E8F0] h-full flex-1 rounded-full"></div>
                          <div className="bg-[#E2E8F0] h-full flex-1 rounded-full"></div>
                        </div>
                        <span className="text-[13px] font-bold text-[#0F172A]">4/8</span>
                      </div>
                      <button className="px-5 py-2 rounded-lg border border-[#10B981] text-[#10B981] text-[13.5px] font-semibold hover:bg-[#ECFDF5] transition-colors">
                        View Milestone
                      </button>
                    </div>
                  </div>

                  {/* Right: Recent Earnings */}
                  <div className="bg-white border border-[#E2E8F0] rounded-[4px] p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-[15.5px] font-bold text-[#0F172A]">Recent Earnings</h3>
                      <button className="text-[13.5px] font-bold text-[#0F172A] hover:underline">View all</button>
                    </div>
                    <div className="w-full flex-1 overflow-x-auto pb-2">
                      <div className="min-w-[400px]">
                        <div className="grid grid-cols-4 text-[13px] text-[#64748B] pb-3 border-b border-[#F1F5F9]">
                          <span className="col-span-1">Milestone</span>
                          <span className="col-span-1">Amount</span>
                          <span className="col-span-1">Date</span>
                          <span className="col-span-1 text-right">Status</span>
                        </div>
                        <div className="grid grid-cols-4 items-center text-[13.5px] font-semibold text-[#0F172A] py-4 border-b border-[#F1F5F9]">
                          <span className="col-span-1">Foundation</span>
                          <span className="col-span-1">₦1,500,000</span>
                          <span className="col-span-1 font-normal text-[#64748B]">June 15, 2025</span>
                          <div className="col-span-1 flex justify-end">
                            <span className="bg-[#ECFDF5] text-[#10B981] text-[12px] font-bold px-3 py-1 rounded-md">Paid</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 items-center text-[13.5px] font-semibold text-[#0F172A] py-4 border-b border-[#F1F5F9]">
                          <span className="col-span-1">Marketplace</span>
                          <span className="col-span-1">₦75,000</span>
                          <span className="col-span-1 font-normal text-[#64748B]">June 12, 2025</span>
                          <div className="col-span-1 flex justify-end">
                            <span className="bg-[#ECFDF5] text-[#10B981] text-[12px] font-bold px-3 py-1 rounded-md">Paid</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : isComplete ? (
                <div className="bg-white border border-[#E2E8F0] rounded-[4px] p-6 lg:p-8 mb-6 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                  {/* Left: Progress Circle */}
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

                  {/* Right: Checklist */}
                  <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 lg:border-l lg:border-[#E2E8F0] lg:pl-16">
                    {[
                      "Photo added",
                      "Portfolio added",
                      "Skills added",
                      "Identity verified",
                      "Experience added",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <CheckCircle2 size={18} className="text-[#10B981] shrink-0" />
                        <span className="text-[13.5px] font-semibold text-[#0F172A]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-[#E2E8F0] rounded-[4px] p-6 mb-6 flex flex-col lg:flex-row gap-6 lg:gap-8">
                  {/* Left: Progress */}
                  <div className="flex-1 max-w-[400px]">
                    <h2 className="text-[18px] font-bold text-[#0F172A] mb-2">Complete your contractor profile</h2>
                    <p className="text-[14px] text-[#475569] mb-6 leading-relaxed">
                      A complete profile helps clients trust you and increases your chances of getting hired.
                    </p>
                    
                    <div className="mb-2">
                      <span className="text-[14px] font-bold text-[#10B981]">
                        {profileLoaded ? `${percent}% complete` : "Loading…"}
                      </span>
                    </div>
                    <div className="w-full h-[8px] bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#10B981] rounded-full transition-all duration-500"
                        style={{ width: profileLoaded ? `${percent}%` : "0%" }}
                      />
                    </div>
                  </div>

                  {/* Middle: Checklist */}
                  <div className="flex-1 flex flex-col gap-3">
                    {checks.map((item) => (
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
                          <p className={`text-[13.5px] font-semibold ${item.done ? 'text-[#0F172A]' : 'text-[#334155]'}`}>{item.title}</p>
                          <p className="text-[12.5px] text-[#64748B] mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right: CTA */}
                  <div className="flex flex-col items-start lg:items-center justify-center lg:border-l lg:border-[#F1F5F9] lg:pl-8">
                    <h3 className="text-[15.5px] font-bold text-[#0F172A] mb-1">Complete your profile</h3>
                    <p className="text-[13.5px] text-[#475569] mb-5 text-center lg:text-left">Stand out and get more jobs.</p>
                    <button 
                      onClick={() => navigate("/dashboard/contractor/profile-setup")}
                      className="px-5 py-2 rounded-lg border border-[#10B981] text-[#10B981] text-[14px] font-semibold hover:bg-[#ECFDF5] transition-colors w-full sm:w-auto"
                    >
                      Update Profile
                    </button>
                  </div>
                </div>
              )}

              {/* Stats Grid (Bottom if not complete) */}
              {isComplete === false && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
                  {[
                    { value: "0", label: "Active Jobs", desc: "No active jobs yet" },
                    { value: "0", label: "Completed Jobs", desc: "Keep up the good work" },
                    { value: "₦0.00", label: "Total Earnings", desc: "Your earnings overview" },
                    { value: "0", label: "Reviews", desc: "No reviews yet" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white border border-[#E2E8F0] rounded-[4px] p-6 flex flex-col justify-center min-h-[120px]">
                      <h3 className="text-[26px] font-bold text-[#0F172A] leading-none mb-1.5">{stat.value}</h3>
                      <p className="text-[14px] font-semibold text-[#0F172A] mb-1">{stat.label}</p>
                      <p className="text-[12.5px] text-[#64748B]">{stat.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom Sections Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Getting Started OR Opportunities */}
                {isComplete ? (
                  <div className="flex flex-col h-full">
                    <h2 className="text-[17px] font-bold text-[#0F172A] mb-4">Opportunities for you</h2>
                    <div className="flex flex-col gap-4 flex-1">
                      {[
                        { title: "Electrical Installation", loc: "Victoria Island, Lagos", price: "₦500,000", time: "2 hours ago" },
                        { title: "Full House Wiring", loc: "Lekki Phase 1, Lagos", price: "₦350,000", time: "5 hours ago" },
                        { title: "Generator Installation", loc: "Ajah, Lagos", price: "₦120,000", time: "Yesterday" }
                      ].map((job) => (
                        <div key={job.title} className="p-5 bg-white border border-[#E2E8F0] rounded-[4px] flex items-center justify-between hover:border-[#CBD5E1] transition-all">
                          <div>
                            <h4 className="text-[14.5px] font-bold text-[#0F172A] mb-1">{job.title}</h4>
                            <p className="text-[13px] text-[#64748B] mb-2">{job.loc}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] font-bold text-[#0F172A]">{job.price}</span>
                              <span className="text-[#CBD5E1]">•</span>
                              <span className="text-[12px] text-[#64748B]">{job.time}</span>
                            </div>
                          </div>
                          <button className="px-5 py-2 rounded-lg border border-[#10B981] text-[#10B981] text-[13.5px] font-semibold hover:bg-[#ECFDF5] transition-colors shrink-0">
                            View Job
                          </button>
                        </div>
                      ))}
                    </div>
                    <button className="w-full text-center text-[#10B981] text-[14px] font-semibold py-2 mt-2 hover:text-[#059669] transition-colors">
                      View all opportunities
                    </button>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-[17px] font-bold text-[#0F172A] mb-1.5">Getting started</h2>
                    <p className="text-[13.5px] text-[#475569] mb-5">Follow these simple steps to start getting jobs on BuildSpora.</p>
                    
                    <div className="flex flex-col gap-3">
                      {[
                        { num: 1, title: "Complete your profile", desc: "Add your details, skills and experience", done: true },
                        { num: 2, title: "Add your services", desc: "List the services you offer", done: false },
                        { num: 3, title: "Get verified", desc: "Verify your identity to build client trust", done: false },
                        { num: 4, title: "Start applying for jobs", desc: "Find projects and send proposals", done: false },
                      ].map((step) => (
                        <div key={step.num} className="flex items-center justify-between p-4 bg-white border border-[#E2E8F0] rounded-[4px] cursor-pointer hover:border-[#CBD5E1] transition-all group">
                          <div className="flex items-center gap-3.5">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12.5px] font-bold shrink-0 ${step.done ? 'bg-[#ECFDF5] text-[#10B981]' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
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
                )}

                {/* Opportunities (Empty) OR Pending Invites/Messages */}
                {hasActiveProject ? (
                  <div className="bg-white border border-[#E2E8F0] rounded-[4px] p-6 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-[16px] font-bold text-[#0F172A]">Messages</h3>
                      <button className="text-[13.5px] font-bold text-[#0F172A] hover:underline">View all</button>
                    </div>
                    <div className="flex-1 flex items-center justify-center border border-dashed border-[#E2E8F0] rounded-[12px] p-8">
                      <span className="text-[13.5px] text-[#64748B]">No messages here</span>
                    </div>
                  </div>
                ) : isComplete ? (
                  <div className="flex flex-col h-full">
                    <h2 className="text-[17px] font-bold text-[#0F172A] mb-1">Pending Invites</h2>
                    <p className="text-[13.5px] text-[#475569] mb-4">Clients want to work with you</p>
                    
                    <div className="flex flex-col gap-4 flex-1">
                      {[
                        { title: "Victoria Island Duplex", subtitle: "New Build • Lekki, Lagos", client: "Chioma", price: "₦12,000,000" },
                        { title: "Abuja Terrace Renovation", subtitle: "Renovation • Abuja", client: "Adaeze", price: "₦8,500,000" },
                      ].length > 0 ? (
                        [
                          { title: "Victoria Island Duplex", subtitle: "New Build • Lekki, Lagos", client: "Chioma", price: "₦12,000,000" },
                          { title: "Abuja Terrace Renovation", subtitle: "Renovation • Abuja", client: "Adaeze", price: "₦8,500,000" },
                        ].map((invite) => (
                          <div key={invite.title} className="p-5 bg-white border border-[#E2E8F0] rounded-[4px] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#CBD5E1] transition-all">
                            <div>
                              <h4 className="text-[14.5px] font-bold text-[#0F172A] mb-1">{invite.title}</h4>
                              <p className="text-[13px] text-[#64748B] mb-1">{invite.subtitle}</p>
                              <p className="text-[13px] text-[#64748B] mb-2">Client: {invite.client}</p>
                              <span className="text-[14.5px] font-bold text-[#0F172A]">{invite.price}</span>
                            </div>
                            <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
                              <button className="px-6 py-2 rounded-lg border border-[#10B981] text-[#10B981] text-[13.5px] font-semibold hover:bg-[#ECFDF5] transition-colors w-full">
                                Accept
                              </button>
                              <button className="px-6 py-2 rounded-lg border border-[#E2E8F0] text-[#475569] text-[13.5px] font-semibold hover:bg-[#F8FAFC] transition-colors w-full">
                                Decline
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-center h-full border border-dashed border-[#E2E8F0] rounded-[4px] p-8 text-[#64748B] text-[13.5px]">
                          No pending invites at the moment.
                        </div>
                      )}
                    </div>
                    <button className="w-full text-center text-[#10B981] text-[14px] font-semibold py-2 mt-2 hover:text-[#059669] transition-colors">
                      View all invites
                    </button>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-[17px] font-bold text-[#0F172A] mb-1.5">Opportunities for you</h2>
                    <p className="text-[13.5px] text-[#475569] mb-5">Jobs that match your skills and location.</p>
                    
                    <div className="bg-white border border-[#E2E8F0] border-dashed rounded-[24px] p-8 flex flex-col items-center justify-center text-center min-h-[260px]">
                      <h3 className="text-[15.5px] font-bold text-[#0F172A] mb-2">No job recommendations yet</h3>
                      <p className="text-[13.5px] text-[#475569] mb-6 max-w-[280px] leading-relaxed">
                        Complete your profile and add your services to see job opportunities.
                      </p>
                      <button className="px-5 py-2 rounded-lg border border-[#10B981] text-[#10B981] text-[14px] font-semibold hover:bg-[#ECFDF5] transition-colors bg-white">
                        Go to Jobs
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : active === 'payments' ? (
            <ContractorPayments />
          ) : active === 'milestones' ? (
            <ContractorMilestones />
          ) : active === 'updates' ? (
            <ContractorUpdates />
          ) : active === 'projects' ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-white border border-[#E2E8F0] rounded-[4px] py-20 px-8">
              <div className="w-14 h-14 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-4">
                <CheckCircle2 size={26} className="text-[#94A3B8]" />
              </div>
              <h3 className="text-[16px] font-bold text-[#0F172A] mb-1.5">No active projects</h3>
              <p className="text-[13.5px] text-[#64748B] max-w-[280px] leading-relaxed">
                Projects you're working on will appear here once clients assign you to a job.
              </p>
            </div>
          ) : active === 'suppliers' ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-white border border-[#E2E8F0] rounded-[4px] py-20 px-8">
              <div className="w-14 h-14 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-4">
                <Circle size={26} className="text-[#94A3B8]" />
              </div>
              <h3 className="text-[16px] font-bold text-[#0F172A] mb-1.5">No suppliers yet</h3>
              <p className="text-[13.5px] text-[#64748B] max-w-[280px] leading-relaxed">
                Connect with suppliers to order materials directly.
              </p>
            </div>
          ) : active === 'team' ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-white border border-[#E2E8F0] rounded-[4px] py-20 px-8">
              <div className="w-14 h-14 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-4">
                <Circle size={26} className="text-[#94A3B8]" />
              </div>
              <h3 className="text-[16px] font-bold text-[#0F172A] mb-1.5">No team members yet</h3>
              <p className="text-[13.5px] text-[#64748B] max-w-[280px] leading-relaxed">
                Invite team members to collaborate on projects.
              </p>
            </div>
          ) : active === 'settings' ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-white border border-[#E2E8F0] rounded-[4px] py-20 px-8">
              <div className="w-14 h-14 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-4">
                <Settings size={26} className="text-[#94A3B8]" />
              </div>
              <h3 className="text-[16px] font-bold text-[#0F172A] mb-1.5">Settings</h3>
              <p className="text-[13.5px] text-[#64748B] max-w-[280px] leading-relaxed">
                Account settings and preferences will be available here soon.
              </p>
            </div>
          ) : null}

        </div>
      </main>
    </div>
  );
}
