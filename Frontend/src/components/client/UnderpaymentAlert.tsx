import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UnderpaymentAlert() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#FEF2F2] rounded-[16px] p-5 flex flex-col gap-4 border border-[#FECACA] mb-6">
      <div className="flex items-start gap-3">
        <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" strokeWidth={2.5} />
        <div>
          <h3 className="text-[14px] font-bold text-gray-900 mb-1">Insufficient Wallet Balance</h3>
          <p className="text-[13px] text-gray-700 leading-relaxed">
            Your current balance is less than the milestone amount. You need to top up your wallet to approve and release payment.
          </p>
        </div>
      </div>
      <button 
        onClick={() => navigate('/client/wallet/fund')} // adjust path as needed
        className="self-start py-2 px-4 rounded-lg bg-red-500 text-white font-semibold text-[13px] hover:bg-red-600 transition-colors"
      >
        Fund Wallet Now
      </button>
    </div>
  );
}
