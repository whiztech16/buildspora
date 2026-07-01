import { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toInitials, dashboardPath } from "../../context/authHelpers";
import { api } from "../../lib/api";

const FONT = "'Inter', sans-serif";

interface SignInResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: "client" | "contractor" | "supplier";
  };
}

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async () => {
    setError("");

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!EMAIL_REGEX.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    try {
      const data = await api.post<SignInResponse>("/api/auth/signin", { email, password });

      login(
        {
          id: data.user.id,
          name: data.user.fullName,
          email: data.user.email,
          role: data.user.role,
          initials: toInitials(data.user.fullName),
          isFirstLogin: false,
        },
        data.token
      );

      navigate(dashboardPath(data.user.role), { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-8" style={{ fontFamily: FONT }}>
      <Link to="/" className="inline-flex items-center gap-2 text-[14px] font-medium text-black mb-10">
        <ArrowLeft size={20} />
        <span>Back</span>
      </Link>

      <div className="max-w-[400px] mx-auto">
        <div className="text-[22px] font-bold tracking-tight mb-10">
          <span className="text-[#10162F]">Build</span>
          <span className="text-[#059669]">Spora</span>
        </div>

        <h1 className="text-[24px] font-semibold text-[#0F172A] leading-tight" style={{ letterSpacing: "-0.01em" }}>
          Welcome back
        </h1>
        <p className="text-[14px] text-[#64748B] mt-1.5">Sign in to continue to your account</p>

        <div className="flex flex-col gap-5 mt-8">
          <div>
            <label htmlFor="signin-email" className="block text-[14px] font-medium text-[#0F172A] mb-1.5">
              Email Address
            </label>
            <input
              id="signin-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="w-full h-[48px] px-4 rounded-xl border border-[#E2E8F0] text-[14px] text-[#0F172A] placeholder-[#94A3B8] bg-white outline-none transition-colors focus:border-[#059669] focus:ring-1 focus:ring-[#059669]/20"
              style={{ fontFamily: FONT }}
            />
          </div>

          <div>
            <label htmlFor="signin-password" className="block text-[14px] font-medium text-[#0F172A] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="signin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full h-[48px] px-4 rounded-xl border border-[#E2E8F0] text-[14px] text-[#0F172A] placeholder-[#94A3B8] bg-white outline-none transition-colors focus:border-[#059669] focus:ring-1 focus:ring-[#059669]/20"
                style={{ fontFamily: FONT }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex justify-end mt-2">
              <Link to="/forgot-password" className="text-[13px] font-semibold text-[#059669] hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-[13px] mt-3 text-center" style={{ fontFamily: FONT }}>
            {error}
          </p>
        )}

        <button
          onClick={handleSignIn}
          disabled={loading}
          className="w-full mt-6 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            height: "52px",
            borderRadius: "12px",
            background: "#059669",
            color: "#fff",
            fontSize: "15px",
            fontWeight: 600,
            fontFamily: FONT,
            border: "none",
            transition: "background 0.2s ease",
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#047857"; }}
          onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#059669"; }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-[14px] text-[#64748B] mt-8 text-center">
          Don't have an account?{" "}
          <Link to="/create-account" className="text-[#059669] font-semibold hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}