import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const FONT = "'Inter', sans-serif";

export default function AccountCreated() {
  const navigate = useNavigate();
  const location = useLocation();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 3000;
    const interval = 30;
    const increment = 100 / (duration / interval);
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          navigate("/signin", { replace: true });
          return 100;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [navigate, location.state]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ fontFamily: FONT }}>
      <div className="relative mb-8" style={{ animation: "scaleIn 0.5s ease-out forwards" }}>
        <div className="absolute inset-0 rounded-full" style={{ width: "96px", height: "96px", background: "rgba(5, 150, 105, 0.1)", animation: "pulseRing 2s ease-out infinite" }} />
        <div className="w-[96px] h-[96px] rounded-full flex items-center justify-center" style={{ background: "#059669", boxShadow: "0 8px 32px rgba(5, 150, 105, 0.3)" }}>
          <Check size={44} strokeWidth={3} className="text-white" style={{ animation: "checkDraw 0.4s ease-out 0.3s both" }} />
        </div>
      </div>

      <h1 className="text-[28px] font-bold text-[#0F172A] text-center leading-tight" style={{ letterSpacing: "-0.02em", animation: "fadeUp 0.5s ease-out 0.2s both" }}>
        Account Created<br />Successfully!
      </h1>

      <p className="text-[15px] text-[#64748B] mt-3 text-center" style={{ animation: "fadeUp 0.5s ease-out 0.4s both" }}>
        Taking you to sign in...
      </p>

      <div className="mt-8 w-[200px] h-[4px] rounded-full overflow-hidden" style={{ backgroundColor: "#E2E8F0", animation: "fadeUp 0.5s ease-out 0.5s both" }}>
        <div className="h-full rounded-full transition-all duration-100 ease-linear" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #059669, #10B981)" }} />
      </div>

      <style>{`
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
        @keyframes pulseRing { 0% { transform: scale(1); opacity: 0.4; } 100% { transform: scale(1.6); opacity: 0; } }
        @keyframes checkDraw { from { opacity: 0; transform: scale(0.3) rotate(-10deg); } to { opacity: 1; transform: scale(1) rotate(0deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}