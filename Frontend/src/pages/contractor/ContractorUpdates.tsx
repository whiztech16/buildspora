import { useState } from "react";
import {
  CheckCircle2, CreditCard, Bell, Star, FileText,
  Briefcase, AlertCircle, Clock,
} from "lucide-react";
import PreviewToggle from "../../components/shared/PreviewToggle";

const PREVIEW_STATES = [
  { label: "New Contractor",    description: "No notifications yet" },
  { label: "Active Contractor", description: "Notifications present" },
];

type NotifType = "milestone" | "payment" | "invite" | "review" | "document" | "job" | "alert";

interface Notification {
  id: number;
  type: NotifType;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const SAMPLE_NOTIFS: Notification[] = [
  {
    id: 1, type: "milestone", read: false,
    title: "Milestone Approved",
    description: "The 'Block Work' milestone on Victoria Island Duplex has been approved. Payment of ₦1,500,000 has been released.",
    time: "2 hours ago",
  },
  {
    id: 2, type: "payment", read: false,
    title: "Payment Received",
    description: "₦1,500,000 has been credited to your Noba virtual account for the Victoria Island Duplex project.",
    time: "2 hours ago",
  },
  {
    id: 3, type: "invite", read: false,
    title: "New Job Invitation",
    description: "You have been invited to quote for 'Office Building (G+4)' in Wuse 2, Abuja. Budget: ₦120,000,000.",
    time: "Yesterday, 10:05 AM",
  },
  {
    id: 4, type: "review", read: true,
    title: "Review Received",
    description: "Chioma Adeyemi left a 5-star review for your work on the Kitchen Fitting – Lekki Phase 1 project.",
    time: "Yesterday, 08:30 AM",
  },
  {
    id: 5, type: "document", read: true,
    title: "Document Uploaded",
    description: "A new document 'Revised BOQ.pdf' has been added to the Parkview Estate Renovation project.",
    time: "2 days ago",
  },
  {
    id: 6, type: "job", read: true,
    title: "Quote Accepted",
    description: "Your quote for 'Tiling & Flooring Work' in Kano has been accepted. You can now begin the project.",
    time: "3 days ago",
  },
  {
    id: 7, type: "milestone", read: true,
    title: "Milestone Due Soon",
    description: "The 'Roofing Completion' milestone for Greenfield Court is due in 3 days. Ensure timely delivery.",
    time: "3 days ago",
  },
  {
    id: 8, type: "alert", read: true,
    title: "Profile Incomplete",
    description: "Your contractor profile is missing your trade license. Complete your profile to improve job visibility.",
    time: "5 days ago",
  },
];

const TYPE_META: Record<NotifType, { Icon: React.ElementType; bg: string; color: string }> = {
  milestone: { Icon: CheckCircle2,  bg: "#F0FDF4", color: "#059669" },
  payment:   { Icon: CreditCard,    bg: "#EFF6FF", color: "#3B82F6" },
  invite:    { Icon: Briefcase,     bg: "#F5F3FF", color: "#7C3AED" },
  review:    { Icon: Star,          bg: "#FFFBEB", color: "#D97706" },
  document:  { Icon: FileText,      bg: "#F8FAFC", color: "#64748B" },
  job:       { Icon: Clock,         bg: "#F0FDF4", color: "#059669" },
  alert:     { Icon: AlertCircle,   bg: "#FFF7ED", color: "#EA580C" },
};

export default function ContractorUpdates() {
  const [previewIdx, setPreviewIdx] = useState(0);
  const [tab, setTab] = useState<"all" | "unread">("all");
  const [notifs, setNotifs] = useState<Notification[]>(SAMPLE_NOTIFS);

  // In production: notifs come from the API
  const displayedNotifs = previewIdx === 0 ? [] : notifs;

  const unreadCount = displayedNotifs.filter((n) => !n.read).length;
  const displayed = tab === "unread" ? displayedNotifs.filter((n) => !n.read) : displayedNotifs;

  function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: number) {
    setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }

