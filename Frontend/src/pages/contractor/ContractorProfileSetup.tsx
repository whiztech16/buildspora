import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Upload, Plus, Trash2, Camera, Loader2 } from "lucide-react";
import SearchableSelect from "../../components/shared/SearchableSelect";
import { api } from "../../lib/api";

const FONT = "'Inter', sans-serif";

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT (Abuja)", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

const TRADES = [
  "General Contractor", "Electrician", "Plumber", "Mason", "Carpenter",
  "Painter", "Roofer", "Tiler", "Welder", "POP Installer",
  "Aluminium Installer", "HVAC Technician", "Borehole Driller",
  "Interior Finisher", "General Artisan", "Other",
];

const NIGERIAN_BANKS = [
  "Access Bank", "Citibank Nigeria", "Ecobank Nigeria", "Fidelity Bank",
  "First Bank of Nigeria", "First City Monument Bank (FCMB)",
  "Guaranty Trust Bank (GTBank)", "Heritage Bank", "Keystone Bank",
  "Kuda Bank", "Opay", "Palmpay", "Polaris Bank", "Providus Bank",
  "Stanbic IBTC Bank", "Standard Chartered", "Sterling Bank",
  "SunTrust Bank", "Union Bank", "United Bank for Africa (UBA)",
  "Unity Bank", "Wema Bank", "Zenith Bank",
];

/* ─── Form state types ──────────────────────────────────── */
interface FormData {
  // Step 1
  photo: string | null;        // preview URL (objectURL or remote)
  photoFile: File | null;      // actual file to upload
  fullName: string;
  phone: string;
  state: string;
  city: string;
  bio: string;
  // Step 2
  specialty: string;
  yearsExp: string;
  workPreference: string;
  teamSize: string;
  // Step 4
  bankName: string;
  accountNum: string;
  accountName: string;
  nin: string;
}

