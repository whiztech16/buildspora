import { useEffect, useState } from "react";
import { Lightbulb, User, ChevronRight, CheckCircle2, MessageCircle, MoreVertical, Star, Building2, FileText } from "lucide-react";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";
import InviteContractorModal from "../../components/client/InviteContractorModal";
import { api } from "../../lib/api";

import { getDetailMilestones, getDetailSteps, getProjectType } from "../../data/mockData";

export default function MilestonesTab({ hasContractor: propHasContractor, projectId: propProjectId }: { hasContractor?: boolean; projectId?: string }) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const navigate = useNavigate();
  const { id: paramProjectId } = useParams<{ id: string }>();
  
  // Safely get context if rendered inside an Outlet, otherwise fallback to prop or true
  const context = useOutletContext<{ hasContractor: boolean; projectId?: string }>();
  const hasContractor = context ? context.hasContractor : (propHasContractor ?? true);
  const resolvedProjectId = propProjectId || paramProjectId || context?.projectId;

  const [realProject, setRealProject] = useState<any>(null);
  const [realMilestones, setRealMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!resolvedProjectId) return;
    const fetchMilestones = async () => {
      setLoading(true);
      try {
        const res = await api.get<{ success: boolean; project: any; milestones: any[] }>(`/api/projects/${resolvedProjectId}`);
        if (res.success) {
          setRealProject(res.project);
          setRealMilestones(res.milestones);
        }
      } catch (e) {
        console.error("Failed to fetch project milestones", e);
      } finally {
        setLoading(false);
      }
    };
    fetchMilestones();
  }, [resolvedProjectId]);

  const projectType = getProjectType();
  
  const milestonesToRender = realMilestones.length > 0
    ? realMilestones.map(m => ({
        id: m.id,
        name: m.name,
        amount: `₦${Number(m.allocatedAmount).toLocaleString()}`,
        status: m.status === 'pending' ? 'Pending' : m.status.charAt(0).toUpperCase() + m.status.slice(1),
        icon: FileText
      }))
    : getDetailMilestones(projectType, hasContractor);

  const STEPS = realMilestones.length > 0
    ? realMilestones.map((m, idx) => ({
        name: m.name,
        completed: m.status === 'approved',
        current: m.status === 'pending' && (idx === 0 || realMilestones[idx - 1].status === 'approved')
      }))
    : getDetailSteps(projectType);

  const overallBudget = realProject?.budget 
    ? `₦${Number(realProject.budget).toLocaleString()}` 
    : "₦12,000,000";
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <span className="text-gray-500">Loading milestones...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 mb-10">

      {!hasContractor ? (
        // -------------------------------------------------------------
        // STATE 1: NO CONTRACTOR (Empty/Pending State)
        // -------------------------------------------------------------
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6 mb-2">
          {/* Simple Project Progress Card */}
          <div className="bg-white border border-[#F1F5F9] rounded-[24px] p-8 shadow-sm flex flex-col justify-center min-h-[220px]">
            <h2 className="text-[17px] font-semibold text-[#0F172A] mb-8">Project Progress</h2>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1 h-[8px] bg-[#F1F5F9] rounded-full overflow-hidden relative">
                <div className="absolute top-0 left-0 h-full bg-[#16A34A] rounded-full" style={{ width: '0%' }}></div>
              </div>
              <span className="ml-6 text-[15px] font-medium text-[#475569]">0%</span>
            </div>
            
            <p className="text-[14.5px] font-medium text-[#64748B]">
              0 of 8 milestones completed
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
              <p className="text-[14px] font-medium text-[#0F172A] mb-1">
                Don't have a contractor?
              </p>
              <a href="#" className="text-[14px] font-semibold text-[#0284C7] flex items-center gap-1 hover:underline w-max">
                Find a Contractor <ChevronRight size={16} />
              </a>
            </div>
          </div>
        </div>
      ) : (
        // -------------------------------------------------------------
        // STATE 2: CONTRACTOR CONNECTED (Active State)
        // -------------------------------------------------------------
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
                  <h2 className="text-[17px] font-bold text-[#0F172A]">BuildRight Construction Ltd.</h2>
                  <CheckCircle2 size={18} className="text-[#16A34A]" strokeWidth={2.5} />
                </div>
                <p className="text-[13.5px] text-[#475569] mb-2">Lead: Engr. Michael Adeyemi</p>
                <div className="flex items-center gap-1.5">
                  <Star size={16} className="text-[#F59E0B] fill-[#F59E0B]" />
                  <span className="text-[13.5px] font-bold text-[#0F172A]">4.8</span>
                  <span className="text-[13.5px] text-[#64748B]">(24 projects)</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 text-[13.5px] font-semibold text-[#0F172A] hover:bg-gray-50 transition-colors shadow-sm">
                <MessageCircle size={16} />
                Message Contractor
              </button>
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-[#475569] hover:bg-gray-50 transition-colors shrink-0">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          {/* Detailed Project Progress Card */}
          <div className="bg-white border border-[#F1F5F9] rounded-[24px] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8 sm:mb-10">
              <h2 className="text-[17px] font-semibold text-[#0F172A]">Project Progress</h2>
              <span className="text-[16px] font-bold text-[#0F172A]">25%</span>
            </div>
            
            <div className="hidden sm:flex items-center justify-between mb-12">
              <div className="flex-1 h-[8px] bg-[#F1F5F9] rounded-full overflow-hidden relative">
                <div className="absolute top-0 left-0 h-full bg-[#16A34A] rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center relative">
              
              {/* Connecting Line Desktop */}
              <div className="hidden sm:block absolute top-[12px] left-[5%] right-[5%] h-[2px] bg-[#F1F5F9] -z-10"></div>
              {/* Connecting Line Mobile */}
              <div className="sm:hidden absolute top-[20px] bottom-[20px] left-[13px] w-[2px] bg-[#F1F5F9] -z-10"></div>
              
              <div className="flex flex-col sm:flex-row justify-between w-full gap-8 sm:gap-0 px-0 sm:px-[5%] relative">
                {STEPS.map((step, idx) => (
                  <div key={idx} className="flex flex-row sm:flex-col items-center gap-4 sm:gap-0 relative bg-transparent z-10 w-full sm:w-auto">
                    {/* Node */}
                    <div className={`w-[26px] h-[26px] rounded-full flex items-center justify-center bg-white sm:mb-4 shrink-0
                      ${step.completed ? 'border-[5px] border-[#16A34A]' : 
                        step.current ? 'border-[5px] border-[#DCFCE7]' : 
                        'border-[5px] border-[#F1F5F9]'}`}
                    >
                      {step.completed ? (
                        <div className="w-[10px] h-[10px] rounded-full bg-[#16A34A] flex items-center justify-center text-white">
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                      ) : (
                        <div className={`w-[8px] h-[8px] rounded-full ${step.current ? 'bg-[#16A34A]' : 'bg-[#94A3B8]'}`}></div>
                      )}
                    </div>
                    
                    {/* Desktop Text */}
                    <span className="hidden sm:block text-[12px] font-medium text-[#0F172A] whitespace-nowrap absolute top-[36px]">
                      {step.name}
                    </span>

                    {/* Mobile Text & Status (Only visible on mobile) */}
                    <div className="flex sm:hidden items-center justify-between flex-1 pb-4 border-b border-gray-100 last:border-none">
                      <span className={`text-[14px] ${step.completed || step.current ? 'font-semibold text-[#0F172A]' : 'font-medium text-[#475569]'}`}>
                        {step.name}
                      </span>
                      {/* Status badge for mobile */}
                      {!step.completed && !step.current && (
                        <span className="text-[12px] font-medium text-[#64748B] bg-[#F1F5F9] px-3 py-1 rounded-full">Pending</span>
                      )}
                      {step.current && (
                        <span className="text-[12px] font-medium text-[#3B82F6] bg-[#DBEAFE] px-3 py-1 rounded-full">In Review</span>
                      )}
                      {step.completed && (
                        <span className="text-[12px] font-medium text-[#16A34A] bg-[#DCFCE7] px-3 py-1 rounded-full flex items-center gap-1">Completed <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <p className="text-[14px] font-medium text-[#64748B] mt-6 sm:mt-12 hidden sm:block">
              2 of 8 milestones completed
            </p>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SHARED SECTION: MILESTONES LIST (Data updates based on state) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white border border-[#F1F5F9] rounded-[24px] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[17px] font-semibold text-[#0F172A]">Milestones</h2>
          <div className="text-right">
            <span className="text-[12px] font-medium text-[#64748B] block mb-0.5 uppercase tracking-wider">Overall Budget</span>
            <span className="text-[18px] font-bold text-[#16A34A]">{overallBudget}</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-3.5">
          {milestonesToRender.map((milestone, idx) => {
            const Icon = milestone.icon;
            return (
              <div 
                key={idx}
                onClick={() => navigate(`/dashboard/client/project/${resolvedProjectId || 1}/milestones/${('id' in milestone ? milestone.id : milestone.name.toLowerCase().replace(/\s+/g, '-'))}`)}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-[16px] border border-[#F1F5F9] hover:border-[#E2E8F0] hover:bg-[#F8FAFC]/50 transition-colors gap-4 cursor-pointer"
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
                      ${milestone.status === 'Completed' ? 'bg-[#DCFCE7] text-[#16A34A] flex items-center gap-1' : 
                        milestone.status === 'In Review' ? 'bg-[#DBEAFE] text-[#3B82F6]' : 
                        'bg-[#F1F5F9] text-[#475569]'}`}
                    >
                      {milestone.status}
                      {milestone.status === 'Completed' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                    </span>
                    <ChevronRight size={18} className="text-[#94A3B8] hidden sm:block" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
