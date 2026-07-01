import { useState } from "react";
import { ArrowLeft, Lock, ShieldCheck, Info } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import OTPModal from "../../components/shared/OTPModal";
import StatusModal from "../../components/shared/StatusModal";
import SearchableSelect from "../../components/shared/SearchableSelect";

const PAY_TO_OPTIONS = ["Bank Account", "Saved Beneficiary", "Contractor / Talent"];
const BANK_OPTIONS = ["Guaranty Trust Bank", "Zenith Bank", "Access Bank"];

export default function SendMoney() {
  const navigate = useNavigate();
  const location = useLocation();
  const [amount, setAmount] = useState("");
  const [narration, setNarration] = useState("");
  
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"success" | "failed" | "pending">("success");

  const formattedAmount = amount ? `₦${amount}` : "₦0.00";

  const handleProceed = () => {
    setIsOtpOpen(true);
  };

  const handleVerifyOtp = async () => {
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
        setIsOtpOpen(false);
        setPaymentStatus("success");
        setIsStatusOpen(true);
      }, 1500);
    });
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto font-['Inter',sans-serif] pb-20 px-4 sm:px-6 lg:px-8 animate-fade-in text-gray-900">
      
      {/* Header Area */}
      <div className="mb-8 pt-6 sm:pt-8">
        <button 
          onClick={() => {
            if (location.pathname.includes('/project/')) {
              navigate('/dashboard/client/project/1/payments');
            } else {
              navigate('/dashboard/client', { state: { activeTab: 'payments' } });
            }
          }} 
          className="flex items-center gap-2 text-[14px] font-bold text-[#0F172A] hover:underline mb-6"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          Back to Payments
        </button>
        <h1 className="text-[24px] sm:text-[28px] font-bold leading-tight mb-2">Send Money</h1>
        <p className="text-[14px] text-[#475569]">Fill in the details below to send money.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 xl:gap-8 items-start">
        
        {/* Left Column (Form Card) */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 flex flex-col gap-6">
          
          {/* Pay to */}
          <div>
            <SearchableSelect
              id="payTo"
              label="Pay to"
              placeholder="Select recipient"
              options={PAY_TO_OPTIONS}
            />
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-[14px] font-bold text-[#0F172A] mb-2">Amount (₦)</label>
            <div className="relative flex items-center">
              <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 bg-transparent border-r border-transparent">
                <span className="text-[15px] font-bold text-[#0F172A] bg-[#F8FAFC] w-8 h-8 rounded flex items-center justify-center">₦</span>
              </div>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] text-[14.5px] transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Bank Dropdown */}
          <div>
            <SearchableSelect
              id="bank"
              label="Bank"
              placeholder="Select bank"
              options={BANK_OPTIONS}
            />
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-[14px] font-bold text-[#0F172A] mb-2">Account Number</label>
            <input
              type="text"
              maxLength={10}
              placeholder="Enter 10-digit account number"
              className="w-full px-4 py-3 rounded-lg bg-white border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] text-[14.5px] transition-all text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Narration */}
          <div>
            <label className="block text-[14px] font-bold text-[#0F172A] mb-2">Narration (optional)</label>
            <div className="relative">
              <textarea
                rows={3}
                value={narration}
                onChange={(e) => setNarration(e.target.value)}
                maxLength={100}
                placeholder="e.g. Payment for electrical work"
                className="w-full px-4 py-3 rounded-lg bg-white border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] text-[14.5px] transition-all text-gray-900 placeholder:text-gray-400 resize-none pb-8"
              />
              <span className="absolute right-3 bottom-3 text-[12px] font-medium text-gray-400">
                {narration.length} / 100
              </span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-4">
            <button 
              onClick={() => {
                if (location.pathname.includes('/project/')) {
                  navigate('/dashboard/client/project/1/payments');
                } else {
                  navigate('/dashboard/client', { state: { activeTab: 'payments' } });
                }
              }}
              className="text-[14.5px] font-bold text-[#475569] hover:text-[#0F172A] transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleProceed}
              className="bg-[#16A34A] hover:bg-[#15803d] text-white font-bold text-[14.5px] px-8 py-3 rounded-full transition-colors"
            >
              Proceed
            </button>
          </div>
          
        </div>
        
        {/* Right Column (Summary Card) */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8">
          <h3 className="text-[16px] font-bold text-[#0F172A] mb-8">Payment Summary</h3>
          
          <div className="flex flex-col gap-6">
            
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[#64748B]">Payment Type</span>
              <span className="text-[14px] font-medium text-[#475569]">Bank Transfer</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[#64748B]">Paying From</span>
              <span className="text-[14px] font-medium text-[#475569]">BuildSpora Wallet</span>
            </div>
            
            <div className="h-[1px] bg-[#F1F5F9] my-1"></div>

            <div className="flex items-center justify-between">
              <span className="text-[14.5px] text-[#64748B]">You are sending</span>
              <span className="text-[16px] font-bold text-[#0F172A] tracking-tight">{formattedAmount}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[14.5px] text-[#64748B]">
                Bank Charges <Info size={14} className="text-[#94A3B8]" />
              </div>
              <span className="text-[14.5px] font-medium text-[#64748B]">₦0.00</span>
            </div>
            
            <div className="h-[1px] bg-[#F1F5F9] my-1"></div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-[16px] font-bold text-[#0F172A]">Total</span>
              <span className="text-[20px] font-bold text-[#16A34A] tracking-tight">{formattedAmount}</span>
            </div>

            {/* Secure Payment Alert Box */}
            <div className="bg-[#F0FDF4] rounded-xl p-5 flex gap-3.5 mt-2">
              <ShieldCheck size={20} className="text-[#16A34A] shrink-0 mt-0.5" strokeWidth={2.5} />
              <div className="flex flex-col gap-1">
                <span className="text-[13.5px] font-bold text-[#0F172A]">Secure Payment</span>
                <span className="text-[13px] text-[#475569] leading-relaxed">
                  Your payment is protected with bank-level security and encryption.
                </span>
              </div>
            </div>

          </div>
        </div>
        
      </div>

      <div className="flex items-center justify-center gap-2 mt-8 text-[#64748B] text-[13px] font-medium">
        <Lock size={14} />
        All transactions are secure and encrypted.
      </div>

      <OTPModal 
        isOpen={isOtpOpen} 
        onClose={() => setIsOtpOpen(false)} 
        onVerify={handleVerifyOtp} 
        actionLabel="Pay"
      />

      <StatusModal
        isOpen={isStatusOpen}
        onClose={() => setIsStatusOpen(false)}
        status={paymentStatus}
        title={paymentStatus === "success" ? "Payment Successful" : paymentStatus === "failed" ? "Payment Failed" : "Payment Pending"}
        description={paymentStatus === "success" ? "Your payment has been processed successfully." : paymentStatus === "failed" ? "We couldn't process your payment. Please try again." : "Your payment is currently pending."}
        actionLabel="Done"
        onAction={() => {
          setIsStatusOpen(false);
          navigate('/dashboard/client/project/1/payments');
        }}
      />
    </div>
  );
}
