import { useState, useEffect } from "react";
import {
  Copy,
  ShoppingCart,
  FileText,
  Landmark,
  Loader2,
  Wallet,
  RefreshCw,
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  Building2,
  TrendingUp,
} from "lucide-react";
import ContractorWithdrawPage from "../../components/contractor/ContractorWithdrawPage";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import SetPinModal from "../../components/shared/SetPinModal";
import ForgotPinModal from "../../components/shared/ForgotPinModal";

type TabType = "all" | "inbound" | "outbound";

interface RawTransaction {
  id: string;
  source: string;
  projectName: string;
  amount: number;
  date: string;
  status: string;
  type: string;
  narration?: string;
  recipientBank?: string;
  recipientAcct?: string;
  recipientName?: string;
}

interface VirtualAccount {
  bankName: string;
  accountNumber: string;
  accountName: string;
  balance: number;
}

interface PaymentsApiResponse {
  success: boolean;
  virtualAccount: VirtualAccount | null;
  earnings: RawTransaction[];
  totalEarnings: number;
}

// ── Direction helpers ─────────────────────────────────────────────────────────
const INBOUND_TYPES = new Set(["milestone_payout", "inbound", "marketplace_payment"]);
const OUTBOUND_TYPES = new Set(["withdrawal", "bank_transfer", "transfer"]);

function getDirection(type: string): "inbound" | "outbound" {
  if (INBOUND_TYPES.has(type)) return "inbound";
  if (OUTBOUND_TYPES.has(type)) return "outbound";
  return "inbound";
}

// ── Formatters ────────────────────────────────────────────────────────────────
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

// ── Copy button ───────────────────────────────────────────────────────────────
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

// ── Source icon ───────────────────────────────────────────────────────────────
function SourceIcon({ type }: { type: string }) {
  const dir = getDirection(type);
  if (type === "milestone_payout") {
    return <div className="w-9 h-9 rounded-full bg-[#F0FDF4] flex items-center justify-center shrink-0"><Landmark size={16} className="text-[#059669]" strokeWidth={1.8} /></div>;
  }
  if (type === "marketplace_payment") {
    return <div className="w-9 h-9 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0"><ShoppingCart size={16} className="text-[#3B82F6]" strokeWidth={1.8} /></div>;
  }
  if (type === "inbound") {
    return <div className="w-9 h-9 rounded-full bg-[#F0FDF4] flex items-center justify-center shrink-0"><ArrowDownLeft size={16} className="text-[#059669]" strokeWidth={1.8} /></div>;
  }
  if (type === "bank_transfer") {
    return <div className="w-9 h-9 rounded-full bg-[#FFF7ED] flex items-center justify-center shrink-0"><Building2 size={16} className="text-[#EA580C]" strokeWidth={1.8} /></div>;
  }
  if (type === "withdrawal") {
    return <div className="w-9 h-9 rounded-full bg-[#FEF2F2] flex items-center justify-center shrink-0"><ArrowUpRight size={16} className="text-[#DC2626]" strokeWidth={1.8} /></div>;
  }
  return dir === "inbound"
    ? <div className="w-9 h-9 rounded-full bg-[#F0FDF4] flex items-center justify-center shrink-0"><ArrowDownLeft size={16} className="text-[#059669]" strokeWidth={1.8} /></div>
    : <div className="w-9 h-9 rounded-full bg-[#FFF7ED] flex items-center justify-center shrink-0"><FileText size={16} className="text-[#D97706]" strokeWidth={1.8} /></div>;
}

function sourceLabel(type: string) {
  const map: Record<string, string> = {
    milestone_payout: "Milestone",
    marketplace_payment: "Marketplace",
    inbound: "Inbound",
    bank_transfer: "Bank Transfer",
    withdrawal: "Withdrawal",
    transfer: "Transfer",
  };
  return map[type] ?? type;
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const isPaid = status === "paid" || status === "success";
  const isFailed = status === "failed";
  return (
    <span
      className={`inline-flex items-center text-[11.5px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
        isPaid
          ? "bg-[#F0FDF4] text-[#059669]"
          : isFailed
          ? "bg-[#FEF2F2] text-[#DC2626]"
          : "bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]"
      }`}
    >
      {isPaid ? "Paid" : isFailed ? "Failed" : "Pending"}
    </span>
  );
}

