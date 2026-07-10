import { useEffect, useState } from "react";
import { Lightbulb, User, ChevronRight, CheckCircle2, MessageCircle, Building2, FileText, Loader2 } from "lucide-react";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";
import InviteContractorModal from "../../components/client/InviteContractorModal";
import { api } from "../../lib/api";

export default function MilestonesTab({
  projectId: propProjectId,
}: {
  hasContractor?: boolean; // kept for API compat but IGNORED — derived from fetched data
  projectId?: string;
}) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const navigate = useNavigate();
  const { id: paramProjectId } = useParams<{ id: string }>();

  // Safely get context if rendered inside a Route Outlet
  let context: { hasContractor?: boolean; projectId?: string } | null = null;
  try {
    context = useOutletContext<{ hasContractor?: boolean; projectId?: string }>();
  } catch {
    context = null;
  }

  // Resolve project ID from: prop → URL param → outlet context
  const resolvedProjectId = propProjectId || paramProjectId || context?.projectId;

  // ── Fetch state ──────────────────────────────────────────────
  const [realProject, setRealProject] = useState<any>(null);
  const [realMilestones, setRealMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    // If no projectId at all, stop loading immediately
    if (!resolvedProjectId) {
      setLoading(false);
      setRealProject(null);
      setRealMilestones([]);
      return;
    }
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      setFetchError(false);
      try {
        const res = await api.get<{ success: boolean; project: any; milestones: any[] }>(
          `/api/projects/${resolvedProjectId}`
        );
        if (cancelled) return;
        if (res.success) {
          setRealProject(res.project ?? null);
          setRealMilestones(res.milestones ?? []);
        } else {
          setFetchError(true);
        }
      } catch (e) {
        if (!cancelled) {
          console.error("Failed to fetch project milestones", e);
          setFetchError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, [resolvedProjectId]);

  // ── Derive hasContractor ONLY from fetched data (never from props) ──
  // null  = still loading
  // true  = project fetched & has a contractor
  // false = project fetched but no contractor, OR no project found
  const hasContractor: boolean | null = loading
    ? null
    : realProject
    ? !!realProject.contractorId
    : false; // no project found → treat as no contractor

  // ── Derived display values ───────────────────────────────────
  const approvedCount = realMilestones.filter(m => m.status === "approved").length;
  const totalCount = realMilestones.length;
  const progressPct = totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0;

  const overallBudget = realProject?.budget
    ? `₦${Number(realProject.budget).toLocaleString()}`
    : null;

  const milestonesToRender = realMilestones.map(m => ({
    id: m.id,
    name: m.name,
    amount: m.allocatedAmount ? `₦${Number(m.allocatedAmount).toLocaleString()}` : "₦—",
    status:
      m.status === "pending"   ? "Pending"  :
      m.status === "approved"  ? "Approved" :
      m.status === "submitted" ? "In Review":
      m.status === "rejected"  ? "Rejected" :
      m.status.charAt(0).toUpperCase() + m.status.slice(1),
    icon: FileText,
  }));

  const STEPS = realMilestones.map((m, idx) => ({
    name: m.name,
    completed: m.status === "approved",
    current: m.status !== "approved" && (idx === 0 || realMilestones[idx - 1]?.status === "approved"),
  }));

  // ── Loading state: show spinner while fetching ───────────────
  if (loading || hasContractor === null) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="animate-spin text-[#16A34A]" size={28} />
      </div>
    );
  }

  // ── No project at all (client hasn't created one yet) ────────
  if (!resolvedProjectId || (!realProject && !fetchError)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[360px] text-center bg-white border border-[#F1F5F9] rounded-[24px] p-10 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mb-5">
          <FileText size={28} className="text-[#94A3B8]" strokeWidth={1.5} />
        </div>
        <h3 className="text-[17px] font-bold text-[#0F172A] mb-2">No project yet</h3>
        <p className="text-[14px] text-[#64748B] max-w-[300px] leading-relaxed mb-6">
          Create your first project to start adding milestones and tracking progress.
        </p>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────
  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
        <p className="text-[14px] font-medium text-gray-700 mb-2">Failed to load milestones</p>
        <button
          onClick={() => { setLoading(true); setFetchError(false); }}
          className="text-[13px] text-[#16A34A] font-semibold hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 mb-10">

      {!hasContractor ? (
        // STATE 1: NO CONTRACTOR ASSIGNED
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6 mb-2">
          {/* Simple Project Progress Card */}
          <div className="bg-white border border-[#F1F5F9] rounded-[24px] p-8 shadow-sm flex flex-col justify-center min-h-[220px]">
            <h2 className="text-[17px] font-semibold text-[#0F172A] mb-8">Project Progress</h2>
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1 h-[8px] bg-[#F1F5F9] rounded-full overflow-hidden relative">
                <div className="absolute top-0 left-0 h-full bg-[#16A34A] rounded-full" style={{ width: "0%" }}></div>
              </div>
              <span className="ml-6 text-[15px] font-medium text-[#475569]">0%</span>
            </div>
            <p className="text-[14.5px] font-medium text-[#64748B]">
              0 of {totalCount || "—"} milestones completed
            </p>
          </div>

          {/* Connect Contractor Info Card */}
          <div className="bg-[#FFFDF7] border border-[#FEF3C7] rounded-[24px] p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="w-[48px] h-[48px] rounded-full bg-[#FEF3C7]/60 flex items-center justify-center shrink-0">
              <Lightbulb size={24} className="text-[#D97706]" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col">
              <h3 className="text-[15px] font-semibold text-[#0F172A] leading-relaxed mb-4">
                Milestone amounts will be confirmed once a contractor is assigned to your project.
              </h3>
              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="flex items-center justify-center gap-2 w-full sm:w-max px-6 py-2.5 bg-[#0F172A] text-white text-[13.5px] font-medium rounded-xl mb-4 hover:bg-black transition-colors shadow-sm"
              >
                <User size={16} />
                Connect Existing Contractor
              </button>
              <p className="text-[13.5px] text-[#475569] mb-4 leading-relaxed">
                Already have a contractor? Invite them to manage milestones and project updates.
              </p>
            </div>
          </div>
        </div>
      ) : (
        // STATE 2: CONTRACTOR CONNECTED
        <div className="flex flex-col gap-6 mb-2">
          {/* Contractor Profile Card */}
          <div className="bg-white border border-[#F1F5F9] rounded-[24px] p-6 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-[60px] h-[60px] rounded-full bg-black flex items-center justify-center shrink-0">
                <Building2 size={28} className="text-[#16A34A]" strokeWidth={1.5} />
              </div>
              <div>
                <span className="text-[12px] font-medium text-gray-500 uppercase tracking-wider mb-1 block">Contractor</span>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <h2 className="text-[17px] font-bold text-[#0F172A]">Assigned</h2>
                  <CheckCircle2 size={18} className="text-[#16A34A]" strokeWidth={2.5} />
                </div>
                <p className="text-[13.5px] text-[#475569] mb-2">Contractor is connected to this project</p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 text-[13.5px] font-semibold text-[#0F172A] hover:bg-gray-50 transition-colors shadow-sm">
                <MessageCircle size={16} />
                Message Contractor
              </button>
            </div>
          </div>

          {/* Real Project Progress Card */}
          <div className="bg-white border border-[#F1F5F9] rounded-[24px] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8 sm:mb-10">
              <h2 className="text-[17px] font-semibold text-[#0F172A]">Project Progress</h2>
              <span className="text-[16px] font-bold text-[#0F172A]">{progressPct}%</span>
            </div>

            <div className="hidden sm:flex items-center justify-between mb-12">
              <div className="flex-1 h-[8px] bg-[#F1F5F9] rounded-full overflow-hidden relative">
                <div
                  className="absolute top-0 left-0 h-full bg-[#16A34A] rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                ></div>
              </div>
            </div>

            {STEPS.length > 0 && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center relative">
                <div className="hidden sm:block absolute top-[12px] left-[5%] right-[5%] h-[2px] bg-[#F1F5F9] -z-10"></div>
                <div className="sm:hidden absolute top-[20px] bottom-[20px] left-[13px] w-[2px] bg-[#F1F5F9] -z-10"></div>
                <div className="flex flex-col sm:flex-row justify-between w-full gap-8 sm:gap-0 px-0 sm:px-[5%] relative">
                  {STEPS.map((step, idx) => (
                    <div key={idx} className="flex flex-row sm:flex-col items-center gap-4 sm:gap-0 relative bg-transparent z-10 w-full sm:w-auto">
                      <div className={`w-[26px] h-[26px] rounded-full flex items-center justify-center bg-white sm:mb-4 shrink-0
                        ${step.completed ? "border-[5px] border-[#16A34A]" :
                          step.current   ? "border-[5px] border-[#DCFCE7]" :
                                           "border-[5px] border-[#F1F5F9]"}`}>
                        {step.completed ? (
                          <div className="w-[10px] h-[10px] rounded-full bg-[#16A34A] flex items-center justify-center text-white">
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </div>
                        ) : (
                          <div className={`w-[8px] h-[8px] rounded-full ${step.current ? "bg-[#16A34A]" : "bg-[#94A3B8]"}`}></div>
                        )}
                      </div>
                      <span className="hidden sm:block text-[12px] font-medium text-[#0F172A] whitespace-nowrap absolute top-[36px]">
                        {step.name}
                      </span>
                      <div className="flex sm:hidden items-center justify-between flex-1 pb-4 border-b border-gray-100 last:border-none">
                        <span className={`text-[14px] ${step.completed || step.current ? "font-semibold text-[#0F172A]" : "font-medium text-[#475569]"}`}>
                          {step.name}
                        </span>
                        {!step.completed && !step.current && (
                          <span className="text-[12px] font-medium text-[#64748B] bg-[#F1F5F9] px-3 py-1 rounded-full">Pending</span>
                        )}
                        {step.current && (
                          <span className="text-[12px] font-medium text-[#3B82F6] bg-[#DBEAFE] px-3 py-1 rounded-full">In Progress</span>
                        )}
                        {step.completed && (
                          <span className="text-[12px] font-medium text-[#16A34A] bg-[#DCFCE7] px-3 py-1 rounded-full flex items-center gap-1">Approved</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-[14px] font-medium text-[#64748B] mt-6 sm:mt-12 hidden sm:block">
              {approvedCount} of {totalCount} milestones completed
            </p>
          </div>
        </div>
      )}

      {/* SHARED SECTION: MILESTONES LIST */}
      <div className="bg-white border border-[#F1F5F9] rounded-[24px] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[17px] font-semibold text-[#0F172A]">Milestones</h2>
          {overallBudget && (
            <div className="text-right">
              <span className="text-[12px] font-medium text-[#64748B] block mb-0.5 uppercase tracking-wider">Overall Budget</span>
              <span className="text-[18px] font-bold text-[#16A34A]">{overallBudget}</span>
            </div>
          )}
        </div>

        {milestonesToRender.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText size={32} className="text-gray-300 mb-3" />
            <p className="text-[14px] font-medium text-gray-700 mb-1">No milestones yet</p>
            <p className="text-[13px] text-gray-500">Milestones will appear here once the project is set up.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {milestonesToRender.map((milestone) => {
              const Icon = milestone.icon;
              return (
                <div
                  key={milestone.id}
                  onClick={() => {
                    if (resolvedProjectId) {
                      navigate(`/dashboard/client/project/${resolvedProjectId}/milestones/${milestone.id}`);
                    }
                  }}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-[16px] border border-[#F1F5F9] hover:border-[#E2E8F0] hover:bg-[#F8FAFC]/50 transition-colors gap-4 ${resolvedProjectId ? "cursor-pointer" : "cursor-default"}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-[42px] h-[42px] rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-[#64748B]" strokeWidth={1.8} />
                    </div>
                    <span className="text-[14.5px] font-medium text-[#0F172A]">{milestone.name}</span>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 lg:gap-[60px] w-full sm:w-auto pl-[58px] sm:pl-0">
                    <span className="text-[14.5px] font-bold text-[#0F172A]">{milestone.amount}</span>
                    <div className="flex items-center gap-4">
                      <span className={`px-4 py-1.5 rounded-full text-[13px] font-medium min-w-[90px] flex justify-center text-center
                        ${milestone.status === "Approved" ? "bg-[#DCFCE7] text-[#16A34A]" :
                          milestone.status === "In Review" ? "bg-[#DBEAFE] text-[#3B82F6]" :
                          milestone.status === "Rejected"  ? "bg-[#FEF2F2] text-[#DC2626]" :
                          "bg-[#F1F5F9] text-[#475569]"}`}
                      >
                        {milestone.status}
                      </span>
                      {resolvedProjectId && <ChevronRight size={18} className="text-[#94A3B8] hidden sm:block" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <InviteContractorModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        projectId={resolvedProjectId || ""}
      />
    </div>
  );
}
