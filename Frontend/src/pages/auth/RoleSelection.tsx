import { useState } from "react";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const roles = [
  {
    id: "client",
    label: "Client",
    description: "Fund and track your projects remotely",
  },
  {
    id: "contractor",
    label: "Contractor",
    description: "Manage jobs and receive milestone funding",
  },
  {
    id: "supplier",
    label: "Supplier",
    description: "Supply materials and manage orders",
  },
] as const;

export default function CreateAccount() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen px-6 py-8"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Back arrow — pinned to top-left edge */}
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
          Create your account
        </h1>
        <p className="text-[14px] text-[#64748B] mt-1.5">
          Choose how you want to get started
        </p>

        {/* Role cards */}
        <div className="flex flex-col gap-3 mt-8">
          {roles.map((role) => {
            const isSelected = selectedRole === role.id;
            return (
              <button
                key={role.id}
                id={`role-${role.id}`}
                onClick={() => {
                  setSelectedRole(role.id);
                  navigate(`/create-account/${role.id}`);
                }}
                className={`
                  w-full flex items-center justify-between px-5 py-4
                  rounded-xl border text-left
                  transition-all duration-200 cursor-pointer
                  ${
                    isSelected
                      ? "border-[#059669] bg-[#F0FDF4] shadow-[0_0_0_1px_#059669]"
                      : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#FAFAFA]"
                  }
                `}
              >
                <div>
                  <p
                    className={`text-[15px] font-semibold ${
                      isSelected ? "text-[#059669]" : "text-[#0F172A]"
                    }`}
                  >
                    {role.label}
                  </p>
                  <p className="text-[13px] text-[#64748B] mt-0.5">
                    {role.description}
                  </p>
                </div>
                <ChevronRight
                  size={18}
                  className={`flex-shrink-0 ml-3 ${
                    isSelected ? "text-[#059669]" : "text-[#94A3B8]"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Sign in link */}
        <p className="text-[14px] text-[#64748B] mt-8">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-[#059669] font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
