import { ArrowLeft, CheckCircle2, Info, AlertCircle, CheckCircle, FileText, Loader2 } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RejectionModal from "../../components/client/RejectionModal";
import PinModal from "../../components/shared/PinModal";
import ForgotPinModal from "../../components/shared/ForgotPinModal";
import SetPinModal from "../../components/shared/SetPinModal";
import StatusModal from "../../components/shared/StatusModal";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";

interface Photo {
  id: string;
  storageUrl: string;
  locationName: string | null;
  takenAt: string;
  mapsUrl: string | null;
}

interface CheckIn {
  checkInTime: string;
  checkInLocationName: string | null;
  checkOutTime: string | null;
  checkOutLocationName: string | null;
}

interface MilestoneDetail {
  id: string;
  projectId: string;
  name: string;
  status: string;
  allocatedAmount: string | null;
  rejectionReason: string | null;
  images: Photo[];
  checkIns: CheckIn[];
}

export default function SingleMilestone() {
  const navigate = useNavigate();
  const { milestoneId } = useParams();
  const { user, updateUser } = useAuth();

  const [milestone, setMilestone] = useState<MilestoneDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isSetPinModalOpen, setIsSetPinModalOpen] = useState(false);
  const [isForgotPinModalOpen, setIsForgotPinModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadMilestone = useCallback(async () => {
    if (!milestoneId) return;
    try {
      const res = await api.get<{ success: boolean; milestone: MilestoneDetail }>(`/api/milestones/${milestoneId}`);
      setMilestone(res.milestone);
    } catch (err: any) {
      setLoadError(err.message || "Failed to load milestone.");
    } finally {
      setIsLoading(false);
    }
  }, [milestoneId]);

  const loadBalance = useCallback(async () => {
    try {
      const res = await api.post<{ success: boolean; virtualAccount: { balance: string } }>("/api/payments/generate-account", {});
      setBalance(Number(res.virtualAccount.balance));
    } catch {
      // silently fail — balance check isn't critical for viewing
    }
  }, []);

  useEffect(() => {
    loadMilestone();
    loadBalance();

    pollRef.current = setInterval(loadMilestone, 12000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [loadMilestone, loadBalance]);

  const amount = milestone?.allocatedAmount ? Number(milestone.allocatedAmount) : 0;
  const hasSufficientBalance = balance !== null && balance >= amount;

  const handleReject = async (reason: string) => {
    if (!milestoneId) return;
    try {
      await api.put(`/api/milestones/${milestoneId}/reject`, { reason });
      setIsRejectModalOpen(false);
      await loadMilestone();
    } catch (err: any) {
      setActionError(err.message || "Failed to reject milestone.");
    }
  };

  const handleApproveClick = () => {
    setActionError(null);
    if (user?.hasPin) {
      setIsPinModalOpen(true);
    } else {
      setIsSetPinModalOpen(true);
    }
  };

  const handleVerifyPin = async (pin: string) => {
    if (!milestoneId) return;
    await api.post(`/api/payments/approve-milestone/${milestoneId}`, { pin });
    setIsPinModalOpen(false);
    setIsStatusModalOpen(true);
    await loadMilestone();
  };

  const fmtTime = (iso: string | null) => {
    if (!iso) return "";
    return new Date(iso).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-[#16A34A]" size={32} />
      </div>
    );
  }

  if (loadError || !milestone) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-gray-500 text-[14px]">
        {loadError || "Milestone not found."}
      </div>
    );
  }

  return (
    <div className="w-full font-['Inter',sans-serif] pb-20 animate-fade-in text-gray-900">
      <nav className="flex items-center gap-2 text-[13px] font-medium text-gray-500 mb-8" aria-label="Breadcrumb">
        <button type="button" className="hover:text-gray-900 transition-colors" onClick={() => navigate("../milestones")}>Milestones</button>
        <span className="text-gray-300" aria-hidden="true">/</span>
        <span className="text-gray-900 font-semibold">{milestone.name}</span>
      </nav>

      <button
        onClick={() => navigate("../milestones")}
        className="flex items-center gap-2 text-[14px] font-medium text-gray-700 hover:text-gray-900 transition-colors mb-6 w-max"
      >
        <ArrowLeft size={16} />
        Back to Milestones
      </button>

      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-[24px] sm:text-[28px] font-bold leading-tight text-gray-900">{milestone.name}</h1>
            {milestone.status === "submitted" && (
              <span className="bg-[#DBEAFE] text-[#3B82F6] text-[12px] font-semibold px-3 py-1 rounded-full">In Review</span>
            )}
            {milestone.status === "approved" && (
              <span className="bg-[#DCFCE7] text-[#16A34A] text-[12px] font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle size={12} /> Approved
              </span>
            )}
            {milestone.status === "rejected" && (
              <span className="bg-[#FEF2F2] text-[#DC2626] text-[12px] font-semibold px-3 py-1 rounded-full">Rejected</span>
            )}
          </div>
        </div>
      </div>

      {actionError && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-[13px] text-red-600">{actionError}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
        <div className="flex flex-col gap-8">
          {milestone.status === "rejected" && milestone.rejectionReason && (
            <div className="bg-[#FEF2F2] rounded-[16px] p-6 flex gap-4 border border-[#FCA5A5]">
              <AlertCircle size={24} className="text-red-500 shrink-0 mt-0.5" strokeWidth={2} />
              <div>
                <h3 className="text-[15px] font-bold text-gray-900 mb-2">This milestone was rejected</h3>
                <p className="text-[13.5px] text-gray-700 leading-relaxed">{milestone.rejectionReason}</p>
              </div>
            </div>
          )}

          {milestone.checkIns && milestone.checkIns.length > 0 && (
            <div className="bg-white rounded-[16px] border border-gray-100 p-6 shadow-sm">
              <h3 className="text-[15px] font-bold text-gray-900 mb-4">Contractor Activity</h3>
              <div className="flex flex-col gap-4">
                {milestone.checkIns.map((checkIn, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5 text-[13.5px] border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                    <div>
                      <span className="text-gray-500">Checked in: </span>
                      <span className="font-semibold">{fmtTime(checkIn.checkInTime)}</span>
                      {checkIn.checkInLocationName && <span className="text-gray-500"> — {checkIn.checkInLocationName}</span>}
                    </div>
                    {checkIn.checkOutTime && (
                      <div>
                        <span className="text-gray-500">Checked out: </span>
                        <span className="font-semibold">{fmtTime(checkIn.checkOutTime)}</span>
                        {checkIn.checkOutLocationName && <span className="text-gray-500"> — {checkIn.checkOutLocationName}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-[16px] border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-gray-900 mb-4">Site Photos ({milestone.images.length})</h3>
            {milestone.images.length === 0 ? (
              <p className="text-[13.5px] text-gray-500">No photos submitted yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {milestone.images.map((img) => (
                  <div key={img.id} className="rounded-xl border border-gray-100 overflow-hidden">
                    <div className="aspect-[4/3] bg-gray-100">
                      <img src={img.storageUrl} alt="Site" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-2.5">
                      <p className="text-[11px] text-gray-500">{fmtTime(img.takenAt)}</p>
                      {img.locationName && <p className="text-[11px] text-gray-700 font-medium truncate">{img.locationName}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {milestone.status === "submitted" && (
            <div className="bg-[#F0FDF4] rounded-[16px] p-6 flex gap-4 border border-[#DCFCE7]">
              <Info size={24} className="text-[#16A34A] shrink-0" strokeWidth={2} />
              <div>
                <h3 className="text-[15px] font-bold text-gray-900 mb-2">What happens next?</h3>
                <p className="text-[13.5px] text-gray-600 leading-relaxed">
                  If you approve, <span className="font-semibold text-gray-900">₦{amount.toLocaleString()}</span> will be released to the contractor.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="sticky top-8">
          <div className="bg-white rounded-[16px] border border-gray-100 p-6 sm:p-8 shadow-sm">
            <h2 className="text-[15px] font-bold text-gray-900 mb-8">Payment Details</h2>

            <div className="flex flex-col gap-6 mb-8">
              <div>
                <p className="text-[13px] text-gray-500 mb-1">Milestone Amount</p>
                <p className="text-[24px] font-bold text-gray-900">₦{amount.toLocaleString()}</p>
              </div>

              {milestone.status !== "approved" && (
                <>
                  <div>
                    <p className="text-[13px] text-gray-500 mb-1">Your Balance</p>
                    <p className="text-[24px] font-bold text-gray-900">
                      {balance !== null ? `₦${balance.toLocaleString()}` : "—"}
                    </p>
                  </div>

                  {balance !== null && (
                    hasSufficientBalance ? (
                      <div className="flex items-center gap-2 text-[13px] font-semibold text-[#16A34A]">
                        <CheckCircle2 size={18} className="fill-[#DCFCE7]" strokeWidth={2} /> Sufficient balance
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-[13px] font-semibold text-red-500">
                        <AlertCircle size={18} className="text-red-500" strokeWidth={2} /> Insufficient balance
                      </div>
                    )
                  )}
                </>
              )}

              {milestone.status === "approved" && (
                <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#DCFCE7] flex items-center justify-center text-[#16A34A]">
                      <CheckCircle2 size={18} />
                    </div>
                    <p className="text-[14px] font-bold text-gray-900">Paid Successfully</p>
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white border border-gray-200 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                    <FileText size={16} /> View Receipt
                  </button>
                </div>
              )}
            </div>

            {milestone.status === "submitted" && (
              <div className="flex flex-col xl:flex-row gap-3">
                <button
                  onClick={() => setIsRejectModalOpen(true)}
                  className="flex-1 py-3 px-4 rounded-lg border-2 border-red-500 text-red-500 font-bold text-[14px] hover:bg-red-50 transition-colors text-center"
                >
                  Reject Milestone
                </button>
                <button
                  disabled={!hasSufficientBalance}
                  onClick={handleApproveClick}
                  className="flex-1 py-3 px-4 rounded-lg bg-[#16A34A] text-white font-bold text-[14px] hover:bg-[#15803d] transition-colors text-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Approve & Release
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <RejectionModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onReject={handleReject}
      />

      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onVerify={handleVerifyPin}
        actionLabel="Approve & Release Payment"
        onForgotPin={() => {
          setIsPinModalOpen(false);
          setIsForgotPinModalOpen(true);
        }}
      />

      <ForgotPinModal
        isOpen={isForgotPinModalOpen}
        onClose={() => setIsForgotPinModalOpen(false)}
        onSuccess={() => setIsPinModalOpen(true)}
      />

      <SetPinModal
        isOpen={isSetPinModalOpen}
        onClose={() => setIsSetPinModalOpen(false)}
        onSuccess={() => {
          setIsSetPinModalOpen(false);
          updateUser({ hasPin: true });
          setIsPinModalOpen(true);
        }}
      />

      <StatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        status="success"
        title="Payment Successful"
        description="Your milestone payment has been processed. The contractor's balance has been credited."
        actionLabel="Done"
        onAction={() => setIsStatusModalOpen(false)}
      />
    </div>
  );
}