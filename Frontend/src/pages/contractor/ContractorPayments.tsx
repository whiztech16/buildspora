import { useState, useEffect } from "react";
import { Copy, ShoppingCart, FileText, Landmark, Loader2, Wallet, RefreshCw } from "lucide-react";
import ContractorWithdrawPage from "../../components/contractor/ContractorWithdrawPage";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import SetPinModal from "../../components/shared/SetPinModal";
import ForgotPinModal from "../../components/shared/ForgotPinModal";

type EarningSource = "Milestone" | "Marketplace" | "Quote";

interface Earning {
  source: EarningSource;
  projectClient: string;
  amount: string;
  date: string;
  status: "Paid" | "Pending";
}

interface VirtualAccount {
  bankName: string;
  accountNumber: string;
  accountName: string;
  balance: number; // in kobo or naira depending on backend
}

interface PaymentsApiResponse {
  success: boolean;
  virtualAccount: VirtualAccount | null;
  earnings: {
    id: string;
    source: string;
    projectName: string;
    amount: number;
    date: string;
    status: string;
  }[];
  totalEarnings: number;
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

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="flex items-center gap-1 text-[12px] font-medium text-[#64748B] hover:text-[#0F172A] transition-colors"
    >
      {copied ? "Copied!" : <><Copy size={12} /> Copy</>}
    </button>
  );
}

