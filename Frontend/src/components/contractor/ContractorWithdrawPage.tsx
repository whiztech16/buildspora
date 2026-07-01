import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft, Search, ChevronDown, Check, X,
  AlertCircle, ArrowRight, CheckCircle2, Copy,
} from "lucide-react";
import OTPModal from "../shared/OTPModal";

interface ContractorWithdrawPageProps {
  availableBalance?: string;
  email?: string;
  onBack: () => void;
}

type Step = "form" | "success" | "error";

const NIGERIAN_BANKS = [
  "Access Bank", "Citibank Nigeria", "Ecobank Nigeria", "Fidelity Bank",
  "First Bank of Nigeria", "First City Monument Bank (FCMB)",
  "Guaranty Trust Bank (GTBank)", "Heritage Bank", "Jaiz Bank",
  "Keystone Bank", "Kuda Bank", "Moniepoint Microfinance Bank",
  "OPay Digital Services", "PalmPay", "Polaris Bank", "Providus Bank",
  "Stanbic IBTC Bank", "Standard Chartered Bank", "Sterling Bank",
  "SunTrust Bank", "Titan Trust Bank", "Union Bank of Nigeria",
  "United Bank for Africa (UBA)", "Unity Bank", "VFD Microfinance Bank",
  "Wema Bank", "Zenith Bank",
];

