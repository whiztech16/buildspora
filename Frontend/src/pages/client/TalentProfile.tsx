import { useState } from "react";
import { ArrowLeft, MapPin, CheckCircle2, Star, Clock, Briefcase, Users, Calendar, ShieldCheck, ArrowRight, MessageSquare, UserPlus } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TALENTS } from "../../data/mockData";
import ClientSidebar from "../../components/layout/Sidebar";
import HireModal from "../../components/client/HireModal";
import StatusModal from "../../components/shared/StatusModal";

export default function TalentProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { talentId } = useParams();
  const [activeTab, setActiveTab] = useState("About");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const isInsideProject = location.pathname.includes('/project/');
  const talent = TALENTS.find(t => t.id === Number(talentId)) || TALENTS[0];
  const talentName = talent.name;

  const TABS = ["About", "Experience", "Reviews (124)", "Work"];

  const desktopMarginClass = desktopOpen ? "md:ml-[240px]" : "md:ml-[68px]";

  const handlePayNow = () => {
    setIsHireModalOpen(false);
    navigate('/dashboard/client/send-money');
  };

  const handleInvite = () => {
    setIsHireModalOpen(false);
    setIsStatusModalOpen(true);
  };

  return (
    <div className={isInsideProject ? "" : "min-h-screen bg-white"}>
      {/* Include the global sidebar only if not inside a project */}
      {!isInsideProject && (
        <ClientSidebar 
          active="talents" 
          setActive={() => {}} 
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          desktopOpen={desktopOpen}
          setDesktopOpen={setDesktopOpen}
        />
      )}

      {/* Main Content Area next to Sidebar */}
      <main className={`transition-all duration-300 ease-in-out flex flex-col pb-20 animate-fade-in max-w-[1000px] mx-auto w-full px-4 sm:px-6 lg:px-8 ${!isInsideProject ? desktopMarginClass : ''}`}>
        
        {/* Top Bar with Back Button */}
        <div className="py-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-[14px] font-medium text-gray-500 hover:text-[#0F172A] transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-between items-start md:items-center">
        
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
          {/* Profile Image */}
          <div className="relative w-[130px] h-[130px] shrink-0">
            {talent.img ? (
              <img 
                src={talent.img} 
                alt={talentName} 
                className="w-full h-full object-cover rounded-full shadow-sm"
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center rounded-full text-[40px] font-bold ${talent.bgColor || 'bg-[#0F172A]'} ${talent.textColor || 'text-white'}`}>
                {talent.initials}
              </div>
            )}
            {/* The small green check on bottom right of the avatar */}
            <div className="absolute bottom-1 right-1 bg-white rounded-full p-0.5">
              <CheckCircle2 className="text-green-700" fill="currentColor" color="white" size={26} />
            </div>
          </div>

          {/* Name & Info */}
          <div className="flex flex-col pt-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="text-[28px] sm:text-[32px] font-bold text-gray-900 leading-tight">
                {talentName}
              </h1>
              <CheckCircle2 className="text-green-700 mt-1" fill="currentColor" color="white" size={24} />
            </div>
            <p className="text-[17px] text-gray-600 mb-3">{talent.role}</p>
            
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 text-[15px]">
              <div className="flex items-center gap-1.5 font-medium text-gray-800">
                <Star size={18} className="text-[#EAB308] fill-[#EAB308]" /> 
                4.8 <span className="text-gray-500 font-normal">(124 reviews)</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600">
                <MapPin size={18} className="text-gray-400" /> {talent.location}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-800 px-6 py-3 rounded-lg text-[15px] font-semibold hover:bg-gray-50 transition-colors shadow-sm">
            <MessageSquare size={18} />
            Message
          </button>
          <button 
            onClick={() => setIsHireModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#0E793C] text-white px-8 py-3 rounded-lg text-[15px] font-semibold hover:bg-[#0b6330] transition-colors shadow-sm"
          >
            <UserPlus size={18} />
            Hire {talentName.split(' ')[0]}
          </button>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-100 mt-10 gap-8">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-[15px] font-bold whitespace-nowrap transition-colors relative
              ${activeTab === tab ? 'text-[#0E793C]' : 'text-gray-500 hover:text-gray-800'}`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#0E793C] rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === "About" && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
            
            {/* Left Column (Stats & Verification) */}
            <div className="flex flex-col">
              <p className="text-[16px] sm:text-[17px] text-gray-700 font-medium leading-relaxed mb-8">
                I specialize in residential and commercial electrical installations, wiring, and automation.
              </p>

              <div className="space-y-6 text-[15px]">
                {/* Experience */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                  <div className="flex items-center gap-4 text-gray-500">
                    <Briefcase size={20} /> <span className="font-semibold text-gray-700">Experience</span>
                  </div>
                  <span className="font-semibold text-gray-800">8+ years</span>
                </div>
                
                {/* Completed Projects */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                  <div className="flex items-center gap-4 text-gray-500">
                    <Users size={20} /> <span className="font-semibold text-gray-700">Completed Projects</span>
                  </div>
                  <span className="font-semibold text-gray-800">{talent.projects}</span>
                </div>

                {/* Response Time */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                  <div className="flex items-center gap-4 text-gray-500">
                    <Clock size={20} /> <span className="font-semibold text-gray-700">Response Time</span>
                  </div>
                  <span className="font-semibold text-gray-800">Within 2 hours</span>
                </div>

                {/* Member Since */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                  <div className="flex items-center gap-4 text-gray-500">
                    <Calendar size={20} /> <span className="font-semibold text-gray-700">Member Since</span>
                  </div>
                  <span className="font-semibold text-gray-800">Jan 2023</span>
                </div>

                {/* Verification */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                  <div className="flex items-center gap-4 text-gray-500">
                    <ShieldCheck size={20} /> <span className="font-semibold text-gray-700">Verification</span>
                  </div>
                  <span className="font-semibold text-[#0E793C] flex items-center gap-1.5">
                    <CheckCircle2 size={18} fill="currentColor" color="white" />
                    Verified Professional
                  </span>
                </div>
              </div>

              {/* Verified Badge Container */}
              <div className="bg-[#F6FAF6] rounded-xl p-6 mt-8 flex items-start sm:items-center gap-4 border border-green-50">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <ShieldCheck size={24} className="text-[#0E793C]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1 text-[16px]">Verified Professional</h4>
                  <p className="text-gray-600 text-[14px] sm:text-[15px] leading-snug">
                    Background checked and identity verified.<br className="hidden sm:block"/>
                    BuildSpora ensures quality and trust.
                  </p>
                </div>
              </div>

            </div>
            
            {/* Right Column (Skills & Recent Work) */}
            <div className="flex flex-col gap-6">
              
              {/* Skills Card */}
              <div className="border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-[17px] text-gray-900 mb-5">Skills</h3>
                <div className="flex flex-wrap gap-2.5">
                  {["House Wiring", "Lighting Installation", "Fault Finding", "DB Installation", "Earthing", "CCTV Wiring"].map(skill => (
                    <span key={skill} className="bg-gray-100 text-gray-700 px-3.5 py-2 rounded-lg text-[14px] font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent Work Card */}
              <div className="border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-bold text-[17px] text-gray-900">Recent Work</h3>
                  <button className="text-[#0E793C] text-[14px] font-bold flex items-center gap-1 hover:underline">
                    View all work <ArrowRight size={16} />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1541888062972-e1a5e1286c8f?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=300&fit=crop"
                  ].map((src, i) => (
                    <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                      <img 
                        src={src} 
                        alt={`Recent work ${i + 1}`} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Placeholders for other tabs */}
        {activeTab === "Experience" && (
          <div className="py-12 text-center text-gray-500">
            <Briefcase size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Experience Details</h3>
            <p>Detailed work history and experience will appear here.</p>
          </div>
        )}
        
        {activeTab === "Reviews (124)" && (
          <div className="py-12 text-center text-gray-500">
            <Star size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Client Reviews</h3>
            <p>Read what other clients have said about working with {talentName.split(' ')[0]}.</p>
          </div>
        )}
        
        {activeTab === "Work" && (
          <div className="py-12 text-center text-gray-500">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                    <img 
                      src={`https://images.unsplash.com/photo-162190525${i}189-08b45d6a269e?w=800&h=600&fit=crop`} 
                      alt={`Portfolio item ${i}`} 
                      className="w-full h-full object-cover" 
                      onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop" }}
                    />
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>

      <HireModal
        isOpen={isHireModalOpen}
        onClose={() => setIsHireModalOpen(false)}
        talentName={talentName}
        talentRole={talent.role}
        onPayNow={handlePayNow}
        onInvite={handleInvite}
      />

      <StatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        status="success"
        title="Invitation Sent"
        description={`Your invitation has been sent to ${talentName}. You will be notified when they respond.`}
        actionLabel="Done"
        onAction={() => setIsStatusModalOpen(false)}
      />

      </main>

    </div>
  );
}

