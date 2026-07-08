import { FileText, Home, ChevronRight, UserPlus, Calendar, Clock, DollarSign, UserCircle2, Loader2 } from "lucide-react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import InviteContractorModal from "../../components/client/InviteContractorModal";
import { api } from "../../lib/api";

export default function ProjectOverview() {
  const { hasContractor, projectId } = useOutletContext<{ hasContractor: boolean; projectId: string }>();
  const navigate = useNavigate();
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const [realMilestones, setRealMilestones] = useState<any[]>([]);
  const [realProject, setRealProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) { setLoading(false); return; }
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get<{ success: boolean; project: any; milestones: any[] }>(`/api/projects/${projectId}`);
        if (res.success) {
          setRealProject(res.project);
          setRealMilestones(res.milestones);
        }
      } catch { /* fail silently */ } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [projectId]);

  const totalCount = realMilestones.length;
  const approvedCount = realMilestones.filter(m => m.status === "approved").length;
  const progressPct = totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0;
  const totalBudget = realProject?.budget ? `₦${Number(realProject.budget).toLocaleString()}` : "₦—";

  const statusLabel = (s: string) => {
    if (s === "pending") return "Pending";
    if (s === "in_progress") return "In Progress";
    if (s === "submitted") return "In Review";
    if (s === "approved") return "Approved";
    if (s === "rejected") return "Rejected";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT COLUMN: Progress & Milestones */}
      <div className="lg:col-span-2 flex flex-col gap-8">

        {/* Project Progress */}
        <div className="bg-white border border-[#F1F5F9] rounded-[24px] p-6 sm:p-8 shadow-sm">
          <h2 className="text-[17px] font-bold text-[#0F172A] mb-8">Project Progress</h2>

          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 h-[8px] bg-[#F1F5F9] rounded-full overflow-hidden relative">
              <div
                className="absolute top-0 left-0 h-full bg-[#16A34A] rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="ml-6 text-[14px] font-bold text-[#0F172A]">{progressPct}%</span>
          </div>

          <p className="text-[13.5px] text-[#475569]">
            {loading ? "Loading..." : `${approvedCount} of ${totalCount} milestones approved`}
          </p>
        </div>

        {/* Milestones List */}
        <div className="bg-white border border-[#F1F5F9] rounded-[24px] p-6 sm:p-8 shadow-sm">
          <h2 className="text-[17px] font-bold text-[#0F172A] mb-6">Milestones</h2>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-[#16A34A]" size={24} />
            </div>
          ) : realMilestones.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <FileText size={28} className="text-gray-300 mb-3" />
              <p className="text-[13.5px] text-gray-500">No milestones yet</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {realMilestones.map((milestone) => (
                <button
                  key={milestone.id}
                  onClick={() => navigate(`/dashboard/client/project/${projectId}/milestones/${milestone.id}`)}
                  className="flex items-center justify-between py-4 border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC]/50 transition-colors cursor-pointer text-left w-full rounded-lg px-2 -mx-2"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-[40px] h-[40px] rounded-xl bg-white border border-[#F1F5F9] flex items-center justify-center shrink-0 shadow-sm">
                      <FileText size={18} className="text-[#64748B]" strokeWidth={2} />
                    </div>
                    <span className="text-[14.5px] font-bold text-[#0F172A]">{milestone.name}</span>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-8">
                    <span className="text-[14px] font-bold text-[#0F172A] hidden sm:block w-[100px]">
                      {milestone.allocatedAmount ? `₦${Number(milestone.allocatedAmount).toLocaleString()}` : "₦—"}
                    </span>
                    <span className={`px-4 py-1.5 rounded-full text-[12px] font-bold w-[90px] text-center
                      ${milestone.status === "approved" ? "bg-[#DCFCE7] text-[#16A34A]" :
                        milestone.status === "submitted" ? "bg-[#DBEAFE] text-[#3B82F6]" :
                        milestone.status === "rejected" ? "bg-[#FEF2F2] text-[#DC2626]" :
                        milestone.status === "in_progress" ? "bg-[#FEF3C7] text-[#D97706]" :
                        "bg-[#F1F5F9] text-[#475569]"}`}
                    >
                      {statusLabel(milestone.status)}
                    </span>
                    <ChevronRight size={18} className="text-gray-400 shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Sidebar Cards */}
      <div className="lg:col-span-1 flex flex-col gap-6">

        {!hasContractor && (
          <div className="bg-[#FFFDF5] border border-[#FEF0C7] rounded-[24px] p-6">
            <div className="w-[52px] h-[52px] rounded-full bg-[#FEF9C3] flex items-center justify-center mb-5">
              <UserPlus size={24} className="text-[#CA8A04]" strokeWidth={2} />
            </div>
            <h3 className="text-[16px] font-bold text-[#0F172A] mb-3">Contractor Required</h3>
            <p className="text-[13.5px] text-[#475569] leading-relaxed mb-6">
              Assign a contractor before milestone amounts can be confirmed and work can begin.
            </p>
            <button
              onClick={() => setIsInviteOpen(true)}
              className="w-full bg-[#16A34A] hover:bg-[#15803d] text-white font-semibold text-[14px] py-3 rounded-xl transition-colors shadow-sm mb-4"
            >
              Connect Contractor
            </button>
            <div className="text-center">
              <button className="text-[#16A34A] text-[13px] font-semibold hover:underline flex items-center justify-center gap-1.5 w-full">
                <FileText size={14} /> Learn more about hiring
              </button>
            </div>
          </div>
        )}

        {/* Project Summary */}
        <div className="bg-white border border-[#F1F5F9] rounded-[24px] p-6 shadow-sm">
          <h2 className="text-[16px] font-bold text-[#0F172A] mb-6">Project Summary</h2>

          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#475569]">
                <Home size={16} />
                <span className="text-[13px] font-medium">Project Type</span>
              </div>
              <span className="text-[13px] font-bold text-[#0F172A] capitalize">
                {realProject?.type ? realProject.type.replace("_", " ") : "—"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#475569]">
                <Calendar size={16} />
                <span className="text-[13px] font-medium">Start Date</span>
              </div>
              <span className="text-[13px] font-bold text-[#0F172A]">Not set</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#475569]">
                <Clock size={16} />
                <span className="text-[13px] font-medium">Estimated Duration</span>
              </div>
              <span className="text-[13px] font-bold text-[#0F172A]">Not set</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#475569]">
                <DollarSign size={16} />
                <span className="text-[13px] font-medium">Total Budget</span>
              </div>
              <span className="text-[13px] font-bold text-[#0F172A]">{loading ? "—" : totalBudget}</span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9]">
              <div className="flex items-center gap-2 text-[#475569]">
                <UserCircle2 size={16} />
                <span className="text-[13px] font-medium">Contractor</span>
              </div>
              <span className={`text-[13px] font-bold ${hasContractor ? "text-[#16A34A]" : "text-[#0F172A]"}`}>
                {hasContractor ? "Assigned ✓" : "Not assigned"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <InviteContractorModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        projectId={projectId}
      />
    </div>
  );
}
