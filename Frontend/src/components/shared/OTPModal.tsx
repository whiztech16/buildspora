import React, { useState, useRef, useEffect } from "react";
import { X, RefreshCw } from "lucide-react";

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => Promise<void>;
  email?: string;
  actionLabel?: string;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function maskEmail(e: string) {
  if (!e) return "";
  const [user, domain] = e.split("@");
  if (!domain) return e;
  return `${user.slice(0, 2)}${"*".repeat(Math.max(3, user.length - 2))}@${domain}`;
}

export default function OTPModal({
  isOpen,
  onClose,
  onVerify,
  email = "ch***@gmail.com",
  actionLabel = "Verify OTP",
}: OTPModalProps) {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    setTimeout(() => setTimeLeft(300), 0);
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setOtp(["", "", "", "", "", ""]);
        setError("");
        setResent(false);
      }, 0);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  function handleChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError("");
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
    if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus();
  }

  function handlePaste(e: React.ClipboardEvent<HTMLDivElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((d, i) => { if (i < 6) newOtp[i] = d; });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  }

  async function handleVerify() {
    const code = otp.join("");
    if (code.length < 6) { setError("Please enter the complete 6-digit code"); return; }
    if (timeLeft === 0) { setError("OTP has expired. Please request a new one."); return; }

    setLoading(true);
    setError("");
    try {
      await onVerify(code);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid code. Please try again.";
      setError(message);
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);
    setError("");
    setOtp(["", "", "", "", "", ""]);
    await new Promise(r => setTimeout(r, 1000));
    setTimeLeft(300);
    setResent(true);
    setResending(false);
    setTimeout(() => setResent(false), 3000);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[380px] p-7 shadow-2xl relative"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <button
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] transition-colors"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={16} className="text-[#94A3B8]" />
        </button>

        {/* Title */}
        <div className="mb-5">
          <h3 className="text-[17px] font-bold text-[#0F172A]">Enter verification code</h3>
          <p className="text-[13px] text-[#64748B] mt-0.5">
            Sent to <span className="font-medium text-[#0F172A]">{maskEmail(email)}</span>
          </p>
        </div>

        {/* OTP inputs */}
        <div className="flex gap-2 mb-3" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={`otp-digit-${i}`}
              ref={el => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className={`w-full h-[52px] border rounded-xl text-center text-[20px] font-bold outline-none transition-all caret-[#0F172A]
                ${error
                  ? "border-red-400 text-red-500 bg-red-50"
                  : digit
                  ? "border-[#0F172A] bg-[#F8FAFC] text-[#0F172A]"
                  : "border-[#E2E8F0] bg-white text-[#0F172A] focus:border-[#0F172A] focus:bg-[#F8FAFC]"
                }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-[12.5px] text-red-500 mb-3">{error}</p>
        )}

        {/* Timer + Resend */}
        <div className="flex justify-between items-center mb-5 mt-1">
          {timeLeft > 0 ? (
            <p className="text-[12.5px] text-[#94A3B8]">
              Expires in{" "}
              <span className={`font-semibold ${timeLeft < 60 ? "text-red-500" : "text-[#475569]"}`}>
                {formatTime(timeLeft)}
              </span>
            </p>
          ) : (
            <p className="text-[12.5px] text-red-500 font-medium">Code expired</p>
          )}
          <button
            className="text-[12.5px] font-semibold text-[#475569] hover:text-[#0F172A] flex items-center gap-1 disabled:opacity-40 transition-colors"
            onClick={handleResend}
            disabled={resending || timeLeft > 240}
          >
            {resending ? (
              <><RefreshCw size={12} className="animate-spin" /> Sending...</>
            ) : resent ? (
              "Sent!"
            ) : (
              "Resend code"
            )}
          </button>
        </div>

        {/* Submit */}
        <button
          className="w-full bg-[#0F172A] text-white rounded-xl py-3 text-[13.5px] font-semibold flex items-center justify-center gap-2 hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={handleVerify}
          disabled={otp.join("").length < 6 || loading}
        >
          {loading ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verifying...</>
          ) : (
            actionLabel
          )}
        </button>
      </div>
    </div>
  );
}
