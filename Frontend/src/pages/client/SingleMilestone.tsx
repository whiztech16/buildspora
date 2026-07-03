import { ArrowLeft, CheckCircle2, Info, MoreHorizontal, AlertCircle, RefreshCw, CheckCircle, FileText } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ContractorActivityCard from "../../components/client/ContractorActivityCard";
import PhotoGalleryCard from "../../components/client/PhotoGalleryCard";
import RejectionModal from "../../components/client/RejectionModal";
import UnderpaymentAlert from "../../components/client/UnderpaymentAlert";
import OTPModal from "../../components/shared/OTPModal";
import StatusModal from "../../components/shared/StatusModal";

type MilestoneState = "in_review" | "resubmitted" | "approved";

export default function SingleMilestone() {
  const navigate = useNavigate();
  const { milestoneId } = useParams();

  // Convert URL slug back to Title Case (e.g., land-secured -> Land Secured)
  const formattedName = milestoneId 
    ? milestoneId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'Block Work';
  
  // For demo purposes, we allow switching the state
  const [viewState, setViewState] = useState<MilestoneState>("in_review");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  
  // For demo, toggle this to see the underpayment state
  const [hasSufficientBalance, setHasSufficientBalance] = useState(true);

  const handleReject = (reason: string) => {
    console.log("Rejected with reason:", reason);
    setIsRejectModalOpen(false);
    // In a real app, this would make an API call and likely navigate away or update state
  };

  const handleVerifyOtp = async (_otp: string) => {
    // Simulate API call
    void _otp;
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
        setIsOtpModalOpen(false);
        setIsStatusModalOpen(true);
      }, 1500);
    });
  };

  return (
    <div className="w-full font-['Inter',sans-serif] pb-20 animate-fade-in text-gray-900">
      
      {/* DEMO CONTROLS - REMOVE IN PRODUCTION */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-xl mb-8 flex flex-wrap gap-4 items-center shadow-sm">
        <span className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">Demo Controls:</span>
        <select 
          className="text-[13px] border border-gray-300 rounded-md px-3 py-1.5 outline-none"
          value={viewState}
          onChange={(e) => setViewState(e.target.value as MilestoneState)}
        >
          <option value="in_review">State: In Review</option>
          <option value="resubmitted">State: Resubmitted (After Rejection)</option>
          <option value="approved">State: Approved & Paid</option>
        </select>
        {viewState !== 'approved' && (
          <label className="flex items-center gap-2 text-[13px] text-gray-700 cursor-pointer">
            <input 
              type="checkbox" 
              checked={hasSufficientBalance} 
              onChange={(e) => setHasSufficientBalance(e.target.checked)}
              className="rounded text-[#16A34A] focus:ring-[#16A34A]"
            />
            Sufficient Balance
          </label>
        )}
      </div>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[13px] font-medium text-gray-500 mb-8">
        <span className="cursor-pointer hover:text-gray-900">Projects</span>
        <span className="text-gray-300">/</span>
        <span className="cursor-pointer hover:text-gray-900">Victoria Island Duplex</span>
        <span className="text-gray-300">/</span>
        <span className="cursor-pointer hover:text-gray-900" onClick={() => navigate('../milestones')}>Milestones</span>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900 font-semibold">{formattedName}</span>
      </div>

      <button 
        onClick={() => navigate('../milestones')}
        className="flex items-center gap-2 text-[14px] font-medium text-gray-700 hover:text-gray-900 transition-colors mb-6 w-max"
      >
        <ArrowLeft size={16} />
        Back to Milestones
      </button>

      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-[24px] sm:text-[28px] font-bold leading-tight text-gray-900">{formattedName}</h1>
            
            {viewState === "in_review" && (
              <span className="bg-[#DBEAFE] text-[#3B82F6] text-[12px] font-semibold px-3 py-1 rounded-full">In Review</span>
            )}
            {viewState === "resubmitted" && (
              <span className="bg-[#FEF3C7] text-[#D97706] text-[12px] font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <RefreshCw size={12} /> Resubmitted
              </span>
            )}
            {viewState === "approved" && (
              <span className="bg-[#DCFCE7] text-[#16A34A] text-[12px] font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle size={12} /> Approved
              </span>
            )}
          </div>
          <div className="text-[14px] text-gray-600 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <span>Contractor: <span className="font-medium text-gray-900">BuildRight Construction Ltd.</span></span>
            <span className="hidden sm:inline text-gray-300">•</span>
            <span>Submitted: <span className="font-medium text-gray-900">Today, 11:15 AM</span></span>
          </div>
        </div>
        <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors shrink-0">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
        
        {/* Left Column */}
        <div className="flex flex-col gap-8">
          
          {/* Resubmitted Notice */}
          {viewState === "resubmitted" && (
            <div className="bg-[#FFFBEB] rounded-[16px] p-6 flex gap-4 border border-[#FDE68A]">
              <AlertCircle size={24} className="text-[#D97706] shrink-0 mt-0.5" strokeWidth={2} />
              <div>
                <h3 className="text-[15px] font-bold text-gray-900 mb-2">Contractor has resubmitted this milestone</h3>
                <p className="text-[13.5px] text-gray-700 leading-relaxed mb-4">
                  The contractor has addressed the issues you highlighted in your previous rejection. Please review the new photos and activity logs.
                </p>
                <div className="bg-white/60 p-4 rounded-xl border border-[#FDE68A]/50">
                  <p className="text-[12px] font-semibold text-gray-500 uppercase mb-1">Your previous feedback</p>
                  <p className="text-[13.5px] text-gray-800 italic">"The finishing on the east wall is not smooth enough, please fix and re-plaster before painting begins."</p>
                </div>
              </div>
            </div>
          )}

          <ContractorActivityCard />
          <PhotoGalleryCard />

          {/* What happens next (Only show if not approved) */}
          {viewState !== "approved" && (
            <div className="bg-[#F0FDF4] rounded-[16px] p-6 flex gap-4 border border-[#DCFCE7]">
              <Info size={24} className="text-[#16A34A] shrink-0" strokeWidth={2} />
              <div>
                <h3 className="text-[15px] font-bold text-gray-900 mb-2">What happens next?</h3>
                <p className="text-[13.5px] text-gray-600 leading-relaxed mb-3">
                  If you approve, <span className="font-semibold text-gray-900">₦2,000,000</span> will be released to the contractor and this milestone will be marked as completed.
                </p>
                <p className="text-[13.5px] text-gray-600 leading-relaxed">
                  If you reject, the contractor will be asked to address the issues and resubmit.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Right Column */}
        <div className="sticky top-8">
          {!hasSufficientBalance && viewState !== "approved" && <UnderpaymentAlert />}
          
          <div className="bg-white rounded-[16px] border border-gray-100 p-6 sm:p-8 shadow-sm">
            <h2 className="text-[15px] font-bold text-gray-900 mb-8">Payment Details</h2>
            
            <div className="flex flex-col gap-6 mb-8">
              <div>
                <p className="text-[13px] text-gray-500 mb-1">Milestone Amount</p>
                <p className="text-[24px] font-bold text-gray-900">₦2,000,000</p>
              </div>
              
              <div>
                <p className="text-[13px] text-gray-500 mb-1">Overall Project Budget</p>
                <p className="text-[16px] font-bold text-gray-700">₦12,000,000</p>
              </div>
              
              {viewState !== "approved" && (
                <>
                  <div>
                    <p className="text-[13px] text-gray-500 mb-1">Your Balance</p>
                    <p className="text-[24px] font-bold text-gray-900">
                      {hasSufficientBalance ? "₦3,200,000" : "₦1,500,000"}
                    </p>
                  </div>
                  
                  {hasSufficientBalance ? (
                    <div className="flex items-center gap-2 text-[13px] font-semibold text-[#16A34A]">
                      <CheckCircle2 size={18} className="fill-[#DCFCE7]" strokeWidth={2} /> Sufficient balance
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-[13px] font-semibold text-red-500">
                      <AlertCircle size={18} className="text-red-500" strokeWidth={2} /> Insufficient balance
                    </div>
                  )}
                </>
              )}

              {viewState === "approved" && (
                <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#DCFCE7] flex items-center justify-center text-[#16A34A]">
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-gray-900">Paid Successfully</p>
                      <p className="text-[12px] text-gray-500">Today, 2:30 PM</p>
                    </div>
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white border border-gray-200 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                    <FileText size={16} /> View Receipt
                  </button>
                </div>
              )}
            </div>

            {viewState !== "approved" && (
              <div className="flex flex-col xl:flex-row gap-3">
                <button 
                  onClick={() => setIsRejectModalOpen(true)}
                  className="flex-1 py-3 px-4 rounded-lg border-2 border-red-500 text-red-500 font-bold text-[14px] hover:bg-red-50 transition-colors text-center"
                >
                  Reject Milestone
                </button>
                <button 
                  disabled={!hasSufficientBalance}
                  onClick={() => setIsOtpModalOpen(true)}
                  className="flex-1 py-3 px-4 rounded-lg bg-[#16A34A] text-white font-bold text-[14px] hover:bg-[#15803d] transition-colors text-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Approve & Release
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Modals */}
      <RejectionModal 
        isOpen={isRejectModalOpen} 
        onClose={() => setIsRejectModalOpen(false)} 
        onReject={handleReject} 
      />
      
      <OTPModal 
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        onVerify={handleVerifyOtp}
        actionLabel="Approve & Release Payment"
      />

      <StatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        status="success"
        title="Payment Successful"
        description="Your milestone payment has been processed. The contractor will be notified."
        actionLabel="Done"
        onAction={() => {
          setIsStatusModalOpen(false);
          setViewState("approved");
        }}
      />
    </div>
  );
}
