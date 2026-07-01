import { FileText, Home, ChevronRight, UserPlus, Calendar, Clock, DollarSign, UserCircle2 } from "lucide-react";
import { useOutletContext, useNavigate } from "react-router-dom";

import { getOverviewMilestones, getProjectType } from "../../data/mockData";

export default function ProjectOverview() {
  const { hasContractor } = useOutletContext<{ hasContractor: boolean }>();
  const navigate = useNavigate();

  const projectType = getProjectType();
  const milestonesToRender = getOverviewMilestones(projectType, hasContractor);
  const completedCount = hasContractor ? 3 : 0;
  const totalCount = 8;
  const progressPercentage = hasContractor ? "37%" : "0%";

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
                style={{ width: progressPercentage }}
              />
            </div>
            <span className="ml-6 text-[14px] font-bold text-[#0F172A]">{progressPercentage}</span>
          </div>
          
          <p className="text-[13.5px] text-[#475569]">
            {completedCount} of {totalCount} milestones completed
          </p>
        </div>

        {/* Milestones List */}
        <div className="bg-white border border-[#F1F5F9] rounded-[24px] p-6 sm:p-8 shadow-sm">
          <h2 className="text-[17px] font-bold text-[#0F172A] mb-6">Milestones</h2>
          
          <div className="flex flex-col">
            {milestonesToRender.map((milestone, idx) => (
              <button 
                key={idx} 
                onClick={() => navigate(`/dashboard/client/project/1/milestones/${milestone.id}`)}
                className="flex items-center justify-between py-4 border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC]/50 transition-colors cursor-pointer text-left w-full rounded-lg px-2 -mx-2"
              >
                <div className="flex items-center gap-4">
                  <div className="w-[40px] h-[40px] rounded-xl bg-white border border-[#F1F5F9] flex items-center justify-center shrink-0 shadow-sm">
                    <milestone.icon size={18} className="text-[#64748B]" strokeWidth={2} />
                  </div>
                  <span className="text-[14.5px] font-bold text-[#0F172A]">{milestone.name}</span>
                </div>
                <div className="flex items-center gap-4 sm:gap-8">
                  <span className="text-[14px] font-bold text-[#0F172A] hidden sm:block w-[100px]">{milestone.amount}</span>
                  <span className={`px-4 py-1.5 rounded-full text-[12px] font-bold w-[90px] text-center
                    ${milestone.status === 'Approved' ? 'bg-[#DCFCE7] text-[#16A34A]' : 
                      milestone.status === 'In Review' ? 'bg-[#DBEAFE] text-[#3B82F6]' : 
                      'bg-[#F1F5F9] text-[#475569]'}`}
                  >
                    {milestone.status}
                  </span>
                  <ChevronRight size={18} className="text-gray-400 shrink-0" />
                </div>
              </button>
            ))}
          </div>
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
            <button className="w-full bg-[#16A34A] hover:bg-[#15803d] text-white font-semibold text-[14px] py-3 rounded-xl transition-colors shadow-sm mb-4">
              Hire Contractor
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
              <span className="text-[13px] font-bold text-[#0F172A]">Residential</span>
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
                <span className="text-[13px] font-medium">Total Milestone Amount</span>
              </div>
              <span className="text-[13px] font-bold text-[#0F172A]">₦ —</span>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9]">
              <div className="flex items-center gap-2 text-[#475569]">
                <UserCircle2 size={16} />
                <span className="text-[13px] font-medium">Contractor</span>
              </div>
              <span className="text-[13px] font-bold text-[#0F172A]">Not assigned</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
