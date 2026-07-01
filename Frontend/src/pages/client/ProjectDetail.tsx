import { useState } from "react";
import { Plus, Menu } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import CreateProjectModal from "../../components/client/CreateProjectModal";
import ClientSidebar from "../../components/layout/Sidebar";
import { ArrowLeft, MapPin, Copy, Settings, ChevronDown } from "lucide-react";

const FONT = "'Inter', sans-serif";

import { PROJECT_DATA } from "../../data/mockData";

export default function ProjectDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathParts = location.pathname.split('/');
  const currentRoute = pathParts[pathParts.length - 1];
  const activeTab = currentRoute === '1' ? 'overview' : currentRoute;
  const sidebarActiveTab = "projects";
  
  const isSubPage = (pathParts.includes('milestones') && pathParts[pathParts.length - 1] !== 'milestones') ||
                    (pathParts.includes('payments') && pathParts[pathParts.length - 1] !== 'payments') ||
                    (pathParts.includes('talents') && pathParts[pathParts.length - 1] !== 'talents');

  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasContractor, setHasContractor] = useState(false);

  const desktopMarginClass = desktopOpen ? "md:ml-[240px]" : "md:ml-[68px]";
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: FONT }}>
      
      {/* Sidebar Component */}
      <ClientSidebar 
        active={sidebarActiveTab} 
        setActive={() => {}} // Now handled by routing
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        desktopOpen={desktopOpen}
        setDesktopOpen={setDesktopOpen}
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
              <span style={{ color: "#059669" }}>Spora</span>
            </span>
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="px-4 sm:px-6 md:px-10 pt-8 pb-16 sm:pt-12 sm:pb-24 max-w-[1100px] mx-auto w-full flex-1">
          
          {/* DEV STATE TOGGLE (TEMP) */}
          <div className="flex items-center gap-2 mb-6 justify-end opacity-30 hover:opacity-100 transition-opacity">
            <button 
              onClick={() => {
                if (hasContractor) {
                  setHasContractor(false);
                } else {
                  navigate('/dashboard/client', { state: { activeTab: activeTab === 'overview' ? 'projects' : activeTab } });
                }
              }}
              className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              title="Previous State"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button 
              onClick={() => {
                if (!hasContractor) {
                  setHasContractor(true);
                }
              }}
              disabled={hasContractor}
              className={`p-1.5 rounded-full transition-colors ${hasContractor ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
              title="Next State"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>

          {/* Header */}
          {!isSubPage && (
            <div className="flex flex-col gap-6 mb-8">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => navigate('/dashboard/client')}
                  className="flex items-center gap-2 text-[#475569] hover:text-[#0F172A] transition-colors text-[14px] font-medium"
                >
                  <ArrowLeft size={16} />
                  Back to Projects
                </button>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 bg-[#0F172A] text-white text-[13px] font-semibold px-5 py-2.5 rounded-full hover:bg-black transition-colors cursor-pointer shadow-sm"
                >
                  <Plus size={16} strokeWidth={2.5} />
                  <span>New Project</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-[120px] h-[120px] rounded-[16px] overflow-hidden shrink-0 border border-gray-100 bg-gray-50">
                  <img 
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=400" 
                    alt="Property" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-[24px] sm:text-[28px] font-bold text-[#0F172A] leading-tight">
                      {PROJECT_DATA.location} {PROJECT_DATA.type}
                    </h1>
                    <span className="px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#DCFCE7] text-[#16A34A]">
                      Active
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-[#475569] mb-3">
                    <MapPin size={16} />
                    <span className="text-[14px] font-medium">{PROJECT_DATA.location}, Lagos</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[14px] text-[#475569]">
                    <span className="font-semibold text-[#0F172A]">Project ID:</span> BSP-001234
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <Copy size={14} />
                    </button>
                  </div>
                </div>

                <div className="sm:self-center">
                  <button className="flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-4 py-2.5 text-[14px] font-medium text-[#0F172A] hover:bg-gray-50 transition-colors shadow-sm">
                    <Settings size={16} className="text-gray-500" />
                    Project Settings
                    <ChevronDown size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-8 border-b border-gray-200 mt-4 overflow-x-auto hide-scrollbar">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'milestones', label: 'Milestones' },
                  { id: 'payments', label: 'Payments' },
                  { id: 'team', label: 'Team' },
                  { id: 'documents', label: 'Documents' },
                  { id: 'updates', label: 'Updates' }
                ].map((tab) => {
                  const isActive = activeTab === tab.id || (activeTab === '1' && tab.id === 'overview');
                  return (
                    <button
                      key={tab.id}
                      onClick={() => navigate(`/dashboard/client/project/1${tab.id === 'overview' ? '' : `/${tab.id}`}`)}
                      className={`pb-4 text-[14.5px] font-semibold whitespace-nowrap transition-colors relative ${
                        isActive ? 'text-[#16A34A]' : 'text-[#64748B] hover:text-[#0F172A]'
                      }`}
                    >
                      {tab.label}
                      {isActive && (
                        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#16A34A] rounded-t-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Nested Routes Rendered Here */}
          <Outlet context={{ hasContractor }} />
          
        </div>
      </main>

      {/* Modals */}
      <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
