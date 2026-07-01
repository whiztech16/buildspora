import { useState } from "react";
import { Bell, ShoppingCart, CreditCard, ClipboardList, CheckCircle2 } from "lucide-react";
import PreviewToggle from "../../components/shared/PreviewToggle";

const FONT = "'Inter', sans-serif";

// ── Types ──────────────────────────────────────────────────────────────────────
type UpdateType = "quote_accepted" | "payment" | "new_quote" | "delivered";

interface Update {
  id: string;
  type: UpdateType;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

// ── Mock data (backend will replace this) ─────────────────────────────────────
const MOCK_UPDATES: Update[] = [
  { id: "1", type: "quote_accepted", title: "Quote accepted",               description: "Chioma Adeyemi accepted your quote — 200 bags Dangote Cement · ₦900,000", time: "2 hours ago", read: false },
  { id: "2", type: "payment",        title: "Payment received — ₦900,000", description: "From Chioma Adeyemi for Order #BSP-001",                                   time: "2 hours ago", read: false },
  { id: "3", type: "new_quote",      title: "New quote request",            description: "Tunde Bakare wants 150 bags BUA Cement",                                    time: "5 hours ago", read: false },
  { id: "4", type: "delivered",      title: "Order marked as delivered",    description: "Order #BSP-003 — Emeka Nwachukwu",                                          time: "Yesterday",   read: true  },
  { id: "5", type: "payment",        title: "Payment received — ₦425,000", description: "From Ngozi Okonkwo for Order #BSP-002",                                     time: "Yesterday",   read: true  },
];

// ── Preview states ─────────────────────────────────────────────────────────────
const PREVIEW_STATES = [
  { label: "New Supplier",    description: "No activity yet" },
  { label: "Active Supplier", description: "Updates present" },
];

// ── Icon per type ──────────────────────────────────────────────────────────────
const TYPE_CONFIG: Record<UpdateType, { icon: React.ElementType; bg: string; color: string }> = {
  quote_accepted: { icon: ClipboardList, bg: "bg-[#EFF6FF]", color: "text-[#2563EB]" },
  payment:        { icon: CreditCard,    bg: "bg-[#ECFDF5]", color: "text-[#059669]" },
  new_quote:      { icon: ShoppingCart,  bg: "bg-[#FEF3C7]", color: "text-[#D97706]" },
  delivered:      { icon: CheckCircle2,  bg: "bg-[#F1F5F9]", color: "text-[#64748B]" },
};

// ── Main ───────────────────────────────────────────────────────────────────────
export default function SupplierUpdates() {
  const [previewIdx, setPreviewIdx] = useState(0);

  // In production: updates come from the API (e.g. GET /api/supplier/notifications)
  const updates: Update[] = previewIdx === 0 ? [] : MOCK_UPDATES;
  const unread = updates.filter(u => !u.read).length;

  return (
    <div style={{ fontFamily: FONT }}>
      <PreviewToggle states={PREVIEW_STATES} current={previewIdx} onChange={setPreviewIdx} />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <h1 className="text-[24px] font-bold text-[#0F172A]">Updates</h1>
          {unread > 0 && (
            <span className="text-[12px] font-bold bg-[#059669] text-white px-2 py-0.5 rounded-full">
              {unread} new
            </span>
          )}
        </div>
      </div>

      {/* Empty state */}
      {updates.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-[4px] flex flex-col items-center justify-center text-center py-20 px-8">
          <div className="w-14 h-14 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-4">
            <Bell size={26} className="text-[#94A3B8]" />
          </div>
          <h3 className="text-[16px] font-bold text-[#0F172A] mb-1.5">No updates yet</h3>
          <p className="text-[13.5px] text-[#64748B] max-w-[260px] leading-relaxed">
            Activity related to your orders and quotes will appear here.
          </p>
        </div>
      ) : (
        /* Active feed */
        <div className="bg-white border border-[#E2E8F0] rounded-[4px] divide-y divide-[#F1F5F9]">
          {updates.map(update => {
            const { icon: Icon, bg, color } = TYPE_CONFIG[update.type];
            return (
              <div
                key={update.id}
                className={`flex items-start gap-4 p-5 transition-colors ${!update.read ? "bg-[#F8FAFC]" : "hover:bg-[#FAFAFA]"}`}
              >
                <div className={`w-9 h-9 rounded-full ${bg} flex items-center justify-center shrink-0`}>
                  <Icon size={17} className={color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-[13.5px] leading-snug ${!update.read ? "font-bold text-[#0F172A]" : "font-semibold text-[#334155]"}`}>
                      {update.title}
                    </p>
                    <span className="text-[11.5px] text-[#94A3B8] shrink-0">{update.time}</span>
                  </div>
                  <p className="text-[12.5px] text-[#64748B] mt-0.5 leading-relaxed">{update.description}</p>
                </div>
                {!update.read && (
                  <div className="w-2 h-2 rounded-full bg-[#059669] mt-1.5 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
