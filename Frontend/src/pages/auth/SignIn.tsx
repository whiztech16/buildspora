import { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toInitials, dashboardPath } from "../../context/authHelpers";

const FONT = "'Inter', sans-serif";

// ─── MOCK USERS (replace with real API call in production) ───────────────────
// These simulate what your backend /auth/login endpoint would return.
const MOCK_USERS = [
  { email: "contractor@test.com", password: "password", role: "contractor" as const, name: "Emeka Okafor", id: "c1", isFirstLogin: false },
  { email: "supplier@test.com",   password: "password", role: "supplier"   as const, name: "Dangote Cement", id: "s1", isFirstLogin: false },
  { email: "client@test.com",     password: "password", role: "client"     as const, name: "Chioma Adeyemi", id: "cl1", isFirstLogin: false },
];


export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = () => {
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

    // ── In production: replace this block with a real API call ──────────────
    // const res = await fetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    // const data = await res.json();  →  { id, name, role, token, isFirstLogin }
    // ────────────────────────────────────────────────────────────────────────
    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (!found) { setError("Invalid email or password."); return; }
    login({ id: found.id, name: found.name, email: found.email, role: found.role, initials: toInitials(found.name), isFirstLogin: found.isFirstLogin });
    navigate(dashboardPath(found.role), { replace: true });
  };

  return (
    <div
      className="min-h-screen px-6 py-8"
      style={{ fontFamily: FONT }}
    >
      {/* Back arrow */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-[14px] font-medium text-black mb-10"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </Link>

      {/* Centered form content */}
      <div className="max-w-[400px] mx-auto">
        {/* Logo */}
        <div className="text-[22px] font-bold tracking-tight mb-10">
          <span className="text-[#10162F]">Build</span>
          <span className="text-[#059669]">Spora</span>
        </div>

        {/* Heading */}
        <h1
          className="text-[24px] font-semibold text-[#0F172A] leading-tight"
          style={{ letterSpacing: "-0.01em" }}
        >
          Welcome back
        </h1>
        <p className="text-[14px] text-[#64748B] mt-1.5">
          Sign in to continue to your account
        </p>

        {/* Form fields */}
        <div className="flex flex-col gap-5 mt-8">
          {/* Email */}
          <div>
            <label
              htmlFor="signin-email"
              className="block text-[14px] font-medium text-[#0F172A] mb-1.5"
            >
              Email Address
            </label>
            <input
              id="signin-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="
                w-full h-[48px] px-4 rounded-xl border border-[#E2E8F0]
                text-[14px] text-[#0F172A] placeholder-[#94A3B8]
                bg-white outline-none transition-colors
                focus:border-[#059669] focus:ring-1 focus:ring-[#059669]/20
              "
              style={{ fontFamily: FONT }}
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="signin-password"
              className="block text-[14px] font-medium text-[#0F172A] mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="signin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="
                  w-full h-[48px] px-4 rounded-xl border border-[#E2E8F0]
                  text-[14px] text-[#0F172A] placeholder-[#94A3B8]
                  bg-white outline-none transition-colors
                  focus:border-[#059669] focus:ring-1 focus:ring-[#059669]/20
                "
                style={{ fontFamily: FONT }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end mt-2">
              <Link
                to="/forgot-password"
                className="text-[13px] font-semibold text-[#059669] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 text-[13px] mt-3 text-center" style={{ fontFamily: FONT }}>{error}</p>}
        <button
          onClick={handleSignIn}
          className="w-full mt-6 cursor-pointer"
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
          onMouseEnter={(e) => (e.currentTarget.style.background = "#047857")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#059669")}
        >
          Sign In
        </button>



        {/* Create account link */}
        <p className="text-[14px] text-[#64748B] mt-8 text-center">
          Don't have an account?{" "}
          <Link
            to="/create-account"
            className="text-[#059669] font-semibold hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
