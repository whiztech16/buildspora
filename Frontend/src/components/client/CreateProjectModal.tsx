import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { PROJECT_STORAGE_KEY } from "../../data/mockData";

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
  "Taraba", "Yobe", "Zamfara"
];

const NEW_BUILD_MILESTONES = [
  "Land Secured",
  "Site Preparation",
  "Foundation",
  "Block Work",
  "Roofing",
  "Electrical",
  "Finishing",
  "Completed",
];

const RENOVATION_MILESTONES = [
  "Assessment",
  "Demolition",
  "Structural Work",
  "Plumbing/Electrical",
  "Plastering/Tiling",
  "Painting",
  "Finishing",
  "Completed",
];

const NEW_BUILD_WEIGHTS: Record<string, number> = {
  "Land Secured": 0.25,
  "Site Preparation": 0.05,
  "Foundation": 0.15,
  "Block Work": 0.15,
  "Roofing": 0.10,
  "Electrical": 0.10,
  "Finishing": 0.15,
  "Completed": 0.05,
};

const RENOVATION_WEIGHTS: Record<string, number> = {
  "Assessment": 0.05,
  "Demolition": 0.10,
  "Structural Work": 0.20,
  "Plumbing/Electrical": 0.15,
  "Plastering/Tiling": 0.15,
  "Painting": 0.10,
  "Finishing": 0.15,
  "Completed": 0.10,
};

