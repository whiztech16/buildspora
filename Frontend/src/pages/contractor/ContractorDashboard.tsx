import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Plus, Menu, CheckCircle2, Circle, ChevronRight, Settings, Check,
  Loader2, MapPin, LogIn, LogOut as LogOutIcon,
} from "lucide-react";
import ContractorPayments from "./ContractorPayments";
import ContractorMilestones from "./ContractorMilestones";
import ContractorSidebar from "../../components/contractor/ContractorSidebar";
import ContractorUpdates from "./ContractorUpdates";
import ContractorSubmissions from "./ContractorSubmissions";
import ContractorActivity from "./ContractorActivity";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import NotificationDrawer from "../../components/shared/NotificationDrawer";

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
  const { user } = useAuth();
  const displayName = user?.name?.split(' ')[0] ?? 'there';
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

  // ── Real project + milestone state ────────────────────────
  interface DashProject {
    id: string; name: string; status: string;
    address: string; city: string; state: string; clientId: string;
  }
  interface DashMilestone {
    id: string; name: string; status: string; orderIndex: number;
  }
  interface CheckInRec {
    checkInTime: string; checkInLocationName: string | null; checkInMapsUrl: string | null;
    checkOutTime: string | null; checkOutLocationName: string | null; checkOutMapsUrl: string | null;
  }

  const [dashProject, setDashProject] = useState<DashProject | null>(null);
  const [dashMilestones, setDashMilestones] = useState<DashMilestone[]>([]);
  const [dashCheckIn, setDashCheckIn] = useState<CheckInRec | null>(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [dashEarnings, setDashEarnings] = useState<any[]>([]);
  const [activeJobs, setActiveJobs] = useState(0);
  const [completedJobs, setCompletedJobs] = useState(0);

  // Current milestone = first non-approved
  const currentMilestone = dashMilestones.find(m => m.status !== 'approved') || null;
  const hasActiveProject = !!dashProject;

  const loadDashProject = async () => {
    try {
      const res = await api.get<{ success: boolean; projects: DashProject[] }>('/api/projects');
      const allProjects = res.projects || [];
      setActiveJobs(allProjects.filter(p => p.status !== 'completed' && p.status !== 'cancelled').length);
      setCompletedJobs(allProjects.filter(p => p.status === 'completed').length);

      const p = allProjects[0];
      if (!p) { return; }
      setDashProject(p);
      const detail = await api.get<{ success: boolean; milestones: DashMilestone[] }>(`/api/projects/${p.id}`);
      setDashMilestones(detail.milestones);
      // Load check-in for current milestone
      const cur = detail.milestones.find(m => m.status !== 'approved');
      if (cur) {
        try {
          const mDetail = await api.get<{ success: boolean; milestone: { checkIns: CheckInRec[] } }>(`/api/milestones/${cur.id}`);
          const allChecks = mDetail.milestone.checkIns || [];
          allChecks.sort((a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime());
          setDashCheckIn(allChecks[0] || null);
        } catch { setDashCheckIn(null); }
      }
    } catch { /* fail silently */ }

    // Fetch payments
    try {
      const payRes = await api.get<{ success: boolean; totalEarnings: number; earnings: any[] }>('/api/payments');
      setTotalEarnings(payRes.totalEarnings || 0);
      setDashEarnings(payRes.earnings || []);
    } catch { /* fail silently */ }
  };

  const fmtNaira = (amount: number) => `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const fmtTime = (iso: string) => new Date(iso).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' });

  /** Returns true if the string is a raw "lat,lng" fallback */
  const isCoordString = (s: string | null | undefined): boolean => {
    if (!s) return false;
    return /^-?\d{1,3}\.\d+,?\s*-?\d{1,3}\.\d+$/.test(s.trim());
  };

  const getGPS = () => new Promise<GeolocationPosition>((res, rej) =>
    navigator.geolocation.getCurrentPosition(res, rej, { 
      enableHighAccuracy: true, 
      timeout: 20000, 
      maximumAge: 0 
    })
  );

  const reverseGeocode = async (lat: number, lng: number) => {
    // 1. Try Nominatim with proper headers
    try {
      const r = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=16&addressdetails=1`,
        { headers: { "Accept-Language": "en", "User-Agent": "BuildSpora-App/1.0" } }
      );
      if (r.ok) {
        const d = await r.json();
        if (d?.address) {
          const a = d.address;
          const parts = [
            a.road || a.pedestrian || a.footway,
            a.suburb || a.neighbourhood || a.quarter,
            a.city || a.town || a.village || a.municipality,
            a.state,
          ].filter(Boolean);
          if (parts.length >= 2) return parts.join(", ");
        }
        if (d?.display_name) return d.display_name.split(",").slice(0, 3).join(",").trim();
      }
    } catch { /* try next */ }

    // 2. BigDataCloud fallback (no API key, good African coverage)
    try {
      const r2 = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      if (r2.ok) {
        const d2 = await r2.json();
        const parts2 = [d2.locality, d2.principalSubdivision, d2.countryName].filter(Boolean);
        if (parts2.length > 0) return parts2.join(", ");
      }
    } catch { /* both failed */ }

    return `${lat.toFixed(6)},${lng.toFixed(6)}`;
  };

  const handleDashCheckIn = async () => {
    if (!currentMilestone) return;
    setIsCheckingIn(true); setActionError(null);
    try {
      const pos = await getGPS();
      const locationName = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
      await api.post(`/api/milestones/${currentMilestone.id}/checkin`, {
        lat: pos.coords.latitude, lng: pos.coords.longitude, locationName,
      });
      await loadDashProject(); // refresh to get updated status + check-in record
    } catch (err: any) {
      setActionError(err instanceof GeolocationPositionError
        ? 'Location access denied. Please enable location in your browser.'
        : err.message || 'Check-in failed.');
    } finally { setIsCheckingIn(false); }
  };

  const handleDashCheckOut = async () => {
    if (!currentMilestone) return;
    setIsCheckingOut(true); setActionError(null);
    try {
      const pos = await getGPS();
      const locationName = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
      await api.post(`/api/milestones/${currentMilestone.id}/checkout`, {
        lat: pos.coords.latitude, lng: pos.coords.longitude, locationName,
      });
      await loadDashProject();
    } catch (err: any) {
      setActionError(err instanceof GeolocationPositionError
        ? 'Location access denied. Please enable location in your browser.'
        : err.message || 'Check-out failed.');
    } finally { setIsCheckingOut(false); }
  };

  // Fetch profile on mount
  useEffect(() => {
    api.get<{ success: boolean; profile: ContractorProfile | null }>("/api/user/me")
      .then(res => { setProfile(res.profile); })
      .catch(() => {})
      .finally(() => setProfileLoaded(true));
  }, [location.key]);

  useEffect(() => { loadDashProject(); }, []);

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
          <NotificationDrawer />
        </div>

        {/* Content Wrapper */}
        <div className="relative px-4 sm:px-6 md:px-10 pt-6 pb-16 sm:pt-8 sm:pb-24 max-w-[1000px] mx-auto w-full flex-1">
          {/* Desktop Notification Bell */}
          <div className="hidden md:block absolute top-6 right-6">
            <NotificationDrawer />
          </div>

          {active === 'dashboard' ? (
            <>
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                  <h1 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-[#0F172A] leading-tight">
                    {isComplete === false ? (
                      <>Welcome to Build<span className="text-[#059669]">Spora</span>, {displayName}!</>
                    ) : (
                      <>Welcome back, {displayName}!</>
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
                    { value: activeJobs.toString(), label: activeJobs === 1 ? "Active Job" : "Active Jobs", desc: "Keep it up!" },
                    { value: completedJobs.toString(), label: "Completed Jobs", desc: completedJobs > 0 ? "Good work!" : "No completed jobs yet" },
                    { value: fmtNaira(totalEarnings), label: "Total Earnings", desc: "See overview" },
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
                        <h3 className="text-[18px] font-bold text-[#0F172A] mb-1">{dashProject?.name}</h3>
                        <p className="text-[13.5px] text-[#475569] mb-1">{dashProject?.city}, {dashProject?.state}</p>
                      </div>
                      <span className={`text-[12px] font-bold px-3 py-1 rounded-md ${
                        dashProject?.status === 'active' ? 'bg-[#ECFDF5] text-[#059669]' :
                        dashProject?.status === 'pending' ? 'bg-[#FEF3C7] text-[#D97706]' :
                        'bg-[#F1F5F9] text-[#64748B]'
                      }`}>
                        {dashProject?.status ? dashProject.status.charAt(0).toUpperCase() + dashProject.status.slice(1) : ''}
                      </span>
                    </div>

                    <div className="mt-auto border-t border-[#F1F5F9] pt-4">
                      {currentMilestone && (
                        <p className="text-[13.5px] font-bold text-[#0F172A] mb-3">
                          Current Milestone: <span className="text-[#10B981]">{currentMilestone.name}</span>
                        </p>
                      )}

                      {/* Progress bar */}
                      {dashMilestones.length > 0 && (
                        <>
                          <p className="text-[12.5px] text-[#64748B] mb-2">Progress</p>
                          <div className="flex items-center justify-between gap-4 mb-4">
                            <div className="flex gap-1.5 flex-1 h-2">
                              {dashMilestones.map((m) => (
                                <div key={m.id} className={`h-full flex-1 rounded-full ${m.status === 'approved' ? 'bg-[#10B981]' : 'bg-[#E2E8F0]'}`} />
                              ))}
                            </div>
                            <span className="text-[13px] font-bold text-[#0F172A]">
                              {dashMilestones.filter(m => m.status === 'approved').length}/{dashMilestones.length}
                            </span>
                          </div>
                        </>
                      )}

                      {/* Action buttons */}
                      {currentMilestone && (
                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            onClick={handleDashCheckIn}
                            disabled={isCheckingIn}
                            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-black text-white text-[13.5px] font-semibold hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-60"
                          >
                            {isCheckingIn ? <Loader2 size={15} className="animate-spin" /> : <LogIn size={15} />}
                            {isCheckingIn ? 'Getting location...' : 'Check In'}
                          </button>
                          
                          <button
                            onClick={handleDashCheckOut}
                            disabled={isCheckingOut}
                            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-black text-white text-[13.5px] font-semibold hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-60"
                          >
                            {isCheckingOut ? <Loader2 size={15} className="animate-spin" /> : <LogOutIcon size={15} />}
                            {isCheckingOut ? 'Getting location...' : 'Check Out'}
                          </button>
                          
                          <button
                            onClick={() => setActive('milestones')}
                            className="px-5 py-2 rounded-lg border border-[#10B981] text-[#10B981] text-[13.5px] font-semibold hover:bg-[#ECFDF5] transition-colors"
                          >
                            View Milestone
                          </button>
                        </div>
                      )}

                      {/* Error */}
                      {actionError && (
                        <p className="text-[12.5px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-3">{actionError}</p>
                      )}

                      {/* Location / timestamp cards */}
                      {dashCheckIn && (
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="flex items-start gap-2.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-3">
                            <div className="w-7 h-7 rounded-full bg-[#10B981] flex items-center justify-center shrink-0 mt-0.5">
                              <LogIn size={13} className="text-white" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[11px] font-bold text-[#059669] uppercase tracking-wide mb-0.5">Checked In</p>
                              <p className="text-[12px] font-semibold text-[#0F172A] truncate">
                                <MapPin size={10} className="inline mr-1 text-[#10B981]" />
                                {isCoordString(dashCheckIn.checkInLocationName)
                                  ? 'Location captured'
                                  : (dashCheckIn.checkInLocationName || 'Location captured')}
                              </p>
                              <p className="text-[11px] text-[#64748B]">{fmtTime(dashCheckIn.checkInTime)}</p>
                              {dashCheckIn.checkInMapsUrl && (
                                <a href={dashCheckIn.checkInMapsUrl} target="_blank" rel="noreferrer"
                                  className="text-[10.5px] text-[#059669] font-semibold hover:underline">View on map ↗</a>
                              )}
                            </div>
                          </div>
                          {dashCheckIn.checkOutTime && (
                            <div className="flex items-start gap-2.5 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-3">
                              <div className="w-7 h-7 rounded-full bg-[#F59E0B] flex items-center justify-center shrink-0 mt-0.5">
                                <LogOutIcon size={13} className="text-white" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[11px] font-bold text-[#D97706] uppercase tracking-wide mb-0.5">Checked Out</p>
                                <p className="text-[12px] font-semibold text-[#0F172A] truncate">
                                <MapPin size={10} className="inline mr-1 text-[#F59E0B]" />
                                {isCoordString(dashCheckIn.checkOutLocationName)
                                  ? 'Location captured'
                                  : (dashCheckIn.checkOutLocationName || 'Location captured')}
                              </p>
                                <p className="text-[11px] text-[#64748B]">{fmtTime(dashCheckIn.checkOutTime)}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
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
                        {dashEarnings.length === 0 ? (
                          <div className="py-8 text-center text-[13.5px] text-[#64748B]">No recent transactions</div>
                        ) : (
                          dashEarnings.slice(0, 5).map((e, idx) => (
                            <div key={idx} className="grid grid-cols-4 items-center text-[13.5px] font-semibold text-[#0F172A] py-4 border-b border-[#F1F5F9] last:border-0">
                              <span className="col-span-1 capitalize">{e.source || e.projectName || 'Milestone'}</span>
                              <span className="col-span-1">{fmtNaira(e.amount)}</span>
                              <span className="col-span-1 font-normal text-[#64748B]">{fmtTime(e.date)}</span>
                              <div className="col-span-1 flex justify-end">
                                <span className={`text-[12px] font-bold px-3 py-1 rounded-md capitalize ${e.status === 'paid' ? 'bg-[#ECFDF5] text-[#10B981]' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
                                  {e.status}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
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
                      {/* No job recommendations yet */}
                      <div className="flex flex-col items-center justify-center border border-dashed border-[#E2E8F0] rounded-[12px] p-8 text-center">
                        <span className="text-[13.5px] text-[#64748B]">No job recommendations yet. <br /> Check the jobs board.</span>
                      </div>
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
                      {false ? (
                        [].map((invite: any) => (
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
          ) : active === 'submissions' ? (
            <ContractorSubmissions />
          ) : active === 'activity' ? (
            <ContractorActivity />
          ) : active === 'updates' ? (
            <ContractorUpdates />
          ) : active === 'projects' ? (
            <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-6 lg:p-8 min-h-[400px]">
              <h2 className="text-[20px] font-bold text-[#0F172A] mb-6">Your Projects</h2>
              {hasActiveProject ? (
                <div className="border border-[#E2E8F0] rounded-xl p-5 hover:border-[#CBD5E1] transition-colors bg-white">
                  <h3 className="text-[18px] font-bold text-[#0F172A] mb-1">{dashProject?.name}</h3>
                  <p className="text-[14px] text-[#64748B] mb-4">{dashProject?.city}, {dashProject?.state}</p>
                  <div className="flex items-center gap-4">
                    <span className={`text-[12px] font-bold px-3 py-1 rounded-md ${
                      dashProject?.status === 'active' ? 'bg-[#ECFDF5] text-[#059669]' :
                      dashProject?.status === 'pending' ? 'bg-[#FEF3C7] text-[#D97706]' :
                      'bg-[#F1F5F9] text-[#64748B]'
                    }`}>
                      {dashProject?.status ? dashProject.status.charAt(0).toUpperCase() + dashProject.status.slice(1) : ''}
                    </span>
                    <button onClick={() => setActive('milestones')} className="text-[13px] text-[#10B981] font-semibold hover:underline">
                      View Milestones &rarr;
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[300px] text-center border border-dashed border-[#E2E8F0] rounded-xl">
                  <div className="w-14 h-14 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-4">
                    <CheckCircle2 size={26} className="text-[#94A3B8]" />
                  </div>
                  <h3 className="text-[16px] font-bold text-[#0F172A] mb-1.5">No active projects</h3>
                  <p className="text-[13.5px] text-[#64748B] max-w-[280px] leading-relaxed">
                    Projects you're working on will appear here once clients assign you to a job.
                  </p>
                </div>
              )}
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
            <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-6 lg:p-8 min-h-[400px]">
              <h2 className="text-[20px] font-bold text-[#0F172A] mb-2">Team & Client</h2>
              <p className="text-[14px] text-[#475569] mb-8">People collaborating on your active projects.</p>
              
              {hasActiveProject ? (
                <div className="border border-[#E2E8F0] rounded-xl p-5 hover:border-[#CBD5E1] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#ECFDF5] flex items-center justify-center text-[#10B981] font-bold text-[18px]">
                      C
                    </div>
                    <div>
                      <h3 className="text-[16px] font-bold text-[#0F172A]">Client</h3>
                      <p className="text-[13px] text-[#64748B] mt-0.5">Project: {dashProject.name}</p>
                      <p className="text-[12px] text-[#94A3B8] mt-1 font-mono">ID: {dashProject.clientId}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-14 h-14 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-4">
                    <Circle size={26} className="text-[#94A3B8]" />
                  </div>
                  <h3 className="text-[16px] font-bold text-[#0F172A] mb-1.5">No active team</h3>
                  <p className="text-[13.5px] text-[#64748B] max-w-[280px] leading-relaxed">
                    You have no active project, so there is no client assigned to you yet.
                  </p>
                </div>
              )}
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
