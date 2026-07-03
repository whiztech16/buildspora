import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";

const FONT = "'Inter', sans-serif";

const LAST_UPDATED = "2 July 2026";
const COMPANY = "BuildSpora Technologies Ltd";
const EMAIL = "legal@buildspora.com";

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: `By creating an account on BuildSpora, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our platform. These Terms apply to all users, including Clients, Contractors, and Suppliers.`,
  },
  {
    title: "2. Description of Service",
    body: `BuildSpora is a construction marketplace platform that connects Clients (property owners and developers) with Contractors (skilled tradespeople) and Suppliers (building material vendors) across Nigeria. We facilitate project management, milestone tracking, payments, and communications between parties.`,
  },
  {
    title: "3. User Accounts & Eligibility",
    body: `You must be at least 18 years old to use BuildSpora. You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate, current, and complete information during registration. BuildSpora reserves the right to suspend or terminate accounts that contain false information or violate these Terms.`,
  },
  {
    title: "4. Roles & Responsibilities",
    body: `Clients are responsible for clearly defining project scopes, timelines, and budgets. Contractors are responsible for delivering work to the agreed standard and within agreed timelines. Suppliers are responsible for fulfilling orders accurately and on time. BuildSpora does not guarantee the quality of work or materials provided by third parties on the platform.`,
  },
  {
    title: "5. Payments & Escrow",
    body: `All payments on BuildSpora are processed through our secure escrow system. Funds are held by BuildSpora until milestone completion is confirmed by the Client. BuildSpora charges a platform fee on each transaction, which will be disclosed before any payment is made. Disputes over payment releases will be reviewed by our support team and resolved in accordance with our Dispute Resolution Policy.`,
  },
  {
    title: "6. Identity Verification",
    body: `BuildSpora may request identity verification (including NIN or CAC documents) to ensure platform safety. Providing false documents is a violation of these Terms and may result in account termination and referral to relevant authorities. Your identification data is encrypted and handled in accordance with our Privacy Policy.`,
  },
  {
    title: "7. Prohibited Conduct",
    body: `You agree not to: (a) post false, misleading, or fraudulent content; (b) circumvent platform fees by transacting with other users outside BuildSpora; (c) harass, threaten, or discriminate against other users; (d) use the platform for any illegal activity; (e) reverse-engineer or attempt to gain unauthorised access to our systems.`,
  },
  {
    title: "8. Intellectual Property",
    body: `All content, logos, trademarks, and platform features are owned by BuildSpora Technologies Ltd or its licensors. Users retain ownership of the content they upload but grant BuildSpora a non-exclusive, royalty-free licence to display and use that content for platform operations.`,
  },
  {
    title: "9. Limitation of Liability",
    body: `BuildSpora is a marketplace intermediary. We are not liable for disputes arising from work quality, material defects, or project delays. To the maximum extent permitted by Nigerian law, BuildSpora's total liability to any user shall not exceed the total fees paid by that user to the platform in the 90 days preceding the claim.`,
  },
  {
    title: "10. Dispute Resolution",
    body: `If a dispute arises between a Client and a Contractor or Supplier, both parties must first attempt to resolve it directly. If unresolved within 7 days, either party may raise a formal dispute via BuildSpora's support portal. BuildSpora's decision in such disputes is final.`,
  },
  {
    title: "11. Termination",
    body: `BuildSpora may suspend or terminate your account at any time if you violate these Terms. You may also delete your account at any time by contacting support. Upon termination, any pending milestone payments will be reviewed and released or refunded according to our Dispute Resolution Policy.`,
  },
  {
    title: "12. Changes to Terms",
    body: `BuildSpora reserves the right to update these Terms at any time. We will notify users of significant changes via email or in-app notification. Continued use of the platform after changes are posted constitutes your acceptance of the updated Terms.`,
  },
  {
    title: "13. Governing Law",
    body: `These Terms are governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes shall be subject to the exclusive jurisdiction of the courts of Lagos State, Nigeria.`,
  },
  {
    title: "14. Contact",
    body: `For questions about these Terms, please contact us at ${EMAIL} or write to: ${COMPANY}, Lagos, Nigeria.`,
  },
];

export default function TermsPage() {
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
            <Shield size={18} className="text-[#059669]" />
            <span className="text-[16px] font-bold text-[#0F172A]">Terms & Conditions</span>
          </div>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-5 pt-10 pb-24">
        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-[28px] sm:text-[32px] font-bold text-[#0F172A] leading-tight mb-3">
            Terms &amp; Conditions
          </h1>
          <p className="text-[14px] text-[#64748B]">Last updated: {LAST_UPDATED}</p>
          <div className="mt-5 p-4 bg-[#F0FDF4] border border-[#D1FAE5] rounded-xl">
            <p className="text-[13.5px] text-[#065F46] leading-relaxed">
              Please read these Terms and Conditions carefully before using BuildSpora. By creating an account or using our services, you agree to be bound by these terms.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-[16px] font-bold text-[#0F172A] mb-2">{s.title}</h2>
              <p className="text-[14px] text-[#475569] leading-relaxed">{s.body}</p>
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
