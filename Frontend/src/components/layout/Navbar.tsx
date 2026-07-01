import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between py-6 relative">
      <div className="text-[22px] font-bold tracking-tight">
        <span className="text-[#10162F] font-bold">Build</span>
        <span className="text-[#059669] font-bold">Spora</span>
      </div>

      {/* Desktop nav pill */}
      <div className="hidden md:flex items-center bg-[#FAFAFA] rounded-[10px] px-1.5 py-1 gap-0.5">
        <a href="#how-it-works" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-[7px] transition-colors">
          How it works
        </a>
        <a href="#features" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-[7px] transition-colors">
          Features
        </a>
        <a href="#pricing" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-[7px] transition-colors">
          Pricing
        </a>
        <a href="#about" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-[7px] transition-colors">
          About
        </a>
        <Link to="/create-account" aria-label="Account" className="p-2 ml-0.5 text-[#10162F] hover:text-gray-700 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="7.5" r="4"></circle>
            <path d="M4 22a8 8 0 0 1 16 0H4z"></path>
          </svg>
        </Link>
      </div>

      {/* Mobile hamburger button */}
      <button
        aria-label="Menu"
        className="md:hidden p-2 text-[#10162F] hover:text-gray-700 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {isOpen ? (
            <>
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </>
          ) : (
            <>
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </>
          )}
        </svg>
      </button>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="absolute top-full left-[-24px] right-[-24px] bg-white h-[calc(100vh-80px)] border-t border-gray-100 py-6 px-6 flex flex-col gap-4 md:hidden z-50">
          <a href="#how-it-works" className="px-4 py-3 text-[16px] font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
            How it works
          </a>
          <a href="#features" className="px-4 py-3 text-[16px] font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
            Features
          </a>
          <a href="#pricing" className="px-4 py-3 text-[16px] font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
            Pricing
          </a>
          <a href="#about" className="px-4 py-3 text-[16px] font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
            About
          </a>
          <Link to="/create-account" className="px-4 py-3 text-[16px] font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="7.5" r="4"></circle>
              <path d="M4 22a8 8 0 0 1 16 0H4z"></path>
            </svg>
            Account
          </Link>
        </div>
      )}
    </nav>
  );
}