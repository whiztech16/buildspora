import { useState, useRef } from "react";
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

const NIGERIAN_BANKS = [
  "Access Bank", "Citibank Nigeria", "Ecobank Nigeria", "Fidelity Bank",
  "First Bank of Nigeria", "First City Monument Bank (FCMB)",
  "Guaranty Trust Bank (GTBank)", "Heritage Bank", "Keystone Bank",
  "Kuda Bank", "Opay", "Palmpay", "Polaris Bank", "Providus Bank",
  "Stanbic IBTC Bank", "Standard Chartered", "Sterling Bank",
  "SunTrust Bank", "Union Bank", "United Bank for Africa (UBA)",
  "Unity Bank", "Wema Bank", "Zenith Bank",
];

const SUPPLY_CATEGORIES = [
  "Cement & Concrete",
  "Iron Rods & Steel",
  "Roofing Materials",
  "Tiles & Flooring",
  "Paint & Finishes",
  "Electrical Materials",
  "Plumbing Materials",
  "Timber & Wood",
  "Blocks & Bricks",
  "Interior Fittings",
];

const ALL_CITIES: Record<string, string[]> = {
  "Lagos": ["Lagos Island", "Victoria Island", "Lekki", "Ajah", "Ikeja", "Surulere", "Yaba", "Badagry", "Ikorodu", "Epe"],
  "Abuja": ["Wuse", "Garki", "Maitama", "Asokoro", "Gwarinpa", "Kubwa", "Bwari"],
  "Rivers": ["Port Harcourt", "Obio-Akpor", "Eleme", "Bonny"],
  "Kano": ["Kano City", "Fagge", "Dala", "Gwale"],
  "Default": ["Central Area", "GRA", "New Layout", "Old Town"],
};

/* ─── Form state types ──────────────────────────────────── */
interface SupplierFormData {
  logo: string | null;
  phone: string;
  businessName: string;
  businessType: string;
  description: string;
  state: string;
  city: string;
  citiesServed: string[];
  supplyCategories: string[];
  cacNumber: string;
  bankName: string;
  accountNum: string;
  accountName: string;
}

/* ─── Shared form components ─────────────────────────── */
function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <label className="block text-[13.5px] font-semibold text-[#0F172A] mb-1.5" style={{ fontFamily: FONT }}>
      {text}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function ControlledInput({ label, id, placeholder, type = "text", required, maxLength, hint, value, onChange }: {
  label: string; id: string; placeholder: string; type?: string;
  required?: boolean; maxLength?: number; hint?: string;
  value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label text={label} required={required} />
      {hint && <p className="text-[12px] text-[#94A3B8] mb-1.5 italic" style={{ fontFamily: FONT }}>{hint}</p>}
      <input
        id={id} type={type} placeholder={placeholder} maxLength={maxLength}
        value={value} onChange={e => onChange(e.target.value)}
        className="w-full h-[46px] px-4 rounded-lg border border-[#E2E8F0] text-[14px] text-[#0F172A] placeholder-[#CBD5E1] bg-white outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/10 transition-all"
        style={{ fontFamily: FONT }}
      />
    </div>
  );
}

function ControlledTextarea({ label, id, placeholder, maxLength, value, onChange }: {
  label: string; id: string; placeholder: string; maxLength?: number;
  value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label text={label} />
      <textarea
        id={id} rows={4} placeholder={placeholder} maxLength={maxLength}
        value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#0F172A] placeholder-[#CBD5E1] bg-white outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/10 transition-all resize-none"
        style={{ fontFamily: FONT }}
      />
      {maxLength && (
        <p className="text-[11.5px] text-[#94A3B8] text-right mt-1" style={{ fontFamily: FONT }}>{value.length}/{maxLength}</p>
      )}
    </div>
  );
}

