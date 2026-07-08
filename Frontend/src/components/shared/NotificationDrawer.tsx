import { useState, useEffect, useRef } from "react";
import { Bell, X, CheckCircle2, MessageCircle, AlertCircle, FileText, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  linkTo?: string;
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

const getIcon = (type: string, isRead: boolean) => {
  const baseClasses = "flex items-center justify-center shrink-0 w-10 h-10 rounded-full";
  const readStyles = isRead ? "bg-gray-100 text-gray-400" : "";
  
  switch (type) {
    case "milestone_approved":
    case "payment_received":
      return (
        <div className={`${baseClasses} ${readStyles || "bg-[#DCFCE7] text-[#16A34A]"}`}>
          <CheckCircle2 size={20} />
        </div>
      );
    case "milestone_rejected":
    case "payment_failed":
      return (
        <div className={`${baseClasses} ${readStyles || "bg-red-100 text-red-600"}`}>
          <AlertCircle size={20} />
        </div>
      );
    case "message":
      return (
        <div className={`${baseClasses} ${readStyles || "bg-blue-100 text-blue-600"}`}>
          <MessageCircle size={20} />
        </div>
      );
    default:
      return (
        <div className={`${baseClasses} ${readStyles || "bg-[#FEF3C7] text-[#D97706]"}`}>
          <FileText size={20} />
        </div>
      );
  }
};

export default function NotificationDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const drawerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await api.get<{ success: boolean; notifications: Notification[] }>("/api/notifications");
      if (res.success && res.notifications) {
        setNotifications(res.notifications);
        setUnreadCount(res.notifications.filter(n => !n.isRead).length);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Polling every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleMarkAsRead = async (id: string, linkTo?: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const notif = notifications.find(n => n.id === id);
    if (!notif) return;

    if (!notif.isRead) {
      // Optimistic update
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));

      try {
        await api.put(`/api/notifications/${id}/read`, {});
      } catch {
        // Revert on fail
        fetchNotifications();
      }
    }
    
    if (linkTo) {
      setIsOpen(false);
      navigate(linkTo);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    
    // Optimistic update
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
    
    try {
      await api.put("/api/notifications/read-all", {});
    } catch {
      fetchNotifications();
    }
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
    if (!isOpen) fetchNotifications();
  };

  return (
    <div className="relative" ref={drawerRef}>
      {/* Bell Button */}
      <button 
        type="button" 
        onClick={toggleDrawer}
        className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white ring-2 ring-red-500/20" />
        )}
      </button>

      {/* Drawer Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-bold text-[#0F172A]">Notifications</h3>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="text-[12px] font-medium text-[#16A34A] hover:text-[#15803d]"
                >
                  Mark all as read
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
                <Bell size={32} className="text-gray-300 mb-3" />
                <p className="text-[14px] font-medium text-gray-900 mb-1">No notifications yet</p>
                <p className="text-[13px]">We'll notify you when something arrives.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    onClick={(e) => handleMarkAsRead(notif.id, notif.linkTo, e)}
                    className={`flex gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer ${notif.isRead ? 'opacity-70' : 'bg-[#F8FAFC]'}`}
                  >
                    {getIcon(notif.type, notif.isRead)}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <p className={`text-[14px] font-semibold truncate pr-2 ${notif.isRead ? 'text-gray-700' : 'text-[#0F172A]'}`}>
                          {notif.title}
                        </p>
                        <span className="text-[11px] text-gray-400 whitespace-nowrap pt-0.5">
                          {formatTimeAgo(notif.createdAt)}
                        </span>
                      </div>
                      <p className={`text-[13px] line-clamp-2 ${notif.isRead ? 'text-gray-500' : 'text-gray-600'}`}>
                        {notif.body}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div className="flex items-center shrink-0">
                        <div className="w-2 h-2 bg-[#16A34A] rounded-full" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="p-2 border-t border-gray-100 bg-gray-50">
            <button className="w-full py-2 text-[13px] font-medium text-gray-600 hover:text-gray-900 flex items-center justify-center gap-1">
              View all <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
