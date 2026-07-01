import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-gray-100">
      <div className="mx-auto max-w-[1400px] px-6">
        {/* Top section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-10 gap-6">
          {/* Brand */}
          <div>
            <div className="text-[20px] font-bold tracking-tight">
              <span className="text-[#10162F]">Build</span>
              <span className="text-[#059669]">Spora</span>
            </div>
            <p className="text-[#64748B] text-[14px] mt-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>
              Build with confidence from anywhere.
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-6 md:gap-8 flex-wrap">
            <a
              href="#how-it-works"
              className="text-[14px] text-[#475569] hover:text-[#10162F] transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              How it works
            </a>
            <a
              href="#features"
              className="text-[14px] text-[#475569] hover:text-[#10162F] transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-[14px] text-[#475569] hover:text-[#10162F] transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Pricing
            </a>
            <Link
              to="/create-account"
              className="text-[14px] font-semibold text-[#059669] hover:text-[#047857] transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Get Started
            </Link>
          </nav>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row items-center justify-between py-5 gap-3">
          <p className="text-[13px] text-[#94A3B8]" style={{ fontFamily: "'Inter', sans-serif" }}>
            &copy; {new Date().getFullYear()} BuildSpora. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="#privacy"
              className="text-[13px] text-[#94A3B8] hover:text-[#475569] transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Privacy
            </a>
            <a
              href="#terms"
              className="text-[13px] text-[#94A3B8] hover:text-[#475569] transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
