import { useState, useEffect } from "react";
import {
  CheckCircle2, CreditCard, Bell, Star, FileText,
  Briefcase, AlertCircle, Clock, Loader2
} from "lucide-react";
import { api } from "../../lib/api";

type NotifType = "milestone" | "payment" | "invite" | "review" | "document" | "job" | "alert" | string;

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

const formatTimeAgo = (dateStr: string) => {
  const date = new Date(dateStr);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

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
  const [tab, setTab] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get<{ success: boolean; notifications: Notification[] }>("/api/notifications");
      if (res.success && res.notifications) {
        setNotifications(res.notifications);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const displayed = tab === "unread" ? notifications.filter((n) => !n.isRead) : notifications;

  const markAllRead = async () => {
    if (unreadCount === 0) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await api.put("/api/notifications/read-all", {});
    } catch {
      fetchNotifications();
    }
  };

  const markRead = async (id: string) => {
    const notif = notifications.find(n => n.id === id);
    if (!notif || notif.isRead) return;

    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
    try {
      await api.put(`/api/notifications/${id}/read`, {});
    } catch {
      fetchNotifications();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-[#16A34A]" size={32} />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-[720px]" style={{ fontFamily: "'Inter', sans-serif" }}>

      {notifications.length === 0 ? (
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
            const meta = TYPE_META[notif.type as NotifType] || TYPE_META.alert;
            return (
              <button
                key={notif.id}
                onClick={() => markRead(notif.id)}
                className={`w-full text-left flex items-start gap-4 px-5 py-4 border-b border-[#F8FAFC] last:border-none transition-colors
                  ${!notif.isRead ? "bg-[#FAFFFE]" : "bg-white"} hover:bg-[#F8FAFC]`}
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
                  <p className={`text-[13.5px] leading-snug mb-0.5 ${!notif.isRead ? "font-bold text-[#0F172A]" : "font-semibold text-[#0F172A]"}`}>
                    {notif.title}
                  </p>
                  <p className="text-[13px] text-[#475569] leading-relaxed">
                    {notif.body}
                  </p>
                  <p className="text-[12px] text-[#94A3B8] mt-1.5">{formatTimeAgo(notif.createdAt)}</p>
                </div>

                {/* Unread dot */}
                <div className="shrink-0 pt-1.5">
                  {!notif.isRead ? (
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