function BankDropdown({ value, onChange, hasError }: { value: string; onChange: (v: string) => void; hasError: boolean }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const filtered = NIGERIAN_BANKS.filter((b) => b.toLowerCase().includes(search.toLowerCase()));

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
        <span>{value || "Select a bank"}</span>
        <ChevronDown size={16} className={`text-[#94A3B8] transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-20 top-full mt-1 left-0 right-0 bg-white border border-[#E5E7EB] rounded-xl shadow-xl overflow-hidden">
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
            {filtered.length === 0 ? (
              <p className="text-[13px] text-[#94A3B8] text-center py-4">No bank found</p>
            ) : (
              filtered.map((bank) => (
                <button
                  key={bank}
                  type="button"
                  onClick={() => { onChange(bank); setOpen(false); setSearch(""); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-[13.5px] text-left transition-colors
                    ${value === bank ? "bg-[#F0FDF4] text-[#059669] font-semibold" : "text-[#0F172A] hover:bg-[#F8FAFC]"}`}
                >
                  {bank}
                  {value === bank && <Check size={14} className="text-[#059669]" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ContractorWithdrawPage({
  availableBalance = "₦4,750,000",
  email = "emeka@gmail.com",
  onBack,
}: ContractorWithdrawPageProps) {
  const [step, setStep] = useState<Step>("form");
  const [otpOpen, setOtpOpen] = useState(false);

  const [bank, setBank] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [formError, setFormError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  function handleFormSubmit() {
    if (!bank) { setFormError("Please select a bank."); return; }
    if (!accountName.trim()) { setFormError("Please enter the account name."); return; }
    if (!/^\d{10}$/.test(accountNumber.replace(/\s/g, ""))) { setFormError("Please enter a valid 10-digit account number."); return; }
    const num = parseFloat(amount.replace(/[^0-9.]/g, ""));
    if (!amount || isNaN(num) || num <= 0) { setFormError("Please enter a valid amount."); return; }

    // Balance check — strip currency symbol and commas then compare
    const balanceNum = parseFloat(availableBalance.replace(/[^0-9.]/g, ""));
    if (!isNaN(balanceNum) && num > balanceNum) {
      setFormError(`Insufficient balance. Your available balance is ${availableBalance}.`);
      return;
    }

    setFormError("");
    setOtpOpen(true);
  }

  async function handleOtpVerify(code: string) {
    await new Promise((r) => setTimeout(r, 1500));
    if (code === "000000") {
      setOtpOpen(false);
      setErrorMessage("Transaction failed. Please check your details and try again.");
      setStep("error");
      throw new Error("Transaction failed");
    }
    setOtpOpen(false);
    setStep("success");
  }

  function handleCopyRef() {
    navigator.clipboard.writeText("BSP-" + Date.now()).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const numericAmount = parseFloat(amount || "0");

  return (
    <>
      <div className="flex flex-col w-full max-w-[560px]" style={{ fontFamily: "'Inter', sans-serif" }}>

        {/* ── Page header ── */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors text-[#0F172A]"
          >
            <ChevronLeft size={18} strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-[22px] font-bold text-[#0F172A] tracking-tight leading-tight">Withdraw Funds</h1>
            <p className="text-[13px] text-[#64748B] mt-0.5">Transfer your earnings to your bank account</p>
          </div>
        </div>

        {/* ── FORM STEP ── */}
        {step === "form" && (
          <div className="flex flex-col gap-6">

            {/* Balance card */}
            <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-[4px] px-5 py-4 flex items-center justify-between">
              <span className="text-[13px] font-medium text-[#64748B]">Available Balance</span>
              <span className="text-[18px] font-bold text-[#059669]">{availableBalance}</span>
            </div>

            {/* Form card */}
            <div className="border border-[#E2E8F0] rounded-[4px] bg-white p-6 flex flex-col gap-5">

              {/* Bank */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#374151]">Bank</label>
                <BankDropdown
                  value={bank}
                  onChange={(v) => { setBank(v); setFormError(""); }}
                  hasError={!!formError}
                />
              </div>

              {/* Account Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#374151]">Account Name</label>
                <input
                  type="text"
                  placeholder="e.g. Emeka Okafor"
                  value={accountName}
                  onChange={(e) => { setAccountName(e.target.value); setFormError(""); }}
                  className="border border-[#E5E7EB] rounded-xl px-4 py-3 text-[14px] text-[#0F172A] placeholder-[#9CA3AF] outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/10 transition-all"
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
                  className="border border-[#E5E7EB] rounded-xl px-4 py-3 text-[14px] text-[#0F172A] placeholder-[#9CA3AF] outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/10 transition-all tracking-widest"
                />
              </div>

              {/* Amount */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#374151]">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B] font-semibold text-[14px]">₦</span>
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

              {formError && (
                <p className="text-[13px] text-red-500 flex items-center gap-1.5 -mt-2">
                  <AlertCircle size={14} /> {formError}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={onBack}
                className="text-[13px] text-[#64748B] hover:text-[#0F172A] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFormSubmit}
                className="flex items-center gap-2 bg-[#059669] text-white rounded-xl px-6 py-2.5 text-[13.5px] font-semibold hover:bg-[#047857] transition-colors"
              >
                Verify & Pay <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* ── SUCCESS STEP ── */}
        {step === "success" && (
          <div className="border border-[#E2E8F0] rounded-[4px] bg-white p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#F0FDF4] flex items-center justify-center mb-5">
              <CheckCircle2 size={34} className="text-[#059669]" strokeWidth={1.8} />
            </div>
            <h2 className="text-[20px] font-bold text-[#0F172A] mb-1">Withdrawal Successful</h2>
            <p className="text-[13.5px] text-[#64748B] mb-6">
              <span className="font-bold text-[#0F172A]">₦{numericAmount.toLocaleString()}</span> is on its way to your bank account.
            </p>

            <div className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-5 py-4 flex flex-col gap-3 mb-6 text-left">
              <div className="flex justify-between text-[13px]">
                <span className="text-[#64748B]">Bank</span>
                <span className="font-semibold text-[#0F172A]">{bank}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[#64748B]">Account Name</span>
                <span className="font-semibold text-[#0F172A]">{accountName}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[#64748B]">Account Number</span>
                <span className="font-semibold text-[#0F172A] tracking-wider">{accountNumber}</span>
              </div>
              <div className="flex justify-between text-[13px] border-t border-[#E2E8F0] pt-3 mt-0.5">
                <span className="text-[#64748B]">Amount</span>
                <span className="font-bold text-[#059669]">₦{numericAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-[#64748B]">Reference</span>
                <button onClick={handleCopyRef} className="flex items-center gap-1.5 font-medium text-[#0F172A] hover:text-[#059669] transition-colors">
                  {copied ? "Copied!" : <><Copy size={12} /> Copy ref</>}
                </button>
              </div>
            </div>

            <p className="text-[12.5px] text-[#94A3B8] mb-6">Funds typically arrive within a few minutes.</p>
            <button
              onClick={onBack}
              className="w-full bg-[#059669] text-white rounded-xl py-3.5 text-[14px] font-semibold hover:bg-[#047857] transition-colors"
            >
              Back to Payments
            </button>
          </div>
        )}

        {/* ── ERROR STEP ── */}
        {step === "error" && (
          <div className="border border-[#E2E8F0] rounded-[4px] bg-white p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-5">
              <AlertCircle size={34} className="text-red-500" strokeWidth={1.8} />
            </div>
            <h2 className="text-[20px] font-bold text-[#0F172A] mb-1">Withdrawal Failed</h2>
            <p className="text-[13.5px] text-[#64748B] mb-8 max-w-[320px] leading-relaxed">
              {errorMessage || "Something went wrong. Please check your details and try again."}
            </p>
            <button
              onClick={() => { setStep("form"); setErrorMessage(""); }}
              className="w-full bg-[#0F172A] text-white rounded-xl py-3.5 text-[14px] font-semibold hover:bg-black transition-colors mb-3"
            >
              Try Again
            </button>
            <button onClick={onBack} className="w-full text-[#64748B] text-[14px] font-medium hover:underline">
              Back to Payments
            </button>
          </div>
        )}
      </div>

      {/* Shared OTP Modal */}
      <OTPModal
        isOpen={otpOpen}
        onClose={() => setOtpOpen(false)}
        onVerify={handleOtpVerify}
        email={email}
        actionLabel="Withdraw"
      />
    </>
  );
}
