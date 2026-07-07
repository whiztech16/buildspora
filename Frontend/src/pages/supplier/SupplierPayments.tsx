import { useState, useEffect } from "react";
import { CreditCard, ArrowDownLeft, Receipt, Wallet, Loader2, RefreshCw, Copy } from "lucide-react";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import WithdrawModal from "../../components/shared/WithdrawModal";

const FONT = "'Inter', sans-serif";

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
      className="flex items-center gap-1 text-[12px] font-medium text-[#64748B] hover:text-[#0F172A] transition-colors"
    >
      {copied ? "Copied!" : <><Copy size={12} /> Copy</>}
    </button>
  );
}

const fmtNaira = (n: number) => `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate  = (iso: string) => new Date(iso).toLocaleString("en-NG", { day: "2-digit", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });

export default function SupplierPayments() {
  const { user } = useAuth();
  const [virtualAccount, setVirtualAccount] = useState<VirtualAccount | null>(null);
  const [transactions, setTransactions]     = useState<TxRecord[]>([]);
  const [totalEarnings, setTotalEarnings]   = useState(0);
  const [isLoading, setIsLoading]           = useState(true);
  const [loadError, setLoadError]           = useState<string | null>(null);
  const [isGenerating, setIsGenerating]     = useState(false);
  const [generateError, setGenerateError]   = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing]     = useState(false);
  const [withdrawOpen, setWithdrawOpen]     = useState(false);

  const loadPayments = async () => {
    try {
      setLoadError(null);
      const res = await api.get<PaymentsApiResponse>("/api/payments");
      setVirtualAccount(res.virtualAccount);
      setTransactions(res.earnings || []);
      setTotalEarnings(res.totalEarnings ?? 0);
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
      const res = await api.post<{ success: boolean; virtualAccount: VirtualAccount }>("/api/payments/generate-account", {});
      setVirtualAccount(res.virtualAccount);
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
      setTotalEarnings(res.totalEarnings ?? 0);
    } catch { /* silent */ }
    finally { setIsRefreshing(false); }
  };

  const paid    = transactions.filter(t => t.status === "paid").reduce((s, t) => s + t.amount, 0);
  const pending = transactions.filter(t => t.status === "pending").reduce((s, t) => s + t.amount, 0);

  return (
    <div style={{ fontFamily: FONT }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[24px] font-bold text-[#0F172A]">Payments</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="p-2 rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#CBD5E1] hover:text-[#0F172A] transition-colors disabled:opacity-40"
            title="Refresh"
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
          </button>
        </div>
        {/* Withdraw button — only when VA has balance */}
        {virtualAccount && virtualAccount.balance > 0 && (
          <button
            onClick={() => setWithdrawOpen(true)}
            className="flex items-center gap-2 bg-[#0F172A] text-white text-[13.5px] font-semibold px-4 py-2.5 rounded-lg hover:bg-black transition-colors"
          >
            Withdraw
          </button>
        )}
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
          {/* Payout Account */}
          {virtualAccount ? (
            <div className="bg-white border border-[#E2E8F0] rounded-[4px] p-6 mb-6">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F1F5F9] flex items-center justify-center shrink-0">
                    <CreditCard size={22} className="text-[#475569]" />
                  </div>
                  <div>
                    <p className="text-[13px] text-[#64748B] mb-0.5">Payout Account</p>
                    <p className="text-[15px] font-bold text-[#0F172A]">{virtualAccount.bankName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[13px] text-[#475569] tracking-wider">{virtualAccount.accountNumber.replace(/(.{4})/g, "$1 ").trim()}</p>
                      <CopyButton text={virtualAccount.accountNumber} />
                    </div>
                    <p className="text-[12.5px] text-[#94A3B8] mt-0.5">{virtualAccount.accountName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[12.5px] text-[#64748B] mb-0.5">Available Balance</p>
                  <p className="text-[22px] font-bold text-[#0F172A]">{fmtNaira(virtualAccount.balance)}</p>
                </div>
              </div>
            </div>
          ) : (
            /* No virtual account — generate it */
            <div className="bg-white border border-[#E2E8F0] rounded-[4px] p-6 mb-6">
              <div className="flex flex-col items-center text-center gap-4 py-2">
                <div className="w-14 h-14 rounded-full bg-[#F1F5F9] flex items-center justify-center">
                  <Wallet size={24} className="text-[#94A3B8]" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[#0F172A] mb-1">No Virtual Account Yet</h3>
                  <p className="text-[13.5px] text-[#64748B] max-w-[340px] leading-relaxed">
                    Generate your unique account number to start receiving payments from orders.
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
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: "Total Revenue",    value: fmtNaira(totalEarnings), sub: "All time" },
              { label: "Total Paid Out",   value: fmtNaira(paid),          sub: "Completed" },
              { label: "Pending",          value: fmtNaira(pending),       sub: "Awaiting confirmation" },
            ].map(s => (
              <div key={s.label} className="bg-white border border-[#E2E8F0] rounded-[4px] p-5">
                <p className="text-[13px] text-[#64748B] mb-1">{s.label}</p>
                <p className="text-[22px] font-bold text-[#0F172A]">{s.value}</p>
                <p className="text-[12px] text-[#94A3B8] mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Transactions */}
          <div className="bg-white border border-[#E2E8F0] rounded-[4px] p-6">
            <h2 className="text-[16px] font-bold text-[#0F172A] mb-5">Transaction History</h2>

            {transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-3">
                  <Receipt size={22} className="text-[#94A3B8]" />
                </div>
                <p className="text-[14px] font-bold text-[#0F172A] mb-1">No payments yet</p>
                <p className="text-[13px] text-[#64748B] max-w-[240px] leading-relaxed">
                  Payments from your orders will appear here once clients pay.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-[560px]">
                  <div className="grid grid-cols-5 text-[12.5px] text-[#64748B] pb-3 border-b border-[#F1F5F9]">
                    <span className="col-span-2">Narration</span>
                    <span>Amount</span>
                    <span>Date</span>
                    <span className="text-right">Status</span>
                  </div>
                  {transactions.map(tx => (
                    <div key={tx.id} className="grid grid-cols-5 items-center py-4 border-b border-[#F1F5F9] last:border-0">
                      <div className="col-span-2 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#ECFDF5] flex items-center justify-center shrink-0">
                          <ArrowDownLeft size={15} className="text-[#059669]" />
                        </div>
                        <div>
                          <p className="text-[13.5px] font-semibold text-[#0F172A]">{tx.narration || tx.recipientName || "—"}</p>
                          <p className="text-[12px] text-[#94A3B8] capitalize">{tx.type.replace(/_/g, " ")}</p>
                        </div>
                      </div>
                      <span className="text-[14px] font-bold text-[#059669]">{fmtNaira(tx.amount)}</span>
                      <span className="text-[12.5px] text-[#64748B]">{fmtDate(tx.date)}</span>
                      <div className="flex justify-end">
                        <span className={`text-[12px] font-bold px-3 py-1 rounded-md ${
                          tx.status === "paid" ? "bg-[#ECFDF5] text-[#059669]"
                          : tx.status === "pending" ? "bg-[#FEF3C7] text-[#D97706]"
                          : "bg-red-50 text-red-600"
                        }`}>
                          {tx.status === "paid" ? "Paid" : tx.status === "pending" ? "Pending" : "Failed"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Withdraw Modal */}
      <WithdrawModal
        isOpen={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        availableBalance={virtualAccount ? fmtNaira(virtualAccount.balance) : "\u20a60.00"}
        rawBalance={virtualAccount?.balance ?? 0}
        email={user?.email ?? ""}
        onSuccess={() => { setWithdrawOpen(false); loadPayments(); }}
      />
    </div>
  );
}