const fmtNaira = (amount: number) =>
  `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export default function ContractorPayments() {
  const { user } = useAuth();
  const [showWithdraw, setShowWithdraw] = useState(false);

  // Data state
  const [virtualAccount, setVirtualAccount] = useState<VirtualAccount | null>(null);
  const [rawEarnings, setRawEarnings] = useState<any[]>([]);
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Generate account state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // Balance refresh
  const [isRefreshing, setIsRefreshing] = useState(false);

  // PIN
  const [isSetPinOpen, setIsSetPinOpen] = useState(false);
  const [isForgotPinOpen, setIsForgotPinOpen] = useState(false);

  const loadPayments = async () => {
    try {
      setLoadError(null);
      const res = await api.get<PaymentsApiResponse>("/api/payments");
      setVirtualAccount(res.virtualAccount);
      setTotalEarnings(res.totalEarnings ?? 0);
      setRawEarnings(res.earnings || []);

      // Map backend earnings to frontend shape
      const mapped: Earning[] = (res.earnings || []).map((e) => ({
        source: (e.source as EarningSource) || "Milestone",
        projectClient: e.projectName || "—",
        amount: `+${fmtNaira(e.amount)}`,
        date: fmtDate(e.date),
        status: e.status === "paid" ? "Paid" : "Pending",
      }));
      setEarnings(mapped);
    } catch (err: any) {
      setLoadError(err.message || "Failed to load payments.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleGenerateAccount = async () => {
    setIsGenerating(true);
    setGenerateError(null);
    try {
      const res = await api.post<{ success: boolean; virtualAccount: VirtualAccount; requiresPinSetup?: boolean }>(
        "/api/payments/generate-account",
        {}
      );
      setVirtualAccount(res.virtualAccount);
      if (res.requiresPinSetup) {
        setIsSetPinOpen(true);
      }
    } catch (err: any) {
      setGenerateError(err.message || "Failed to generate account. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefreshBalance = async () => {
    setIsRefreshing(true);
    try {
      const res = await api.get<PaymentsApiResponse>("/api/payments");
      if (res.virtualAccount) setVirtualAccount(res.virtualAccount);
      setTotalEarnings(res.totalEarnings ?? 0);
      setRawEarnings(res.earnings || []);
      const mapped: Earning[] = (res.earnings || []).map((e) => ({
        source: (e.source as EarningSource) || "Milestone",
        projectClient: e.projectName || "—",
        amount: `+${fmtNaira(e.amount)}`,
        date: fmtDate(e.date),
        status: e.status === "paid" ? "Paid" : "Pending",
      }));
      setEarnings(mapped);
    } catch {
      // silent
    } finally {
      setIsRefreshing(false);
    }
  };

  // ── Withdraw page ──────────────────────────────────────────────────────────
  if (showWithdraw) {
    return (
      <ContractorWithdrawPage
        availableBalance={
          virtualAccount ? fmtNaira(virtualAccount.balance) : "₦0.00"
        }
        rawBalance={virtualAccount?.balance ?? 0}
        email={user?.email ?? ""}
        onBack={() => setShowWithdraw(false)}
        onSuccess={() => { setShowWithdraw(false); loadPayments(); }}
      />
    );
  }

  // ── Payments overview ──────────────────────────────────────────────────────
  return (
    <div className="flex flex-col w-full" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[24px] sm:text-[28px] font-bold text-[#0F172A] tracking-tight">
          Payments
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefreshBalance}
            disabled={isRefreshing || isLoading}
            className="p-2 rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#CBD5E1] hover:text-[#0F172A] transition-colors disabled:opacity-40"
            title="Refresh balance"
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => setShowWithdraw(true)}
            disabled={!virtualAccount || (virtualAccount?.balance ?? 0) <= 0}
            className="bg-[#0F172A] text-white text-[13.5px] font-semibold px-5 py-2.5 rounded-lg hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Withdraw
          </button>
        </div>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 text-[#64748B] text-[14px] py-20">
          <Loader2 size={18} className="animate-spin" />
          Loading payments…
        </div>
      ) : loadError ? (
        <div className="bg-red-50 border border-red-200 text-red-600 text-[13.5px] font-medium p-4 rounded-xl mb-6">
          {loadError}
        </div>
      ) : (
        <>
          {/* Payout Account */}
          <div className="mb-8">
            <h2 className="text-[15px] font-bold text-[#0F172A] mb-4">Payout Account</h2>
            <div className="border border-[#E2E8F0] rounded-[4px] bg-white">

              {virtualAccount ? (
                <>
                  <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10 flex-wrap">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest">
                        Bank
                      </span>
                      <span className="text-[14px] font-semibold text-[#0F172A]">
                        {virtualAccount.bankName}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest">
                        Account Number
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-semibold text-[#0F172A] tracking-wider">
                          {virtualAccount.accountNumber.replace(/(.{4})/g, "$1 ").trim()}
                        </span>
                        <CopyButton text={virtualAccount.accountNumber} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest">
                        Account Name
                      </span>
                      <span className="text-[14px] font-semibold text-[#0F172A]">
                        {virtualAccount.accountName}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest">
                        Available Balance
                      </span>
                      <span className="text-[22px] font-bold text-[#0F172A]">
                        {fmtNaira(virtualAccount.balance)}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-[#F1F5F9] px-6 py-3 bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <p className="text-[12.5px] text-[#64748B]">
                      Share your account number with clients to receive milestone payments.
                    </p>
                    <button
                      onClick={() => setIsForgotPinOpen(true)}
                      className="text-[12.5px] font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors whitespace-nowrap"
                    >
                      Reset PIN
                    </button>
                  </div>
                </>
              ) : (
                /* No virtual account — show Generate button */
                <div className="px-6 py-8 flex flex-col items-center text-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#F1F5F9] flex items-center justify-center">
                    <Wallet size={24} className="text-[#94A3B8]" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-[#0F172A] mb-1">
                      No Virtual Account Yet
                    </h3>
                    <p className="text-[13.5px] text-[#64748B] max-w-[340px] leading-relaxed">
                      Generate your unique Nomba virtual account number to start receiving
                      milestone payments from clients.
                    </p>
                  </div>

                  {generateError && (
                    <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 w-full max-w-[380px]">
                      {generateError}
                    </p>
                  )}

                  <button
                    onClick={handleGenerateAccount}
                    disabled={isGenerating}
                    className="flex items-center gap-2 bg-[#0F172A] text-white text-[13.5px] font-semibold px-6 py-3 rounded-lg hover:bg-black transition-colors disabled:opacity-60 shadow-sm"
                  >
                    {isGenerating ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Wallet size={16} />
                    )}
                    {isGenerating ? "Generating account…" : "Generate Virtual Account"}
                  </button>
                  <p className="text-[11.5px] text-[#94A3B8]">
                    This can only be done once per account.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Earnings summary strip */}
          {virtualAccount && totalEarnings > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { label: "Total Earned", value: fmtNaira(totalEarnings), color: "#059669" },
                {
                  label: "Paid Out",
                  value: fmtNaira(
                    rawEarnings
                      .filter(e => (e.source === "Withdrawal" || e.type === "withdrawal") && e.status === "paid")
                      .reduce((sum, e) => sum + Number(e.amount), 0)
                  ),
                  color: "#0F172A",
                },
                {
                  label: "Pending",
                  value: fmtNaira(
                    rawEarnings
                      .filter(e => (e.source === "Withdrawal" || e.type === "withdrawal") && e.status !== "paid")
                      .reduce((sum, e) => sum + Number(e.amount), 0)
                  ),
                  color: "#D97706",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="border border-[#E2E8F0] rounded-[4px] bg-white px-5 py-4"
                >
                  <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest mb-1.5">
                    {stat.label}
                  </p>
                  <p className="text-[20px] font-bold" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Earnings History */}
          <div>
            <h2 className="text-[15px] font-bold text-[#0F172A] mb-4">Earnings History</h2>

            {earnings.length === 0 ? (
              <div className="border border-dashed border-[#E2E8F0] rounded-[4px] flex flex-col items-center justify-center py-16 px-8 text-center bg-white">
                <h3 className="text-[15px] font-semibold text-[#0F172A] mb-2">
                  No earnings yet
                </h3>
                <p className="text-[13.5px] text-[#64748B] max-w-[320px] leading-relaxed">
                  Your earnings will appear here once clients complete milestone payments or
                  marketplace orders.
                </p>
              </div>
            ) : (
              <div className="border border-[#E2E8F0] rounded-[4px] bg-white overflow-x-auto">
                <div className="grid grid-cols-[2fr_3fr_2fr_3fr_1.5fr] px-6 py-3 border-b border-[#F1F5F9] min-w-[600px]">
                  {["Source", "Project / Client", "Amount", "Date", "Status"].map((h) => (
                    <span
                      key={h}
                      className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                {earnings.map((row, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-[2fr_3fr_2fr_3fr_1.5fr] px-6 py-4 border-b border-[#F8FAFC] last:border-none items-center hover:bg-[#FAFAFA] transition-colors min-w-[600px]"
                  >
                    <div className="flex items-center gap-2.5">
                      {SOURCE_ICONS[row.source] ?? SOURCE_ICONS["Milestone"]}
                      <span className="text-[13.5px] font-semibold text-[#0F172A]">
                        {row.source}
                      </span>
                    </div>
                    <span className="text-[13px] text-[#475569] pr-4 truncate">
                      {row.projectClient}
                    </span>
                    <span className="text-[13.5px] font-bold text-[#059669]">{row.amount}</span>
                    <span className="text-[13px] text-[#64748B]">{row.date}</span>
                    <div>
                      <span
                        className={`text-[12px] font-semibold px-3 py-1 rounded-md ${
                          row.status === "Paid"
                            ? "bg-[#F0FDF4] text-[#059669]"
                            : "bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]"
                        }`}
                      >
                        {row.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* PIN Modals */}
      <SetPinModal isOpen={isSetPinOpen} onClose={() => setIsSetPinOpen(false)} onSuccess={() => {}} />
      <ForgotPinModal isOpen={isForgotPinOpen} onClose={() => setIsForgotPinOpen(false)} />
    </div>
  );
}
