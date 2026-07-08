import { useState, useEffect } from "react";
import {
  Search, ChevronDown, SlidersHorizontal, Bookmark,
  MapPin, Clock, X, Download, ChevronLeft, FileText, Loader2,
  Building2, User, AlertCircle
} from "lucide-react";
import { api } from "../../lib/api";
import { useNavigate } from "react-router-dom";


// ─── Data ─────────────────────────────────────────────────────────────────────

interface Job {
  id: number | string;
  title: string;
  location: string;
  budget: string;
  budgetType: string;
  postedAt: string;
  category: string;
  projectType: string;
  timeline: string;
  overview: string;
  requirements: string[];
  documents: { name: string; size: string }[];
  status: "open" | "invited" | "applied" | "awarded" | "completed";
  isRealInvite?: boolean;
  onAccept?: () => Promise<void>;
  onDecline?: () => Promise<void>;
}

const JOBS: Job[] = [
  {
    id: 1, title: "3 Bedroom Duplex Construction", location: "Lekki Phase 1, Lagos",
    budget: "₦45,000,000", budgetType: "Budget", postedAt: "2 hours ago",
    category: "Building Construction", projectType: "Residential", timeline: "6 Months",
    overview: "We are looking for an experienced and reliable contractor to deliver a 3 bedroom duplex building project. The project involves clearing, floor, foundation, block work, roofing, electrical and finishing.",
    requirements: ["Proven experience in similar projects", "Good team and project management skills", "Ability to work within budget and timeline", "Quality finishing and attention to detail"],
    documents: [{ name: "Bill of Quantities.pdf", size: "1.4 MB" }],
    status: "open",
  },
  {
    id: 2, title: "Office Building (G+4)", location: "Wuse 2, Abuja",
    budget: "₦120,000,000", budgetType: "Budget", postedAt: "5 hours ago",
    category: "Commercial Construction", projectType: "Commercial", timeline: "12 Months",
    overview: "Construction of a 4-storey office building with basement parking. Full MEP works included.",
    requirements: ["Minimum 10 years experience", "Valid contractor license", "Experience with commercial buildings", "Own equipment is a plus"],
    documents: [{ name: "Architectural Drawings.pdf", size: "8.2 MB" }, { name: "BOQ.xlsx", size: "520 KB" }],
    status: "open",
  },
  {
    id: 3, title: "Interior Finishing & Painting", location: "Victoria Island, Lagos",
    budget: "₦8,500,000", budgetType: "Budget", postedAt: "1 day ago",
    category: "Interior Finishing", projectType: "Residential", timeline: "2 Months",
    overview: "We need a skilled contractor for complete interior finishing of a 5-bedroom apartment including plastering, screeding, painting, tiling, and carpentry works.",
    requirements: ["Skilled in all interior trades", "Good references from past clients", "Can start within 2 weeks"],
    documents: [],
    status: "invited",
  },
  {
    id: 4, title: "Plumbing & Sanitary Installation", location: "Gwarinpa, Abuja",
    budget: "₦6,200,000", budgetType: "Budget", postedAt: "1 day ago",
    category: "MEP Works", projectType: "Residential", timeline: "6 Weeks",
    overview: "Full plumbing and sanitary installation for a duplex. Supply and installation of all sanitary fittings, pipes, tanks and pumps.",
    requirements: ["Certified plumber", "Experience with residential plumbing", "Ability to supply fittings"],
    documents: [{ name: "Plumbing Specs.pdf", size: "900 KB" }],
    status: "applied",
  },
  {
    id: 5, title: "Roofing Work – Metal Sheet", location: "Ibadan, Oyo State",
    budget: "₦7,800,000", budgetType: "Budget", postedAt: "2 days ago",
    category: "Roofing", projectType: "Residential", timeline: "3 Weeks",
    overview: "Supply and installation of long-span aluminium roofing sheets on a completed structural frame. Guttering and fascia boards included.",
    requirements: ["Experienced roofer", "Must supply roofing materials", "Warranty on workmanship"],
    documents: [],
    status: "open",
  },
  {
    id: 6, title: "Electrical Installation", location: "Asokoro, Abuja",
    budget: "₦5,750,000", budgetType: "Budget", postedAt: "2 days ago",
    category: "MEP Works", projectType: "Commercial", timeline: "5 Weeks",
    overview: "Full electrical installation for a commercial property. Includes wiring, distribution boards, sockets, lighting, and generator connection.",
    requirements: ["COREN registered", "Experience in commercial electrical work", "Provide test certificates"],
    documents: [{ name: "Electrical Schedule.pdf", size: "1.1 MB" }],
    status: "open",
  },
  {
    id: 7, title: "Tiling & Flooring Work", location: "Kano, Kano State",
    budget: "₦4,500,000", budgetType: "Budget", postedAt: "3 days ago",
    category: "Interior Finishing", projectType: "Residential", timeline: "4 Weeks",
    overview: "Supply and installation of floor and wall tiles throughout a 4-bedroom bungalow. All materials to be supplied by contractor.",
    requirements: ["Experienced tiler", "Supply and installation", "Portfolio of past work required"],
    documents: [],
    status: "awarded",
  },
];

