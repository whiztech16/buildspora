import { useState, useEffect } from "react";
import { Bell, CheckCircle2, MessageCircle, AlertCircle, Loader2 } from "lucide-react";
import { api } from "../../lib/api";

interface Notification {
  id: string;
  type: string;
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

function NotifIcon({ type, read }: { type: string; read: boolean }) {
  const readStyles = read ? "text-[#94A3B8]" : "";
  
  if (type === "milestone_approved" || type === "payment_received") {
    return <CheckCircle2 size={20} className={readStyles || "text-[#16A34A]"} />;
  }
  if (type === "milestone_rejected" || type === "payment_failed") {
    return <AlertCircle size={20} className={readStyles || "text-red-500"} />;
  }
  if (type === "message") {
    return <MessageCircle size={20} className={readStyles || "text-blue-500"} />;
  }
  return <Bell size={20} className={readStyles || "text-[#D97706]"} />;
}

export default function UpdatesPage() {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
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

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const displayed = activeTab === "unread" ? notifications.filter(n => !n.isRead) : notifications;

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    try {
      await api.put("/api/notifications/read-all", {});
    } catch {
      fetchNotifications();
    }
  };

  const handleMarkAsRead = async (id: string) => {
    const notif = notifications.find(n => n.id === id);
    if (!notif || notif.isRead) return;

    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
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
    <div className="flex flex-col animate-fade-in pb-10">

      <div className="flex items-center justify-between mb-8 sm:mb-10">
        <h1 className="text-[22px] sm:text-[26px] md:text-[28px] font-bold tracking-tight text-[#0F172A] leading-tight">
          Updates &amp; Notifications
        </h1>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllAsRead} className="text-[13px] font-semibold text-[#16A34A] hover:underline">
            Mark all as read
          </button>
        )}
      </div>

      {/* Empty state */}
      {notifications.length === 0 ? (
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
                {tab === "all" ? "All Updates" : `Unread${unreadCount > 0 ? ` (${unreadCount})` : ""}`}
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
                  onClick={() => handleMarkAsRead(note.id)}
                  className={`p-5 rounded-xl border flex gap-4 items-start cursor-pointer transition-colors ${
                    note.isRead ? "bg-white border-[#F1F5F9] hover:bg-gray-50" : "bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#F1F5F9]"
                  }`}
                >
                  <div className="mt-0.5 text-[#64748B]">
                    <NotifIcon type={note.type} read={note.isRead} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-[14.5px] mb-1 ${note.isRead ? "font-medium text-[#334155]" : "font-bold text-[#0F172A]"}`}>
                      {note.title}
                    </h4>
                    <p className="text-[13.5px] text-[#475569] leading-relaxed mb-2">{note.body}</p>
                    <span className="text-[12px] font-medium text-[#94A3B8]">{formatTimeAgo(note.createdAt)}</span>
                  </div>
                  {!note.isRead && <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A] shrink-0 mt-2" />}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
