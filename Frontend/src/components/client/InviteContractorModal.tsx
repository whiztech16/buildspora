/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";

interface InviteContractorModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly projectId: string;
}

import { api } from "../../lib/api";

export default function InviteContractorModal({ isOpen, onClose, projectId }: InviteContractorModalProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsSent(false);
      setEmail("");
      setMessage("");
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-['Inter',sans-serif]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity" />
      
      {/* Modal Container */}
      <div className="relative bg-white rounded-[24px] w-full max-w-[500px] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-2">
          <div>
            {!isSent && (
              <>
                <h2 className="text-[20px] font-bold text-[#0F172A] mb-2">Invite Contractor</h2>
                <p className="text-[14px] text-[#475569] leading-relaxed">
                  Enter your contractor's email address. We'll send them an invitation to join this project.
                </p>
              </>
            )}
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors shrink-0 -mt-1 -mr-1"
            aria-label="Close modal"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {isSent ? (
          <div className="px-6 pb-10 pt-4 flex flex-col items-center text-center">
            <div className="w-[52px] h-[52px] rounded-full bg-[#DCFCE7] flex items-center justify-center mb-5">
              <Check size={28} className="text-[#16A34A]" strokeWidth={2.5} />
            </div>
            <h2 className="text-[20px] font-bold text-[#0F172A] mb-2">Invitation Sent</h2>
            <p className="text-[14px] text-[#475569] leading-relaxed mb-8">
              An invitation has been sent to<br/>
              <span className="font-medium text-[#0F172A]">{email || "the contractor"}</span>.<br/>
              Waiting for contractor to accept.
            </p>
            <button
              onClick={() => setIsSent(false)}
              className="px-6 py-2.5 rounded-full border border-gray-200 text-[#0F172A] text-[14px] font-medium hover:bg-gray-50 transition-colors shadow-sm"
            >
              Resend Invitation
            </button>
          </div>
        ) : (
          <>
            {/* Content Body */}
            <div className="px-6 py-6 flex flex-col gap-5">
              {/* Email Input */}
              <div>
                <label htmlFor="contractorEmail" className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
                  Contractor Email <span className="text-[#059669]">*</span>
                </label>
                <input
                  id="contractorEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contractor@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] text-[14px] placeholder-gray-400 transition-all text-[#0F172A]"
                />
              </div>

              {/* Message Input */}
              <div>
                <label htmlFor="inviteMessage" className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
                  Optional Personal Message
                </label>
                <textarea
                  id="inviteMessage"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hi, I'd like you to join my BuildSpora project."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] text-[14px] placeholder-gray-400 transition-all text-[#0F172A] resize-none"
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between px-6 py-5 border-t border-gray-100 bg-white shrink-0 rounded-b-[24px]">
              <button
                onClick={onClose}
                className="text-[14px] font-medium text-black hover:text-gray-600 transition-colors px-2"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!email) return;
                  setIsLoading(true);
                  setError(null);
                  try {
                    const res = await api.post<{success: boolean; error?: string}>("/api/invites", {
                      projectId,
                      email,
                      message
                    });
                    if (res.success) {
                      setIsSent(true);
                    } else {
                      setError(res.error || "Failed to send invitation.");
                    }
                  } catch (err: any) {
                    setError(err.message || "Failed to send invitation.");
                  } finally {
                    setIsLoading(false);
                  }
                }}
                className={`bg-[#059669] hover:bg-[#047857] text-white px-6 py-2.5 rounded-full text-[14px] font-medium transition-colors shadow-sm ${(!email || isLoading) ? 'opacity-50 cursor-not-allowed hover:bg-[#059669]' : ''}`}
                disabled={isLoading || !email}
              >
                {isLoading ? "Sending..." : "Send Invitation"}
              </button>
            </div>
            {error && (
              <div className="px-6 pb-4">
                <p className="text-red-500 text-[13px]">{error}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
