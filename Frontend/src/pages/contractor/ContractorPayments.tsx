import { useState } from "react";
import { Copy, ShoppingCart, FileText, Landmark } from "lucide-react";
import ContractorWithdrawPage from "../../components/contractor/ContractorWithdrawPage";
import PreviewToggle from "../../components/shared/PreviewToggle";

const PREVIEW_STATES = [
  { label: "New Contractor",    description: "No earnings, virtual account ready" },
  { label: "Active Contractor", description: "Earnings history present" },
];

type EarningSource = "Milestone" | "Marketplace" | "Quote";

interface Earning {
  source: EarningSource;
  projectClient: string;
  amount: string;
  date: string;
  status: "Paid" | "Pending";
}

const SOURCE_ICONS: Record<EarningSource, React.ReactNode> = {
  Milestone: (
    <div className="w-9 h-9 rounded-full bg-[#F0FDF4] flex items-center justify-center shrink-0">
      <Landmark size={16} className="text-[#059669]" strokeWidth={1.8} />
    </div>
  ),
  Marketplace: (
    <div className="w-9 h-9 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0">
      <ShoppingCart size={16} className="text-[#3B82F6]" strokeWidth={1.8} />
    </div>
  ),
  Quote: (
    <div className="w-9 h-9 rounded-full bg-[#FFFBEB] flex items-center justify-center shrink-0">
      <FileText size={16} className="text-[#D97706]" strokeWidth={1.8} />
    </div>
  ),
};

const SAMPLE_EARNINGS: Earning[] = [
  { source: "Milestone",   projectClient: "Victoria Island Duplex",          amount: "+₦1,500,000", date: "14 Jun 2026, 11:30 AM", status: "Paid"    },
  { source: "Marketplace", projectClient: "Kitchen Fitting – Lekki Phase 1", amount: "+₦450,000",   date: "12 Jun 2026, 03:15 PM", status: "Paid"    },
  { source: "Quote",       projectClient: "Chioma Adeyemi",                   amount: "+₦200,000",   date: "10 Jun 2026, 09:45 AM", status: "Paid"    },
  { source: "Milestone",   projectClient: "Parkview Estate Renovation",       amount: "+₦1,200,000", date: "09 Jun 2026, 04:20 PM", status: "Paid"    },
  { source: "Marketplace", projectClient: "Bathroom Accessories – Ajah",      amount: "+₦320,000",   date: "08 Jun 2026, 02:10 PM", status: "Pending" },
  { source: "Quote",       projectClient: "Tunde Balogun",                    amount: "+₦180,000",   date: "07 Jun 2026, 10:05 AM", status: "Pending" },
  { source: "Milestone",   projectClient: "Greenfield Court",                 amount: "+₦900,000",   date: "05 Jun 2026, 01:25 PM", status: "Pending" },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1 text-[12px] font-medium text-[#64748B] hover:text-[#0F172A] transition-colors"
    >
      {copied ? "Copied!" : <><Copy size={12} /> Copy</>}
    </button>
  );
}

export default function ContractorPayments() {
  const [previewIdx, setPreviewIdx] = useState(0);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const isNewContractor = previewIdx === 0;

  const availableBalance = isNewContractor ? null : "₦4,750,000";
  const earnings = isNewContractor ? [] : SAMPLE_EARNINGS;

  // ── Withdraw page ──────────────────────────────────────────
  if (showWithdraw) {
    return (
      <ContractorWithdrawPage
        availableBalance={availableBalance ?? "₦0.00"}
        email="emeka@gmail.com"
        onBack={() => setShowWithdraw(false)}
      />
    );
  }

  // ── Payments overview ──────────────────────────────────────
  return (
    <div className="flex flex-col w-full" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Preview toggle (remove in production) */}
      <PreviewToggle states={PREVIEW_STATES} current={previewIdx} onChange={setPreviewIdx} />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[24px] sm:text-[28px] font-bold text-[#0F172A] tracking-tight">Payments</h1>
        <button
          onClick={() => setShowWithdraw(true)}
          className="bg-[#0F172A] text-white text-[13.5px] font-semibold px-5 py-2.5 rounded-lg hover:bg-black transition-colors"
        >
          Withdraw
        </button>
      </div>

      {/* Payout Account */}
      <div className="mb-8">
        <h2 className="text-[15px] font-bold text-[#0F172A] mb-4">Payout Account</h2>
        <div className="border border-[#E2E8F0] rounded-[4px] bg-white">
          <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10 flex-wrap">

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest">Linked Bank</span>
              <span className="text-[14px] font-semibold text-[#0F172A]">Noba (GTBank)</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest">Account Number</span>
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-[#0F172A] tracking-wider">0123 456 789</span>
                <CopyButton text="0123456789" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest">Account Name</span>
              <span className="text-[14px] font-semibold text-[#0F172A]">Emeka Okafor</span>
            </div>

            {!isNewContractor && availableBalance && (
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest">Available Balance</span>
                <span className="text-[22px] font-bold text-[#0F172A]">{availableBalance}</span>
              </div>
            )}
          </div>

          {isNewContractor && (
            <div className="border-t border-[#F1F5F9] px-6 py-4 bg-[#F8FAFC]">
              <p className="text-[13px] font-semibold text-[#0F172A] mb-0.5">Your Noba virtual account is ready</p>
              <p className="text-[12.5px] text-[#64748B] leading-relaxed">
                Share your account number with clients to receive milestone payments. Your balance will appear here once you receive your first payment.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Earnings History */}
      <div>
        <h2 className="text-[15px] font-bold text-[#0F172A] mb-4">Earnings History</h2>

        {earnings.length === 0 ? (
          <div className="border border-dashed border-[#E2E8F0] rounded-[4px] flex flex-col items-center justify-center py-16 px-8 text-center bg-white">
            <h3 className="text-[15px] font-semibold text-[#0F172A] mb-2">No earnings yet</h3>
            <p className="text-[13.5px] text-[#64748B] max-w-[320px] leading-relaxed">
              Your earnings will appear here once clients complete milestone payments or marketplace orders.
            </p>
          </div>
        ) : (
          <div className="border border-[#E2E8F0] rounded-[4px] bg-white overflow-x-auto">
            <div className="grid grid-cols-[2fr_3fr_2fr_3fr_1.5fr] px-6 py-3 border-b border-[#F1F5F9] min-w-[600px]">
              {["Source", "Project / Client", "Amount", "Date", "Status"].map((h) => (
                <span key={h} className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest">{h}</span>
              ))}
            </div>

            {earnings.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[2fr_3fr_2fr_3fr_1.5fr] px-6 py-4 border-b border-[#F8FAFC] last:border-none items-center hover:bg-[#FAFAFA] transition-colors min-w-[600px]"
              >
                <div className="flex items-center gap-2.5">
                  {SOURCE_ICONS[row.source]}
                  <span className="text-[13.5px] font-semibold text-[#0F172A]">{row.source}</span>
                </div>
                <span className="text-[13px] text-[#475569] pr-4 truncate">{row.projectClient}</span>
                <span className="text-[13.5px] font-bold text-[#059669]">{row.amount}</span>
                <span className="text-[13px] text-[#64748B]">{row.date}</span>
                <div>
                  <span className={`text-[12px] font-semibold px-3 py-1 rounded-md ${
                    row.status === "Paid"
                      ? "bg-[#F0FDF4] text-[#059669]"
                      : "bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]"
                  }`}>
                    {row.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
