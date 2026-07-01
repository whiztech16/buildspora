import { useState } from "react";
import { Bell, CheckCircle2, CreditCard } from "lucide-react";
import PreviewToggle from "../../components/shared/PreviewToggle";

const PREVIEW_STATES = [
  { label: "New Client",    description: "No activity yet" },
  { label: "Active Client", description: "Notifications present" },
];

const MOCK_NOTIFICATIONS = [
  {
    id: 1, type: "milestone",
    title: "Milestone Approved",
    message: "You have successfully approved the 'Block Work' milestone. Payment has been released.",
    time: "2 hours ago", read: false,
  },
  {
    id: 2, type: "payment",
    title: "Payment Received",
    message: "₦2,000,000 has been credited to your virtual account for the Victoria Island Duplex project.",
    time: "Yesterday, 14:30", read: true,
  },
  {
    id: 3, type: "invite",
    title: "Contractor Accepted Invite",
    message: "BuildRight Construction Ltd. has accepted your invitation to manage Victoria Island Duplex.",
    time: "Oct 24, 09:15", read: true,
  },
];

function NotifIcon({ type, read }: { type: string; read: boolean }) {
  if (type === "milestone") return <CheckCircle2 size={20} className={read ? "text-[#64748B]" : "text-[#16A34A]"} />;
  if (type === "payment") return <CreditCard size={20} className="text-[#64748B]" />;
  return <Bell size={20} className="text-[#64748B]" />;
}

export default function UpdatesPage() {
  const [previewIdx, setPreviewIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  const allNotifs = previewIdx === 0 ? [] : MOCK_NOTIFICATIONS;
  const displayed = activeTab === "unread" ? allNotifs.filter(n => !n.read) : allNotifs;
  const unread = allNotifs.filter(n => !n.read).length;

  return (
    <div className="flex flex-col animate-fade-in pb-10">
      <PreviewToggle states={PREVIEW_STATES} current={previewIdx} onChange={setPreviewIdx} />

      <div className="flex items-center justify-between mb-8 sm:mb-10">
        <h1 className="text-[22px] sm:text-[26px] md:text-[28px] font-bold tracking-tight text-[#0F172A] leading-tight">
          Updates &amp; Notifications
        </h1>
        {unread > 0 && (
          <button className="text-[13px] font-semibold text-[#16A34A] hover:underline">
            Mark all as read
          </button>
        )}
      </div>

      {/* Empty state */}
      {allNotifs.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-xl flex flex-col items-center justify-center text-center py-20 px-8">
          <div className="w-14 h-14 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-4">
            <Bell size={26} className="text-[#94A3B8]" />
          </div>
          <h3 className="text-[16px] font-bold text-[#0F172A] mb-1.5">No updates yet</h3>
          <p className="text-[13.5px] text-[#64748B] max-w-[260px] leading-relaxed">
            Milestone approvals, payments, and contractor activity will appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4 border-b border-[#F1F5F9] mb-6 pb-2">
            {(["all", "unread"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[14px] font-semibold pb-2 border-b-2 transition-colors capitalize ${
                  activeTab === tab ? "border-[#0F172A] text-[#0F172A]" : "border-transparent text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                {tab === "all" ? "All Updates" : `Unread${unread > 0 ? ` (${unread})` : ""}`}
              </button>
            ))}
          </div>

          {displayed.length === 0 ? (
            <div className="text-center py-12 text-[#94A3B8] text-[14px]">You're all caught up.</div>
          ) : (
            <div className="flex flex-col gap-4">
              {displayed.map(note => (
                <div
                  key={note.id}
                  className={`p-5 rounded-xl border flex gap-4 items-start ${
                    note.read ? "bg-white border-[#F1F5F9]" : "bg-[#F8FAFC] border-[#E2E8F0]"
                  }`}
                >
                  <div className="mt-0.5 text-[#64748B]">
                    <NotifIcon type={note.type} read={note.read} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-[14.5px] mb-1 ${note.read ? "font-medium text-[#334155]" : "font-bold text-[#0F172A]"}`}>
                      {note.title}
                    </h4>
                    <p className="text-[13.5px] text-[#475569] leading-relaxed mb-2">{note.message}</p>
                    <span className="text-[12px] font-medium text-[#94A3B8]">{note.time}</span>
                  </div>
                  {!note.read && <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A] shrink-0 mt-2" />}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
