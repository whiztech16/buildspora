import { useState } from "react";
import { ArrowLeft, Image as ImageIcon, MapPin, Star, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SearchableSelect from "../../components/shared/SearchableSelect";

const STEPS = [
  { id: 1, name: "Service Details" },
  { id: 2, name: "Pricing" },
  { id: 3, name: "Preview & Submit" }
];

const CATEGORIES = [
  "Electrical", "Plumbing", "Masonry", "Roofing", 
  "Tiling", "Painting", "Carpentry", "Plastering", "General"
];

export default function PostServicePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [detailedDesc, setDetailedDesc] = useState("");
  const [pricingType, setPricingType] = useState("fixed");
  const [price, setPrice] = useState("");
  const [included, setIncluded] = useState("");
  const [notIncluded, setNotIncluded] = useState("");

  const handleClose = () => {
    navigate("/dashboard/contractor");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-['Inter',sans-serif]">
      
      {/* Header */}
      <div className="flex items-center gap-4 px-6 sm:px-10 py-5 bg-white shrink-0 sticky top-0 z-10">
        <button 
          onClick={handleClose} 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-[#0F172A] transition-colors shrink-0"
          aria-label="Go back"
        >
          <ArrowLeft size={22} strokeWidth={2} />
        </button>
        <div>
          <h2 className="text-[20px] font-bold text-[#0F172A] mb-0.5">Offer a Service</h2>
          <p className="text-[13.5px] text-[#475569]">
            Add a new service to let clients know what you offer.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row max-w-[1200px] mx-auto w-full">
        
        {/* Left Sidebar Steps */}
        <div className="w-full md:w-[260px] lg:w-[300px] shrink-0 p-6 md:p-8 hidden md:block">
          <div className="flex flex-col gap-3">
            {STEPS.map((step) => {
              const isActive = step.id === currentStep;
              const isPast = step.id < currentStep;
              let stepBgClass = 'bg-[#E2E8F0] text-[#64748B]';
              if (isActive) stepBgClass = 'bg-[#059669] text-white';
              else if (isPast) stepBgClass = 'bg-[#16A34A] text-white';

              return (
                <div key={step.id} className="flex items-center gap-3">
                  <div 
                    className={`flex items-center gap-3 w-full py-3 transition-colors
                      ${isActive ? 'text-[#059669]' : 'text-[#475569]'}`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 ${stepBgClass}`}>
                      {step.id}
                    </div>
                    <span className={`text-[14.5px] font-bold ${isActive ? 'text-[#059669]' : 'text-[#0F172A]'}`}>
                      {step.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Steps Header */}
        <div className="md:hidden flex items-center justify-center gap-3 p-5 bg-white">
          {STEPS.map((step) => {
            let stepBgClass = 'bg-[#E2E8F0] text-[#64748B]';
            if (step.id === currentStep) stepBgClass = 'bg-[#059669] text-white';
            else if (step.id < currentStep) stepBgClass = 'bg-[#16A34A] text-white';
            return (
              <div 
                key={step.id} 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 ${stepBgClass}`}
              >
                {step.id}
              </div>
            );
          })}
        </div>

        {/* Form Content Wrapper */}
        <div className="flex-1 p-4 sm:p-6 md:p-8">
          <div className="bg-white h-full flex flex-col overflow-hidden max-w-[800px]">
            
            <div className="flex-1 p-2 sm:p-4 overflow-y-auto">
              {currentStep === 1 && (
                <div className="animate-fade-in">
                  <h3 className="text-[17px] font-bold text-[#0F172A] mb-6">1. Service Details</h3>
                  
                  <div className="flex flex-col sm:flex-row gap-6 mb-6">
                    <div className="flex-1">
                      <label htmlFor="serviceTitle" className="block text-[13.5px] font-bold text-[#0F172A] mb-1.5">
                        Service Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="serviceTitle"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='e.g. "Electrical Wiring Installation"'
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] text-[14.5px] placeholder-gray-400 transition-all text-[#0F172A]"
                      />
                    </div>
                    <div className="flex-1">
                      <SearchableSelect
                      id="serviceCategory"
                      label="Category"
                      required
                      placeholder="Select category"
                      options={CATEGORIES}
                      value={category}
                      onChange={(val) => setCategory(val)}
                    />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="shortDescription" className="block text-[13.5px] font-bold text-[#0F172A] mb-1.5">
                      Short Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="shortDescription"
                      rows={2}
                      maxLength={150}
                      value={shortDesc}
                      onChange={(e) => setShortDesc(e.target.value)}
                      placeholder="What does this service include?"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] text-[14.5px] placeholder-gray-400 transition-all text-[#0F172A] resize-none"
                    />
                    <div className="text-right text-[12.5px] text-gray-400 mt-1.5">{shortDesc.length}/150</div>
                  </div>

                  <div className="mb-6 flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                      <label htmlFor="detailedDescription" className="block text-[13.5px] font-bold text-[#0F172A] mb-1.5">
                        Detailed Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="detailedDescription"
                        rows={6}
                        maxLength={1000}
                        value={detailedDesc}
                        onChange={(e) => setDetailedDesc(e.target.value)}
                        placeholder="Describe in detail what clients get"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] text-[14.5px] placeholder-gray-400 transition-all text-[#0F172A] resize-none"
                      />
                      <div className="text-right text-[12.5px] text-gray-400 mt-1.5">{detailedDesc.length}/1000</div>
                    </div>
                    
                    <div className="w-full lg:w-[240px]">
                      <span className="block text-[13.5px] font-bold text-[#0F172A] mb-1.5">
                        Upload Images (Optional)
                      </span>
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center h-[180px] cursor-pointer hover:border-[#059669]/50 hover:bg-[#F8FAFC] transition-colors">
                        <ImageIcon size={28} className="text-gray-400 mb-3" />
                        <span className="text-[13.5px] font-medium text-[#0F172A] mb-1.5">Drag and drop images here</span>
                        <span className="text-[13px] text-gray-500 mb-3">or click to browse</span>
                        <span className="text-[11.5px] text-gray-400 px-2 leading-tight">
                          Up to 5 images<br />JPG/PNG max 5MB each
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {currentStep === 2 && (
                <div className="animate-fade-in">
                  <h3 className="text-[17px] font-bold text-[#0F172A] mb-6">2. Pricing</h3>
                  
                  <div className="mb-8">
                    <label className="block text-[13.5px] font-bold text-[#0F172A] mb-3">
                      Pricing Type <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { id: 'fixed', label: 'Fixed Price' },
                        { id: 'daily', label: 'Price Per Day' },
                        { id: 'quote', label: 'Request a Quote' }
                      ].map(type => (
                        <button
                          key={type.id}
                          onClick={() => setPricingType(type.id)}
                          className={`flex items-center justify-center py-3.5 px-4 rounded-xl border-2 transition-colors text-[13.5px] font-bold
                            ${pricingType === type.id 
                              ? 'bg-[#ECFDF5] border-[#059669] text-[#059669]' 
                              : 'bg-white border-gray-100 text-[#475569] hover:border-gray-200 hover:text-[#0F172A]'}`}
                        >
                          {type.label}
                          {type.id === 'quote' && <span className="ml-1.5 font-medium text-[11.5px] opacity-70">(Negotiable)</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {pricingType !== 'quote' && (
                    <div className="mb-8">
                      <label htmlFor="price" className="block text-[13.5px] font-bold text-[#0F172A] mb-1.5">
                        Price (₦) <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="price"
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="e.g. 150000"
                        className="w-full sm:w-1/2 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] text-[14.5px] placeholder-gray-400 transition-all text-[#0F172A]"
                      />
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-6 mb-6">
                    <div className="flex-1">
                      <label htmlFor="included" className="block text-[13.5px] font-bold text-[#0F172A] mb-1.5">
                        What's included (Optional)
                      </label>
                      <textarea
                        id="included"
                        rows={3}
                        value={included}
                        onChange={(e) => setIncluded(e.target.value)}
                        placeholder="e.g. Labour + minor materials"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] text-[14.5px] placeholder-gray-400 transition-all text-[#0F172A] resize-none"
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="notIncluded" className="block text-[13.5px] font-bold text-[#0F172A] mb-1.5">
                        What's NOT included (Optional)
                      </label>
                      <textarea
                        id="notIncluded"
                        rows={3}
                        value={notIncluded}
                        onChange={(e) => setNotIncluded(e.target.value)}
                        placeholder="e.g. Cost of major materials"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] text-[14.5px] placeholder-gray-400 transition-all text-[#0F172A] resize-none"
                      />
                    </div>
                  </div>

                </div>
              )}

              {currentStep === 3 && (
                <div className="animate-fade-in flex flex-col h-full">
                  <h3 className="text-[17px] font-bold text-[#0F172A] mb-2">3. Preview & Submit</h3>
                  <p className="text-[14px] text-[#475569] mb-8">Your service will appear as:</p>
                  
                  {/* Preview Card */}
                  <div className="bg-white rounded-[20px] border border-[#E2E8F0] shadow-md p-6 sm:p-8 max-w-[440px] mx-auto w-full">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-[52px] h-[52px] rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                        <img src="https://ui-avatars.com/api/?name=Emeka+Okafor&background=059669&color=fff&size=52" alt="Emeka" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-[15.5px] font-bold text-[#0F172A] flex items-center gap-1.5 mb-0.5">
                          Emeka Okafor
                          <ShieldCheck size={16} className="text-[#059669]" />
                        </h4>
                        <p className="text-[13.5px] text-[#64748B]">5 years experience</p>
                      </div>
                    </div>
                    
                    <div className="mb-5">
                      <span className="inline-block px-3 py-1.5 rounded-md bg-[#F1F5F9] text-[#475569] text-[11.5px] font-bold uppercase tracking-wider mb-3">
                        {category || "Category"}
                      </span>
                      <h3 className="text-[20px] font-bold text-[#0F172A] leading-snug mb-3">
                        {title || "Service Title"}
                      </h3>
                      <div className="flex items-center gap-4 text-[13.5px] text-[#64748B] mb-1">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={16} className="text-[#94A3B8]" /> Lagos, Nigeria
                        </div>
                        <div className="flex items-center gap-1.5 text-[#0F172A] font-semibold">
                          <Star size={16} className="fill-[#F59E0B] text-[#F59E0B]" />
                          New
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-5 border-t border-[#F1F5F9]">
                      <div className="text-[12.5px] text-[#64748B] mb-1">Starting from</div>
                      <div className="text-[20px] font-bold text-[#0F172A]">
                        {pricingType === 'quote' ? "Negotiable" : (price ? `₦${Number(price).toLocaleString()}` : "₦0")}
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between px-6 sm:px-8 py-5 bg-white shrink-0 mt-8">
              <button
                onClick={handleClose}
                className="text-[14.5px] font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors"
              >
                Cancel
              </button>
              <div className="flex gap-3">
                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="px-6 py-2.5 rounded-full border border-gray-200 bg-white text-[#0F172A] text-[14.5px] font-semibold hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={() => {
                    if (currentStep < STEPS.length) {
                      setCurrentStep(prev => prev + 1);
                    } else {
                      handleClose(); // Close/submit action
                    }
                  }}
                  className="bg-[#059669] hover:bg-[#047857] text-white px-8 py-2.5 rounded-full text-[14.5px] font-semibold transition-colors shadow-sm"
                >
                  {currentStep === STEPS.length ? "Submit Service" : "Next"}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
