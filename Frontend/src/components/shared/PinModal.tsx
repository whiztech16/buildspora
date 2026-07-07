import { useState, useRef } from "react";
import type { KeyboardEvent, ClipboardEvent } from "react";
import { X, Loader2 } from "lucide-react";

interface PinModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onVerify: (pin: string) => Promise<void>;
  readonly actionLabel: string;
  readonly onForgotPin?: () => void;
}

const DIGIT_IDS = ["pin-0", "pin-1", "pin-2", "pin-3"] as const;

export default function PinModal({ isOpen, onClose, onVerify, actionLabel, onForgotPin }: PinModalProps) {
  const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  if (!isOpen) return null;

  const reset = () => {
    setDigits(["", "", "", ""]);
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    setError(null);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (value && index === 3) {
      const fullPin = next.join("");
      if (fullPin.length === 4) submitPin(fullPin);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (pasted.length === 4) {
      setDigits(pasted.split(""));
      submitPin(pasted);
    }
  };

  const submitPin = async (pin: string) => {
    setIsVerifying(true);
    setError(null);
    try {
      await onVerify(pin);
      reset();
    } catch (err: unknown) {
      setError((err as Error).message || "Incorrect PIN. Please try again.");
      setDigits(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Accessible backdrop — keyboard-focusable, announces role */}
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] cursor-default"
        onClick={handleClose}
      />
      <div className="relative bg-white rounded-[20px] w-full max-w-[380px] p-6 shadow-2xl">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <h3 className="text-[17px] font-bold text-[#0F172A] mb-1">Enter your PIN</h3>
        <p className="text-[13.5px] text-[#64748B] mb-6">To confirm: {actionLabel}</p>

        <div className="flex gap-3 justify-center mb-4">
          {digits.map((digit, i) => (
            <input
              key={DIGIT_IDS[i]}
              id={DIGIT_IDS[i]}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              disabled={isVerifying}
              aria-label={`PIN digit ${i + 1}`}
              className="w-14 h-14 text-center text-[24px] font-bold rounded-xl border-2 border-gray-200 focus:border-[#16A34A] focus:outline-none disabled:opacity-60"
            />
          ))}
        </div>

        {error && <p className="text-[13px] text-red-600 text-center mb-4">{error}</p>}

        {isVerifying && (
          <div className="flex items-center justify-center gap-2 text-[13.5px] text-[#64748B] mb-4">
            <Loader2 size={16} className="animate-spin" /> Verifying...
          </div>
        )}

        {onForgotPin && (
          <button
            type="button"
            onClick={() => { handleClose(); onForgotPin(); }}
            className="w-full text-center text-[13.5px] font-semibold text-[#16A34A] hover:underline"
          >
            Forgot PIN?
          </button>
        )}
      </div>
    </div>
  );
}