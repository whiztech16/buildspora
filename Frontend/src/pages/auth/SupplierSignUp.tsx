import { useState } from "react";
import { Eye, EyeOff, ArrowLeft, ArrowRight, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SearchableSelect from "../../components/shared/SearchableSelect";

const FONT = "'Inter', sans-serif";

/* ─── Step indicator ───────────────────────────────── */
function StepIndicator({ current, total }: Readonly<{ current: number; total: number }>) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1;
        const isActive = step <= current;
        const isLast = step === total;
        return (
          <div key={step} className="flex items-center">
            <div
              className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[13px] font-semibold"
              style={{
                backgroundColor: isActive ? "#0F172A" : "#F1F5F9",
                color: isActive ? "#FFFFFF" : "#94A3B8",
              }}
            >
              {step}
            </div>
            {!isLast && (
              <div
                className="w-[80px] h-[2px]"
                style={{
                  backgroundColor: step < current ? "#0F172A" : "#E2E8F0",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Reusable input ───────────────────────────────── */
function FormInput({
  label,
  placeholder,
  type = "text",
  id,
  required,
  value,
  onChange,
}: Readonly<{
  label: string;
  placeholder: string;
  type?: string;
  id: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[14px] font-medium text-[#0F172A] mb-1.5"
        style={{ fontFamily: FONT }}
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="
            w-full h-[48px] px-4 rounded-xl border border-[#E2E8F0]
            text-[14px] text-[#0F172A] placeholder-[#94A3B8]
            bg-white outline-none transition-colors
            focus:border-[#059669] focus:ring-1 focus:ring-[#059669]/20
          "
          style={{ fontFamily: FONT }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}


/* ─── Textarea ─────────────────────────────────────── */
function FormTextarea({
  label,
  placeholder,
  id,
  required,
}: Readonly<{
  label: string;
  placeholder: string;
  id: string;
  required?: boolean;
}>) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[14px] font-medium text-[#0F172A] mb-1.5"
        style={{ fontFamily: FONT }}
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <textarea
        id={id}
        placeholder={placeholder}
        rows={3}
        className="
          w-full px-4 py-3 rounded-xl border border-[#E2E8F0]
          text-[14px] text-[#0F172A] placeholder-[#94A3B8]
          bg-white outline-none resize-none transition-colors
          focus:border-[#059669] focus:ring-1 focus:ring-[#059669]/20
        "
        style={{ fontFamily: FONT }}
      />
    </div>
  );
}

/* ─── File upload (logo) ───────────────────────────── */
function FileUpload({
  label,
  optional,
  id,
  accept,
  hint,
}: Readonly<{
  label: string;
  optional?: boolean;
  id: string;
  accept?: string;
  hint?: string;
}>) {
  return (
    <div>
      <p
        className="text-[14px] font-medium text-[#0F172A] mb-1.5"
        style={{ fontFamily: FONT }}
      >
        {label}{" "}
        {optional && (
          <span className="font-normal text-[#94A3B8] italic">(Optional)</span>
        )}
      </p>
      <label
        htmlFor={id}
        className="
          flex flex-col items-center justify-center gap-1.5
          w-full h-[100px] rounded-xl border-2 border-dashed border-[#E2E8F0]
          bg-[#FAFAFA] cursor-pointer
          hover:border-[#CBD5E1] hover:bg-[#F8FAFC] transition-colors
        "
      >
        <Upload size={20} className="text-[#94A3B8]" />
        <span
          className="text-[13px] font-medium text-[#475569]"
          style={{ fontFamily: FONT }}
        >
          {label.includes("Logo") ? "Upload Logo" : "Upload Photo"}
        </span>
        <span
          className="text-[11px] text-[#94A3B8]"
          style={{ fontFamily: FONT }}
        >
          {hint || "JPG, PNG up to 5MB"}
        </span>
        <input
          id={id}
          type="file"
          accept={accept || "image/*"}
          className="hidden"
        />
      </label>
    </div>
  );
}

/* ─── Data ─────────────────────────────────────────── */
const BUSINESS_TYPES = [
  "Building Materials",
  "Electrical Supplies",
  "Plumbing Supplies",
  "Paint & Finishes",
  "Roofing Materials",
  "Iron & Steel",
  "Cement & Concrete",
  "Tiles & Flooring",
  "Woodwork & Timber",
  "Hardware & Tools",
  "Other",
];

/* ═══════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════ */
export default function SupplierRegistration() {
  const [step, setStep] = useState(1);
  const [slideDir, setSlideDir] = useState<"left" | "right">("right");
  const [selectedBusinessType, setSelectedBusinessType] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const goToStep = (next: number) => {
    if (next === 2) {
      setError("");
      if (!EMAIL_REGEX.test(email)) {
        setError("Please enter a valid email address.");
        return;
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters long.");
        return;
      }
    }
    setSlideDir(next > step ? "right" : "left");
    setStep(next);
  };

  return (
    <div className="min-h-screen px-6 py-8" style={{ fontFamily: FONT }}>
      {/* Back arrow */}
      <button
        onClick={() =>
          step === 1 ? navigate("/create-account") : goToStep(step - 1)
        }
        className="inline-flex items-center gap-2 text-[14px] font-medium text-black cursor-pointer mb-10"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      {/* Centered form content */}
      <div className="max-w-[440px] mx-auto">
        {/* Step indicator */}
        <StepIndicator current={step} total={3} />

        {/* ─── Step 1 ──────────────────────────────── */}
        {step === 1 && (
          <div
            key={`step-1-${slideDir}`}
            className={slideDir === "right" ? "slide-in-right" : "slide-in-left"}
          >
            <h1 className="text-center text-[22px] font-semibold text-[#0F172A] leading-tight">
              Create Supplier Account
            </h1>
            <p className="text-center text-[14px] text-[#94A3B8] mt-1">
              Step 1 of 3
            </p>

            <div className="flex flex-col gap-5 mt-8">
              <FormInput
                id="supplier-business-name"
                label="Business Name"
                placeholder="Enter business name"
                required
              />
              <FormInput
                id="supplier-owner-name"
                label="Owner Name"
                placeholder="Enter owner full name"
                required
              />
              <FormInput
                id="supplier-email"
                label="Email Address"
                placeholder="example@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <FormInput
                id="supplier-password"
                label="Password"
                placeholder="Create a password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            
            {error && <p className="text-red-500 text-[13px] mt-4 text-center">{error}</p>}

            {/* Actions */}
            <div className="flex items-center justify-between mt-12">
              <button
                onClick={() => navigate("/create-account")}
                className="flex items-center gap-2 text-[14px] font-medium text-black cursor-pointer"
              >
                <ArrowLeft size={16} />
                Back
              </button>

              <button
                onClick={() => goToStep(2)}
                className="inline-flex items-center justify-center gap-2 cursor-pointer"
                style={{
                  height: "52px",
                  minWidth: "140px",
                  paddingInline: "36px",
                  borderRadius: "9999px",
                  background: "#059669",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 600,
                  fontFamily: FONT,
                }}
              >
                Next
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ─── Step 2 ──────────────────────────────── */}
        {step === 2 && (
          <div
            key={`step-2-${slideDir}`}
            className={slideDir === "right" ? "slide-in-right" : "slide-in-left"}
          >
            <h1 className="text-center text-[22px] font-semibold text-[#0F172A] leading-tight">
              Tell us about your business
            </h1>
            <p className="text-center text-[14px] text-[#94A3B8] mt-1">
              Step 2 of 3
            </p>

            <div className="flex flex-col gap-5 mt-8">
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  id="supplier-state"
                  label="State"
                  placeholder="Enter your state"
                  required
                />
                <FormInput
                  id="supplier-city"
                  label="City"
                  placeholder="Enter your city"
                  required
                />
              </div>
              <SearchableSelect
                id="supplier-business-type"
                label="Business Type"
                placeholder="Select business type"
                options={BUSINESS_TYPES}
                value={selectedBusinessType}
                onChange={setSelectedBusinessType}
                required
              />
              {selectedBusinessType === "Other" && (
                <FormInput
                  id="supplier-business-type-other"
                  label="Specify your business type"
                  placeholder="Enter your business type"
                  required
                />
              )}
              <FormTextarea
                id="supplier-offer"
                label="What do you offer?"
                placeholder="Describe what you supply"
                required
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-12">
              <button
                onClick={() => goToStep(1)}
                className="flex items-center gap-2 text-[14px] font-medium text-black cursor-pointer"
              >
                <ArrowLeft size={16} />
                Back
              </button>

              <button
                onClick={() => goToStep(3)}
                className="inline-flex items-center justify-center gap-2 cursor-pointer"
                style={{
                  height: "52px",
                  minWidth: "140px",
                  paddingInline: "36px",
                  borderRadius: "9999px",
                  background: "#059669",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 600,
                  fontFamily: FONT,
                }}
              >
                Next
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ─── Step 3 ──────────────────────────────── */}
        {step === 3 && (
          <div
            key={`step-3-${slideDir}`}
            className={slideDir === "right" ? "slide-in-right" : "slide-in-left"}
          >
            <h1 className="text-center text-[22px] font-semibold text-[#0F172A] leading-tight">
              Almost there
            </h1>
            <p className="text-center text-[14px] text-[#94A3B8] mt-1">
              Step 3 of 3
            </p>

            <div className="flex flex-col gap-5 mt-8">
              <FormInput
                id="supplier-cac"
                label="CAC Registration Number"
                placeholder="Enter CAC number"
                required
              />
              <FileUpload
                id="supplier-logo"
                label="Company Logo"
                optional
                hint="JPG, PNG up to 5MB"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-12">
              <button
                onClick={() => goToStep(2)}
                className="flex items-center gap-2 text-[14px] font-medium text-black cursor-pointer"
              >
                <ArrowLeft size={16} />
                Back
              </button>

              <button
                onClick={() => navigate("/account-created", { state: { role: 'supplier' } })}
                className="inline-flex items-center justify-center gap-2 cursor-pointer"
                style={{
                  height: "52px",
                  minWidth: "160px",
                  paddingInline: "36px",
                  borderRadius: "9999px",
                  background: "#059669",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 600,
                  fontFamily: FONT,
                }}
              >
                Create Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