const TABS = [
  { key: "all", label: "All Jobs", count: 128 },
  { key: "open", label: "Open", count: 86 },
  { key: "invited", label: "Invited", count: 12 },
  { key: "applied", label: "Applied", count: 18 },
  { key: "awarded", label: "Awarded", count: 8 },
  { key: "completed", label: "Completed", count: 6 },
] as const;

type TabKey = typeof TABS[number]["key"];

// ─── Job Detail Panel / Page ────────────────────────────────────────────────

function JobDetail({ job, onClose, isPage = false }: { job: Job; onClose: () => void; isPage?: boolean }) {
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(job.status === "applied" || job.status === "awarded");
  const [loadingAccept, setLoadingAccept] = useState(false);

  return (
    <div className={`flex flex-col h-full ${isPage ? "p-4 sm:p-6" : "p-6"}`} style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex-1 pr-4">
          {isPage && (
            <button onClick={onClose} className="flex items-center gap-1.5 text-[13px] text-[#64748B] hover:text-[#0F172A] mb-4 transition-colors">
              <ChevronLeft size={16} /> Back to Jobs
            </button>
          )}
          <h2 className="text-[18px] font-bold text-[#0F172A] leading-tight mb-2">{job.title}</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-[#64748B]">
            <span className="flex items-center gap-1"><MapPin size={12} strokeWidth={2} />{job.location}</span>
            <span className="flex items-center gap-1"><Clock size={12} strokeWidth={2} />Posted {job.postedAt}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right">
            <p className="text-[18px] font-bold text-[#0F172A]">{job.budget}</p>
            <p className="text-[12px] text-[#94A3B8]">{job.budgetType}</p>
          </div>
          {!isPage && (
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] transition-colors ml-2">
              <X size={16} className="text-[#94A3B8]" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-5">

        {/* Overview */}
        <div>
          <h3 className="text-[14px] font-bold text-[#0F172A] mb-2">Job Overview</h3>
          <p className="text-[13.5px] text-[#475569] leading-relaxed">{job.overview}</p>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-3 border-t border-[#F1F5F9] pt-4 gap-4">
          {[
            { label: "Category", value: job.category },
            { label: "Project Type", value: job.projectType },
            { label: "Timeline", value: job.timeline },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">{item.label}</p>
              <p className="text-[13px] font-semibold text-[#0F172A]">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Requirements */}
        <div className="border-t border-[#F1F5F9] pt-4">
          <h3 className="text-[14px] font-bold text-[#0F172A] mb-3">Requirements</h3>
          <ul className="space-y-2">
            {job.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-[13.5px] text-[#475569]">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#CBD5E1] shrink-0" />
                {req}
              </li>
            ))}
          </ul>
        </div>

        {/* Documents */}
        {job.documents.length > 0 && (
          <div className="border-t border-[#F1F5F9] pt-4">
            <h3 className="text-[14px] font-bold text-[#0F172A] mb-3">Documents</h3>
            <div className="space-y-2">
              {job.documents.map((doc, i) => (
                <div key={i} className="flex items-center justify-between bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <FileText size={15} className="text-[#64748B]" strokeWidth={1.8} />
                    <span className="text-[13px] font-medium text-[#0F172A]">{doc.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] text-[#94A3B8]">{doc.size}</span>
                    <button className="text-[#64748B] hover:text-[#0F172A] transition-colors">
                      <Download size={14} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="pt-4 border-t border-[#F1F5F9] mt-4 flex items-center gap-3">
        <button
          onClick={() => setSaved((s) => !s)}
          className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors shrink-0 ${saved ? "border-[#0F172A] bg-[#0F172A] text-white" : "border-[#E2E8F0] text-[#64748B] hover:border-[#CBD5E1]"}`}
          title={saved ? "Saved" : "Save job"}
        >
          <Bookmark size={16} strokeWidth={1.8} />
        </button>
        {job.isRealInvite && job.onDecline && !applied && (
          <button
            onClick={async () => {
              setLoadingAccept(true);
              await job.onDecline!();
              setLoadingAccept(false);
            }}
            disabled={loadingAccept}
            className="flex-1 py-3 rounded-xl text-[14px] font-semibold transition-colors bg-red-100 text-red-600 hover:bg-red-200 border border-red-200"
          >
            Decline
          </button>
        )}
        <button
          onClick={async () => {
            if (job.isRealInvite && job.onAccept) {
              setLoadingAccept(true);
              await job.onAccept();
              setApplied(true);
              setLoadingAccept(false);
            } else {
              setApplied(true);
            }
          }}
          disabled={applied || loadingAccept}
          className={`flex-1 py-3 rounded-xl text-[14px] font-semibold transition-colors ${
            applied
              ? "bg-[#F0FDF4] text-[#059669] border border-[#DCFCE7] cursor-default"
              : "bg-[#059669] text-white hover:bg-[#047857]"
          }`}
        >
          {loadingAccept ? "Processing..." : (job.isRealInvite ? (applied ? "Accepted" : "Accept Invitation") : (applied ? "Applied" : "I'm Interested"))}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function ContractorJobs() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [mobileDetailJob, setMobileDetailJob] = useState<Job | null>(null);

  // ── Real project fetch ──────────────────────────────
  interface RealProject {
    id: string;
    name: string;
    status: string;
    address: string;
    city: string;
    state: string;
    clientId: string;
    clientName?: string;
  }
  interface RealInvite {
    id: string;
    status: string;
    createdAt: string;
    clientName?: string;
    project?: {
      id: string;
      name: string;
      budget: string;
      city: string;
      state: string;
      type: string;
      description?: string;
    };
  }

  const [realProject, setRealProject] = useState<RealProject | null>(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [realInvites, setRealInvites] = useState<RealInvite[]>([]);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setProjectLoading(true);
      try {
        const [projRes, invRes] = await Promise.all([
          api.get<{ success: boolean; projects: RealProject[] }>('/api/projects').catch(() => null),
          api.get<{ success: boolean; invites: RealInvite[] }>('/api/invites').catch(() => null)
        ]);
        
        if (!isMounted) return;

        if (projRes?.projects && projRes.projects.length > 0) {
          setRealProject(projRes.projects[0]);
        } else {
          setRealProject(null);
        }

        if (invRes?.invites) {
          setRealInvites(invRes.invites.filter((inv) => inv.status === 'pending'));
        }
      } catch {
        // fail silently
      } finally {
        if (isMounted) setProjectLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, []);

  const handleAcceptInvite = async (inviteId: string) => {
    try {
      const res = await api.put<{ success: boolean; error?: string }>(`/api/invites/${inviteId}/accept`, {});
      if (res.success) {
        // Optimistic UI update or refresh
        const newInvites = realInvites.filter(i => i.id !== inviteId);
        setRealInvites(newInvites);
        setSelectedJob(null);
        setMobileDetailJob(null);
        
        // Refetch project
        const projRes = await api.get<{ success: boolean; projects: RealProject[] }>('/api/projects').catch(() => null);
        if (projRes?.projects && projRes.projects.length > 0) {
          setRealProject(projRes.projects[0]);
        }
      } else {
        alert(res.error || "Failed to accept invite");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Failed to accept invite");
      }
    }
  };

  const handleDeclineInvite = async (inviteId: string) => {
    try {
      const res = await api.put<{ success: boolean; error?: string }>(`/api/invites/${inviteId}/decline`, {});
      if (res.success) {
        const newInvites = realInvites.filter(i => i.id !== inviteId);
        setRealInvites(newInvites);
        setSelectedJob(null);
        setMobileDetailJob(null);
      } else {
        alert(res.error || "Failed to decline invite");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Failed to decline invite");
      }
    }
  };

  const mappedInvites: Job[] = realInvites.map(inv => ({
    id: inv.id,
    title: inv.project?.name || "Project Invite",
    location: inv.project?.city && inv.project?.state ? `${inv.project.city}, ${inv.project.state}` : "Unknown Location",
    budget: inv.project?.budget ? `₦${Number(inv.project.budget).toLocaleString()}` : "—",
    budgetType: "Budget",
    postedAt: new Date(inv.createdAt).toLocaleDateString(),
    category: "Project Assignment",
    projectType: inv.project?.type || "Residential",
    timeline: "TBD",
    overview: inv.project?.description || `You have been invited by ${inv.clientName || 'a client'} to work on this project.`,
    requirements: [],
    documents: [],
    status: "invited",
    isRealInvite: true,
    onAccept: () => handleAcceptInvite(inv.id),
    onDecline: () => handleDeclineInvite(inv.id)
  }));

  const allJobs = [...mappedInvites, ...JOBS.filter(j => j.status !== 'invited' || mappedInvites.length === 0)];

  const filtered = allJobs.filter((j) => {
    const matchTab = activeTab === "all" || j.status === activeTab;
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.location.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  // Mobile: show full-page detail
  if (mobileDetailJob) {
    return (
      <div className="md:hidden flex flex-col w-full min-h-full" style={{ fontFamily: "'Inter', sans-serif" }}>
        <JobDetail job={mobileDetailJob} onClose={() => setMobileDetailJob(null)} isPage />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── MY ACTIVE PROJECT ───────────────────────── */}
      <div className="mb-6">
        <h2 className="text-[15px] font-bold text-[#0F172A] mb-3">My Active Project</h2>
        {projectLoading ? (
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 flex items-center gap-3">
            <Loader2 size={18} className="animate-spin text-[#10B981]" />
            <span className="text-[13.5px] text-[#64748B]">Loading project...</span>
          </div>
        ) : realProject ? (
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#F0FDF4] flex items-center justify-center shrink-0">
                <Building2 size={20} className="text-[#10B981]" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-[#0F172A] mb-0.5">{realProject.name}</h3>
                <p className="text-[12.5px] text-[#64748B] mb-1 flex items-center gap-1.5">
                  <MapPin size={12} /> {realProject.address ? `${realProject.address}, ` : ''}{realProject.city}, {realProject.state}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[11.5px] font-bold px-2 py-0.5 rounded-md ${
                    realProject.status === 'active' ? 'bg-[#ECFDF5] text-[#059669]' :
                    realProject.status === 'pending' ? 'bg-[#FFFBEB] text-[#D97706]' :
                    'bg-[#F1F5F9] text-[#64748B]'
                  }`}>
                    {realProject.status.charAt(0).toUpperCase() + realProject.status.slice(1)}
                  </span>
                  <span className="text-[12px] text-[#64748B] flex items-center gap-1">
                    <User size={11} /> Client assigned
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard/contractor', { state: { activeTab: 'milestones' } })}
              className="flex items-center justify-center gap-2 border border-[#10B981] text-[#10B981] px-5 py-2 rounded-lg text-[13.5px] font-semibold hover:bg-[#ECFDF5] transition-colors w-full sm:w-auto"
            >
              View Milestones
            </button>
          </div>
        ) : (
          <div className="bg-white border border-[#E2E8F0] rounded-xl flex flex-col items-center justify-center text-center py-12 px-8">
            <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-3">
              <AlertCircle size={22} className="text-[#94A3B8]" />
            </div>
            <h3 className="text-[14.5px] font-bold text-[#0F172A] mb-1">No active projects</h3>
            <p className="text-[13px] text-[#64748B] max-w-[280px] leading-relaxed">
              Projects you're working on will appear here once clients assign you to a job.
            </p>
          </div>
        )}
      </div>

      {/* ── OPEN JOB BOARD ──────────────────────────── */}
      <h1 className="text-[20px] font-bold text-[#0F172A] tracking-tight mb-4">Open Jobs</h1>

      <>

      {/* Search + Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" strokeWidth={2} />
          <input
            type="text"
            placeholder="Search jobs by title, skill or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-[#E2E8F0] rounded-full text-[13px] text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#0F172A] transition-all bg-white"
          />
        </div>
        {["Category", "Location", "Budget"].map((f) => (
          <button key={f} className="flex items-center gap-1.5 border border-[#E2E8F0] rounded-full px-4 py-2.5 text-[13px] font-medium text-[#0F172A] hover:border-[#CBD5E1] bg-white transition-colors whitespace-nowrap">
            {f} <ChevronDown size={14} className="text-[#94A3B8]" />
          </button>
        ))}
        <button className="flex items-center gap-1.5 border border-[#E2E8F0] rounded-full px-4 py-2.5 text-[13px] font-medium text-[#0F172A] hover:border-[#CBD5E1] bg-white transition-colors">
          <SlidersHorizontal size={14} className="text-[#64748B]" /> Filters
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-[#E2E8F0] mb-4 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => {
          let count: string | number = tab.count;
          if (tab.key === "invited" && mappedInvites.length > 0) {
            count = mappedInvites.length;
          }
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 pb-3 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors
                ${activeTab === tab.key
                  ? "border-[#0F172A] text-[#0F172A]"
                  : "border-transparent text-[#64748B] hover:text-[#0F172A]"}`}
            >
              {tab.label}
              <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${activeTab === tab.key ? "bg-[#F1F5F9] text-[#0F172A]" : "bg-[#F8FAFC] text-[#94A3B8]"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sort row */}
      <div className="flex justify-end mb-3">
        <button className="flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] hover:text-[#0F172A] transition-colors">
          Sort by: Newest <ChevronDown size={14} />
        </button>
      </div>

      {/* Content: split on desktop, list only on mobile */}
      <div className="flex gap-4 flex-1 min-h-0">

        {/* Job list */}
        <div className={`flex flex-col gap-0 border border-[#E2E8F0] rounded-[4px] bg-white overflow-hidden ${selectedJob ? "md:w-[45%] lg:w-[40%]" : "w-full"}`}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
              <p className="text-[14px] font-semibold text-[#0F172A] mb-1">No jobs found</p>
              <p className="text-[13px] text-[#64748B]">Try adjusting your search or filters.</p>
            </div>
          ) : (
            filtered.map((job, idx) => {
              const isSelected = selectedJob?.id === job.id;
              return (
                <button
                  key={job.id}
                  onClick={() => {
                    // Mobile → full page; Desktop → side panel
                    if (window.innerWidth < 768) {
                      setMobileDetailJob(job);
                    } else {
                      setSelectedJob(job);
                    }
                  }}
                  className={`w-full text-left px-5 py-4 border-b border-[#F1F5F9] last:border-none transition-colors
                    ${isSelected ? "bg-[#F8FAFC] border-l-2 border-l-[#0F172A]" : "hover:bg-[#FAFAFA] border-l-2 border-l-transparent"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className={`text-[14px] font-bold leading-snug mb-1 ${isSelected ? "text-[#0F172A]" : "text-[#0F172A]"}`}>{job.title}</p>
                      <p className="text-[12.5px] text-[#64748B] mb-0.5">{job.location}</p>
                      <p className="text-[12px] text-[#94A3B8]">Posted {job.postedAt}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[14px] font-bold text-[#0F172A]">{job.budget}</p>
                      <p className="text-[12px] text-[#94A3B8] mb-2">{job.budgetType}</p>
                      <Bookmark
                        size={15}
                        className="text-[#CBD5E1] hover:text-[#64748B] ml-auto transition-colors"
                        strokeWidth={1.8}
                      />
                    </div>
                  </div>
                  {idx === 0 && (
                    <span className="inline-block mt-2 text-[11px] font-semibold text-[#059669] bg-[#F0FDF4] px-2 py-0.5 rounded-md">New</span>
                  )}
                </button>
              );
            })
          )}

          {/* Pagination */}
          <div className="flex items-center justify-center gap-1 px-5 py-4 border-t border-[#F1F5F9]">
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:bg-[#F1F5F9] transition-colors">
              <ChevronLeft size={14} />
            </button>
            {[1, 2, 3, 4, 5].map((p) => (
              <button
                key={p}
                className={`w-8 h-8 rounded-lg text-[13px] font-medium transition-colors ${p === 1 ? "bg-[#0F172A] text-white" : "text-[#64748B] hover:bg-[#F1F5F9]"}`}
              >
                {p}
              </button>
            ))}
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:bg-[#F1F5F9] transition-colors">
              <ChevronLeft size={14} className="rotate-180" />
            </button>
          </div>
        </div>

        {/* Detail panel — desktop only */}
        {selectedJob && (
          <div className="hidden md:flex flex-col flex-1 border border-[#E2E8F0] rounded-[4px] bg-white overflow-hidden">
            <JobDetail job={selectedJob} onClose={() => setSelectedJob(null)} />
          </div>
        )}
      </div>
      </>
    </div>
  );
}