/* ─── Step 1: Business Info ───────────────────────────── */
function Step1({ data, onChange, onCitiesChange, onCategoriesChange }: {
  data: SupplierFormData;
  onChange: (k: keyof SupplierFormData, v: string | null) => void;
  onCitiesChange: (cities: string[]) => void;
  onCategoriesChange: (cats: string[]) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const cities = ALL_CITIES[data.state] ?? ALL_CITIES["Default"];

  const toggleCity = (city: string) => {
    const updated = data.citiesServed.includes(city)
      ? data.citiesServed.filter(c => c !== city)
      : [...data.citiesServed, city];
    onCitiesChange(updated);
  };

  const toggleCategory = (cat: string) => {
    const updated = data.supplyCategories.includes(cat)
      ? data.supplyCategories.filter(c => c !== cat)
      : [...data.supplyCategories, cat];
    onCategoriesChange(updated);
  };

  return (
    <div className="space-y-5">
      {/* Logo upload */}
      <div>
        <Label text="Business Logo" required />
        <div className="flex items-center gap-4 mt-1">
          <div
            onClick={() => fileRef.current?.click()}
            className="w-[80px] h-[80px] rounded-xl border-2 border-dashed border-[#D1FAE5] bg-[#F0FDF4] flex flex-col items-center justify-center cursor-pointer hover:border-[#059669] transition-colors overflow-hidden shrink-0"
          >
            {data.logo ? (
              <img src={data.logo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <>
                <Camera size={20} className="text-[#10B981]" />
                <span className="text-[10px] text-[#64748B] mt-0.5" style={{ fontFamily: FONT }}>Upload</span>
              </>
            )}
          </div>
          <div>
            <p className="text-[13px] text-[#475569]" style={{ fontFamily: FONT }}>Upload your business logo or a clear product photo</p>
            <p className="text-[12px] text-[#94A3B8] mt-0.5" style={{ fontFamily: FONT }}>JPG, PNG – max 5MB</p>
            <button type="button" onClick={() => fileRef.current?.click()} className="mt-1.5 text-[12.5px] font-medium text-[#059669] hover:underline" style={{ fontFamily: FONT }}>
              Choose file
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => {
            const f = e.target.files?.[0];
            if (f) onChange("logo", URL.createObjectURL(f));
          }} />
        </div>
      </div>

      <ControlledInput id="businessName" label="Business Name" placeholder="e.g. Emeka Building Supplies" required value={data.businessName} onChange={v => onChange("businessName", v)} />
      <ControlledInput id="phone" label="Phone Number" placeholder="e.g. 0812 345 6789" type="tel" required value={data.phone} onChange={v => onChange("phone", v)} />
      <ControlledTextarea id="bizDesc" label="Business Description" placeholder="e.g. We supply quality building materials across Lagos and Ogun State at competitive prices." maxLength={500} value={data.description} onChange={v => onChange("description", v)} />

      {/* State */}
      <SearchableSelect
        id="state"
        label="State"
        required
        options={NIGERIAN_STATES}
        placeholder="Search state…"
        value={data.state}
        onChange={v => { onChange("state", v); onCitiesChange([]); }}
      />

      {/* Cities multi-select */}
      <div>
        <Label text="Cities / Areas Served" required />
        <p className="text-[12px] text-[#94A3B8] mb-2" style={{ fontFamily: FONT }}>
          {data.state ? `Select areas in ${data.state}` : "Select a state first"}
        </p>
        <div className="flex flex-wrap gap-2">
          {cities.map(city => {
            const sel = data.citiesServed.includes(city);
            return (
              <button
                key={city} type="button" onClick={() => toggleCity(city)}
                className={"px-3 py-1.5 rounded-full border text-[12.5px] font-medium transition-all " + (
                  sel ? "bg-[#059669] border-[#059669] text-white" : "bg-white border-[#E2E8F0] text-[#475569] hover:border-[#059669] hover:text-[#059669]"
                )}
                style={{ fontFamily: FONT }}
              >
                {city}
              </button>
            );
          })}
        </div>
      </div>

      {/* What do you supply */}
      <div>
        <Label text="What Do You Supply?" required />
        <p className="text-[12px] text-[#94A3B8] mb-2" style={{ fontFamily: FONT }}>Select all categories that apply</p>
        <div className="flex flex-wrap gap-2">
          {SUPPLY_CATEGORIES.map(cat => {
            const sel = data.supplyCategories.includes(cat);
            return (
              <button
                key={cat} type="button" onClick={() => toggleCategory(cat)}
                className={"px-3 py-1.5 rounded-full border text-[12.5px] font-medium transition-all " + (
                  sel ? "bg-[#059669] border-[#059669] text-white" : "bg-white border-[#E2E8F0] text-[#475569] hover:border-[#059669] hover:text-[#059669]"
                )}
                style={{ fontFamily: FONT }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Step 2: Catalogue items (optional preview) ─────── */
type CatalogueItem = { id: number };

function Step2() {
  const [items, setItems] = useState<CatalogueItem[]>([{ id: 1 }]);
  const addItem = () => setItems(p => [...p, { id: Date.now() }]);
  const removeItem = (id: number) => setItems(p => p.filter(i => i.id !== id));

  return (
    <div className="space-y-5">
      <p className="text-[13px] text-[#64748B]" style={{ fontFamily: FONT }}>
        Add at least one item to your catalogue. You can add more later from the Catalogue section.
      </p>
      {items.map((item, idx) => (
        <div key={item.id} className="p-5 rounded-xl border border-[#E2E8F0] bg-[#FAFAFA] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[#0F172A]" style={{ fontFamily: FONT }}>Item #{idx + 1}</span>
            {items.length > 1 && (
              <button type="button" onClick={() => removeItem(item.id)} className="text-[#94A3B8] hover:text-red-500 transition-colors p-1">
                <Trash2 size={15} />
              </button>
            )}
          </div>
          <div>
            <Label text="Item Name" required />
            <input id={`itemName-${item.id}`} placeholder="e.g. Dangote Cement 50kg" className="w-full h-[46px] px-4 rounded-lg border border-[#E2E8F0] text-[14px] text-[#0F172A] placeholder-[#CBD5E1] bg-white outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/10 transition-all" style={{ fontFamily: FONT }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label text="Unit Price (₦)" required />
              <input id={`itemPrice-${item.id}`} placeholder="e.g. 5800" className="w-full h-[46px] px-4 rounded-lg border border-[#E2E8F0] text-[14px] text-[#0F172A] placeholder-[#CBD5E1] bg-white outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/10 transition-all" style={{ fontFamily: FONT }} />
            </div>
            <div>
              <Label text="Unit" required />
              <input id={`itemUnit-${item.id}`} placeholder="e.g. per bag, per tonne" className="w-full h-[46px] px-4 rounded-lg border border-[#E2E8F0] text-[14px] text-[#0F172A] placeholder-[#CBD5E1] bg-white outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/10 transition-all" style={{ fontFamily: FONT }} />
            </div>
          </div>
          <div>
            <Label text="SKU / Product Code" />
            <input id={`itemSKU-${item.id}`} placeholder="e.g. DAN-50KG" className="w-full h-[46px] px-4 rounded-lg border border-[#E2E8F0] text-[14px] text-[#0F172A] placeholder-[#CBD5E1] bg-white outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/10 transition-all" style={{ fontFamily: FONT }} />
          </div>
          <div>
            <Label text="Item Photo" />
            <label
              htmlFor={`itemPhoto-${item.id}`}
              className="flex flex-col items-center justify-center gap-1.5 w-full h-[90px] rounded-xl border-2 border-dashed border-[#E2E8F0] bg-white cursor-pointer hover:border-[#059669] hover:bg-[#F0FDF4] transition-all"
            >
              <Upload size={18} className="text-[#94A3B8]" />
              <span className="text-[12.5px] font-medium text-[#475569]" style={{ fontFamily: FONT }}>Upload photo (Optional)</span>
              <input id={`itemPhoto-${item.id}`} type="file" accept="image/*" className="hidden" />
            </label>
          </div>
        </div>
      ))}
      <button
        type="button" onClick={addItem}
        className="flex items-center gap-2 text-[13.5px] font-semibold text-[#059669] hover:text-[#047857] transition-colors"
        style={{ fontFamily: FONT }}
      >
        <Plus size={16} />
        Add Another Item
      </button>
    </div>
  );
}

/* ─── Step 3: Verification & Payout ──────────────────── */
function Step3({ data, onChange }: {
  data: SupplierFormData;
  onChange: (k: keyof SupplierFormData, v: string) => void;
}) {
  const [agreed1, setAgreed1] = useState(false);
  const [agreed2, setAgreed2] = useState(false);
  return (
    <div className="space-y-5">
      {/* CAC */}
      <div className="p-4 bg-[#F0FDF4] border border-[#D1FAE5] rounded-xl">
        <p className="text-[13.5px] text-[#065F46] font-medium" style={{ fontFamily: FONT }}>
          Verified suppliers get more orders. Upload your CAC certificate to get your verified badge.
        </p>
      </div>
      <ControlledInput id="cacNumber" label="CAC Registration Number" placeholder="e.g. RC123456" required value={data.cacNumber} onChange={v => onChange("cacNumber", v)} />
      <div>
        <Label text="Upload CAC Certificate" required />
        <label
          htmlFor="cacUpload"
          className="flex flex-col items-center justify-center gap-2 w-full h-[120px] rounded-xl border-2 border-dashed border-[#E2E8F0] bg-[#FAFAFA] cursor-pointer hover:border-[#059669] hover:bg-[#F0FDF4] transition-all"
        >
          <Upload size={20} className="text-[#94A3B8]" />
          <span className="text-[13px] font-medium text-[#475569]" style={{ fontFamily: FONT }}>Upload CAC certificate</span>
          <span className="text-[11px] text-[#94A3B8]" style={{ fontFamily: FONT }}>PDF, JPG, PNG – max 10MB</span>
          <input id="cacUpload" type="file" accept=".pdf,image/*" className="hidden" />
        </label>
      </div>

      <div className="border-t border-[#F1F5F9] pt-5">
        <p className="text-[14px] font-bold text-[#0F172A] mb-4" style={{ fontFamily: FONT }}>Payout Account</p>
        <div className="space-y-4">
          <SearchableSelect
            id="bankName"
            label="Bank Name"
            required
            placeholder="Search bank…"
            options={NIGERIAN_BANKS}
            value={data.bankName}
            onChange={v => onChange("bankName", v)}
          />
          <ControlledInput id="accountNumber" label="Account Number" placeholder="10-digit account number" required maxLength={10} value={data.accountNum} onChange={v => onChange("accountNum", v)} />
          <div>
            <Label text="Account Name" />
            <div className="w-full h-[46px] px-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex items-center">
              <span className="text-[13.5px] text-[#94A3B8]" style={{ fontFamily: FONT }}>
                {data.accountName || "Auto-filled after account verification"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="pt-2 space-y-3">
        {[
          { state: agreed1, set: setAgreed1, text: "I confirm that the information provided is accurate." },
          { state: agreed2, set: setAgreed2, text: "I agree to the Terms & Conditions." },
        ].map((cb, i) => (
          <label key={i} className="flex items-start gap-3 cursor-pointer">
            <div
              onClick={() => cb.set(v => !v)}
              className={"w-[18px] h-[18px] mt-0.5 rounded border-2 shrink-0 flex items-center justify-center transition-colors cursor-pointer " + (
                cb.state ? "bg-[#059669] border-[#059669]" : "border-[#CBD5E1] bg-white"
              )}
            >
              {cb.state && <Check size={12} strokeWidth={3} className="text-white" />}
            </div>
            <span className="text-[13.5px] text-[#475569] leading-snug" style={{ fontFamily: FONT }}>{cb.text}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════ */
const STEPS = [
  { id: 1, label: "Business Info" },
  { id: 2, label: "Catalogue" },
  { id: 3, label: "Verification" },
];

export default function SupplierProfileSetup() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const total = STEPS.length;

  const [formData, setFormData] = useState<SupplierFormData>({
    logo: null,
    phone: "",
    businessName: "",
    businessType: "",
    description: "",
    state: "",
    city: "",
    citiesServed: [],
    supplyCategories: [],
    cacNumber: "",
    bankName: "",
    accountNum: "",
    accountName: "",
  });

  const updateField = (key: keyof SupplierFormData, value: string | null) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await api.patch("/api/user/profile", {
        fullName: formData.businessName || undefined,
        phone: formData.phone || undefined,
        avatarUrl: formData.logo || undefined,
        businessName: formData.businessName || undefined,
        businessType: formData.businessType || undefined,
        state: formData.state || undefined,
        city: formData.city || undefined,
        citiesServed: formData.citiesServed.length > 0 ? formData.citiesServed : undefined,
        supplyCategories: formData.supplyCategories.length > 0 ? formData.supplyCategories : undefined,
        description: formData.description || undefined,
        cacNumber: formData.cacNumber || undefined,
        bankName: formData.bankName || undefined,
        bankCode: formData.bankName || undefined,
        accountNum: formData.accountNum || undefined,
        accountName: formData.accountName || undefined,
      });
      localStorage.setItem("buildspora_supplier_profile_complete", "true");
      localStorage.setItem("buildspora_supplier_state", "complete");
      navigate("/dashboard/supplier");
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
      navigate("/dashboard/supplier");
    }
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: FONT }}>

      {/* Top bar */}
      <div className="bg-white px-5 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => navigate("/dashboard/supplier")}
          className="p-2 hover:bg-[#F1F5F9] rounded-full transition-colors text-[#64748B] hover:text-[#0F172A]"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-[17px] font-bold text-[#0F172A] leading-tight">Update Profile</h1>
          <p className="text-[12px] text-[#64748B]">Step {currentStep} of {total}</p>
        </div>
      </div>

      <div className="max-w-[620px] mx-auto px-5 pt-6 pb-24">

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-0 mb-3">
          {STEPS.map((step, idx) => {
            const done = step.id < currentStep;
            const act = step.id === currentStep;
            const isLast = idx === STEPS.length - 1;
            return (
              <div key={step.id} className="flex items-center">
                <div
                  className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[13px] font-semibold"
                  style={{
                    backgroundColor: done || act ? "#059669" : "#F1F5F9",
                    color: done || act ? "#fff" : "#94A3B8",
                  }}
                >
                  {done ? <Check size={15} strokeWidth={2.5} /> : step.id}
                </div>
                {!isLast && (
                  <div
                    className="h-[2px] transition-all duration-300"
                    style={{ width: "80px", backgroundColor: step.id < currentStep ? "#059669" : "#E2E8F0" }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step labels */}
        <div className="flex justify-between mb-7 px-[2px]">
          {STEPS.map(step => (
            <div key={step.id} className="flex-1 text-center">
              <span
                className="text-[11px] font-bold"
                style={{ fontFamily: FONT, color: step.id === currentStep ? "#059669" : "#0F172A" }}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8">
          <h2 className="text-[19px] font-bold text-[#0F172A] mb-1" style={{ fontFamily: FONT }}>
            {currentStep === 1 && "Business Information"}
            {currentStep === 2 && "Catalogue Items"}
            {currentStep === 3 && "Verification & Payout"}
          </h2>
          <p className="text-[13px] text-[#64748B] mb-6" style={{ fontFamily: FONT }}>
            {currentStep === 1 && "Tell clients about your business and what areas you cover."}
            {currentStep === 2 && "Add the items you sell so clients can find and order them."}
            {currentStep === 3 && "Verify your business and set up where you receive payments."}
          </p>

          {currentStep === 1 && (
            <Step1
              data={formData}
              onChange={updateField}
              onCitiesChange={cities => setFormData(prev => ({ ...prev, citiesServed: cities }))}
              onCategoriesChange={cats => setFormData(prev => ({ ...prev, supplyCategories: cats }))}
            />
          )}
          {currentStep === 2 && <Step2 />}
          {currentStep === 3 && <Step3 data={formData} onChange={(k, v) => updateField(k, v)} />}

          {/* Error message */}
          {error && currentStep === total && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-[13px] text-red-600" style={{ fontFamily: FONT }}>{error}</p>
            </div>
          )}

          {/* Nav buttons */}
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
