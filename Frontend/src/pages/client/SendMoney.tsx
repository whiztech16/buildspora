import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, Lock, ShieldCheck, Info, Search, ChevronDown, Check, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import PinModal from "../../components/shared/PinModal";
import ForgotPinModal from "../../components/shared/ForgotPinModal";
import SetPinModal from "../../components/shared/SetPinModal";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { useBanks, type BankEntry } from "../../hooks/useBanks";

// ─── Bank Dropdown ────────────────────────────────────────────────────────────
function BankDropdown({ value, onChange, banks, isLoadingBanks, hasError }: {
  value: string;
  onChange: (name: string, code: string) => void;
  banks: BankEntry[];
  isLoadingBanks: boolean;
  hasError: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const filtered = banks.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setSearch(""); }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => { if (open) setTimeout(() => searchRef.current?.focus(), 50); }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between border rounded-lg px-4 py-3 text-[14.5px] outline-none transition-all text-left bg-white
          ${hasError && !value ? "border-red-400" : open ? "border-[#16A34A] ring-2 ring-[#16A34A]/10" : "border-[#E2E8F0] hover:border-[#CBD5E1]"}
          ${value ? "text-[#0F172A] font-medium" : "text-gray-400"}`}
      >
        <span>{value || (isLoadingBanks ? "Loading banks…" : "Select bank")}</span>
        <ChevronDown size={16} className={`text-[#94A3B8] transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-white border border-[#E2E8F0] rounded-xl shadow-xl overflow-hidden">
          <div className="px-3 py-2.5 border-b border-[#F1F5F9] flex items-center gap-2">
            <Search size={14} className="text-[#94A3B8] shrink-0" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search bank..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-[13px] outline-none text-[#0F172A] placeholder-[#94A3B8]"
            />
            {search && <button onClick={() => setSearch("")} className="text-[#94A3B8] hover:text-[#64748B]"><X size={13} /></button>}
          </div>
          <div className="max-h-[220px] overflow-y-auto py-1">
            {isLoadingBanks ? (
              <div className="flex items-center justify-center gap-2 py-6 text-[#94A3B8] text-[13px]">
                <Loader2 size={14} className="animate-spin" /> Loading banks…
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-[13px] text-[#94A3B8] text-center py-4">No bank found</p>
            ) : (
              filtered.map((bank) => (
                <button
                  key={bank.code}
                  type="button"
                  onClick={() => { onChange(bank.name, bank.code); setOpen(false); setSearch(""); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-[13.5px] text-left transition-colors
                    ${value === bank.name ? "bg-[#F0FDF4] text-[#16A34A] font-semibold" : "text-[#0F172A] hover:bg-[#F8FAFC]"}`}
                >
                  {bank.name}
                  {value === bank.name && <Check size={14} className="text-[#16A34A]" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SendMoney() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUser } = useAuth();
  const { banks, isLoading: isLoadingBanks } = useBanks();

  const [amount, setAmount]           = useState("");
  const [narration, setNarration]     = useState("");
  const [bankName, setBankName]       = useState("");
  const [bankCode, setBankCode]       = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [formError, setFormError]     = useState("");

  const [pinOpen, setPinOpen]           = useState(false);
  const [forgotPinOpen, setForgotPinOpen] = useState(false);
  const [setPinModalOpen, setSetPinModalOpen] = useState(false);
  const [step, setStep]                 = useState<"form" | "success" | "error">("form");

  const [isResolving, setIsResolving]   = useState(false);
  const [resolveError, setResolveError] = useState("");
  const resolveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lookupAccountName = useCallback(async (accNum: string, bCode: string) => {
    if (accNum.length !== 10 || !bCode) return;
    setIsResolving(true);
    setResolveError("");
    setAccountName("");
    try {
      const res = await api.post<{ success: boolean; accountName: string }>(
        "/api/payments/resolve-account",
        { accountNumber: accNum, bankCode: bCode }
      );
      setAccountName(res.accountName);
    } catch (err: any) {
      setResolveError(err.message || "Could not resolve account name.");
    } finally {
      setIsResolving(false);
    }
  }, []);

  useEffect(() => {
    if (resolveTimeoutRef.current) clearTimeout(resolveTimeoutRef.current);
    if (accountNumber.length === 10 && bankCode) {
      resolveTimeoutRef.current = setTimeout(() => lookupAccountName(accountNumber, bankCode), 400);
    } else {
      setAccountName("");
      setResolveError("");
    }
  }, [accountNumber, bankCode, lookupAccountName]);

  const numericAmount = parseFloat(amount.replace(/[^0-9.]/g, "") || "0");
  const formattedAmount = numericAmount > 0 ? `₦${numericAmount.toLocaleString()}` : "₦0.00";

  function handleBack() {
    if (location.pathname.includes("/project/")) {
      navigate(-1);
    } else {
      navigate("/dashboard/client", { state: { activeTab: "payments" } });
    }
  }

  function handleProceed() {
    if (!bankName)              { setFormError("Please select a bank."); return; }
    if (accountNumber.length !== 10) { setFormError("Please enter a valid 10-digit account number."); return; }
    if (!accountName)           { setFormError("Account name could not be resolved. Check account number and bank."); return; }
    if (!numericAmount || numericAmount <= 0) { setFormError("Please enter a valid amount."); return; }
    setFormError("");
    if (user?.hasPin) {
      setPinOpen(true);
    } else {
      setSetPinModalOpen(true);
    }
  }

  async function handleVerifyPin(code: string) {
    const res = await api.post<{ success: boolean; error?: string }>(
      "/api/payments/send-money",
      {
        amount: numericAmount,
        pin: code,
        accountNumber,
        accountName,
        bankCode,
        bankName,
        narration: narration.trim() || undefined,
      }
    );
    if (!res.success) throw new Error(res.error || "Transfer failed.");
    setPinOpen(false);
    setStep("success");
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <div className="w-full max-w-[480px] mx-auto font-['Inter',sans-serif] py-16 px-4 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-[#F0FDF4] flex items-center justify-center mb-6">
          <CheckCircle2 size={42} className="text-[#16A34A]" strokeWidth={1.8} />
        </div>
        <h2 className="text-[22px] font-bold text-[#0F172A] mb-2">Transfer Successful!</h2>
        <p className="text-[14px] text-[#64748B] mb-8">
          <span className="font-bold text-[#0F172A]">{formattedAmount}</span> has been sent to <span className="font-bold text-[#0F172A]">{accountName}</span>.
        </p>
        <div className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-5 py-4 flex flex-col gap-3 mb-8 text-left">
          <div className="flex justify-between text-[13.5px]"><span className="text-[#64748B]">Bank</span><span className="font-semibold text-[#0F172A]">{bankName}</span></div>
          <div className="flex justify-between text-[13.5px]"><span className="text-[#64748B]">Account Name</span><span className="font-semibold text-[#0F172A]">{accountName}</span></div>
          <div className="flex justify-between text-[13.5px]"><span className="text-[#64748B]">Account Number</span><span className="font-semibold text-[#0F172A] tracking-wider">{accountNumber}</span></div>
          {narration && <div className="flex justify-between text-[13.5px]"><span className="text-[#64748B]">Narration</span><span className="font-semibold text-[#0F172A] max-w-[200px] text-right">{narration}</span></div>}
          <div className="flex justify-between text-[13.5px] border-t border-[#E2E8F0] pt-3 mt-1"><span className="text-[#64748B]">Amount</span><span className="font-bold text-[#16A34A]">{formattedAmount}</span></div>
        </div>
        <button onClick={handleBack} className="w-full bg-[#16A34A] hover:bg-[#15803d] text-white font-bold text-[15px] py-3.5 rounded-full transition-colors">
          Back to Payments
        </button>
      </div>
    );
  }

  // ── Form state ─────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-[1000px] mx-auto font-['Inter',sans-serif] pb-20 px-4 sm:px-6 lg:px-8 animate-fade-in text-gray-900">

      {/* Header */}
      <div className="mb-8 pt-6 sm:pt-8">
        <button onClick={handleBack} className="flex items-center gap-2 text-[14px] font-bold text-[#0F172A] hover:underline mb-6">
          <ArrowLeft size={16} strokeWidth={2.5} /> Back to Payments
        </button>
        <h1 className="text-[24px] sm:text-[28px] font-bold leading-tight mb-2">Send Money</h1>
        <p className="text-[14px] text-[#475569]">Fill in the details below to send money.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 xl:gap-8 items-start">

        {/* Left — Form */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 flex flex-col gap-5">

          {/* Amount */}
          <div>
            <label className="block text-[14px] font-bold text-[#0F172A] mb-2">Amount (₦)</label>
            <div className="relative flex items-center">
              <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12">
                <span className="text-[15px] font-bold text-[#0F172A] bg-[#F8FAFC] w-8 h-8 rounded flex items-center justify-center">₦</span>
              </div>
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => { setAmount(e.target.value.replace(/[^0-9.]/g, "")); setFormError(""); }}
                placeholder="Enter amount"
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] text-[14.5px] transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Bank */}
          <div>
            <label className="block text-[14px] font-bold text-[#0F172A] mb-2">Bank</label>
            <BankDropdown
              value={bankName}
              onChange={(name, code) => { setBankName(name); setBankCode(code); setFormError(""); }}
              banks={banks}
              isLoadingBanks={isLoadingBanks}
              hasError={!!formError}
            />
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-[14px] font-bold text-[#0F172A] mb-2">Account Number</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={10}
              value={accountNumber}
              onChange={(e) => { setAccountNumber(e.target.value.replace(/\D/g, "")); setFormError(""); }}
              placeholder="Enter 10-digit account number"
              className="w-full px-4 py-3 rounded-lg bg-white border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] text-[14.5px] transition-all placeholder:text-gray-400 tracking-widest font-mono"
            />
          </div>

          {/* Account Name — auto-resolved */}
          <div>
            <label className="block text-[14px] font-bold text-[#0F172A] mb-2">Account Name</label>
            <div className={`w-full px-4 py-3 rounded-lg border text-[14px] min-h-[48px] flex items-center gap-2 transition-all
              ${accountName ? "border-[#16A34A] bg-[#F0FDF4]" : "border-[#E2E8F0] bg-[#F8FAFC]"}`}>
              {isResolving ? (
                <><Loader2 size={15} className="animate-spin text-[#64748B]" /><span className="text-[#94A3B8]">Resolving account name…</span></>
              ) : accountName ? (
                <><Check size={15} className="text-[#16A34A] shrink-0" /><span className="font-bold text-[#0F172A]">{accountName}</span></>
              ) : resolveError ? (
                <><AlertCircle size={15} className="text-red-500 shrink-0" /><span className="text-red-500 text-[13px]">{resolveError}</span></>
              ) : (
                <span className="text-gray-400">Auto-filled after account number &amp; bank</span>
              )}
            </div>
          </div>

          {/* Narration */}
          <div>
            <label className="block text-[14px] font-bold text-[#0F172A] mb-2">Narration <span className="font-normal text-[#94A3B8]">(optional)</span></label>
            <div className="relative">
              <textarea
                rows={3}
                value={narration}
                onChange={(e) => setNarration(e.target.value)}
                maxLength={100}
                placeholder="e.g. Payment for electrical work"
                className="w-full px-4 py-3 rounded-lg bg-white border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] text-[14.5px] transition-all placeholder:text-gray-400 resize-none pb-8"
              />
              <span className="absolute right-3 bottom-3 text-[12px] font-medium text-gray-400">{narration.length} / 100</span>
            </div>
          </div>

          {/* Error */}
          {formError && (
            <p className="text-[13px] text-red-500 flex items-center gap-1.5 -mt-1">
              <AlertCircle size={14} /> {formError}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <button onClick={handleBack} className="text-[14.5px] font-bold text-[#475569] hover:text-[#0F172A] transition-colors">Cancel</button>
            <button
              onClick={handleProceed}
              disabled={isResolving}
              className="bg-[#16A34A] hover:bg-[#15803d] disabled:opacity-50 text-white font-bold text-[14.5px] px-8 py-3 rounded-full transition-colors"
            >
              Proceed
            </button>
          </div>
        </div>

        {/* Right — Summary */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8">
          <h3 className="text-[16px] font-bold text-[#0F172A] mb-8">Payment Summary</h3>

          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[#64748B]">Payment Type</span>
              <span className="text-[14px] font-medium text-[#475569]">Bank Transfer</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[#64748B]">Paying From</span>
              <span className="text-[14px] font-medium text-[#475569]">BuildSpora Wallet</span>
            </div>
            {accountName && (
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-[#64748B]">Recipient</span>
                <span className="text-[14px] font-semibold text-[#0F172A] text-right max-w-[180px]">{accountName}</span>
              </div>
            )}
            <div className="h-px bg-[#F1F5F9]" />
            <div className="flex items-center justify-between">
              <span className="text-[14.5px] text-[#64748B]">You are sending</span>
              <span className="text-[16px] font-bold text-[#0F172A]">{formattedAmount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[14.5px] text-[#64748B]">
                Bank Charges <Info size={14} className="text-[#94A3B8]" />
              </div>
              <span className="text-[14.5px] font-medium text-[#64748B]">₦0.00</span>
            </div>
            <div className="h-px bg-[#F1F5F9]" />
            <div className="flex items-center justify-between mb-2">
              <span className="text-[16px] font-bold text-[#0F172A]">Total</span>
              <span className="text-[20px] font-bold text-[#16A34A]">{formattedAmount}</span>
            </div>
            <div className="bg-[#F0FDF4] rounded-xl p-5 flex gap-3.5">
              <ShieldCheck size={20} className="text-[#16A34A] shrink-0 mt-0.5" strokeWidth={2.5} />
              <div className="flex flex-col gap-1">
                <span className="text-[13.5px] font-bold text-[#0F172A]">Secure Payment</span>
                <span className="text-[13px] text-[#475569] leading-relaxed">Your payment is protected with bank-level security and encryption.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-8 text-[#64748B] text-[13px] font-medium">
        <Lock size={14} /> All transactions are secure and encrypted.
      </div>

      <PinModal
        isOpen={pinOpen}
        onClose={() => setPinOpen(false)}
        onVerify={handleVerifyPin}
        actionLabel={`Send ${formattedAmount}`}
        onForgotPin={() => {
          setPinOpen(false);
          setForgotPinOpen(true);
        }}
      />

      <ForgotPinModal
        isOpen={forgotPinOpen}
        onClose={() => setForgotPinOpen(false)}
        onSuccess={() => setPinOpen(true)}
      />
      {/* Set PIN Modal */}
      <SetPinModal 
        isOpen={setPinModalOpen} 
        onClose={() => setSetPinModalOpen(false)} 
        onSuccess={() => {
          setSetPinModalOpen(false);
          updateUser({ hasPin: true });
          setPinOpen(true);
        }}
      />
    </div>
  );
}
