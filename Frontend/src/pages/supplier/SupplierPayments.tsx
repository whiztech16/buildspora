import { useState } from "react";
import { CreditCard, ArrowDownLeft, AlertCircle, Plus, Receipt } from "lucide-react";
import WithdrawModal from "../../components/shared/WithdrawModal";
import PreviewToggle from "../../components/shared/PreviewToggle";

const FONT = "'Inter', sans-serif";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Transaction {
  id: string;
  client: string;
  item: string;
  amount: string;
  rawAmount: number;
  date: string;
  status: "Paid" | "Pending";
}

interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountName: string;
  balance: string;
}

// ── Mock data (backend will replace this) ─────────────────────────────────────
const MOCK_ACCOUNT: BankAccount = {
  bankName: "GTBank",
  accountNumber: "0123 456 789",
  accountName: "Dangote Cement",
  balance: "₦2,450,000",
};

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "1", client: "Chioma Adeyemi", item: "Dangote Cement — 200 bags", amount: "₦900,000", rawAmount: 900000, date: "27 Jun 2026", status: "Paid" },
  { id: "2", client: "Ngozi Okonkwo",  item: "Iron Rod 12mm — 50 pcs",   amount: "₦425,000", rawAmount: 425000, date: "26 Jun 2026", status: "Paid" },
  { id: "3", client: "Emeka Nwachukwu",item: "Zinc Roofing — 80 sheets",  amount: "₦320,000", rawAmount: 320000, date: "20 Jun 2026", status: "Paid" },
  { id: "4", client: "Adaeze Obi",     item: "BUA Cement — 150 bags",     amount: "₦840,000", rawAmount: 840000, date: "18 Jun 2026", status: "Paid" },
  { id: "5", client: "Tunde Bakare",   item: "BUA Cement — 150 bags",     amount: "₦840,000", rawAmount: 840000, date: "Today",      status: "Pending" },
];

// ── Preview states ─────────────────────────────────────────────────────────────
const PREVIEW_STATES = [
  { label: "New Supplier",  description: "No bank account, no transactions" },
  { label: "Active Supplier", description: "Bank linked, transactions present" },
];

// ── Sub-components ─────────────────────────────────────────────────────────────
function PayoutCard({ account, onWithdraw }: { account: BankAccount; onWithdraw: () => void }) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[4px] p-6 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F1F5F9] flex items-center justify-center shrink-0">
            <CreditCard size={22} className="text-[#475569]" />
          </div>
          <div>
            <p className="text-[13px] text-[#64748B] mb-0.5">Linked Bank Account</p>
            <p className="text-[15px] font-bold text-[#0F172A]">{account.bankName} · {account.accountNumber}</p>
            <p className="text-[13px] text-[#475569]">{account.accountName}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[12.5px] text-[#64748B] mb-0.5">Available Balance</p>
          <p className="text-[22px] font-bold text-[#0F172A]">{account.balance}</p>
          <button
            onClick={onWithdraw}
            className="mt-2 px-4 py-1.5 rounded-lg border border-[#059669] text-[#059669] text-[12.5px] font-semibold hover:bg-[#ECFDF5] transition-colors"
          >
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}

function NoBankCard() {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[4px] p-6 mb-6 flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-[#FEF3C7] flex items-center justify-center shrink-0">
        <AlertCircle size={20} className="text-[#D97706]" />
      </div>
      <div className="flex-1">
        <p className="text-[14px] font-bold text-[#0F172A] mb-0.5">No payout account linked</p>
        <p className="text-[13px] text-[#64748B]">Link a bank account to start receiving payments from your orders.</p>
      </div>
      <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#059669] hover:bg-[#047857] text-white text-[13px] font-semibold transition-colors shrink-0">
        <Plus size={14} />
        Add Bank Account
      </button>
    </div>
  );
}

function StatsRow({ transactions }: { transactions: Transaction[] }) {
  const total = transactions.filter(t => t.status === "Paid").reduce((s, t) => s + t.rawAmount, 0);
  const pending = transactions.filter(t => t.status === "Pending").reduce((s, t) => s + t.rawAmount, 0);
  const fmt = (n: number) => n === 0 ? "₦0.00" : "₦" + n.toLocaleString();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {[
        { label: "Total Revenue",  value: fmt(total),   sub: "All time" },
        { label: "This Month",     value: fmt(0),        sub: "June 2026" },
        { label: "Pending",        value: fmt(pending),  sub: "Awaiting payment" },
      ].map(s => (
        <div key={s.label} className="bg-white border border-[#E2E8F0] rounded-[4px] p-5">
          <p className="text-[13px] text-[#64748B] mb-1">{s.label}</p>
          <p className="text-[22px] font-bold text-[#0F172A]">{s.value}</p>
          <p className="text-[12px] text-[#94A3B8] mt-0.5">{s.sub}</p>
        </div>
      ))}
    </div>
  );
}

function TransactionList({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[4px] p-6">
      <h2 className="text-[16px] font-bold text-[#0F172A] mb-5">Transaction History</h2>

      {transactions.length === 0 ? (
        /* ── Empty state ── */
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
        /* ── Transaction table ── */
        <div className="overflow-x-auto">
          <div className="min-w-[560px]">
            <div className="grid grid-cols-5 text-[12.5px] text-[#64748B] pb-3 border-b border-[#F1F5F9]">
              <span className="col-span-2">Client / Item</span>
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
                    <p className="text-[13.5px] font-semibold text-[#0F172A]">{tx.client}</p>
                    <p className="text-[12px] text-[#94A3B8]">{tx.item}</p>
                  </div>
                </div>
                <span className="text-[14px] font-bold text-[#059669]">{tx.amount}</span>
                <span className="text-[12.5px] text-[#64748B]">{tx.date}</span>
                <div className="flex justify-end">
                  <span className={`text-[12px] font-bold px-3 py-1 rounded-md ${
                    tx.status === "Paid" ? "bg-[#ECFDF5] text-[#059669]" : "bg-[#FEF3C7] text-[#D97706]"
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function SupplierPayments() {
  const [previewIdx, setPreviewIdx] = useState(0);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  // In production: replace these with real API data
  const isNewSupplier = previewIdx === 0;
  const account: BankAccount | null = isNewSupplier ? null : MOCK_ACCOUNT;
  const transactions: Transaction[] = isNewSupplier ? [] : MOCK_TRANSACTIONS;

  return (
    <div style={{ fontFamily: FONT }}>
      {/* Preview toggle (remove in production) */}
      <PreviewToggle states={PREVIEW_STATES} current={previewIdx} onChange={setPreviewIdx} />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[24px] font-bold text-[#0F172A]">Payments</h1>
        {account && (
          <button
            onClick={() => setWithdrawOpen(true)}
            className="flex items-center gap-2 bg-[#059669] hover:bg-[#047857] text-white text-[13.5px] font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <ArrowDownLeft size={16} strokeWidth={2} />
            Withdraw
          </button>
        )}
      </div>

      {/* Payout Account */}
      {account
        ? <PayoutCard account={account} onWithdraw={() => setWithdrawOpen(true)} />
        : <NoBankCard />
      }

      {/* Stats */}
      <StatsRow transactions={transactions} />

      {/* Transactions */}
      <TransactionList transactions={transactions} />

      {/* Withdraw Modal */}
      <WithdrawModal
        isOpen={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        availableBalance={account?.balance ?? "₦0.00"}
      />
    </div>
  );
}