  return (
    <div className="flex flex-col w-full max-w-[720px]" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Preview toggle */}
      <PreviewToggle states={PREVIEW_STATES} current={previewIdx} onChange={setPreviewIdx} />

      {displayedNotifs.length === 0 ? (
        /* ── Empty state ── */
        <div className="bg-white border border-[#E2E8F0] rounded-[4px] flex flex-col items-center justify-center text-center py-20 px-8">
          <div className="w-14 h-14 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-4">
            <Bell size={26} className="text-[#94A3B8]" strokeWidth={1.5} />
          </div>
          <h3 className="text-[16px] font-bold text-[#0F172A] mb-1.5">No updates yet</h3>
          <p className="text-[13.5px] text-[#64748B] max-w-[260px] leading-relaxed">
            Job invitations, milestone updates, and payments will appear here.
          </p>
        </div>
      ) : (
        <>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[24px] font-bold text-[#0F172A] tracking-tight">Updates & Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-[13px] text-[#64748B] mt-0.5">
              You have <span className="font-semibold text-[#0F172A]">{unreadCount} unread</span> notification{unreadCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-[13px] font-semibold text-[#059669] hover:text-[#047857] transition-colors whitespace-nowrap"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-[#E2E8F0] mb-5">
        {[
          { key: "all",    label: "All Updates" },
          { key: "unread", label: "Unread", count: unreadCount },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setTab(key as "all" | "unread")}
            className={`flex items-center gap-1.5 px-1 pb-3 mr-6 text-[13.5px] font-medium border-b-2 transition-colors
              ${tab === key ? "border-[#0F172A] text-[#0F172A]" : "border-transparent text-[#64748B] hover:text-[#0F172A]"}`}
          >
            {label}
            {count !== undefined && count > 0 && (
              <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${tab === key ? "bg-[#F1F5F9] text-[#0F172A]" : "bg-[#F8FAFC] text-[#94A3B8]"}`}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification list */}
      {displayed.length === 0 ? (
        <div className="border border-dashed border-[#E2E8F0] rounded-[4px] flex flex-col items-center justify-center py-16 text-center bg-white">
          <Bell size={28} className="text-[#CBD5E1] mb-3" strokeWidth={1.5} />
          <p className="text-[14px] font-semibold text-[#0F172A] mb-1">You're all caught up</p>
          <p className="text-[13px] text-[#64748B]">No unread notifications right now.</p>
        </div>
      ) : (
        <div className="flex flex-col border border-[#E2E8F0] rounded-[4px] bg-white overflow-hidden">
          {displayed.map((notif) => {
            const meta = TYPE_META[notif.type];
            return (
              <button
                key={notif.id}
                onClick={() => markRead(notif.id)}
                className={`w-full text-left flex items-start gap-4 px-5 py-4 border-b border-[#F8FAFC] last:border-none transition-colors
                  ${!notif.read ? "bg-[#FAFFFE]" : "bg-white"} hover:bg-[#F8FAFC]`}
              >
                {/* Icon */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: meta.bg }}
                >
                  <meta.Icon size={16} style={{ color: meta.color }} strokeWidth={1.8} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-[13.5px] leading-snug mb-0.5 ${!notif.read ? "font-bold text-[#0F172A]" : "font-semibold text-[#0F172A]"}`}>
                    {notif.title}
                  </p>
                  <p className="text-[13px] text-[#475569] leading-relaxed">
                    {notif.description}
                  </p>
                  <p className="text-[12px] text-[#94A3B8] mt-1.5">{notif.time}</p>
                </div>

                {/* Unread dot */}
                <div className="shrink-0 pt-1.5">
                  {!notif.read ? (
                    <span className="w-2 h-2 rounded-full bg-[#059669] block" />
                  ) : (
                    <span className="w-2 h-2 block" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
      </>
      )}
    </div>
  );
}