/* ─── Reusable components ─────────────────────────────── */
function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <label className="block text-[13.5px] font-semibold text-[#0F172A] mb-1.5" style={{ fontFamily: FONT }}>
      {text}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function ControlledInput({
  label, id, placeholder, type = "text", required, maxLength, hint,
  value, onChange,
}: {
  label: string; id: string; placeholder: string; type?: string;
  required?: boolean; maxLength?: number; hint?: string;
  value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label text={label} required={required} />
      {hint && <p className="text-[12px] text-[#94A3B8] mb-1.5 italic" style={{ fontFamily: FONT }}>{hint}</p>}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        maxLength={maxLength}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-[46px] px-4 rounded-lg border border-[#E2E8F0] text-[14px] text-[#0F172A] placeholder-[#CBD5E1] bg-white outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/10 transition-all"
        style={{ fontFamily: FONT }}
      />
    </div>
  );
}

function ControlledTextarea({
  label, id, placeholder, required, maxLength, value, onChange,
}: {
  label: string; id: string; placeholder: string; required?: boolean; maxLength?: number;
  value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label text={label} required={required} />
      <textarea
        id={id}
        rows={4}
        placeholder={placeholder}
        maxLength={maxLength}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#0F172A] placeholder-[#CBD5E1] bg-white outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/10 transition-all resize-none"
        style={{ fontFamily: FONT }}
      />
      {maxLength && (
        <p className="text-[11.5px] text-[#94A3B8] text-right mt-1" style={{ fontFamily: FONT }}>
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  );
}

/* ─── Step 1: Basic Information ───────────────────────── */
function Step1({ data, onChange }: { data: FormData; onChange: (k: keyof FormData, v: string | null | File) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange("photo", URL.createObjectURL(file));   // preview
      onChange("photoFile", file);                    // real file for upload
    }
  };

  return (
    <div className="space-y-5">
      {/* Profile Photo */}
      <div>
        <Label text="Profile Photo" required />
        <div className="flex items-center gap-4 mt-1">
          <div
            onClick={() => fileRef.current?.click()}
            className="w-[80px] h-[80px] rounded-full border-2 border-dashed border-[#D1FAE5] bg-[#F0FDF4] flex flex-col items-center justify-center cursor-pointer hover:border-[#059669] transition-colors overflow-hidden shrink-0"
          >
            {data.photo ? (
              <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <>
                <Camera size={20} className="text-[#10B981]" />
                <span className="text-[10px] text-[#64748B] mt-0.5" style={{ fontFamily: FONT }}>Upload</span>
              </>
            )}
          </div>
          <div>
            <p className="text-[13px] text-[#475569]" style={{ fontFamily: FONT }}>
              Upload a clear headshot or your business logo
            </p>
            <p className="text-[12px] text-[#94A3B8] mt-0.5" style={{ fontFamily: FONT }}>JPG, PNG – max 5MB</p>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="mt-1.5 text-[12.5px] font-medium text-[#059669] hover:underline"
              style={{ fontFamily: FONT }}
            >
              Choose photo
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        </div>
      </div>

      <ControlledInput id="fullName" label="Full Name / Business Name" placeholder="e.g. Emeka Okafor" required value={data.fullName} onChange={v => onChange("fullName", v)} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <ControlledInput id="phone" label="Phone Number" placeholder="e.g. 0812 345 6789" type="tel" required value={data.phone} onChange={v => onChange("phone", v)} />
        <div>
          <Label text="State" required />
          <SearchableSelect
            id="state"
            label=""
            options={NIGERIAN_STATES}
            placeholder="Select state"
            required
            value={data.state}
            onChange={v => onChange("state", v)}
          />
        </div>
      </div>
      <ControlledInput id="city" label="City / Area" placeholder="e.g. Lekki Phase 1" required value={data.city} onChange={v => onChange("city", v)} />
      <ControlledTextarea
        id="bio"
        label="Short Bio"
        placeholder="e.g. Experienced electrician specialising in residential and commercial installations."
        maxLength={500}
        value={data.bio}
        onChange={v => onChange("bio", v)}
      />
    </div>
  );
}

/* ─── Searchable Trade Dropdown ───────────────────────── */
function SearchableTradeSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [otherValue, setOtherValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = TRADES.filter(
    t => t !== "Other" && t.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const choose = (trade: string) => {
    onChange(trade);
    setQuery("");
    setOpen(false);
  };

  const displayValue = value === "Other" ? "Other" : value || "";

  return (
    <div>
      <Label text="Primary Trade" required />
      <div ref={containerRef} className="relative">
        <div
          className={"flex items-center w-full h-[46px] px-4 rounded-lg border bg-white cursor-pointer transition-all " + (open ? "border-[#059669] ring-2 ring-[#059669]/10" : "border-[#E2E8F0]")}
          onClick={() => setOpen(o => !o)}
        >
          {open ? (
            <input
              autoFocus
              value={query}
              onChange={e => { setQuery(e.target.value); setOpen(true); }}
              placeholder="Search trade..."
              className="flex-1 text-[14px] text-[#0F172A] placeholder-[#CBD5E1] outline-none bg-transparent"
              style={{ fontFamily: FONT }}
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <span
              className={"flex-1 text-[14px] truncate " + (displayValue ? "text-[#0F172A]" : "text-[#CBD5E1]")}
              style={{ fontFamily: FONT }}
            >
              {displayValue || "Search or select your trade"}
            </span>
          )}
          <svg className={"w-3 h-3 ml-2 shrink-0 transition-transform " + (open ? "rotate-180" : "")} viewBox="0 0 12 8" fill="none">
            <path d="M1 1.5L6 6.5L11 1.5" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {open && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-[#E2E8F0] rounded-xl shadow-lg overflow-hidden">
            <div className="max-h-[220px] overflow-y-auto">
              {filtered.length === 0 && (
                <div className="px-4 py-3 text-[13px] text-[#94A3B8]" style={{ fontFamily: FONT }}>No matches found</div>
              )}
              {filtered.map(trade => (
                <div
                  key={trade}
                  onMouseDown={() => choose(trade)}
                  className={"flex items-center justify-between px-4 py-2.5 text-[14px] cursor-pointer transition-colors " + (
                    value === trade
                      ? "bg-[#F0FDF4] text-[#059669] font-semibold"
                      : "text-[#0F172A] hover:bg-[#F8FAFC]"
                  )}
                  style={{ fontFamily: FONT }}
                >
                  {trade}
                  {value === trade && <Check size={14} strokeWidth={2.5} className="text-[#059669]" />}
                </div>
              ))}
            </div>
            <div className="border-t border-[#F1F5F9]">
              <div
                onMouseDown={() => choose("Other")}
                className={"flex items-center justify-between px-4 py-2.5 text-[14px] cursor-pointer transition-colors " + (
                  value === "Other"
                    ? "bg-[#F0FDF4] text-[#059669] font-semibold"
                    : "text-[#475569] hover:bg-[#F8FAFC] italic"
                )}
                style={{ fontFamily: FONT }}
              >
                Other (specify below)
                {value === "Other" && <Check size={14} strokeWidth={2.5} className="text-[#059669]" />}
              </div>
            </div>
          </div>
        )}
      </div>

      {value === "Other" && (
        <div className="mt-3">
          <input
            autoFocus
            value={otherValue}
            onChange={e => { setOtherValue(e.target.value); onChange(e.target.value); }}
            placeholder="e.g. Scaffolding, Glass Installer..."
            className="w-full h-[46px] px-4 rounded-lg border border-[#E2E8F0] text-[14px] text-[#0F172A] placeholder-[#CBD5E1] bg-white outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/10 transition-all"
            style={{ fontFamily: FONT }}
          />
        </div>
      )}
    </div>
  );
}

/* ─── Step 2: Work Information ────────────────────────── */
function Step2({ data, onChange }: { data: FormData; onChange: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="space-y-5">
      <SearchableTradeSelect value={data.specialty} onChange={v => onChange("specialty", v)} />
      <ControlledInput
        id="yearsExp"
        label="Years of Experience"
        placeholder="e.g. 5"
        type="number"
        required
        hint="How many years have you been working in this trade?"
        value={data.yearsExp}
        onChange={v => onChange("yearsExp", v)}
      />
      <div>
        <Label text="Work Preference" required />
        <SearchableSelect
          id="workPref"
          label=""
          required
          placeholder="Select preference"
          options={["Residential Projects", "Commercial Projects", "Industrial Projects", "All Projects"]}
          value={data.workPreference}
          onChange={v => onChange("workPreference", v)}
        />
      </div>
      <div>
        <Label text="Team Size" required />
        <SearchableSelect
          id="teamSize"
          label=""
          required
          placeholder="Select team size"
          options={["Just Me", "2–5 Workers", "6–10 Workers", "More than 10 Workers"]}
          value={data.teamSize}
          onChange={v => onChange("teamSize", v)}
        />
      </div>
    </div>
  );
}

/* ─── Step 3: Previous Work ───────────────────────────── */
type Project = { id: number };

function ProjectEntry({ entry, onRemove, showRemove }: { entry: Project; onRemove: () => void; showRemove: boolean }) {
  return (
    <div className="p-5 rounded-xl border border-[#E2E8F0] bg-[#FAFAFA] space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold text-[#0F172A]" style={{ fontFamily: FONT }}>
          Previous Project
        </span>
        {showRemove && (
          <button type="button" onClick={onRemove} className="text-[#94A3B8] hover:text-red-500 transition-colors p-1">
            <Trash2 size={15} />
          </button>
        )}
      </div>
      <div>
        <Label text="Project Type" />
        <input
          id={`projectType-${entry.id}`}
          placeholder="e.g. Electrical Installation"
          className="w-full h-[46px] px-4 rounded-lg border border-[#E2E8F0] text-[14px] text-[#0F172A] placeholder-[#CBD5E1] bg-white outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/10 transition-all"
          style={{ fontFamily: FONT }}
        />
      </div>
      <div>
        <Label text="Project Location" />
        <input
          id={`projectLocation-${entry.id}`}
          placeholder="e.g. Lekki Phase 1, Lagos"
          className="w-full h-[46px] px-4 rounded-lg border border-[#E2E8F0] text-[14px] text-[#0F172A] placeholder-[#CBD5E1] bg-white outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/10 transition-all"
          style={{ fontFamily: FONT }}
        />
      </div>
      <div>
        <Label text="Project Description" />
        <textarea
          id={`projectDesc-${entry.id}`}
          rows={4}
          placeholder="e.g. Installed complete electrical wiring for a five-bedroom duplex."
          className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#0F172A] placeholder-[#CBD5E1] bg-white outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/10 transition-all resize-none"
          style={{ fontFamily: FONT }}
        />
      </div>
      <div>
        <Label text="Upload Photos" />
        <label
          htmlFor={`projectPhotos-${entry.id}`}
          className="flex flex-col items-center justify-center gap-1.5 w-full h-[90px] rounded-xl border-2 border-dashed border-[#E2E8F0] bg-white cursor-pointer hover:border-[#059669] hover:bg-[#F0FDF4] transition-all"
        >
          <Upload size={18} className="text-[#94A3B8]" />
          <span className="text-[12.5px] font-medium text-[#475569]" style={{ fontFamily: FONT }}>
            JPG / PNG — max 5 photos
          </span>
          <input id={`projectPhotos-${entry.id}`} type="file" accept="image/*" multiple className="hidden" />
        </label>
        <p className="text-[11.5px] text-[#94A3B8] mt-1" style={{ fontFamily: FONT }}>(Optional)</p>
      </div>
    </div>
  );
}

function Step3() {
  const [hasPrevWork, setHasPrevWork] = useState<"yes" | "no" | null>(null);
  const [projects, setProjects] = useState<Project[]>([{ id: 1 }]);

  const addProject = () => setProjects(prev => [...prev, { id: Date.now() }]);
  const removeProject = (id: number) => setProjects(prev => prev.filter(p => p.id !== id));

  return (
    <div className="space-y-5">
      <div>
        <Label text="Have you completed similar projects before?" required />
        <div className="flex gap-6 mt-2">
          {(["yes", "no"] as const).map(val => (
            <label key={val} className="flex items-center gap-2.5 cursor-pointer">
              <div
                onClick={() => setHasPrevWork(val)}
                className={"w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer " + (
                  hasPrevWork === val ? "border-[#059669] bg-[#059669]" : "border-[#CBD5E1] bg-white"
                )}
              >
                {hasPrevWork === val && <div className="w-[7px] h-[7px] rounded-full bg-white" />}
              </div>
              <span className="text-[14px] text-[#0F172A] capitalize" style={{ fontFamily: FONT }}>{val}</span>
            </label>
          ))}
        </div>
      </div>

      {hasPrevWork === "yes" && (
        <>
          <div className="space-y-4">
            {projects.map(p => (
              <ProjectEntry
                key={p.id}
                entry={p}
                showRemove={projects.length > 1}
                onRemove={() => removeProject(p.id)}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={addProject}
            className="flex items-center gap-2 text-[13.5px] font-semibold text-[#059669] hover:text-[#047857] transition-colors"
            style={{ fontFamily: FONT }}
          >
            <Plus size={16} />
            Add Another Project
          </button>
        </>
      )}

      {hasPrevWork === "no" && (
        <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
          <p className="text-[13.5px] text-[#64748B]" style={{ fontFamily: FONT }}>
            No problem! Every expert started somewhere. You can add projects later as you complete jobs on BuildSpora.
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Step 4: Account Information ─────────────────────── */
function Step4({ data, onChange }: { data: FormData; onChange: (k: keyof FormData, v: string) => void }) {
  const [agreed1, setAgreed1] = useState(false);
  const [agreed2, setAgreed2] = useState(false);

  return (
    <div className="space-y-5">
      <div>
        <Label text="Bank Name" required />
        <SearchableSelect
          id="bankName"
          label=""
          required
          placeholder="Select your bank"
          options={NIGERIAN_BANKS}
          value={data.bankName}
          onChange={v => onChange("bankName", v)}
        />
      </div>
      <ControlledInput id="accountNumber" label="Account Number" placeholder="10-digit account number" required maxLength={10} type="text" value={data.accountNum} onChange={v => onChange("accountNum", v)} />
      <div>
        <Label text="Account Name" />
        <div className="w-full h-[46px] px-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex items-center">
          <span className="text-[13.5px] text-[#94A3B8]" style={{ fontFamily: FONT }}>
            {data.accountName || "Auto-filled after account verification"}
          </span>
        </div>
      </div>
      <ControlledInput
        id="nin"
        label="National Identification Number (NIN)"
        placeholder="11-digit NIN"
        maxLength={11}
        hint="Optional — helps speed up identity verification"
        value={data.nin}
        onChange={v => onChange("nin", v)}
      />

      {/* Checkboxes */}
      <div className="pt-2 space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <div
            onClick={() => setAgreed1(v => !v)}
            className={"w-[18px] h-[18px] mt-0.5 rounded border-2 shrink-0 flex items-center justify-center transition-colors cursor-pointer " + (
              agreed1 ? "bg-[#059669] border-[#059669]" : "border-[#CBD5E1] bg-white"
            )}
          >
            {agreed1 && <Check size={12} strokeWidth={3} className="text-white" />}
          </div>
          <span className="text-[13.5px] text-[#475569] leading-snug" style={{ fontFamily: FONT }}>
            I confirm that the information provided is accurate.
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <div
            onClick={() => setAgreed2(v => !v)}
            className={"w-[18px] h-[18px] mt-0.5 rounded border-2 shrink-0 flex items-center justify-center transition-colors cursor-pointer " + (
              agreed2 ? "bg-[#059669] border-[#059669]" : "border-[#CBD5E1] bg-white"
            )}
          >
            {agreed2 && <Check size={12} strokeWidth={3} className="text-white" />}
          </div>
          <span className="text-[13.5px] text-[#475569] leading-snug" style={{ fontFamily: FONT }}>
            I agree to the{" "}
            <a href="#" className="text-[#059669] font-medium hover:underline">Terms &amp; Conditions</a>
            .
          </span>
        </label>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════ */
const STEPS = [
  { id: 1, label: "Basic Info" },
  { id: 2, label: "Work Info" },
  { id: 3, label: "Past Work" },
  { id: 4, label: "Account" },
];

export default function ContractorProfileSetup() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const total = STEPS.length;

  const [formData, setFormData] = useState<FormData>({
    photo: null,
    photoFile: null,
    fullName: "",
    phone: "",
    state: "",
    city: "",
    bio: "",
    specialty: "",
    yearsExp: "",
    workPreference: "",
    teamSize: "",
    bankName: "",
    accountNum: "",
    accountName: "",
    nin: "",
  });

  // ── Pre-fill from existing profile ──────────────────────
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  useEffect(() => {
    api.get<{ success: boolean; user: { fullName?: string; phone?: string }; profile: {
      avatarUrl?: string | null;
      specialty?: string | null;
      state?: string | null;
      city?: string | null;
      bio?: string | null;
      yearsExp?: number | null;
      workPreference?: string | null;
      teamSize?: string | null;
      nin?: string | null;
    } | null }>("/api/user/me")
      .then(res => {
        const u = res.user;
        const p = res.profile;
        setFormData(prev => ({
          ...prev,
          fullName: u?.fullName || "",
          phone: u?.phone || "",
          photo: p?.avatarUrl || null,
          state: p?.state || "",
          city: p?.city || "",
          bio: p?.bio || "",
          specialty: p?.specialty || "",
          yearsExp: p?.yearsExp != null ? String(p.yearsExp) : "",
          workPreference: p?.workPreference || "",
          teamSize: p?.teamSize || "",
          nin: "", // never prefill NIN for security
        }));
      })
      .catch(() => {})
      .finally(() => setIsLoadingProfile(false));
  }, []);

  const updateField = (key: keyof FormData, value: string | null | File) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      // ── 1. Upload avatar if a new file was chosen ──
      let avatarUrl: string | undefined = formData.photo && !formData.photo.startsWith('blob:') ? formData.photo : undefined;
      if (formData.photoFile) {
        const fd = new FormData();
        fd.append('avatar', formData.photoFile);
        const res = await api.postForm<{ success: boolean; avatarUrl: string }>('/api/user/avatar', fd);
        avatarUrl = res.avatarUrl;
      }

      // ── 2. Save profile fields ──
      await api.patch("/api/user/profile", {
        fullName: formData.fullName || undefined,
        phone: formData.phone || undefined,
        avatarUrl,
        specialty: formData.specialty || undefined,
        state: formData.state || undefined,
        city: formData.city || undefined,
        yearsExp: formData.yearsExp ? Number(formData.yearsExp) : undefined,
        workPreference: formData.workPreference || undefined,
        teamSize: formData.teamSize || undefined,
        bio: formData.bio || undefined,
        nin: formData.nin || undefined,
        bankName: formData.bankName || undefined,
        bankCode: formData.bankName || undefined,
        accountNum: formData.accountNum || undefined,
        accountName: formData.accountName || undefined,
      });

      localStorage.setItem("buildspora_profile_complete", "true");
      navigate("/dashboard/contractor");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentStep < total) {
      setCurrentStep(s => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(s => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/dashboard/contractor");
    }
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: FONT }}>
      {isLoadingProfile && (
        <div className="fixed inset-0 bg-white/70 z-50 flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-[#059669]" />
        </div>
      )}

      {/* ── Top bar ── */}
      <div className="bg-white px-5 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => navigate("/dashboard/contractor")}
          className="p-2 hover:bg-[#F1F5F9] rounded-full transition-colors text-[#64748B] hover:text-[#0F172A]"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-[17px] font-bold text-[#0F172A] leading-tight">Update Profile</h1>
          <p className="text-[12px] text-[#64748B]">Step {currentStep} of {total}</p>
        </div>
      </div>

      <div className="max-w-[620px] mx-auto px-5 pt-8 pb-24">

        {/* ── Step indicator ── */}
        <div className="flex items-center justify-center gap-0 mb-3">
          {STEPS.map((step, idx) => {
            const done = step.id < currentStep;
            const active = step.id === currentStep;
            const isLast = idx === STEPS.length - 1;
            return (
              <div key={step.id} className="flex items-center">
                <div
                  className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[13px] font-semibold"
                  style={{
                    backgroundColor: done || active ? "#059669" : "#F1F5F9",
                    color: done || active ? "#fff" : "#94A3B8",
                  }}
                >
                  {done ? <Check size={15} strokeWidth={2.5} /> : step.id}
                </div>
                {!isLast && (
                  <div
                    className="h-[2px] transition-all duration-300"
                    style={{
                      width: "56px",
                      backgroundColor: step.id < currentStep ? "#059669" : "#E2E8F0",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* ── Step labels ── */}
        <div className="flex justify-between mb-7 px-[2px]">
          {STEPS.map(step => (
            <div key={step.id} className="flex-1 text-center">
              <span
                className="text-[11px] font-bold"
                style={{
                  fontFamily: FONT,
                  color: step.id === currentStep ? "#059669" : "#0F172A",
                }}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Form card ── */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8">
          <h2 className="text-[19px] font-bold text-[#0F172A] mb-1" style={{ fontFamily: FONT }}>
            {currentStep === 1 && "Basic Information"}
            {currentStep === 2 && "Work Information"}
            {currentStep === 3 && "Previous Work"}
            {currentStep === 4 && "Account Information"}
          </h2>
          <p className="text-[13px] text-[#64748B] mb-6" style={{ fontFamily: FONT }}>
            {currentStep === 1 && "Your personal details and contact information."}
            {currentStep === 2 && "Tell us about your trade and how you prefer to work."}
            {currentStep === 3 && "Share projects you've completed to build trust with clients."}
            {currentStep === 4 && "Where you'll receive your payments."}
          </p>

          {currentStep === 1 && <Step1 data={formData} onChange={updateField} />}
          {currentStep === 2 && <Step2 data={formData} onChange={(k, v) => updateField(k, v)} />}
          {currentStep === 3 && <Step3 />}
          {currentStep === 4 && <Step4 data={formData} onChange={(k, v) => updateField(k, v)} />}

          {/* ── Error message ── */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-[13px] text-red-600" style={{ fontFamily: FONT }}>{error}</p>
            </div>
          )}

          {/* ── Nav buttons ── */}
          <div className="flex items-center justify-between mt-8 pt-6">
            <button
              onClick={handleBack}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-2 py-2.5 text-[13.5px] font-semibold text-[#475569] hover:text-[#0F172A] transition-colors disabled:opacity-50"
              style={{ fontFamily: FONT }}
            >
              <ArrowLeft size={15} />
              {currentStep === 1 ? "Cancel" : "Previous"}
            </button>
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#059669] hover:bg-[#047857] text-white rounded-xl text-[13.5px] font-semibold transition-colors shadow-sm disabled:opacity-60"
              style={{ fontFamily: FONT }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  {currentStep === total ? "Save Profile" : "Next"}
                  {currentStep < total && <ArrowRight size={15} />}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
