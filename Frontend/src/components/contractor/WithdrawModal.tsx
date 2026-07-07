import { useState, useRef, useEffect, useCallback } from "react";
import { X, AlertCircle, ArrowRight, Search, ChevronDown, Check, CheckCircle2, Copy, Loader2 } from "lucide-react";
import OTPModal from "../shared/OTPModal";
import { api } from "../../lib/api";
import { useBanks, type BankEntry } from "../../hooks/useBanks";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance?: string;
  rawBalance?: number;
  email?: string;
  onSuccess?: () => void;
}

type Step = "form" | "success" | "error";

function BankDropdown({ value, onChange, hasError, banks, isLoadingBanks }: {
  value: string;
  onChange: (name: string, code: string) => void;
  hasError: boolean;
  banks: BankEntry[];
  isLoadingBanks: boolean;
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
        className={`w-full flex items-center justify-between border rounded-xl px-4 py-3 text-[14px] outline-none transition-all text-left
          ${hasError && !value ? "border-red-400" : open ? "border-[#059669] ring-2 ring-[#059669]/10" : "border-[#E5E7EB] hover:border-[#CBD5E1]"}
          ${value ? "text-[#0F172A] font-medium" : "text-[#9CA3AF]"}`}
      >
        <span>{value || (isLoadingBanks ? "Loading banks…" : "Select a bank")}</span>
        <ChevronDown size={16} className={`text-[#94A3B8] transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-white border border-[#E5E7EB] rounded-xl shadow-xl overflow-hidden">
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
          <div className="max-h-[200px] overflow-y-auto py-1">
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
                    ${value === bank.name ? "bg-[#F0FDF4] text-[#059669] font-semibold" : "text-[#0F172A] hover:bg-[#F8FAFC]"}`}
                >
                  {bank.name}
                  {value === bank.name && <Check size={14} className="text-[#059669]" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function WithdrawModal({
  isOpen,
  onClose,
  availableBalance = "₦0.00",
  rawBalance = 0,
  email = "",
  onSuccess,
}: WithdrawModalProps) {
  const { banks, isLoading: isLoadingBanks } = useBanks();
  const [step, setStep] = useState<Step>("form");
  const [otpOpen, setOtpOpen] = useState(false);

  const [bankName, setBankName] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [formError, setFormError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Account name resolution
  const [isResolving, setIsResolving] = useState(false);
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

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setStep("form");
        setOtpOpen(false);
        setBankName(""); setBankCode("");
        setAccountName(""); setAccountNumber("");
        setAmount(""); setFormError(""); setErrorMessage("");
        setResolveError(""); setIsResolving(false);
      }, 0);
    }
  }, [isOpen]);

  function handleFormSubmit() {
    if (!bankName) { setFormError("Please select a bank."); return; }
    if (accountNumber.length !== 10) { setFormError("Please enter a valid 10-digit account number."); return; }
    if (!accountName) { setFormError("Account name could not be resolved. Check the account number and bank."); return; }
    const num = parseFloat(amount.replace(/[^0-9.]/g, ""));
    if (!amount || isNaN(num) || num <= 0) { setFormError("Please enter a valid amount."); return; }
    if (num > rawBalance) { setFormError(`Insufficient balance. Your available balance is ${availableBalance}.`); return; }
    setFormError("");
    requestOtp();
  }

  async function requestOtp() {
    try {
      await api.post("/api/payments/request-otp", { purpose: "withdraw" });
    } catch { /* fail silently */ }
    setOtpOpen(true);
  }

  async function handleOtpVerify(code: string) {
    const num = parseFloat(amount.replace(/[^0-9.]/g, ""));
    const res = await api.post<{ success: boolean; error?: string }>(
      "/api/payments/withdraw",
      { amount: num, otp: code, accountNumber, accountName, bankCode, bankName, narration: "BuildSpora withdrawal" }
    );
    if (!res.success) throw new Error(res.error || "Withdrawal failed.");
    setOtpOpen(false);
    setStep("success");
    onSuccess?.();
  }

  if (!isOpen) return null;

  const numericAmount = parseFloat(amount || "0");

  return (
    <>
      {/* Form Modal — hidden while OTP is open */}
      {!otpOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[1000] p-4 flex items-center justify-center backdrop-blur-[2px]"
          onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-[20px] w-full max-w-[440px] shadow-2xl relative flex flex-col overflow-hidden">

            {/* ── FORM STEP ── */}
            {step === "form" && (
              <div className="p-8">
                <button className="absolute top-5 right-5 p-1 hover:bg-gray-100 rounded-md transition-colors" onClick={onClose} aria-label="Close">
                  <X size={18} className="text-gray-400" />
                </button>

                <h3 className="text-[20px] font-bold text-[#0F172A] mb-1">Withdraw Funds</h3>
                <p className="text-[13.5px] text-[#64748B] mb-6">Enter your bank details to withdraw your earnings.</p>

                {/* Balance pill */}
                <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl px-4 py-3 flex items-center justify-between mb-6">
                  <span className="text-[13px] text-[#64748B] font-medium">Available Balance</span>
                  <span className="text-[16px] font-bold text-[#059669]">{availableBalance}</span>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Bank */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-[#374151]">Bank</label>
                    <BankDropdown
                      value={bankName}
                      onChange={(name, code) => { setBankName(name); setBankCode(code); setFormError(""); }}
                      hasError={!!formError}
                      banks={banks}
                      isLoadingBanks={isLoadingBanks}
                    />
                  </div>

                  {/* Account Number */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-[#374151]">Account Number</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="10-digit account number"
                      value={accountNumber}
                      onChange={(e) => { setAccountNumber(e.target.value.replace(/\D/g, "")); setFormError(""); }}
                      className="border border-[#E5E7EB] rounded-xl px-4 py-3 text-[14px] text-[#0F172A] placeholder-[#9CA3AF] outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/10 transition-all font-mono tracking-wider"
                    />
                  </div>

                  {/* Account Name — auto-resolved */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-[#374151]">Account Name</label>
                    <div className={`border rounded-xl px-4 py-3 text-[14px] min-h-[48px] flex items-center gap-2
                      ${accountName ? "border-[#059669] bg-[#F0FDF4]" : "border-[#E5E7EB] bg-[#F8FAFC]"}`}>
                      {isResolving ? (
                        <><Loader2 size={14} className="animate-spin text-[#64748B]" /><span className="text-[#94A3B8]">Resolving…</span></>
                      ) : accountName ? (
                        <><Check size={14} className="text-[#059669] shrink-0" /><span className="font-semibold text-[#0F172A]">{accountName}</span></>
                      ) : resolveError ? (
                        <><AlertCircle size={14} className="text-red-500 shrink-0" /><span className="text-red-500 text-[13px]">{resolveError}</span></>
                      ) : (
                        <span className="text-[#9CA3AF] text-[13px]">Auto-filled after account number &amp; bank</span>
                      )}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-[#374151]">Amount (₦)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B] font-bold text-[14px]">₦</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => { setAmount(e.target.value.replace(/[^0-9.]/g, "")); setFormError(""); }}
                        className="border border-[#E5E7EB] rounded-xl pl-8 pr-4 py-3 w-full text-[14px] text-[#0F172A] placeholder-[#9CA3AF] outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/10 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {formError && (
                  <p className="text-[13px] text-red-500 mt-3 flex items-center gap-1.5">
                    <AlertCircle size={14} /> {formError}
                  </p>
                )}

                <button
                  onClick={handleFormSubmit}
                  disabled={isResolving}
                  className="mt-6 w-full bg-[#0F172A] text-white rounded-full py-3.5 text-[14px] font-semibold flex items-center justify-center gap-2 hover:bg-black transition-colors disabled:opacity-50"
                >
                  Verify &amp; Pay <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* ── SUCCESS STEP ── */}
            {step === "success" && (
              <div className="p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#F0FDF4] flex items-center justify-center mb-5">
                  <CheckCircle2 size={36} className="text-[#059669]" strokeWidth={1.8} />
                </div>
                <h3 className="text-[20px] font-bold text-[#0F172A] mb-2">Withdrawal Successful!</h3>
                <p className="text-[13.5px] text-[#64748B] mb-4">
                  <span className="font-bold text-[#0F172A]">₦{numericAmount.toLocaleString()}</span> has been sent to your bank.
                </p>
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 mb-4 w-full text-left flex flex-col gap-1.5">
                  <div className="flex justify-between text-[13px]"><span className="text-[#64748B]">Bank</span><span className="font-semibold text-[#0F172A]">{bankName}</span></div>
                  <div className="flex justify-between text-[13px]"><span className="text-[#64748B]">Account Name</span><span className="font-semibold text-[#0F172A]">{accountName}</span></div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#64748B]">Account Number</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#0F172A] font-mono">{accountNumber}</span>
                      <button onClick={() => navigator.clipboard.writeText(accountNumber).catch(() => {})} className="text-[#94A3B8] hover:text-[#64748B]">
                        <Copy size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between text-[13px] border-t border-[#E2E8F0] pt-2 mt-1">
                    <span className="text-[#64748B]">Amount</span>
                    <span className="font-bold text-[#059669]">₦{numericAmount.toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-[12.5px] text-[#94A3B8] mb-6">Funds typically arrive within a few minutes.</p>
                <button onClick={onClose} className="w-full bg-[#059669] text-white rounded-full py-3.5 text-[14px] font-semibold hover:bg-[#047857] transition-colors">
                  Done
                </button>
              </div>
            )}

            {/* ── ERROR STEP ── */}
            {step === "error" && (
              <div className="p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-5">
                  <AlertCircle size={36} className="text-red-500" strokeWidth={1.8} />
                </div>
                <h3 className="text-[20px] font-bold text-[#0F172A] mb-2">Withdrawal Failed</h3>
                <p className="text-[13.5px] text-[#64748B] mb-6 max-w-[300px] leading-relaxed">
                  {errorMessage || "Something went wrong. Please check your details and try again."}
                </p>
                <button onClick={() => { setStep("form"); setErrorMessage(""); }} className="w-full border border-[#0F172A] text-[#0F172A] rounded-full py-3.5 text-[14px] font-semibold hover:bg-[#F8FAFC] transition-colors mb-3">
                  Try Again
                </button>
                <button onClick={onClose} className="w-full text-[#64748B] text-[14px] font-medium hover:underline">Cancel</button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* OTP Modal */}
      <OTPModal
        isOpen={otpOpen}
        onClose={() => setOtpOpen(false)}
        onVerify={handleOtpVerify}
        onResend={async () => { await api.post("/api/payments/request-otp", { purpose: "withdraw" }); }}
        email={email}
        actionLabel="Confirm Withdrawal"
      />
    </>
  );
}
