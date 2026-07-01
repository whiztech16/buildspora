import { useState } from "react";
import { ArrowLeft, Landmark, User, Briefcase, Lock, Info, CheckCircle2 } from "lucide-react";
import SearchableSelect from "../shared/SearchableSelect";

const BANK_OPTIONS = ["Guaranty Trust Bank", "Zenith Bank", "Access Bank"];

export default function SendMoneyModal({
  isOpen,
  onClose,
}: Readonly<{
  isOpen: boolean;
  onClose: () => void;
}>) {
  const [recipientType, setRecipientType] = useState<"bank" | "saved" | "contractor">("bank");
  const [amount, setAmount] = useState("");
  const [saveBeneficiary, setSaveBeneficiary] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-['Inter',sans-serif]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative bg-white rounded-[24px] w-full max-w-[1000px] max-h-[95vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 shrink-0">
          <div className="flex flex-col">
            <h2 className="text-[22px] font-bold text-[#0F172A] leading-tight">Send Money</h2>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[14px] text-[#475569] font-medium">Victoria Island Duplex</span>
              <ChevronDownIcon size={14} className="text-gray-400" />
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#DCFCE7] text-[#16A34A]">Active</span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="flex items-center gap-2 text-[13px] font-semibold text-[#475569] hover:text-[#0F172A] border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-full transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Payments
          </button>
        </div>

        {/* Content Body */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto">
          
          {/* Left Column (Form) */}
          <div className="flex-1 p-8 lg:border-r border-gray-100">
            <h3 className="text-[14px] font-bold text-[#0F172A] mb-4">Who are you paying?</h3>
            
            {/* Recipient Type Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <button
                type="button"
                onClick={() => setRecipientType("bank")}
                className={`p-4 rounded-[16px] border text-left transition-all relative ${
                  recipientType === "bank" 
                    ? "border-[#16A34A] bg-[#DCFCE7]/30 shadow-sm" 
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className={`w-[40px] h-[40px] rounded-full flex items-center justify-center mb-3 ${recipientType === 'bank' ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-gray-100 text-gray-500'}`}>
                  <Landmark size={20} />
                </div>
                <h4 className="text-[13px] font-bold text-[#0F172A] mb-1">Any Nigerian Bank Account</h4>
                <p className="text-[11.5px] text-[#475569] leading-relaxed">Send money to any bank account in Nigeria.</p>
              </button>
              
              <button
                type="button"
                onClick={() => setRecipientType("saved")}
                className={`p-4 rounded-[16px] border text-left transition-all ${
                  recipientType === "saved" 
                    ? "border-[#16A34A] bg-[#DCFCE7]/30 shadow-sm" 
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className={`w-[40px] h-[40px] rounded-full flex items-center justify-center mb-3 ${recipientType === 'saved' ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-gray-100 text-gray-500'}`}>
                  <User size={20} />
                </div>
                <h4 className="text-[13px] font-bold text-[#0F172A] mb-1">Saved Beneficiary</h4>
                <p className="text-[11.5px] text-[#475569] leading-relaxed">Send money to a beneficiary you have saved.</p>
              </button>
              
              <button
                type="button"
                onClick={() => setRecipientType("contractor")}
                className={`p-4 rounded-[16px] border text-left transition-all ${
                  recipientType === "contractor" 
                    ? "border-[#16A34A] bg-[#DCFCE7]/30 shadow-sm" 
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className={`w-[40px] h-[40px] rounded-full flex items-center justify-center mb-3 ${recipientType === 'contractor' ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-gray-100 text-gray-500'}`}>
                  <Briefcase size={20} />
                </div>
                <h4 className="text-[13px] font-bold text-[#0F172A] mb-1">Contractor / Talent</h4>
                <p className="text-[11.5px] text-[#475569] leading-relaxed">Pay a contractor or talent from the marketplace.</p>
              </button>
            </div>

            <h3 className="text-[15px] font-bold text-[#0F172A] mb-5">Enter Bank Details</h3>
            
            <div className="flex flex-col gap-5">
              <div>
                <label htmlFor="amount" className="block text-[12.5px] font-semibold text-[#0F172A] mb-1.5">
                  Amount (₦)
                </label>
                <input
                  id="amount"
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="₦ 500,000"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] text-[14px] font-medium placeholder-gray-400 transition-all text-[#0F172A]"
                />
              </div>

              <div>
                <SearchableSelect
                  id="bankName"
                  label="Bank Name"
                  placeholder="Select Bank"
                  options={BANK_OPTIONS}
                />
              </div>

              <div>
                <label htmlFor="accountNumber" className="block text-[12.5px] font-semibold text-[#0F172A] mb-1.5">
                  Account Number
                </label>
                <div className="relative">
                  <input
                    id="accountNumber"
                    type="text"
                    maxLength={10}
                    placeholder="Enter 10-digit account number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] text-[14px] font-medium placeholder-gray-400 transition-all text-[#0F172A]"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-medium text-gray-400">
                    0/10
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="accountName" className="block text-[12.5px] font-semibold text-[#0F172A] mb-1.5">
                  Account Name
                </label>
                <div className="relative">
                  <input
                    id="accountName"
                    type="text"
                    readOnly
                    placeholder="Account name will appear here"
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:outline-none text-[14px] font-medium placeholder-gray-400 text-[#0F172A]"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-medium text-gray-400">
                    Not verified
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="narration" className="block text-[12.5px] font-semibold text-[#0F172A] mb-1.5">
                  Narration (Optional)
                </label>
                <div className="relative">
                  <textarea
                    id="narration"
                    rows={3}
                    placeholder="e.g. Materials purchase"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] text-[14px] font-medium placeholder-gray-400 transition-all text-[#0F172A] resize-none"
                  />
                  <span className="absolute right-4 bottom-3 text-[12px] font-medium text-gray-400">
                    0/100
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <button 
                  type="button"
                  onClick={() => setSaveBeneficiary(!saveBeneficiary)}
                  className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${saveBeneficiary ? 'bg-[#16A34A] border-[#16A34A]' : 'bg-white border-gray-300'}`}
                >
                  {saveBeneficiary && <CheckCircle2 size={14} className="text-white" strokeWidth={3} />}
                </button>
                <span className="text-[13.5px] font-medium text-[#475569] cursor-pointer" onClick={() => setSaveBeneficiary(!saveBeneficiary)}>
                  Save as beneficiary
                </span>
              </div>

              <button className="w-full bg-[#16A34A] hover:bg-[#15803d] text-white font-bold text-[14.5px] py-3.5 rounded-xl transition-colors shadow-sm mt-4">
                Continue
              </button>
            </div>
          </div>
          
          {/* Right Column (Summary) */}
          <div className="w-full lg:w-[380px] bg-[#F8FAFC] p-8 shrink-0">
            <h3 className="text-[16px] font-bold text-[#0F172A] mb-8">Payment Summary</h3>
            
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <span className="text-[13.5px] font-medium text-[#475569]">Payment Type</span>
                <span className="text-[13.5px] font-semibold text-[#0F172A]">Bank Transfer</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-[13.5px] font-medium text-[#475569]">Project</span>
                <span className="text-[13.5px] font-semibold text-[#0F172A]">Victoria Island Duplex</span>
              </div>
              
              <div className="flex flex-col gap-4 py-6 border-y border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-medium text-[#475569]">You are sending</span>
                  <span className="text-[15px] font-bold text-[#0F172A]">₦{amount || "0.00"}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#475569]">
                    <span className="text-[14px] font-medium">Bank Charges</span>
                    <Info size={14} className="text-gray-400" />
                  </div>
                  <span className="text-[14px] font-semibold text-[#0F172A]">₦0.00</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <span className="text-[16px] font-bold text-[#0F172A]">Total</span>
                <span className="text-[20px] font-bold text-[#16A34A]">₦{amount || "0.00"}</span>
              </div>
            </div>

            <div className="bg-[#DCFCE7]/50 border border-[#DCFCE7] rounded-[16px] p-5 mt-10">
              <div className="flex items-start gap-3">
                <Lock size={18} className="text-[#16A34A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[13px] font-bold text-[#0F172A] mb-1">Secure Payment</h4>
                  <p className="text-[12px] text-[#16A34A] leading-relaxed">
                    Your payment is protected with bank-level security and encryption.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

function ChevronDownIcon({ className, size = 24 }: { className?: string, size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}
