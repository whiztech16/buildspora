import { useState, useRef } from "react";
import type { KeyboardEvent } from "react";
import { X, KeyRound, CheckCircle2, Loader2, Eye, EyeOff } from "lucide-react";
import { api } from "../../lib/api";

interface ForgotPinModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSuccess?: () => void;
}

const NEW_IDS  = ["np-0", "np-1", "np-2", "np-3"] as const;
const CONF_IDS = ["nc-0", "nc-1", "nc-2", "nc-3"] as const;

function PinRow({
  ids, digits, setDigits, disabled, show, label,
}: {
  ids: readonly string[];
  digits: string[];
  setDigits: (d: string[]) => void;
  disabled: boolean;
  show: boolean;
  label: string;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const handleChange = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...digits]; next[i] = v; setDigits(next);
    if (v && i < 3) refs.current[i + 1]?.focus();
  };
  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };
  return (
    <div>
      <p className="text-[13px] font-semibold text-[#374151] mb-3">{label}</p>
      <div className="flex gap-3 justify-center">
        {digits.map((d, i) => (
          <input
            key={ids[i]} id={ids[i]}
            ref={(el) => { refs.current[i] = el; }}
            type={show ? "text" : "password"}
            inputMode="numeric" maxLength={1} value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            disabled={disabled}
            aria-label={`${label} digit ${i + 1}`}
            className="w-12 h-12 text-center text-[20px] font-bold rounded-xl border-2 border-gray-200 focus:border-[#16A34A] focus:outline-none disabled:opacity-60 transition-colors"
          />
        ))}
      </div>
    </div>
  );
}

export default function ForgotPinModal({ isOpen, onClose, onSuccess }: ForgotPinModalProps) {
  const [password, setPassword] = useState("");
  const [newPin, setNewPin]     = useState(["", "", "", ""]);
  const [confPin, setConfPin]   = useState(["", "", "", ""]);
  const [showPw, setShowPw]     = useState(false);
  const [showPin, setShowPin]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone]         = useState(false);

  if (!isOpen) return null;

  const reset = () => { setPassword(""); setNewPin(["","","",""]); setConfPin(["","","",""]); setError(null); setDone(false); };
  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async () => {
    const newStr  = newPin.join("");
    const confStr = confPin.join("");
    if (!password.trim())    { setError("Please enter your account password."); return; }
    if (newStr.length < 4)   { setError("Please enter a complete 4-digit new PIN."); return; }
    if (confStr !== newStr)  { setError("PINs do not match."); setConfPin(["","","",""]); return; }
    setIsLoading(true); setError(null);
    try {
      await api.post("/api/payments/reset-pin", { password: password.trim(), newPin: newStr, confirmNewPin: confStr });
      setDone(true);
      setTimeout(() => { reset(); onSuccess?.(); onClose(); }, 2000);
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to reset PIN. Check your password and try again.");
    } finally { setIsLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/40 backdrop-blur-[2px] cursor-default" onClick={handleClose} />
      <div className="relative bg-white rounded-[22px] w-full max-w-[400px] p-6 sm:p-8 shadow-2xl">
        {!done ? (
          <>
            <button type="button" onClick={handleClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400" aria-label="Close"><X size={18} /></button>
            <div className="w-12 h-12 rounded-full bg-[#FEF3C7] flex items-center justify-center mb-5">
              <KeyRound size={22} className="text-[#D97706]" strokeWidth={2} />
            </div>
            <h3 className="text-[20px] font-bold text-[#0F172A] mb-1">Reset Transaction PIN</h3>
            <p className="text-[13.5px] text-[#64748B] mb-6 leading-relaxed">Enter your account password to set a new transaction PIN.</p>

            {/* Password */}
            <div className="mb-6">
              <label htmlFor="fp-password" className="block text-[13px] font-semibold text-[#374151] mb-2">Account Password</label>
              <div className="relative">
                <input
                  id="fp-password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-10 rounded-xl border-2 border-gray-200 focus:border-[#16A34A] focus:outline-none text-[14px] transition-colors"
                />
                <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label={showPw ? "Hide password" : "Show password"}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <PinRow ids={NEW_IDS} digits={newPin} setDigits={(d) => { setNewPin(d); setError(null); }} disabled={isLoading} show={showPin} label="New PIN" />
              <PinRow ids={CONF_IDS} digits={confPin} setDigits={(d) => { setConfPin(d); setError(null); }} disabled={isLoading} show={showPin} label="Confirm New PIN" />
            </div>

            <button type="button" onClick={() => setShowPin(s => !s)} className="flex items-center gap-1.5 text-[12.5px] text-[#64748B] hover:text-[#0F172A] mt-4 mx-auto transition-colors">
              {showPin ? <EyeOff size={14} /> : <Eye size={14} />} {showPin ? "Hide" : "Show"} PIN
            </button>

            {error && <p className="text-[13px] text-red-600 text-center mt-4">{error}</p>}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !password || newPin.some(d => !d) || confPin.some(d => !d)}
              className="mt-6 w-full bg-[#0F172A] hover:bg-black disabled:opacity-50 text-white font-bold text-[15px] py-3.5 rounded-full transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? <><Loader2 size={16} className="animate-spin" /> Resetting…</> : "Reset PIN"}
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-16 h-16 rounded-full bg-[#DCFCE7] flex items-center justify-center mb-5">
              <CheckCircle2 size={36} className="text-[#16A34A]" strokeWidth={1.8} />
            </div>
            <h3 className="text-[20px] font-bold text-[#0F172A] mb-2">PIN Reset!</h3>
            <p className="text-[13.5px] text-[#64748B]">Your new transaction PIN is now active.</p>
          </div>
        )}
      </div>
    </div>
  );
}