export default function CreateProjectModal({
  isOpen,
  onClose,
}: Readonly<{
  isOpen: boolean;
  onClose: () => void;
}>) {
  const [projectType, setProjectType] = useState<"new" | "renovation">("new");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [milestoneBudgets, setMilestoneBudgets] = useState<Record<string, string>>({});
  const [overallBudgetInput, setOverallBudgetInput] = useState("");
  const navigate = useNavigate();

  const currentMilestones = projectType === "new" ? NEW_BUILD_MILESTONES : RENOVATION_MILESTONES;

  const handleBudgetChange = (milestone: string, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, "");
    setMilestoneBudgets(prev => ({ ...prev, [milestone]: cleanValue }));
  };

  const handleTotalBudgetChange = (value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, "");
    setOverallBudgetInput(cleanValue);

    if (!cleanValue) {
      setMilestoneBudgets({});
      return;
    }
    
    const total = parseInt(cleanValue, 10);
    const weights = projectType === "new" ? NEW_BUILD_WEIGHTS : RENOVATION_WEIGHTS;
    const newMilestoneBudgets: Record<string, string> = {};
    
    currentMilestones.forEach(milestone => {
      const weight = weights[milestone] || 0;
      newMilestoneBudgets[milestone] = Math.round(total * weight).toString();
    });
    
    setMilestoneBudgets(newMilestoneBudgets);
  };

  const filteredStates = NIGERIAN_STATES.filter(state => 
    state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-['Inter',sans-serif]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity" />
      
      {/* Modal Container */}
      <div className="relative bg-white rounded-[20px] w-full max-w-[560px] max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10 shrink-0 rounded-t-[20px]">
          <h2 className="text-[17px] font-bold text-[#0F172A]">Start New Project</h2>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          
          {/* Form Area */}
          <div className="p-6 md:p-8">
            <h3 className="text-[16px] font-bold text-[#0F172A] mb-5">Project Info</h3>
            
            <div className="flex flex-col gap-5">
              {/* Project Name */}
              <div>
                <label htmlFor="projectName" className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
                  Project Name <span className="text-[#059669]">*</span>
                </label>
                <input
                  id="projectName"
                  type="text"
                  placeholder="e.g. Victoria Island Duplex"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] text-[14px] placeholder-gray-400 transition-all text-[#0F172A]"
                />
              </div>

              {/* Project Type */}
              <div>
                <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
                  Project Type <span className="text-[#059669]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {/* New Build Card */}
                  <button
                    onClick={() => setProjectType("new")}
                    className={`relative px-4 py-3.5 rounded-xl border text-left transition-all ${
                      projectType === "new" 
                        ? "border-[#059669] bg-[#059669]/[0.02] shadow-sm shadow-[#059669]/10" 
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <span className={`text-[13.5px] font-medium pr-6 ${projectType === "new" ? "text-[#0F172A]" : "text-gray-600"}`}>
                      New Build
                    </span>
                    {projectType === "new" ? (
                      <CheckCircle2 size={18} className="absolute top-1/2 -translate-y-1/2 right-3 text-[#059669] bg-white rounded-full" />
                    ) : (
                      <Circle size={18} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-200" />
                    )}
                  </button>
                  
                  {/* Renovation Card */}
                  <button
                    onClick={() => setProjectType("renovation")}
                    className={`relative px-4 py-3.5 rounded-xl border text-left transition-all ${
                      projectType === "renovation" 
                        ? "border-[#059669] bg-[#059669]/[0.02] shadow-sm shadow-[#059669]/10" 
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <span className={`text-[13.5px] font-medium pr-6 ${projectType === "renovation" ? "text-[#0F172A]" : "text-gray-600"}`}>
                      Renovation
                    </span>
                    {projectType === "renovation" ? (
                      <CheckCircle2 size={18} className="absolute top-1/2 -translate-y-1/2 right-3 text-[#059669] bg-white rounded-full" />
                    ) : (
                      <Circle size={18} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-200" />
                    )}
                  </button>
                </div>
              </div>

              {/* Property Address */}
              <div>
                <label htmlFor="propertyAddress" className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
                  Property Address <span className="text-[#059669]">*</span>
                </label>
                <input
                  id="propertyAddress"
                  type="text"
                  placeholder="e.g. 15 Admiralty Way, Lekki"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] text-[14px] placeholder-gray-400 transition-all text-[#0F172A]"
                />
              </div>

              {/* City & State Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label htmlFor="city" className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
                    City <span className="text-[#059669]">*</span>
                  </label>
                  <input
                    id="city"
                    type="text"
                    placeholder="e.g. Lagos"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] text-[14px] placeholder-gray-400 transition-all text-[#0F172A]"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
                    State <span className="text-[#059669]">*</span>
                  </label>
                  <div className="relative">
                    <div 
                      className={`relative w-full px-4 py-2.5 rounded-xl border flex items-center justify-between transition-all bg-white ${
                        isDropdownOpen ? "border-[#059669] ring-2 ring-[#059669]/20" : "border-gray-200"
                      }`}
                    >
                      <input
                        id="state"
                        type="text"
                        placeholder="Select state"
                        value={isDropdownOpen ? searchQuery : selectedState}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setIsDropdownOpen(true);
                        }}
                        onFocus={() => {
                          setIsDropdownOpen(true);
                          setSearchQuery("");
                        }}
                        className={`w-full bg-transparent focus:outline-none text-[14px] ${selectedState || isDropdownOpen ? "text-[#0F172A]" : "text-gray-400 placeholder:text-gray-400"}`}
                      />
                      <button
                        type="button"
                        className="cursor-pointer pl-2 border-none bg-transparent"
                        onClick={() => {
                          if (isDropdownOpen) {
                            setIsDropdownOpen(false);
                            setSearchQuery("");
                          } else {
                            setIsDropdownOpen(true);
                            setSearchQuery("");
                          }
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''} shrink-0`}>
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </button>
                    </div>
                    
                    {isDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => {
                          setIsDropdownOpen(false);
                          setSearchQuery("");
                        }} />
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] max-h-[240px] overflow-auto py-1.5 hide-scrollbar">
                          {filteredStates.length > 0 ? (
                            filteredStates.map((state) => (
                              <button
                                type="button"
                                key={state}
                                onClick={() => {
                                  setSelectedState(state);
                                  setSearchQuery("");
                                  setIsDropdownOpen(false);
                                }}
                                className={`w-full px-4 py-2.5 text-[13.5px] cursor-pointer transition-colors flex items-center justify-between border-none ${
                                  selectedState === state 
                                    ? "text-[#059669] font-medium bg-[#059669]/5" 
                                    : "text-[#0F172A] bg-white hover:bg-gray-50"
                                }`}
                              >
                                {state}
                                {selectedState === state && (
                                  <CheckCircle2 size={16} className="text-[#059669]" />
                                )}
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-[13.5px] text-gray-500 text-center">
                              No states found
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Overall Budget */}
              <div>
                <label htmlFor="overallBudget" className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
                  Overall Budget Estimate (₦) <span className="text-[#059669]">*</span>
                </label>
                <input
                  id="overallBudget"
                  type="text"
                  placeholder="e.g. 12,000,000"
                  value={overallBudgetInput ? parseInt(overallBudgetInput, 10).toLocaleString() : ""}
                  onChange={(e) => handleTotalBudgetChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] text-[14px] placeholder-gray-400 transition-all text-[#0F172A] font-semibold"
                />
                <p className="text-[12px] text-gray-500 mt-1.5">
                  Entering a total will automatically distribute the budget across milestones based on standard industry weights.
                </p>
              </div>

              {/* Milestone Budgets */}
              <div className="mt-2 bg-white border border-[#F1F5F9] rounded-xl p-4 sm:p-5">
                <h4 className="text-[14.5px] font-bold text-[#0F172A] mb-4 flex items-center justify-between">
                  <span>Milestone Breakdown</span>
                  <span className="text-[12.5px] font-medium text-gray-500 font-normal">Adjust individual stages</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  {currentMilestones.map((milestone) => (
                    <div key={milestone}>
                      <label className="block text-[12.5px] font-medium text-[#475569] mb-1.5">
                        {milestone}
                      </label>
                      <input
                        type="text"
                        placeholder="0"
                        value={milestoneBudgets[milestone] ? parseInt(milestoneBudgets[milestone]).toLocaleString() : ""}
                        onChange={(e) => handleBudgetChange(milestone, e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] text-[13.5px] placeholder-gray-300 transition-all text-[#0F172A]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white sticky bottom-0 z-10 shrink-0 rounded-b-[20px]">
          <button
            onClick={onClose}
            className="text-[14px] font-medium text-black hover:text-gray-600 transition-colors px-2"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              localStorage.setItem(PROJECT_STORAGE_KEY, projectType);
              onClose();
              navigate("/dashboard/client/project/1");
            }}
            className="flex items-center gap-2 bg-[#059669] hover:bg-[#047857] text-white px-5 py-2.5 rounded-xl text-[13.5px] font-semibold transition-colors shadow-sm shadow-[#059669]/20"
          >
            Create Project
            <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
