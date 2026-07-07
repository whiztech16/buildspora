import { useState, useEffect } from "react";
import { Copy, ArrowDown, ArrowDownLeft, Landmark, Lightbulb, ChevronRight, Loader2, RefreshCw, Wallet, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import SetPinModal from "../../components/shared/SetPinModal";
import ForgotPinModal from "../../components/shared/ForgotPinModal";

interface VirtualAccount {
  bankName: string;
  accountNumber: string;
  accountName: string;
  balance: number;
}

interface TxRecord {
  id: string;
  type: string;
  narration: string | null;
  amount: number;
  date: string;
  status: string;
  recipientBank: string | null;
  recipientAcct: string | null;
  recipientName: string | null;
}

interface PaymentsApiResponse {
  success: boolean;
  virtualAccount: VirtualAccount | null;
  earnings: TxRecord[];
  totalEarnings: number;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1 text-[12px] font-medium"
      title="Copy"
    >
      {copied ? "Copied!" : <><Copy size={12} /> Copy</>}
    </button>
  );
}

const fmtNaira = (n: number) => `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate  = (iso: string) => new Date(iso).toLocaleString("en-NG", { day: "2-digit", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });

export default function PaymentsEmpty() {
  const navigate = useNavigate();

  const [virtualAccount, setVirtualAccount] = useState<VirtualAccount | null>(null);
  const [transactions, setTransactions]     = useState<TxRecord[]>([]);
  const [isLoading, setIsLoading]           = useState(true);
  const [loadError, setLoadError]           = useState<string | null>(null);
  const [isGenerating, setIsGenerating]     = useState(false);
  const [generateError, setGenerateError]   = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing]     = useState(false);
  const [tab, setTab]                       = useState<"inbound" | "outbound">("inbound");
  const [isSetPinOpen, setIsSetPinOpen]     = useState(false);
  const [isForgotPinOpen, setIsForgotPinOpen] = useState(false);

  const loadPayments = async () => {
    try {
      setLoadError(null);
      const res = await api.get<PaymentsApiResponse>("/api/payments");
      setVirtualAccount(res.virtualAccount);
      setTransactions(res.earnings || []);
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
      const res = await api.post<{ success: boolean; virtualAccount: VirtualAccount; requiresPinSetup?: boolean }>("/api/payments/generate-account", {});
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await api.get<PaymentsApiResponse>("/api/payments");
      setVirtualAccount(res.virtualAccount);
      setTransactions(res.earnings || []);
    } catch (err) {
      // quiet fail on refresh
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDownloadReceipt = async (txId: string) => {
    try {
      const blob = await api.getBlob(`/api/payments/receipt/${txId}`);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${txId.substring(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message || "Failed to download receipt.");
    }
  };

  const inbound  = transactions.filter(t => t.type === "inbound" || t.type === "milestone_payout" || t.type === "marketplace_payment");
  const outbound = transactions.filter(t => t.type === "withdrawal" || t.type === "bank_transfer");
  const shown    = tab === "inbound" ? inbound : outbound;

  return (
    <div className="flex flex-col w-full animate-fade-in">

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
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="p-2.5 rounded-full border border-gray-200 bg-white text-[#64748B] hover:border-gray-300 hover:text-[#0F172A] transition-colors disabled:opacity-40"
            title="Refresh"
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Loading */}
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
          {/* Virtual Account Card */}
          <div className="mb-10">
            <h2 className="text-[16px] font-bold text-gray-900 mb-4">Virtual Account</h2>
            <div className="border border-[#F1F5F9] rounded-[24px] p-5 sm:p-8 shadow-sm bg-white">

              {virtualAccount ? (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Account details */}
                  <div className="flex flex-wrap gap-6 md:gap-12">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Bank Name</span>
                      <span className="text-[14px] font-bold text-[#0F172A]">{virtualAccount.bankName}</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Account Number</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-bold text-[#0F172A] tracking-wider">
                          {virtualAccount.accountNumber.replace(/(.{4})/g, "$1 ").trim()}
                        </span>
                        <CopyButton text={virtualAccount.accountNumber} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Account Name</span>
                      <span className="text-[14px] font-bold text-[#0F172A]">{virtualAccount.accountName}</span>
                    </div>
                  </div>
                  {/* Balance */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6 md:gap-8 pt-4 md:pt-0 border-t md:border-none border-gray-100">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Balance</span>
                      <span className="text-[22px] font-bold text-[#0F172A]">{fmtNaira(virtualAccount.balance)}</span>
                    </div>
                    <button
                      onClick={() => { navigator.clipboard.writeText(`Bank: ${virtualAccount.bankName}\nAccount: ${virtualAccount.accountNumber}\nName: ${virtualAccount.accountName}`).catch(() => {}) }}
                      className="flex items-center justify-center border border-[#16A34A] text-[#16A34A] px-5 py-2 rounded-lg text-[13px] font-semibold hover:bg-[#DCFCE7] hover:text-[#15803d] transition-colors whitespace-nowrap self-start"
                    >
                      Share Account Details
                    </button>
                    <button
                      onClick={() => setIsForgotPinOpen(true)}
                      className="flex items-center justify-center text-[#64748B] hover:text-[#0F172A] text-[13px] font-semibold transition-colors whitespace-nowrap self-start mt-2 sm:mt-0 sm:ml-2"
                    >
                      Reset PIN
                    </button>
                  </div>
                </div>
              ) : (
                /* No virtual account — show Generate button */
                <div className="flex flex-col items-center text-center gap-4 py-4">
                  <div className="flex gap-4 max-w-full xl:max-w-[340px] shrink-0 mb-2">
                    <div className="w-[52px] h-[52px] rounded-full bg-[#DCFCE7] flex items-center justify-center shrink-0">
                      <Landmark size={24} className="text-[#16A34A]" strokeWidth={1.5} />
                    </div>
                    <div className="pt-1 text-left">
                      <h3 className="text-[15.5px] font-bold text-[#0F172A] mb-1.5">Generate Your Virtual Account</h3>
                      <p className="text-[13.5px] text-[#475569] leading-relaxed">
                        Get a unique account number to fund your project milestones seamlessly.
                      </p>
                    </div>
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

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-8 border-b border-gray-100 pb-2">
            <button
              onClick={() => setTab("inbound")}
              className={`text-[14px] font-semibold px-4 py-1.5 rounded-md transition-colors ${tab === "inbound" ? "text-[#16A34A] bg-[#DCFCE7]" : "text-[#64748B] hover:text-[#0F172A] hover:bg-gray-50"}`}
            >
              Inbound
            </button>
            <button
              onClick={() => setTab("outbound")}
              className={`text-[14px] font-semibold px-4 py-1.5 rounded-md transition-colors ${tab === "outbound" ? "text-[#16A34A] bg-[#DCFCE7]" : "text-[#64748B] hover:text-[#0F172A] hover:bg-gray-50"}`}
            >
              Outbound
            </button>
          </div>

          {/* Transactions */}
          {shown.length === 0 ? (
            <div className="flex flex-col mb-10">
              <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                <div className="w-[52px] h-[52px] rounded-full bg-[#DCFCE7] flex items-center justify-center mb-5">
                  <ArrowDown size={24} className="text-[#16A34A]" strokeWidth={2} />
                </div>
                <h3 className="text-[16px] font-bold text-[#0F172A] mb-2.5">No transactions yet</h3>
                <p className="text-[13.5px] text-[#64748B] text-center max-w-[340px] mb-8 leading-relaxed">
                  {tab === "inbound"
                    ? "Fund your virtual account to pay for project milestones."
                    : "Your outbound transfers will appear here."}
                </p>
                {virtualAccount && tab === "inbound" && (
                  <button
                    onClick={() => { navigator.clipboard.writeText(`Bank: ${virtualAccount.bankName}\nAccount: ${virtualAccount.accountNumber}\nName: ${virtualAccount.accountName}`).catch(() => {}); }}
                    className="flex items-center justify-center border border-[#16A34A] text-[#16A34A] px-5 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-[#DCFCE7] hover:text-[#15803d] transition-colors whitespace-nowrap shadow-sm w-full sm:w-auto"
                  >
                    Share Account Details
                  </button>
                )}
              </div>

              {!virtualAccount && (
                <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-[16px] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-[42px] h-[42px] rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                      <Lightbulb size={20} className="text-[#16A34A]" strokeWidth={1.8} />
                    </div>
                    <div>
                      <h4 className="text-[14.5px] font-bold text-[#0F172A] mb-0.5">How to get started</h4>
                      <p className="text-[13.5px] text-[#475569]">Generate a virtual account, then fund it to pay for project milestones.</p>
                    </div>
                  </div>
                  <a href="#" className="text-[#16A34A] text-[13.5px] font-semibold flex items-center gap-1 hover:underline whitespace-nowrap self-start sm:self-center">
                    Learn more <ChevronRight size={16} />
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white overflow-x-auto hide-scrollbar border border-[#F1F5F9] rounded-xl">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-4 py-4 text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Transaction</th>
                    <th className="px-4 py-4 text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Details</th>
                    <th className="px-4 py-4 text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-4 text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-4 text-[12px] font-semibold text-gray-400 uppercase tracking-wider text-right">Status</th>
                    <th className="px-4 py-4 text-[12px] font-semibold text-gray-400 uppercase tracking-wider text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((tx) => {
                    const isIn = tx.type === "inbound" || tx.type === "milestone_payout" || tx.type === "marketplace_payment";
                    return (
                      <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-5">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isIn ? "bg-[#DCFCE7]" : "bg-[#FEF3C7]"}`}>
                              <ArrowDownLeft size={16} className={isIn ? "text-[#16A34A]" : "text-[#D97706] rotate-180"} strokeWidth={2.5} />
                            </div>
                            <span className="font-bold text-[#0F172A] whitespace-nowrap text-[14px]">
                              {tx.type === "milestone_payout" ? "Milestone Payout"
                               : tx.type === "bank_transfer" ? "Bank Transfer"
                               : tx.type === "withdrawal" ? "Withdrawal"
                               : "Bank Transfer"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-5 text-[13px] font-medium text-[#475569] max-w-[200px] truncate">
                          {tx.narration || tx.recipientName || "—"}
                        </td>
                        <td className={`px-4 py-5 text-[13.5px] font-bold whitespace-nowrap ${isIn ? "text-[#16A34A]" : "text-[#DC2626]"}`}>
                          {isIn ? "+" : "-"}{fmtNaira(tx.amount)}
                        </td>
                        <td className="px-4 py-5 text-[13px] font-medium text-[#475569] whitespace-nowrap">{fmtDate(tx.date)}</td>
                        <td className="px-4 py-5 text-right">
                          <span className={`text-[12px] font-semibold px-3 py-1 rounded-md ${tx.status === "paid" ? "bg-[#DCFCE7] text-[#16A34A]" : tx.status === "pending" ? "bg-[#FEF3C7] text-[#D97706]" : "bg-red-50 text-red-600"}`}>
                            {tx.status === "paid" ? "Paid" : tx.status === "pending" ? "Pending" : "Failed"}
                          </span>
                        </td>
                        <td className="px-4 py-5 text-right">
                          <button
                            onClick={() => handleDownloadReceipt(tx.id)}
                            className="p-2 text-gray-400 hover:text-[#16A34A] hover:bg-[#DCFCE7] rounded-lg transition-colors cursor-pointer"
                            title="Download Receipt"
                          >
                            <Download size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* PIN Modals */}
      <SetPinModal isOpen={isSetPinOpen} onClose={() => setIsSetPinOpen(false)} onSuccess={() => {}} />
      <ForgotPinModal isOpen={isForgotPinOpen} onClose={() => setIsForgotPinOpen(false)} />
    </div>
  );
}
