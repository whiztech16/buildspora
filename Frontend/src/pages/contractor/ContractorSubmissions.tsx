import { useState, useEffect, useCallback, type ReactNode } from "react";
import { CheckCircle2, Clock, XCircle, ImageOff, RefreshCw, Loader2 } from "lucide-react";
import { api } from "../../lib/api";

interface Submission {
  id: string;
  name: string;
  projectName: string | null;
  status: string;
  rejectionReason?: string | null;
  submittedAt: string | null;
  approvedAt: string | null;
  images: { storageUrl: string }[];
}

const STATUS_CONFIG: Record<string, { label: string; icon: ReactNode; card: string; badge: string }> = {
  approved: {
    label: "Approved",
    icon: <CheckCircle2 size={14} />,
    card: "border-[#D1FAE5]",
    badge: "bg-[#ECFDF5] text-[#059669]",
  },
  rejected: {
    label: "Rejected",
    icon: <XCircle size={14} />,
    card: "border-[#FEE2E2]",
    badge: "bg-[#FEF2F2] text-[#DC2626]",
  },
  submitted: {
    label: "In Review",
    icon: <Clock size={14} />,
    card: "border-[#E2E8F0]",
    badge: "bg-[#EFF6FF] text-[#3B82F6]",
  },
};

export default function ContractorSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoadError(null);
      setIsLoading(true);
      // Single endpoint — 3 DB queries instead of N*M HTTP calls
      const res = await api.get<{ success: boolean; submissions: Submission[] }>(
        "/api/milestones/submissions"
      );
      setSubmissions(res.submissions ?? []);
    } catch (err: any) {
      setLoadError(err.message || "Failed to load submissions.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const fmtDate = (iso: string | null) =>
    iso
      ? new Date(iso).toLocaleString("en-NG", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })
      : null;

  return (
    <div
      className="bg-white rounded-[12px] border border-[#E2E8F0] overflow-hidden min-h-[600px] flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-[#E2E8F0]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-[20px] font-bold text-[#0F172A] mb-1">Submissions</h2>
            <p className="text-[13.5px] text-[#475569]">
              Photos and summaries you submitted for milestone review.
            </p>
          </div>
          <button
            onClick={load}
            disabled={isLoading}
            className="p-2 rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#CBD5E1] hover:text-[#0F172A] transition-colors disabled:opacity-40"
            title="Refresh"
          >
            <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 md:p-6 flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 text-[#64748B] text-[14px] py-16">
            <Loader2 size={18} className="animate-spin" />
            Loading submissions…
          </div>
        ) : loadError ? (
          <div className="text-center text-red-500 font-medium text-[14px] bg-red-50 p-4 rounded-xl border border-red-200">
            {loadError}
          </div>
        ) : submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-4">
              <ImageOff size={24} className="text-[#94A3B8]" />
            </div>
            <h3 className="text-[15px] font-bold text-[#0F172A] mb-1">No submissions yet</h3>
            <p className="text-[13.5px] text-[#64748B] max-w-[260px]">
              Upload photos to a milestone and submit it for client review. It will appear here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {submissions.map((m) => {
              const cfg = STATUS_CONFIG[m.status] ?? STATUS_CONFIG.submitted;
              return (
                <div
                  key={m.id}
                  className={`border rounded-xl p-5 transition-colors ${cfg.card}`}
                >
                  {/* Title row */}
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-[16px] font-bold text-[#0F172A]">
                        {m.projectName ? (
                          <>
                            <span className="text-[#64748B] font-semibold text-[14px]">
                              {m.projectName}
                            </span>
                            <span className="text-[#CBD5E1] mx-2">›</span>
                          </>
                        ) : null}
                        {m.name}
                      </h3>

                      {/* Dates */}
                      <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                        {m.submittedAt && (
                          <p className="text-[12px] text-[#94A3B8]">
                            Submitted: {fmtDate(m.submittedAt)}
                          </p>
                        )}
                        {m.approvedAt && (
                          <p className="text-[12px] text-[#94A3B8]">
                            Approved: {fmtDate(m.approvedAt)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Status badge */}
                    <span
                      className={`text-[12px] font-bold px-2.5 py-1 rounded-md inline-flex items-center gap-1.5 ${cfg.badge}`}
                    >
                      {cfg.icon}
                      {cfg.label}
                    </span>
                  </div>

                  {/* Rejection reason */}
                  {m.rejectionReason && (
                    <div className="mb-4 bg-[#FEF2F2] border border-[#FEE2E2] rounded-xl p-4">
                      <p className="text-[12px] font-bold text-[#DC2626] uppercase tracking-wide mb-1">
                        Rejection Reason
                      </p>
                      <p className="text-[13.5px] text-[#7F1D1D] leading-relaxed">
                        {m.rejectionReason}
                      </p>
                    </div>
                  )}

                  {/* Photos */}
                  {m.images.length > 0 ? (
                    <div>
                      <p className="text-[13px] font-semibold text-[#0F172A] mb-2.5">
                        Attached Photos{" "}
                        <span className="text-[#94A3B8] font-normal">({m.images.length})</span>
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {m.images.map((img, i) => (
                          <a
                            key={i}
                            href={img.storageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="block aspect-square rounded-xl overflow-hidden border border-[#E2E8F0] hover:border-[#10B981] transition-colors"
                          >
                            <img
                              src={img.storageUrl}
                              alt={`Photo ${i + 1}`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-[13px] text-[#94A3B8]">No photos attached.</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