// ── Receipt download ──────────────────────────────────────────────────────────
function ReceiptButton({ txId }: { txId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setLoading(true);
    setError(null);
    try {
      const blob = await api.getBlob(`/api/payments/receipt/${txId}`);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `BuildSpora-Receipt-${txId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || "Failed to download receipt.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleDownload}
        disabled={loading}
        title="Download receipt"
        className="flex items-center gap-1.5 text-[11.5px] font-medium text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-md px-2.5 py-1 transition-all disabled:opacity-50 whitespace-nowrap"
      >
        {loading ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
        Receipt
      </button>
      {error && <span className="text-[10.5px] text-red-500 text-right">{error}</span>}
    </div>
  );
}

// ── Transaction row — Desktop (table) / Mobile (card) ─────────────────────────
function TransactionRow({ row }: { row: RawTransaction }) {
  const dir = getDirection(row.type);
  const description = row.narration || row.projectName || "—";

  return (
    <>
      {/* ── Desktop row (md+) ── */}
      <div className="hidden md:grid grid-cols-[2fr_3fr_2fr_2.5fr_1.2fr_auto] px-5 py-4 border-b border-[#F8FAFC] last:border-none items-center hover:bg-[#FAFAFA] transition-colors gap-3">
        {/* Type */}
        <div className="flex items-center gap-2.5 min-w-0">
          <SourceIcon type={row.type} />
          <span className="text-[13px] font-semibold text-[#0F172A] truncate">{sourceLabel(row.type)}</span>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-0.5 min-w-0 pr-2">
          <span className="text-[12.5px] text-[#475569] truncate">{description}</span>
          {row.recipientName && (
            <span className="text-[11px] text-[#94A3B8] truncate">
              To: {row.recipientName}{row.recipientBank ? ` · ${row.recipientBank}` : ""}
            </span>
          )}
        </div>

        {/* Amount */}
        <span className={`text-[13.5px] font-bold ${dir === "inbound" ? "text-[#059669]" : "text-[#DC2626]"}`}>
          {dir === "inbound" ? "+" : "−"}{fmtNaira(Number(row.amount))}
        </span>

        {/* Date */}
        <span className="text-[12px] text-[#64748B]">{fmtDate(row.date)}</span>

        {/* Status */}
        <StatusBadge status={row.status} />

        {/* Receipt */}
        <ReceiptButton txId={row.id} />
      </div>

      {/* ── Mobile card (< md) ── */}
      <div className="md:hidden px-4 py-4 border-b border-[#F8FAFC] last:border-none hover:bg-[#FAFAFA] transition-colors">
        <div className="flex items-start gap-3">
          <SourceIcon type={row.type} />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-[#0F172A] truncate">{sourceLabel(row.type)}</p>
                <p className="text-[12px] text-[#64748B] truncate">{description}</p>
                {row.recipientName && (
                  <p className="text-[11px] text-[#94A3B8] truncate">
                    To: {row.recipientName}{row.recipientBank ? ` · ${row.recipientBank}` : ""}
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className={`text-[14px] font-bold ${dir === "inbound" ? "text-[#059669]" : "text-[#DC2626]"}`}>
                  {dir === "inbound" ? "+" : "−"}{fmtNaira(Number(row.amount))}
                </p>
                <p className="text-[11px] text-[#94A3B8] mt-0.5">{fmtDate(row.date)}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <StatusBadge status={row.status} />
              <ReceiptButton txId={row.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ContractorPayments() {
  const { user } = useAuth();
  const [showWithdraw, setShowWithdraw] = useState(false);

  const [virtualAccount, setVirtualAccount] = useState<VirtualAccount | null>(null);
  const [rawEarnings, setRawEarnings] = useState<RawTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [isSetPinOpen, setIsSetPinOpen] = useState(false);
  const [isForgotPinOpen, setIsForgotPinOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<TabType>("all");

  const loadPayments = async () => {
    try {
      setLoadError(null);
      const res = await api.get<PaymentsApiResponse>("/api/payments");
      setVirtualAccount(res.virtualAccount);
      setRawEarnings(res.earnings || []);
    } catch (err: any) {
      setLoadError(err.message || "Failed to load payments.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadPayments(); }, []);

  const handleGenerateAccount = async () => {
    setIsGenerating(true);
    setGenerateError(null);
    try {
      const res = await api.post<{ success: boolean; virtualAccount: VirtualAccount; requiresPinSetup?: boolean }>(
        "/api/payments/generate-account", {}
      );
      setVirtualAccount(res.virtualAccount);
      if (res.requiresPinSetup) setIsSetPinOpen(true);
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
      setRawEarnings(res.earnings || []);
    } catch { /* silent */ } finally {
      setIsRefreshing(false);
    }
  };

  // ── Derived stats ─────────────────────────────────────────────────────────
  const totalInbound = rawEarnings
    .filter(e => getDirection(e.type) === "inbound" && (e.status === "paid" || e.status === "success"))
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const totalOutbound = rawEarnings
    .filter(e => getDirection(e.type) === "outbound" && (e.status === "paid" || e.status === "success"))
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const pendingOutbound = rawEarnings
    .filter(e => getDirection(e.type) === "outbound" && e.status !== "paid" && e.status !== "success" && e.status !== "failed")
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const filteredTxns = rawEarnings.filter(e => {
    if (activeTab === "all") return true;
    return getDirection(e.type) === activeTab;
  });

  // ── Withdraw page ─────────────────────────────────────────────────────────
  if (showWithdraw) {
    return (
      <ContractorWithdrawPage
        availableBalance={virtualAccount ? fmtNaira(virtualAccount.balance) : "₦0.00"}
        rawBalance={virtualAccount?.balance ?? 0}
        email={user?.email ?? ""}
        onBack={() => setShowWithdraw(false)}
        onSuccess={() => { setShowWithdraw(false); loadPayments(); }}
      />
    );
  }

  // ── Payments overview ─────────────────────────────────────────────────────
  return (
    <div className="flex flex-col w-full" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6 sm:mb-8 gap-3">
        <h1 className="text-[22px] sm:text-[28px] font-bold text-[#0F172A] tracking-tight">Payments</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefreshBalance}
            disabled={isRefreshing || isLoading}
            className="p-2 rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#CBD5E1] hover:text-[#0F172A] transition-colors disabled:opacity-40"
            title="Refresh"
          >
            <RefreshCw size={15} className={isRefreshing ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => setShowWithdraw(true)}
            disabled={!virtualAccount || (virtualAccount?.balance ?? 0) <= 0}
            className="bg-[#0F172A] text-white text-[13px] sm:text-[13.5px] font-semibold px-4 sm:px-5 py-2.5 rounded-lg hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Withdraw
          </button>
        </div>
      </div>

      {/* ── Loading / Error ── */}
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 text-[#64748B] text-[14px] py-20">
          <Loader2 size={18} className="animate-spin" /> Loading payments…
        </div>
      ) : loadError ? (
        <div className="bg-red-50 border border-red-200 text-red-600 text-[13.5px] font-medium p-4 rounded-xl mb-6">
          {loadError}
        </div>
      ) : (
        <>
          {/* ── Payout Account ── */}
          <div className="mb-6">
            <h2 className="text-[14px] font-bold text-[#0F172A] mb-3">Payout Account</h2>
            <div className="border border-[#E2E8F0] rounded-xl bg-white overflow-hidden">
              {virtualAccount ? (
                <>
                  <div className="px-4 sm:px-6 py-5 grid grid-cols-2 sm:flex sm:flex-row sm:items-center gap-4 sm:gap-8 flex-wrap">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-widest">Bank</span>
                      <span className="text-[13.5px] font-semibold text-[#0F172A]">{virtualAccount.bankName}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-widest">Account Number</span>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[13.5px] font-semibold text-[#0F172A] tracking-wider">
                          {virtualAccount.accountNumber.replace(/(.{4})/g, "$1 ").trim()}
                        </span>
                        <CopyButton text={virtualAccount.accountNumber} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-widest">Account Name</span>
                      <span className="text-[13.5px] font-semibold text-[#0F172A]">{virtualAccount.accountName}</span>
                    </div>
                    <div className="flex flex-col gap-0.5 col-span-2 sm:col-span-1">
                      <span className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-widest">Available Balance</span>
                      <span className="text-[22px] sm:text-[26px] font-bold text-[#0F172A]">{fmtNaira(virtualAccount.balance)}</span>
                    </div>
                  </div>
                  <div className="border-t border-[#F1F5F9] px-4 sm:px-6 py-3 bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <p className="text-[12px] text-[#64748B]">Share your account number with clients to receive milestone payments.</p>
                    <button onClick={() => setIsForgotPinOpen(true)} className="text-[12px] font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors whitespace-nowrap">
                      Reset PIN
                    </button>
                  </div>
                </>
              ) : (
                <div className="px-6 py-10 flex flex-col items-center text-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#F1F5F9] flex items-center justify-center">
                    <Wallet size={24} className="text-[#94A3B8]" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-[#0F172A] mb-1">No Virtual Account Yet</h3>
                    <p className="text-[13.5px] text-[#64748B] max-w-[340px] leading-relaxed">
                      Generate your unique Nomba virtual account to start receiving milestone payments from clients.
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
                    {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Wallet size={16} />}
                    {isGenerating ? "Generating account…" : "Generate Virtual Account"}
                  </button>
                  <p className="text-[11.5px] text-[#94A3B8]">This can only be done once per account.</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Stats strip ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {[
              { label: "Total Received", value: fmtNaira(totalInbound), color: "#059669", icon: <ArrowDownLeft size={15} className="text-[#059669]" />, bg: "#F0FDF4" },
              { label: "Total Withdrawn", value: fmtNaira(totalOutbound), color: "#DC2626", icon: <ArrowUpRight size={15} className="text-[#DC2626]" />, bg: "#FEF2F2" },
              { label: "Pending Outbound", value: fmtNaira(pendingOutbound), color: "#D97706", icon: <TrendingUp size={15} className="text-[#D97706]" />, bg: "#FFFBEB" },
            ].map((stat) => (
              <div key={stat.label} className="border border-[#E2E8F0] rounded-xl bg-white px-4 py-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: stat.bg }}>
                  {stat.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-[10.5px] font-semibold text-[#94A3B8] uppercase tracking-widest mb-0.5 truncate">{stat.label}</p>
                  <p className="text-[18px] sm:text-[20px] font-bold truncate" style={{ color: stat.color }}>{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Transaction History ── */}
          <div>
            {/* Header + tabs */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h2 className="text-[14px] font-bold text-[#0F172A]">Transaction History</h2>
              <div className="flex items-center bg-[#F1F5F9] rounded-lg p-1 gap-0.5">
                {(["all", "inbound", "outbound"] as TabType[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-[11.5px] sm:text-[12.5px] font-semibold transition-all ${
                      activeTab === tab ? "bg-white text-[#0F172A] shadow-sm" : "text-[#64748B] hover:text-[#0F172A]"
                    }`}
                  >
                    {tab === "inbound" && <ArrowDownLeft size={12} className="text-[#059669]" />}
                    {tab === "outbound" && <ArrowUpRight size={12} className="text-[#DC2626]" />}
                    <span>{tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      activeTab === tab
                        ? tab === "inbound" ? "bg-[#F0FDF4] text-[#059669]"
                          : tab === "outbound" ? "bg-[#FEF2F2] text-[#DC2626]"
                          : "bg-[#E2E8F0] text-[#64748B]"
                        : "bg-transparent text-[#94A3B8]"
                    }`}>
                      {tab === "all" ? rawEarnings.length : rawEarnings.filter(e => getDirection(e.type) === tab).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {filteredTxns.length === 0 ? (
              <div className="border border-dashed border-[#E2E8F0] rounded-xl flex flex-col items-center justify-center py-16 px-8 text-center bg-white">
                <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-3">
                  {activeTab === "inbound" ? <ArrowDownLeft size={20} className="text-[#94A3B8]" />
                    : activeTab === "outbound" ? <ArrowUpRight size={20} className="text-[#94A3B8]" />
                    : <Wallet size={20} className="text-[#94A3B8]" />}
                </div>
                <h3 className="text-[15px] font-semibold text-[#0F172A] mb-2">
                  {activeTab === "inbound" ? "No inbound transfers yet"
                    : activeTab === "outbound" ? "No outbound transfers yet"
                    : "No transactions yet"}
                </h3>
                <p className="text-[13px] text-[#64748B] max-w-[300px] leading-relaxed">
                  {activeTab === "inbound"
                    ? "Payments received from clients for milestones or marketplace orders will appear here."
                    : activeTab === "outbound"
                    ? "Withdrawals and bank transfers you initiate will appear here."
                    : "Your transaction history will appear here once clients complete milestone payments."}
                </p>
              </div>
            ) : (
              <div className="border border-[#E2E8F0] rounded-xl bg-white overflow-hidden">
                {/* Desktop table header */}
                <div className="hidden md:grid grid-cols-[2fr_3fr_2fr_2.5fr_1.2fr_auto] px-5 py-3 border-b border-[#F1F5F9] gap-3">
                  {["Type", "Description", "Amount", "Date", "Status", ""].map((h) => (
                    <span key={h} className="text-[10.5px] font-semibold text-[#94A3B8] uppercase tracking-widest">{h}</span>
                  ))}
                </div>

                {filteredTxns.map((row) => (
                  <TransactionRow key={row.id} row={row} />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <SetPinModal isOpen={isSetPinOpen} onClose={() => setIsSetPinOpen(false)} onSuccess={() => {}} />
      <ForgotPinModal isOpen={isForgotPinOpen} onClose={() => setIsForgotPinOpen(false)} />
    </div>
  );
}
