import { X, Briefcase, CreditCard } from "lucide-react";

interface HireModalProps {
  isOpen: boolean;
  onClose: () => void;
  talentName: string;
  talentRole: string;
  onPayNow: () => void;
  onInvite: () => void;
}

export default function HireModal({
  isOpen,
  onClose,
  talentName,
  talentRole,
  onPayNow,
  onInvite
}: Readonly<HireModalProps>) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div 
        role="presentation"
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-[#F1F5F9]">
          <div>
            <h2 className="text-[18px] font-bold text-[#0F172A]">Hire {talentName}</h2>
            <p className="text-[13px] text-[#64748B] mt-1">{talentRole}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-[#64748B] hover:bg-[#F1F5F9] rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-[14px] text-[#475569] mb-6">
            How would you like to engage this professional?
          </p>

          <div className="flex flex-col gap-4">
            <button 
              onClick={onInvite}
              className="flex items-start gap-4 p-4 rounded-xl border border-[#E2E8F0] hover:border-[#16A34A] hover:bg-[#F0FDF4] transition-all text-left group"
            >
              <div className="mt-0.5 bg-[#F1F5F9] group-hover:bg-white p-2 rounded-lg text-[#0F172A] group-hover:text-[#16A34A] transition-colors">
                <Briefcase size={20} />
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-[#0F172A] mb-1">Invite to Project</h4>
                <p className="text-[13px] text-[#64748B] leading-relaxed">
                  Add them as a contractor to an existing project for milestone-based work.
                </p>
              </div>
            </button>

            <button 
              onClick={onPayNow}
              className="flex items-start gap-4 p-4 rounded-xl border border-[#E2E8F0] hover:border-[#16A34A] hover:bg-[#F0FDF4] transition-all text-left group"
            >
              <div className="mt-0.5 bg-[#F1F5F9] group-hover:bg-white p-2 rounded-lg text-[#0F172A] group-hover:text-[#16A34A] transition-colors">
                <CreditCard size={20} />
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-[#0F172A] mb-1">Pay Directly</h4>
                <p className="text-[13px] text-[#64748B] leading-relaxed">
                  Send a one-off payment directly from your virtual account for ad-hoc services.
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
