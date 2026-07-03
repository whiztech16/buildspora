import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";

const FONT = "'Inter', sans-serif";

const LAST_UPDATED = "2 July 2026";
const COMPANY = "BuildSpora Technologies Ltd";
const EMAIL = "privacy@buildspora.com";

const sections = [
  {
    title: "1. Introduction",
    body: `BuildSpora Technologies Ltd ("we", "us", "our") is committed to protecting your personal data. This Privacy Policy explains what data we collect, how we use it, and your rights regarding that data. This policy applies to all users of the BuildSpora platform — Clients, Contractors, and Suppliers.`,
  },
  {
    title: "2. Data We Collect",
    body: `We collect the following types of information:\n\n• Identity Data: Full name, date of birth, NIN (National Identification Number), CAC registration number.\n• Contact Data: Email address, phone number, physical address.\n• Professional Data: Trade/specialty, years of experience, work portfolio, business details.\n• Financial Data: Bank name, account number, account name. We do not store full card numbers.\n• Usage Data: How you interact with our platform, including pages visited, features used, and time spent.\n• Technical Data: IP address, browser type, device identifiers.`,
  },
  {
    title: "3. How We Use Your Data",
    body: `We use your personal data to:\n\n• Create and manage your BuildSpora account.\n• Match Clients with appropriate Contractors and Suppliers.\n• Process payments and manage escrow.\n• Verify your identity and prevent fraud.\n• Send service updates, notifications, and support responses.\n• Comply with legal and regulatory obligations under Nigerian law.\n• Improve platform performance and user experience.`,
  },
  {
    title: "4. Legal Basis for Processing",
    body: `We process your data on the following grounds:\n\n• Contract: Processing is necessary to perform our services to you.\n• Legitimate Interests: To prevent fraud, ensure platform security, and improve our services.\n• Legal Obligation: Where required by Nigerian law, including the Nigeria Data Protection Act (NDPA) 2023.\n• Consent: Where you have explicitly consented, such as for marketing communications.`,
  },
  {
    title: "5. NIN & Identity Data",
    body: `Where you provide your National Identification Number (NIN), it is encrypted immediately upon receipt and stored in encrypted form. Access to decrypted NIN data is strictly limited to authorised personnel for the purpose of identity verification only. We do not share your NIN with third parties except where required by law.`,
  },
  {
    title: "6. Payment Data",
    body: `Payment processing on BuildSpora is handled through our integration with Nomba (a licensed payment service provider). We store only the minimum bank account details necessary to facilitate payouts. We do not store sensitive card data. All payment transactions are encrypted in transit.`,
  },
  {
    title: "7. Data Sharing",
    body: `We do not sell your personal data. We may share data with:\n\n• Service providers (e.g. Nomba for payments, Supabase for authentication, cloud infrastructure providers) who process data on our behalf under strict data processing agreements.\n• Law enforcement or regulatory bodies where required by law.\n• Other users only to the extent necessary to facilitate your use of the platform (e.g. a Client sees a Contractor's name and trade, not their NIN).`,
  },
  {
    title: "8. Data Retention",
    body: `We retain your personal data for as long as your account is active, and for up to 5 years after account closure for legal and financial record-keeping purposes. Identity verification documents are retained for 2 years after verification and then securely destroyed.`,
  },
  {
    title: "9. Your Rights",
    body: `Under the Nigeria Data Protection Act (NDPA) 2023, you have the right to:\n\n• Access: Request a copy of your personal data.\n• Correction: Request we correct inaccurate or incomplete data.\n• Erasure: Request deletion of your data (subject to legal obligations).\n• Restriction: Ask us to limit how we process your data.\n• Portability: Receive your data in a structured, machine-readable format.\n• Objection: Object to processing based on legitimate interests.\n\nTo exercise any of these rights, contact us at ${EMAIL}.`,
  },
  {
    title: "10. Cookies & Tracking",
    body: `BuildSpora uses cookies and similar technologies to maintain your session, remember preferences, and analyse usage patterns. Essential cookies are required for the platform to function. You may disable non-essential cookies via your browser settings, though this may affect platform functionality.`,
  },
  {
    title: "11. Security",
    body: `We implement technical and organisational security measures including TLS encryption in transit, AES-256 encryption for sensitive data at rest, role-based access controls, and regular security reviews. However, no system is perfectly secure — please use a strong password and keep your account credentials confidential.`,
  },
  {
    title: "12. Children's Privacy",
    body: `BuildSpora is not intended for users under the age of 18. We do not knowingly collect personal data from minors. If you believe we have inadvertently collected data from a minor, please contact us immediately and we will delete it.`,
  },
  {
    title: "13. Changes to This Policy",
    body: `We may update this Privacy Policy from time to time. We will notify you of significant changes via email or in-app notification at least 14 days before the change takes effect. Continued use of the platform after the effective date constitutes acceptance of the updated policy.`,
  },
  {
    title: "14. Contact & Data Protection Officer",
    body: `For questions, complaints, or to exercise your rights, contact our Data Protection Officer at ${EMAIL} or write to: ${COMPANY}, Lagos, Nigeria. You also have the right to lodge a complaint with the Nigeria Data Protection Commission (NDPC) at ndpc.gov.ng.`,
  },
];

export default function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFAFA]" style={{ fontFamily: FONT }}>
      {/* Header */}
      <div className="bg-white border-b border-[#F1F5F9] sticky top-0 z-10">
        <div className="max-w-[800px] mx-auto px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[#F1F5F9] rounded-full transition-colors text-[#64748B] hover:text-[#0F172A]"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            <Lock size={18} className="text-[#059669]" />
            <span className="text-[16px] font-bold text-[#0F172A]">Privacy Policy</span>
          </div>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-5 pt-10 pb-24">
        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-[28px] sm:text-[32px] font-bold text-[#0F172A] leading-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-[14px] text-[#64748B]">Last updated: {LAST_UPDATED}</p>
          <div className="mt-5 p-4 bg-[#F0FDF4] border border-[#D1FAE5] rounded-xl">
            <p className="text-[13.5px] text-[#065F46] leading-relaxed">
              Your privacy matters to us. This policy explains how BuildSpora collects, uses, and protects your personal information in accordance with the Nigeria Data Protection Act (NDPA) 2023.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-[16px] font-bold text-[#0F172A] mb-2">{s.title}</h2>
              <p className="text-[14px] text-[#475569] leading-relaxed whitespace-pre-line">{s.body}</p>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-12 pt-8 border-t border-[#E2E8F0]">
          <p className="text-[13px] text-[#94A3B8] text-center">
            © {new Date().getFullYear()} {COMPANY}. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
