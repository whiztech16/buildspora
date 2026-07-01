import { useState, useEffect } from "react";
import { X, Calendar, UploadCloud, CheckCircle2 } from "lucide-react";
import SearchableSelect from "../shared/SearchableSelect";

const CATEGORIES = ["Electrical", "Plumbing", "Roofing"];
const PROJECTS = ["Victoria Island Duplex", "Lekki Renovation", "No Project"];
const STATES = ["Lagos", "Abuja", "Rivers"];
const RATINGS = ["4 Stars & Above", "3 Stars & Above", "Any Rating"];

interface PostJobDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PostJobDrawer({ isOpen, onClose }: PostJobDrawerProps) {
  const [isRendered, setIsRendered] = useState(false);

  // Handle animation mounting/unmounting
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsRendered(true), 0);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    } else {
      const timer = setTimeout(() => setIsRendered(false), 300);
      document.body.style.overflow = "auto";
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !isRendered) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      
      {/* Backdrop overlay */}
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Sliding Drawer */}
      <div 
        className={`relative w-full sm:w-[600px] md:w-[680px] bg-white h-full shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        
        {/* Header */}
        <div className="flex items-start justify-between p-6 sm:p-8 border-b border-gray-100 shrink-0 bg-white z-10">
          <div>
            <h2 className="text-[22px] font-bold text-[#0F172A] mb-1">Post a Job</h2>
            <p className="text-[14px] text-gray-500">Find the right professional for your project.</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
          <form className="flex flex-col gap-8 pb-10">
            
            {/* 1. Job Information */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[15px] font-bold text-[#0F172A]">1. Job Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-gray-700">Job Title <span className="text-red-500">*</span></label>
                  <input type="text" defaultValue="Install Electrical Wiring" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all" />
                </div>
                <SearchableSelect
                  id="category"
                  label="Category"
                  options={CATEGORIES}
                  required
                />
              </div>
            </div>

            {/* 2. Project */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[15px] font-bold text-[#0F172A]">2. Project</h3>
              <div className="flex flex-col gap-1.5">
                <SearchableSelect
                  id="project"
                  label="Project (Optional)"
                  options={PROJECTS}
                />
                <p className="text-[12px] text-gray-500 mt-0.5">Select a project or leave blank to post a general job.</p>
              </div>
            </div>

            {/* 3. Description */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[15px] font-bold text-[#0F172A]">3. Description</h3>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-gray-700">Describe the work <span className="text-red-500">*</span></label>
                <textarea 
                  rows={4}
                  defaultValue="Need complete electrical wiring for a 4-bedroom duplex. Include wiring, sockets, switches, distribution board and grounding."
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all resize-none"
                />
                <div className="flex justify-end text-[12px] text-gray-400 mt-1">120/1000</div>
              </div>
            </div>

            {/* 4. Location */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[15px] font-bold text-[#0F172A]">4. Location</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <SearchableSelect
                  id="state"
                  label="State"
                  options={STATES}
                  required
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-gray-700">Area / City <span className="text-red-500">*</span></label>
                  <input type="text" defaultValue="Lekki Phase 1" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all" />
                </div>
              </div>
            </div>

            {/* 5. Budget */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[15px] font-bold text-[#0F172A]">5. Budget</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2.5">
                  <label className="text-[13px] font-medium text-gray-700">Budget Type <span className="text-red-500">*</span></label>
                  <div className="flex items-center gap-6 mt-1">
                    <label className="flex items-center gap-2 text-[13.5px] text-gray-700 cursor-pointer">
                      <div className="w-[18px] h-[18px] rounded-full border-[5px] border-[#0F172A] bg-white flex items-center justify-center shadow-sm"></div>
                      <span className="font-medium text-[#0F172A]">Fixed Budget</span>
                    </label>
                    <label className="flex items-center gap-2 text-[13.5px] text-gray-600 cursor-pointer">
                      <div className="w-[18px] h-[18px] rounded-full border border-gray-300 bg-white"></div>
                      <span>Request Quotes</span>
                    </label>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-gray-700">Budget (NGN) <span className="text-red-500">*</span></label>
                  <input type="text" defaultValue="500,000" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all" />
                  <p className="text-[12px] text-gray-500 mt-0.5">Enter your total budget</p>
                </div>
              </div>
            </div>

            {/* 6. Timeline */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[15px] font-bold text-[#0F172A]">6. Timeline</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-gray-700">Start Date <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type="text" defaultValue="Jun 20, 2026" className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all cursor-pointer" readOnly />
                    <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-gray-700">Expected Completion <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type="text" defaultValue="Jul 20, 2026" className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all cursor-pointer" readOnly />
                    <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* 7. Attachments */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[15px] font-bold text-[#0F172A]">7. Attachments <span className="text-gray-400 font-normal">(Optional)</span></h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div className="border border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer group">
                  <UploadCloud size={24} className="text-gray-400 group-hover:text-[#0F172A] transition-colors mb-1" />
                  <span className="text-[13px] font-semibold text-[#0F172A]">Upload Images</span>
                  <span className="text-[11px] text-gray-400 text-center">JPG, PNG (Max 10MB)</span>
                </div>
                
                <div className="border border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer group">
                  <UploadCloud size={24} className="text-gray-400 group-hover:text-[#0F172A] transition-colors mb-1" />
                  <span className="text-[13px] font-semibold text-[#0F172A]">Upload Plans</span>
                  <span className="text-[11px] text-gray-400 text-center">PDF (Max 10MB)</span>
                </div>
                
                <div className="border border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer group">
                  <UploadCloud size={24} className="text-gray-400 group-hover:text-[#0F172A] transition-colors mb-1" />
                  <span className="text-[13px] font-semibold text-[#0F172A]">Upload BOQ</span>
                  <span className="text-[11px] text-gray-400 text-center">Excel, PDF (Max 10MB)</span>
                </div>

              </div>
            </div>

            {/* 8. Talent Preferences */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[15px] font-bold text-[#0F172A]">8. Talent Preferences</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-medium text-gray-700">Verified Professionals Only</label>
                  <label className="flex items-center gap-2 mt-1 cursor-pointer">
                    <div className="w-[18px] h-[18px] rounded-[4px] bg-[#0F172A] flex items-center justify-center shrink-0">
                      <CheckCircle2 size={12} strokeWidth={3} className="text-white" />
                    </div>
                    <span className="text-[13.5px] text-gray-700">Show only verified professionals</span>
                  </label>
                </div>
                <SearchableSelect
                  id="rating"
                  label="Minimum Rating"
                  options={RATINGS}
                />
              </div>
            </div>

          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-white shrink-0 flex items-center justify-between sm:justify-end gap-3 z-10">
          <button className="flex-1 sm:flex-none px-6 py-2.5 border border-gray-200 text-gray-700 text-[14px] font-semibold rounded-lg hover:bg-gray-50 transition-colors">
            Save Draft
          </button>
          <button className="flex-1 sm:flex-none px-8 py-2.5 bg-[#0F172A] text-white text-[14px] font-semibold rounded-lg hover:bg-black transition-colors shadow-sm">
            Post Job
          </button>
        </div>

      </div>
    </div>
  );
}
