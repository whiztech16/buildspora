import { useState, useRef, useEffect } from "react";
import { X, AlertCircle, ArrowRight, Search, ChevronDown, Check, CheckCircle2, Copy } from "lucide-react";
import OTPModal from "../shared/OTPModal";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance?: string;
  email?: string;
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
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

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
            {search && (
              <button onClick={() => setSearch("")} className="text-[#94A3B8] hover:text-[#64748B]">
                <X size={13} />
              </button>
            )}
          </div>
          <div className="max-h-[200px] overflow-y-auto py-1">
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

export default function WithdrawModal({
  isOpen,
  onClose,
  availableBalance = "₦4,750,000",
  email = "emeka@gmail.com",
}: WithdrawModalProps) {
  const [step, setStep] = useState<Step>("form");
  const [otpOpen, setOtpOpen] = useState(false);

  const [bank, setBank] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [formError, setFormError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Reset everything when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setStep("form");
        setOtpOpen(false);
        setBank("");
        setAccountName("");
        setAccountNumber("");
        setAmount("");
        setFormError("");
        setErrorMessage("");
      }, 0);
    }
  }, [isOpen]);

  function handleFormSubmit() {
    if (!bank) { setFormError("Please select a bank."); return; }
    if (!accountName.trim()) { setFormError("Please enter the account name."); return; }
    if (!/^\d{10}$/.test(accountNumber.replace(/\s/g, ""))) { setFormError("Please enter a valid 10-digit account number."); return; }
    const numericAmount = parseFloat(amount.replace(/[^0-9.]/g, ""));
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) { setFormError("Please enter a valid amount."); return; }
    setFormError("");
    setOtpOpen(true);
  }

  // Called by OTPModal when user submits OTP
  async function handleOtpVerify(code: string) {
    // Simulate API — replace with real call
    await new Promise((r) => setTimeout(r, 1500));

    if (code === "000000") {
      // Simulate error
      setOtpOpen(false);
      setErrorMessage("Transaction failed. Please check your details and try again.");
      setStep("error");
      throw new Error("Transaction failed");
    }
    // Success
    setOtpOpen(false);
    setStep("success");
  }

  if (!isOpen) return null;

  return (
    <>
      {/* ── FORM MODAL ── only visible when OTPModal is closed */}
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
                <button
                  className="absolute top-5 right-5 p-1 hover:bg-gray-100 rounded-md transition-colors"
                  onClick={onClose}
                  aria-label="Close"
                >
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
                      className="border border-[#E5E7EB] rounded-xl px-4 py-3 text-[14px] text-[#0F172A] placeholder-[#9CA3AF] outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/10 transition-all font-mono tracking-wider"
                    />
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
                  className="mt-6 w-full bg-[#0F172A] text-white rounded-full py-3.5 text-[14px] font-semibold flex items-center justify-center gap-2 hover:bg-black transition-colors"
                >
                  Verify & Pay <ArrowRight size={16} />
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
                  <span className="font-bold text-[#0F172A]">₦{parseFloat(amount || "0").toLocaleString()}</span> has been sent to
                </p>
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 mb-4 w-full text-left flex flex-col gap-1.5">
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
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#0F172A] font-mono">{accountNumber}</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(accountNumber).catch(() => {})}
                        className="text-[#94A3B8] hover:text-[#64748B]"
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-[12.5px] text-[#94A3B8] mb-6">Funds typically arrive within a few minutes.</p>
                <button
                  onClick={onClose}
                  className="w-full bg-[#059669] text-white rounded-full py-3.5 text-[14px] font-semibold hover:bg-[#047857] transition-colors"
                >
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
                <button
                  onClick={() => { setStep("form"); setErrorMessage(""); }}
                  className="w-full border border-[#0F172A] text-[#0F172A] rounded-full py-3.5 text-[14px] font-semibold hover:bg-[#F8FAFC] transition-colors mb-3"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="w-full text-[#64748B] text-[14px] font-medium hover:underline"
                >
                  Cancel
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ── SHARED OTP MODAL ── shown after form submission */}
      <OTPModal
        isOpen={otpOpen}
        onClose={() => {
          setOtpOpen(false);
          // Don't close the whole withdraw modal — let them go back to form
        }}
        onVerify={handleOtpVerify}
        email={email}
        actionLabel="Pay Now"
      />
    </>
  );
}
