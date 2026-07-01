import { useState } from "react";
import { Plus, ChevronDown, Copy, ArrowDown, ArrowDownLeft, Landmark, Lightbulb, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PreviewToggle from "../../components/shared/PreviewToggle";

const PREVIEW_STATES = [
  { label: "New Client",    description: "No transactions, virtual account fresh" },
  { label: "Active Client", description: "Balance and transactions present" },
];

export default function PaymentsEmpty() {
  const navigate = useNavigate();
  const [previewIdx, setPreviewIdx] = useState(0);
  const isPopulated = previewIdx === 1;
  return (
    <div className="flex flex-col w-full animate-fade-in">

      {/* Preview toggle */}
      <PreviewToggle states={PREVIEW_STATES} current={previewIdx} onChange={setPreviewIdx} />
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-[24px] sm:text-[28px] font-bold text-gray-900 leading-tight">Payments</h1>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => navigate("send-money")}
            className="flex-1 sm:flex-none flex justify-center items-center gap-2 bg-[#0F172A] text-white text-[13px] font-semibold px-4 sm:px-5 py-2.5 rounded-full hover:bg-black transition-colors cursor-pointer shadow-sm shrink-0"
          >
            <ArrowDownLeft size={16} strokeWidth={2.5} className="rotate-135" />
            <span>Send Money</span>
          </button>
          <button className="flex-1 sm:flex-none flex justify-center items-center gap-2 bg-white border border-gray-200 text-[#0F172A] text-[13px] font-semibold px-4 sm:px-5 py-2.5 rounded-full hover:bg-gray-50 transition-colors cursor-pointer shadow-sm shrink-0">
            <Plus size={16} strokeWidth={2.5} />
            <span>Add Money</span>
          </button>
        </div>
      </div>

      {/* Dropdown & Badge */}
      <div className="flex items-center gap-3 mb-10">
        <button className="flex items-center justify-between border border-gray-200 bg-white rounded-lg px-4 py-2 w-[190px] text-[13.5px] font-medium text-[#0F172A] hover:bg-gray-50 transition-colors">
          Victoria Island Duplex
          <ChevronDown size={16} className="text-gray-400" />
        </button>
        <span className="bg-[#DCFCE7] text-[#16A34A] px-2.5 py-1 rounded-full text-[12px] font-semibold tracking-wide">
          Active
        </span>
      </div>

      {/* Virtual Account Card */}
      <div className="mb-10">
        <h2 className="text-[16px] font-bold text-gray-900 mb-4">Virtual Account</h2>
        <div className="border border-[#F1F5F9] rounded-[24px] p-5 sm:p-8 flex flex-col xl:flex-row shadow-sm bg-white gap-8 xl:gap-12 xl:items-center">
          
          {!isPopulated && (
            <div className="flex gap-4 max-w-full xl:max-w-[340px] shrink-0">
              <div className="w-[52px] h-[52px] rounded-full bg-[#DCFCE7] flex items-center justify-center shrink-0">
                <Landmark size={24} className="text-[#16A34A]" strokeWidth={1.5} />
              </div>
              <div className="pt-1">
                <h3 className="text-[15.5px] font-bold text-[#0F172A] mb-1.5">Your Virtual Account is Ready!</h3>
                <p className="text-[13.5px] text-[#475569] leading-relaxed">
                  Use your unique virtual account to receive payments for your construction projects.
                </p>
              </div>
            </div>
          )}

          <div className="flex-1 w-full">
            {isPopulated ? (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-wrap gap-6 md:gap-12">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Bank Name</span>
                    <span className="text-[14px] font-bold text-[#0F172A]">GTBank</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Account Number</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold text-[#0F172A]">0123 456 789</span>
                      <button className="text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1 text-[12px] font-medium" title="Copy">
                        Copy <Copy size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Account Name</span>
                    <span className="text-[14px] font-bold text-[#0F172A]">Your Name — BuildSpora</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 md:gap-8 pt-4 md:pt-0 border-t md:border-none border-gray-100">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Balance</span>
                    <span className="text-[20px] font-bold text-[#0F172A]">₦3,200,000</span>
                  </div>
                  <button className="flex items-center justify-center border border-[#16A34A] text-[#16A34A] px-5 py-2 rounded-lg text-[13px] font-semibold hover:bg-[#DCFCE7] hover:text-[#15803d] transition-colors whitespace-nowrap self-start">
                    Share Account Details
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Bank Name</span>
                  <span className="text-[14px] font-bold text-[#0F172A]">GTBank</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Account Number</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-[#0F172A]">0123 456 789</span>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1 text-[12px] font-medium" title="Copy">
                      <Copy size={12} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Account Name</span>
                  <span className="text-[14px] font-bold text-[#0F172A] leading-tight">Your Name — BuildSpora</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Balance</span>
                  <span className="text-[20px] font-bold text-[#0F172A]">₦0.00</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 border-b border-gray-100 pb-2">
        <button className="text-[14px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-4 py-1.5 rounded-md transition-colors">
          Inbound
        </button>
        <button className="text-[14px] font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-gray-50 px-4 py-1.5 rounded-md transition-colors">
          Outbound
        </button>
      </div>

      {/* Transactions State */}
      {!isPopulated ? (
        <div className="flex flex-col mb-10">
          <div className="flex flex-col items-center justify-center py-12 sm:py-16">
            <div className="w-[52px] h-[52px] rounded-full bg-[#DCFCE7] flex items-center justify-center mb-5">
              <ArrowDown size={24} className="text-[#16A34A]" strokeWidth={2} />
            </div>
            <h3 className="text-[16px] font-bold text-[#0F172A] mb-2.5">No transactions yet</h3>
            <p className="text-[13.5px] text-[#64748B] text-center max-w-[340px] mb-8 leading-relaxed">
              You haven't received any payments. Transactions will appear here once you start receiving payments.
            </p>
            <button className="flex items-center justify-center border border-[#16A34A] text-[#16A34A] px-5 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-[#DCFCE7] hover:text-[#15803d] transition-colors whitespace-nowrap shadow-sm w-full sm:w-auto">
              Share Account Details
            </button>
          </div>

          {/* How to get started */}
          <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-[16px] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-[42px] h-[42px] rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                <Lightbulb size={20} className="text-[#16A34A]" strokeWidth={1.8} />
              </div>
              <div>
                <h4 className="text-[14.5px] font-bold text-[#0F172A] mb-0.5">How to get started</h4>
                <p className="text-[13.5px] text-[#475569]">Share your virtual account details with clients, friends or family to receive payments.</p>
              </div>
            </div>
            <a href="#" className="text-[#16A34A] text-[13.5px] font-semibold flex items-center gap-1 hover:underline whitespace-nowrap self-start sm:self-center">
              Learn more <ChevronRight size={16} />
            </a>
          </div>
        </div>
      ) : (
        <div className="bg-white overflow-x-auto hide-scrollbar">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-2 py-4 text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Transaction</th>
                <th className="px-4 py-4 text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Sender</th>
                <th className="px-4 py-4 text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-4 text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-4 py-4 text-[12px] font-semibold text-gray-400 uppercase tracking-wider text-right">Reference</th>
              </tr>
            </thead>
            <tbody>
              {[
                { sender: "John Okafor", amount: "+₦500,000", date: "12 Jun 2026, 10:45 AM", ref: "REF: BSP-23891" },
                { sender: "Adaeze Nwosu", amount: "+₦750,000", date: "11 Jun 2026, 04:32 PM", ref: "REF: BSP-23890" },
                { sender: "Ifeanyichukwu U.", amount: "+₦1,200,000", date: "10 Jun 2026, 11:20 AM", ref: "REF: BSP-23889" },
                { sender: "Chinedu Eze", amount: "+₦300,000", date: "09 Jun 2026, 09:15 AM", ref: "REF: BSP-23888" },
                { sender: "Obinna Lawson", amount: "+₦450,000", date: "07 Jun 2026, 02:08 PM", ref: "REF: BSP-23887" }
              ].map((tx, idx) => (
                <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-2 py-5 text-[14px] text-gray-600 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#DCFCE7] flex items-center justify-center shrink-0">
                      <ArrowDownLeft size={16} className="text-[#16A34A]" strokeWidth={2.5} />
                    </div>
                    <span className="font-bold text-[#0F172A] whitespace-nowrap">Bank Transfer</span>
                  </td>
                  <td className="px-4 py-5 text-[13px] font-medium text-[#475569] whitespace-nowrap">{tx.sender}</td>
                  <td className="px-4 py-5 text-[13.5px] font-bold text-[#16A34A] whitespace-nowrap">{tx.amount}</td>
                  <td className="px-4 py-5 text-[13px] font-medium text-[#475569] whitespace-nowrap">{tx.date}</td>
                  <td className="px-4 py-5 text-[12.5px] font-medium text-[#94A3B8] text-right whitespace-nowrap">{tx.ref}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
