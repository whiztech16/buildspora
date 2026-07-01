import { useState } from "react";
import { Search, ChevronDown, MapPin, Briefcase, LayoutGrid, List, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import PostJobDrawer from "../../components/client/PostJobDrawer";

import { CATEGORIES, TALENTS } from "../../data/mockData";

export default function Talents() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);

  const handleViewProfile = (talentId: number) => {
    if (location.pathname.includes('/project/')) {
      // If we are inside a project, keep the project context
      navigate(`${location.pathname}/talents/${talentId}`.replace('/talents/talents/', '/talents/'));
    } else {
      // If we are in the global dashboard, use the global route
      navigate(`/dashboard/client/talents/${talentId}`);
    }
  };

  return (
    <div className="flex flex-col animate-fade-in pb-10">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-[#0F172A] leading-tight">Talents</h1>
          <p className="text-[14px] text-[#64748B] mt-1">Find trusted professionals for your construction projects.</p>
        </div>
        <button 
          onClick={() => setIsPostJobOpen(true)}
          className="bg-[#0F172A] text-white px-5 py-2.5 rounded-lg text-[14px] font-medium hover:bg-black transition-colors self-start sm:self-auto shrink-0"
        >
          Post a Job
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mt-8 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search talents by name, skill or service..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-[14px] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all"
            />
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1 md:pb-0 shrink-0">
            <button className="flex items-center justify-between px-4 py-2.5 bg-white border border-gray-200 rounded-full text-[13.5px] font-medium text-gray-700 min-w-[130px] hover:bg-gray-50 transition-colors whitespace-nowrap">
              Category <ChevronDown size={16} className="text-gray-400 ml-2" />
            </button>
            <button className="flex items-center justify-between px-4 py-2.5 bg-white border border-gray-200 rounded-full text-[13.5px] font-medium text-gray-700 min-w-[130px] hover:bg-gray-50 transition-colors whitespace-nowrap">
              Location <ChevronDown size={16} className="text-gray-400 ml-2" />
            </button>
            <button className="flex items-center justify-between px-4 py-2.5 bg-white border border-gray-200 rounded-full text-[13.5px] font-medium text-gray-700 min-w-[110px] hover:bg-gray-50 transition-colors whitespace-nowrap">
              Filters <ChevronDown size={16} className="text-gray-400 ml-2" />
            </button>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-colors whitespace-nowrap border
                ${activeCategory === category 
                  ? 'bg-[#0F172A] text-white border-[#0F172A]' 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
            >
              {category}
            </button>
          ))}
          <button className="px-4 py-2 rounded-lg text-[13px] font-medium bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors whitespace-nowrap flex items-center gap-1.5 ml-auto">
            More <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-8 mb-6 gap-4">
        <span className="text-[14px] text-gray-600 font-medium">128 talents found</span>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-[13px] font-medium text-gray-700 hover:bg-gray-50">
            Sort by: Relevance <ChevronDown size={14} className="text-gray-400" />
          </button>
          <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200">
            <button className="p-1.5 bg-[#0F172A] text-white rounded-md shadow-sm">
              <LayoutGrid size={16} />
            </button>
            <button className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md">
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Talents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
        {TALENTS.map(talent => (
          <div key={talent.id} className="bg-white border border-gray-200 rounded-[20px] p-5 sm:p-6 hover:shadow-md transition-shadow flex flex-col group">
            
            <div className="w-[60px] h-[60px] rounded-full mb-4 overflow-hidden border-2 border-gray-50 shrink-0">
              {talent.img ? (
                <img src={talent.img} alt={talent.name} className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full flex items-center justify-center text-[18px] font-bold ${talent.bgColor} ${talent.textColor}`}>
                  {talent.initials}
                </div>
              )}
            </div>
            
            <h3 className="text-[17px] font-bold text-[#0F172A] mb-1">{talent.name}</h3>
            <p className="text-[13.5px] text-gray-500 mb-5">{talent.role}</p>
            
            <div className="flex flex-col gap-2.5 mb-6 mt-auto">
              <div className="flex items-center gap-2 text-[13px] text-gray-600">
                <MapPin size={15} className="text-gray-400 shrink-0" />
                <span className="truncate">{talent.location}</span>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-gray-600">
                <Briefcase size={15} className="text-gray-400 shrink-0" />
                <span>{talent.projects} Projects Completed</span>
              </div>
            </div>
            
            <button 
              onClick={() => handleViewProfile(talent.id)}
              className="w-full py-2.5 rounded-lg border border-gray-200 text-[13.5px] font-semibold text-[#0F172A] hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              View Profile
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-12 gap-1.5">
        <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
          <ChevronLeft size={16} />
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#0F172A] text-white font-medium text-[13px]">
          1
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-medium text-[13px]">
          2
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-medium text-[13px]">
          3
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-medium text-[13px]">
          4
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-medium text-[13px]">
          5
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>

      <PostJobDrawer isOpen={isPostJobOpen} onClose={() => setIsPostJobOpen(false)} />

    </div>
  );
}
