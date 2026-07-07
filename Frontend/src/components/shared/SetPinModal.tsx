import { useState, useRef } from "react";
import type { KeyboardEvent } from "react";
import { X, Lock, CheckCircle2, Loader2, Eye, EyeOff } from "lucide-react";
import { api } from "../../lib/api";

interface SetPinModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSuccess: () => void;
}

const SLOT_IDS  = ["sp-0", "sp-1", "sp-2", "sp-3"] as const;
const CONF_IDS  = ["cp-0", "cp-1", "cp-2", "cp-3"] as const;

function PinRow({
  ids,
  digits,
  setDigits,
  disabled,
  show,
  label,
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
            key={ids[i]}
            id={ids[i]}
            ref={(el) => { refs.current[i] = el; }}
            type={show ? "text" : "password"}
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            disabled={disabled}
            aria-label={`${label} digit ${i + 1}`}
            className="w-14 h-14 text-center text-[22px] font-bold rounded-xl border-2 border-gray-200 focus:border-[#16A34A] focus:outline-none disabled:opacity-60 transition-colors"
          />
        ))}
      </div>
    </div>
  );
}

export default function SetPinModal({ isOpen, onClose, onSuccess }: SetPinModalProps) {
  const [pin, setPin]   = useState(["", "", "", ""]);
  const [conf, setConf] = useState(["", "", "", ""]);
  const [show, setShow] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [done, setDone]       = useState(false);

  if (!isOpen) return null;

  const reset = () => { setPin(["","","",""]); setConf(["","","",""]); setError(null); setDone(false); };
  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async () => {
    const pinStr  = pin.join("");
    const confStr = conf.join("");
    if (pinStr.length < 4)  { setError("Please enter a complete 4-digit PIN."); return; }
    if (confStr.length < 4) { setError("Please confirm your PIN."); return; }
    if (pinStr !== confStr) { setError("PINs do not match. Try again."); setConf(["","","",""]); return; }
    setIsSaving(true); setError(null);
    try {
      await api.post("/api/payments/set-pin", { pin: pinStr, confirmPin: confStr });
      setDone(true);
      setTimeout(() => { reset(); onSuccess(); }, 1800);
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to set PIN. Please try again.");
    } finally { setIsSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/40 backdrop-blur-[2px] cursor-default" onClick={handleClose} />
      <div className="relative bg-white rounded-[22px] w-full max-w-[400px] p-6 sm:p-8 shadow-2xl">
        {!done ? (
          <>
            <button type="button" onClick={handleClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400" aria-label="Close"><X size={18} /></button>
            <div className="w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center mb-5">
              <Lock size={22} className="text-[#16A34A]" strokeWidth={2} />
            </div>
            <h3 className="text-[20px] font-bold text-[#0F172A] mb-1">Set Transaction PIN</h3>
            <p className="text-[13.5px] text-[#64748B] mb-7 leading-relaxed">Create a 4-digit PIN to authorise all payments and withdrawals.</p>

            <div className="flex flex-col gap-6">
              <PinRow ids={SLOT_IDS} digits={pin} setDigits={(d) => { setPin(d); setError(null); }} disabled={isSaving} show={show} label="Enter PIN" />
              <PinRow ids={CONF_IDS} digits={conf} setDigits={(d) => { setConf(d); setError(null); }} disabled={isSaving} show={show} label="Confirm PIN" />
            </div>

            <button type="button" onClick={() => setShow(s => !s)} className="flex items-center gap-1.5 text-[12.5px] text-[#64748B] hover:text-[#0F172A] mt-4 mx-auto transition-colors">
              {show ? <EyeOff size={14} /> : <Eye size={14} />}{show ? "Hide" : "Show"} PIN
            </button>

            {error && <p className="text-[13px] text-red-600 text-center mt-4">{error}</p>}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving || pin.some(d => !d) || conf.some(d => !d)}
              className="mt-6 w-full bg-[#16A34A] hover:bg-[#15803d] disabled:opacity-50 text-white font-bold text-[15px] py-3.5 rounded-full transition-colors flex items-center justify-center gap-2"
            >
              {isSaving ? <><Loader2 size={16} className="animate-spin" /> Setting PIN…</> : "Confirm & Activate PIN"}
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-16 h-16 rounded-full bg-[#DCFCE7] flex items-center justify-center mb-5">
              <CheckCircle2 size={36} className="text-[#16A34A]" strokeWidth={1.8} />
            </div>
            <h3 className="text-[20px] font-bold text-[#0F172A] mb-2">PIN Activated!</h3>
            <p className="text-[13.5px] text-[#64748B]">Your transaction PIN is now active and ready to use.</p>
          </div>
        )}
      </div>
    </div>
  );
}
