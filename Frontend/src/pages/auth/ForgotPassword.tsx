import { useState } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OTPModal from "../../components/shared/OTPModal";
import { api } from "../../lib/api";

const FONT = "'Inter', sans-serif";

type Step = "email" | "otp" | "reset";

interface ForgotPasswordResponse { success: boolean; message: string; }
interface ResetPasswordResponse { success: boolean; message: string; }

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!EMAIL_REGEX.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await api.post<ForgotPasswordResponse>("/api/auth/forgot-password", { email });
      setShowOtpModal(true);
    } catch (err) {
      // always show success to prevent email enumeration
      setShowOtpModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (code: string) => {
    // just store the OTP and move to reset step
    // actual verification happens on reset submit
    setOtp(code);
    setShowOtpModal(false);
    setStep("reset");
    setError("");
  };

  const handleResend = async () => {
    await api.post<ForgotPasswordResponse>("/api/auth/forgot-password", { email });
  };

  const handleResetSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await api.post<ResetPasswordResponse>("/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      navigate("/signin", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-8" style={{ fontFamily: FONT }}>
      <button
        onClick={() => {
          if (step === "email") navigate("/signin");
          else if (step === "reset") setStep("email");
        }}
        className="inline-flex items-center gap-2 text-[14px] font-medium text-black mb-10 cursor-pointer"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      <div className="max-w-[400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-[22px] font-bold tracking-tight mb-10">
          <span className="text-[#10162F]">Build</span>
          <span className="text-[#059669]">Spora</span>
        </div>

        {step === "email" && (
          <form onSubmit={handleEmailSubmit}>
            <h1 className="text-[24px] font-semibold text-[#0F172A] leading-tight" style={{ letterSpacing: "-0.01em" }}>
              Forgot Password
            </h1>
            <p className="text-[14px] text-[#64748B] mt-1.5">
              Enter your email address to receive an OTP to reset your password.
            </p>

            <div className="flex flex-col gap-5 mt-8">
              <div>
                <label htmlFor="reset-email" className="block text-[14px] font-medium text-[#0F172A] mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  required
                  className="w-full h-[48px] px-4 rounded-xl border border-[#E2E8F0] text-[14px] text-[#0F172A] placeholder-[#94A3B8] bg-white outline-none transition-colors focus:border-[#059669] focus:ring-1 focus:ring-[#059669]/20"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-[13px] mt-4 text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                height: "52px",
                borderRadius: "12px",
                background: "#059669",
                color: "#fff",
                fontSize: "15px",
                fontWeight: 600,
                border: "none",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#047857"; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#059669"; }}
            >
              {loading ? "Sending..." : "Send OTP"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={handleResetSubmit}>
            <h1 className="text-[24px] font-semibold text-[#0F172A] leading-tight" style={{ letterSpacing: "-0.01em" }}>
              Set New Password
            </h1>
            <p className="text-[14px] text-[#64748B] mt-1.5">
              Create a new strong password for your account.
            </p>

            <div className="flex flex-col gap-5 mt-8">
              <div>
                <label htmlFor="new-password" className="block text-[14px] font-medium text-[#0F172A] mb-1.5">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    className="w-full h-[48px] px-4 rounded-xl border border-[#E2E8F0] text-[14px] text-[#0F172A] placeholder-[#94A3B8] bg-white outline-none transition-colors focus:border-[#059669] focus:ring-1 focus:ring-[#059669]/20"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors cursor-pointer">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-[14px] font-medium text-[#0F172A] mb-1.5">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    className="w-full h-[48px] px-4 rounded-xl border border-[#E2E8F0] text-[14px] text-[#0F172A] placeholder-[#94A3B8] bg-white outline-none transition-colors focus:border-[#059669] focus:ring-1 focus:ring-[#059669]/20"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors cursor-pointer">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {error && <p className="text-red-500 text-[13px] mt-4 text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                height: "52px",
                borderRadius: "12px",
                background: "#059669",
                color: "#fff",
                fontSize: "15px",
                fontWeight: 600,
                border: "none",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#047857"; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#059669"; }}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>

      <OTPModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleVerifyOtp}
        onResend={handleResend}
        email={email}
        actionLabel="Verify OTP"
      />
    </div>
  );
}