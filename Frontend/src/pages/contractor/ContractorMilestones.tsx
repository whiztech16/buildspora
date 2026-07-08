import { useState, useEffect } from 'react';
import { ChevronRight, CheckCircle2, ArrowLeft, Camera, FileCheck2, Calendar, CreditCard, Building2, Loader2, MapPin, LogIn, LogOut as LogOutIcon } from 'lucide-react';
import { api } from '../../lib/api';
import LiveCameraModal from '../../components/shared/LiveCameraModal';

interface Milestone {
  id: string;
  projectId: string;
  name: string;
  orderIndex: number;
  status: string;
  allocatedAmount: string | null;
}

interface Project {
  id: string;
  name: string;
  status: string;
}

export default function ContractorMilestones() {
  const [project, setProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'detail' | 'submit'>('list');
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const projectsRes = await api.get<{ success: boolean; projects: Project[] }>('/api/projects');
        const activeProject = projectsRes.projects[0];

        if (!activeProject) {
          setLoadError('No project assigned yet. Ask your client to assign you to a project.');
          setIsLoading(false);
          return;
        }

        setProject(activeProject);

        const detailRes = await api.get<{ success: boolean; milestones: Milestone[] }>(`/api/projects/${activeProject.id}`);
        setMilestones(detailRes.milestones);
      } catch (err: any) {
        setLoadError(err.message || 'Failed to load project.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleSelect = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setView('detail');
  };

  const refreshMilestones = async () => {
    if (!project) return;
    const detailRes = await api.get<{ success: boolean; milestones: Milestone[] }>(`/api/projects/${project.id}`);
    setMilestones(detailRes.milestones);
    if (selectedMilestone) {
      const updated = detailRes.milestones.find((m) => m.id === selectedMilestone.id);
      if (updated) setSelectedMilestone(updated);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-[#10B981]" size={32} />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-[#64748B] text-[14px] text-center px-6">
        {loadError}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[12px] border border-[#E2E8F0] overflow-hidden min-h-[600px] flex flex-col">
      {view === 'list' && (
        <MilestoneList projectName={project?.name || ''} milestones={milestones} onSelect={handleSelect} />
      )}
      {view === 'detail' && selectedMilestone && (
        <MilestoneDetail
          milestones={milestones}
          milestone={selectedMilestone}
          projectName={project?.name || ''}
          onBack={() => setView('list')}
          onSubmit={() => setView('submit')}
          onRefresh={refreshMilestones}
        />
      )}
      {view === 'submit' && selectedMilestone && (
        <MilestoneSubmit
          milestone={selectedMilestone}
          onBack={() => setView('detail')}
          onComplete={async () => {
            await refreshMilestones();
            setView('list');
          }}
        />
      )}
    </div>
  );
}

function formatAmount(amount: string | null) {
  if (!amount) return '₦—';
  return `₦${Number(amount).toLocaleString()}`;
}

function statusBadge(status: string) {
  if (status === 'approved') {
    return (
      <span className="text-[#059669] bg-[#ECFDF5] px-2.5 py-1 rounded-md text-[12.5px] font-bold flex items-center gap-1.5">
        Approved <CheckCircle2 size={14} />
      </span>
    );
  }
  if (status === 'submitted') {
    return <span className="text-[#3B82F6] bg-[#EFF6FF] px-2.5 py-1 rounded-md text-[12.5px] font-bold">In Review</span>;
  }
  if (status === 'rejected') {
    return <span className="text-[#DC2626] bg-[#FEF2F2] px-2.5 py-1 rounded-md text-[12.5px] font-bold">Rejected</span>;
  }
  if (status === 'in_progress') {
    return <span className="text-[#D97706] bg-[#FFFBEB] px-2.5 py-1 rounded-md text-[12.5px] font-bold">In Progress</span>;
  }
  return <span className="text-[#64748B] bg-[#F1F5F9] px-2.5 py-1 rounded-md text-[12.5px] font-bold">Pending</span>;
}

function getGPS(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
    }
  });
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    const data = await res.json();
    return data.display_name || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
  } catch {
    return `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
  }
}

function MilestoneList({ projectName, milestones, onSelect }: { projectName: string; milestones: Milestone[]; onSelect: (m: Milestone) => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 md:p-6 border-b border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[20px] font-bold text-[#0F172A] mb-1">Milestones</h2>
          <p className="text-[13.5px] text-[#475569]">Track and submit your work for each milestone.</p>
        </div>
      </div>
      <div className="p-4 md:p-6 pb-2 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2 text-[14.5px] font-bold text-[#0F172A] mb-4">
          <Building2 size={18} className="text-[#64748B]" />
          {projectName}
        </div>
      </div>
      <div className="p-4 md:p-6 flex-1">
        <div className="hidden md:grid grid-cols-12 text-[13px] font-semibold text-[#64748B] mb-4 px-4">
          <div className="col-span-6">Milestone</div>
          <div className="col-span-3">Payment</div>
          <div className="col-span-3">Status</div>
        </div>
        <div className="flex flex-col gap-3 md:gap-2">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              onClick={() => onSelect(milestone)}
              className="flex flex-col md:grid md:grid-cols-12 items-start md:items-center gap-3 md:gap-0 text-[14px] font-medium text-[#0F172A] py-4 md:py-3.5 px-4 rounded-xl hover:bg-[#F8FAFC] cursor-pointer transition-colors border border-[#E2E8F0] md:border-transparent md:hover:border-[#E2E8F0]"
            >
              <div className="w-full md:col-span-6 font-bold md:font-medium">{milestone.orderIndex + 1}. {milestone.name}</div>
              <div className="w-full flex justify-between md:block md:col-span-3 text-[13.5px] text-[#64748B] md:text-[#0F172A] border-b border-[#E2E8F0] md:border-0 pb-3 md:pb-0">
                <span className="md:hidden font-medium text-[#0F172A]">Payment</span>
                {formatAmount(milestone.allocatedAmount)}
              </div>
              <div className="w-full flex items-center justify-between md:col-span-3">
                {statusBadge(milestone.status)}
                <ChevronRight size={16} className="text-[#94A3B8]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MilestoneDetail({ milestones, milestone, projectName, onBack, onSubmit, onRefresh }: {
  milestones: Milestone[];
  milestone: Milestone;
  projectName: string;
  onBack: () => void;
  onSubmit: () => void;
  onRefresh: () => Promise<void>;
}) {
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Persisted check-in record loaded from the backend
  interface CheckInRecord {
    checkInTime: string;
    checkInLocationName: string | null;
    checkInLat: number | null;
    checkInLng: number | null;
    checkInMapsUrl: string | null;
    checkOutTime: string | null;
    checkOutLocationName: string | null;
    checkOutLat: number | null;
    checkOutLng: number | null;
    checkOutMapsUrl: string | null;
  }
  const [checkInRecord, setCheckInRecord] = useState<CheckInRecord | null>(null);

  const loadDetail = async () => {
    try {
      const res = await api.get<{ success: boolean; milestone: { checkIns: CheckInRecord[] } }>(`/api/milestones/${milestone.id}`);
      if (res.milestone.checkIns?.length > 0) {
        const sorted = [...res.milestone.checkIns].sort((a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime());
        setCheckInRecord(sorted[0]);
      } else {
        setCheckInRecord(null);
      }
    } catch {
      // silently fail
    }
  };

  useEffect(() => { loadDetail(); }, [milestone.id]);

  const canSubmit = milestone.status === 'pending' || milestone.status === 'in_progress' || milestone.status === 'rejected';

  const fmtTime = (iso: string | null) => {
    if (!iso) return '';
    return new Date(iso).toLocaleString('en-NG', {
      dateStyle: 'medium', timeStyle: 'short',
    });
  };

  const handleCheckIn = async () => {
    setIsCheckingIn(true);
    setActionError(null);
    try {
      const position = await getGPS();
      const locationName = await reverseGeocode(position.coords.latitude, position.coords.longitude);
      await api.post(`/api/milestones/${milestone.id}/checkin`, {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        locationName,
      });
      await onRefresh();
      await loadDetail(); // refresh check-in record
    } catch (err: any) {
      setActionError(
        err instanceof GeolocationPositionError
          ? 'Location access denied. Please enable location permissions.'
          : err.message || 'Check-in failed.'
      );
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    setIsCheckingOut(true);
    setActionError(null);
    try {
      const position = await getGPS();
      const locationName = await reverseGeocode(position.coords.latitude, position.coords.longitude);
      await api.post(`/api/milestones/${milestone.id}/checkout`, {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        locationName,
      });
      await loadDetail(); // refresh to show checkout timestamp
    } catch (err: any) {
      setActionError(
        err instanceof GeolocationPositionError
          ? 'Location access denied. Please enable location permissions.'
          : err.message || 'Check-out failed.'
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="p-4 md:p-6 border-b border-[#E2E8F0]">
        <button onClick={onBack} className="flex items-center gap-2 text-[13.5px] font-semibold text-[#64748B] hover:text-[#0F172A] mb-4 transition-colors">
          <ArrowLeft size={16} /> Back to Milestones
        </button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-[22px] md:text-[24px] font-bold text-[#0F172A] mb-2">{milestone.name}</h2>
            <div className="flex items-center gap-3 text-[13.5px] font-medium flex-wrap">
              {statusBadge(milestone.status)}
              <span className="text-[#64748B]">Milestone {milestone.orderIndex + 1} of {milestones.length}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {/* Check In / Check Out logic */}
            {(() => {
              const isTodayShift = (isoStr: string) => {
                const checkInDate = new Date(isoStr);
                const now = new Date();
                const resetTime = new Date(now);
                if (resetTime.getHours() < 6) resetTime.setDate(resetTime.getDate() - 1);
                resetTime.setHours(6, 0, 0, 0);
                return checkInDate >= resetTime;
              };

              const hasUnfinishedCheckIn = checkInRecord && !checkInRecord.checkOutTime;
              const hasCheckedInToday = checkInRecord && isTodayShift(checkInRecord.checkInTime);
              const isDoneForToday = hasCheckedInToday && !!checkInRecord.checkOutTime;

              if (hasUnfinishedCheckIn) {
                return (
                  <button
                    onClick={handleCheckOut}
                    disabled={isCheckingOut}
                    className="flex justify-center items-center gap-2 bg-[#0F172A] text-white px-5 py-2.5 rounded-lg text-[13.5px] font-semibold hover:bg-black transition-colors w-full sm:w-auto disabled:opacity-60"
                  >
                    {isCheckingOut ? <Loader2 size={16} className="animate-spin" /> : null}
                    {isCheckingOut ? 'Checking out...' : 'Check Out'}
                  </button>
                );
              }

              if (isDoneForToday) {
                return (
                  <div className="flex justify-center items-center gap-2 bg-[#F1F5F9] text-[#64748B] px-5 py-2.5 rounded-lg text-[13.5px] font-semibold w-full sm:w-auto">
                    Checked in for today
                  </div>
                );
              }

              return (
                <button
                  onClick={handleCheckIn}
                  disabled={isCheckingIn}
                  className="flex justify-center items-center gap-2 bg-[#0F172A] text-white px-5 py-2.5 rounded-lg text-[13.5px] font-semibold hover:bg-black transition-colors w-full sm:w-auto disabled:opacity-60"
                >
                  {isCheckingIn ? <Loader2 size={16} className="animate-spin" /> : null}
                  {isCheckingIn ? 'Checking in...' : 'Check In'}
                </button>
              );
            })()}
            {/* STEP 3: Submit — always show for actionable milestones */}
            {canSubmit && (
              <button
                onClick={onSubmit}
                className="flex justify-center bg-[#10B981] text-white px-5 py-2.5 rounded-lg text-[13.5px] font-semibold hover:bg-[#059669] transition-colors w-full sm:w-auto items-center gap-2"
              >
                <span>📷</span> Submit Milestone
              </button>
            )}
          </div>
        </div>
        {actionError && (
          <p className="text-[13px] text-red-600 mt-3 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{actionError}</p>
        )}

        {/* ── CHECK-IN CAPTURE CARD ─────────────────── */}
        {checkInRecord && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Check-in card */}
            <div className="flex items-start gap-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-4">
              <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center shrink-0 mt-0.5">
                <LogIn size={15} className="text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-[#059669] uppercase tracking-wide mb-1">Checked In</p>
                <p className="text-[13px] font-semibold text-[#0F172A] mb-0.5 truncate">
                  <MapPin size={11} className="inline mr-1 text-[#10B981]" />
                  {checkInRecord.checkInLocationName || 'Location captured'}
                </p>
                <p className="text-[11.5px] text-[#64748B]">{fmtTime(checkInRecord.checkInTime)}</p>
                {checkInRecord.checkInMapsUrl && (
                  <a href={checkInRecord.checkInMapsUrl} target="_blank" rel="noreferrer"
                    className="text-[11px] text-[#059669] font-semibold hover:underline mt-0.5 inline-block">
                    View on map ↗
                  </a>
                )}
              </div>
            </div>

            {/* Check-out card */}
            {checkInRecord.checkOutTime ? (
              <div className="flex items-start gap-3 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-4">
                <div className="w-8 h-8 rounded-full bg-[#F59E0B] flex items-center justify-center shrink-0 mt-0.5">
                  <LogOutIcon size={15} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-[#D97706] uppercase tracking-wide mb-1">Checked Out</p>
                  <p className="text-[13px] font-semibold text-[#0F172A] mb-0.5 truncate">
                    <MapPin size={11} className="inline mr-1 text-[#F59E0B]" />
                    {checkInRecord.checkOutLocationName || 'Location captured'}
                  </p>
                  <p className="text-[11.5px] text-[#64748B]">{fmtTime(checkInRecord.checkOutTime)}</p>
                  {checkInRecord.checkOutMapsUrl && (
                    <a href={checkInRecord.checkOutMapsUrl} target="_blank" rel="noreferrer"
                      className="text-[11px] text-[#D97706] font-semibold hover:underline mt-0.5 inline-block">
                      View on map ↗
                    </a>
                  )}
                </div>
              </div>
            ) : milestone.status === 'in_progress' ? (
              <div className="flex items-start gap-3 bg-[#F8FAFC] border border-dashed border-[#CBD5E1] rounded-xl p-4">
                <div className="w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center shrink-0 mt-0.5">
                  <LogOutIcon size={15} className="text-[#94A3B8]" />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-wide mb-1">Not Checked Out</p>
                  <p className="text-[12.5px] text-[#64748B]">Tap &quot;Check Out&quot; when you leave the site</p>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="p-4 md:p-6 flex-1 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
          <div className="bg-white p-5 md:p-6 rounded-xl border border-[#E2E8F0] flex flex-col justify-center gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#64748B] text-[13.5px]"><CreditCard size={16} /> Milestone Amount</div>
              <div className="text-[14px] font-bold text-[#0F172A]">{formatAmount(milestone.allocatedAmount)}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#64748B] text-[13.5px]"><Building2 size={16} /> Project</div>
              <div className="text-[14px] font-bold text-[#0F172A]">{projectName}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#64748B] text-[13.5px]"><Calendar size={16} /> Payment on Approval</div>
              <div className="text-[14px] font-bold text-[#0F172A]">100%</div>
            </div>
          </div>

          <div className="bg-white p-5 md:p-6 rounded-xl border border-[#E2E8F0]">
            <p className="text-[13.5px] font-bold text-[#0F172A] mb-4">Overall Progress</p>
            <div className="w-full overflow-x-auto pb-2">
              <div className="min-w-[300px] relative flex justify-between items-center px-2">
                <div className="absolute top-2 left-2 right-2 h-0.5 bg-[#E2E8F0] -z-10" />
                {milestones.map((m) => {
                  const isPast = m.status === 'approved';
                  const isCurrent = m.id === milestone.id;
                  return (
                    <div key={m.id} className="flex flex-col items-center gap-1.5 bg-white px-1">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center border-2 ${isPast ? 'bg-[#10B981] border-[#10B981]' : isCurrent ? 'bg-white border-[#10B981]' : 'bg-white border-[#E2E8F0]'}`}>
                        {isPast && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        {isCurrent && <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full" />}
                      </div>
                      <span className={`text-[10px] font-bold ${isPast || isCurrent ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`}>{m.orderIndex + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {milestone.status === 'rejected' && (
          <div className="bg-[#FEF2F2] rounded-xl p-6 mb-6 border border-[#FCA5A5]">
            <h3 className="text-[15px] font-bold text-[#0F172A] mb-2">This milestone was rejected</h3>
            <p className="text-[13.5px] text-gray-700">Please review the client feedback and resubmit after corrections.</p>
          </div>
        )}

        {canSubmit && (
          <div className="bg-white p-5 md:p-6 rounded-xl border border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-[16px] font-bold text-[#0F172A] mb-1">Ready to submit your work?</h3>
              <p className="text-[13.5px] text-[#64748B]">
                {milestone.status === 'pending'
                  ? 'Check in first, then take live photos and submit your milestone.'
                  : 'Take live photos and submit your milestone for client review.'}
              </p>
            </div>
            <button onClick={onSubmit} className="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-2.5 rounded-lg text-[14px] font-bold transition-colors w-full md:w-auto flex items-center justify-center gap-2">
              <span>📷</span> Submit Milestone
            </button>
          </div>
        )}

        {(milestone.status === 'submitted' || milestone.status === 'approved') && (
          <div className="bg-[#ECFDF5] rounded-xl p-6 border border-[#6EE7B7]">
            <h3 className="text-[15px] font-bold text-[#059669] mb-1">
              {milestone.status === 'approved' ? 'Milestone Approved' : 'Awaiting Client Review'}
            </h3>
            <p className="text-[13.5px] text-[#065F46]">
              {milestone.status === 'approved' ? 'Payment will be processed shortly.' : 'The client has been notified and will review your submission.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface CapturedPhoto {
  id: string;
  storageUrl: string;
  lat: string | null;
  lng: string | null;
  locationName: string | null;
  takenAt: string;
  mapsUrl: string | null;
}

function MilestoneSubmit({ milestone, onBack, onComplete }: { milestone: Milestone; onBack: () => void; onComplete: () => void }) {
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCheckedOut, setHasCheckedOut] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleCapture = async (file: File) => {
    setIsUploading(true);
    setError(null);
    try {
      const position = await getGPS();
      const locationName = await reverseGeocode(position.coords.latitude, position.coords.longitude);
      
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('lat', String(position.coords.latitude));
      formData.append('lng', String(position.coords.longitude));
      formData.append('locationName', locationName);
      
      const res = await api.postForm<{ success: boolean; photo: CapturedPhoto }>(`/api/milestones/${milestone.id}/photos`, formData);
      setPhotos((prev) => [...prev, res.photo]);
    } catch (err: any) {
      setError(err instanceof GeolocationPositionError ? 'Location access denied.' : err.message || 'Photo upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCheckOut = async () => {
    setIsCheckingOut(true);
    setError(null);
    try {
      const position = await getGPS();
      const locationName = await reverseGeocode(position.coords.latitude, position.coords.longitude);
      await api.post(`/api/milestones/${milestone.id}/checkout`, {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        locationName,
      });
      setHasCheckedOut(true);
    } catch (err: any) {
      setError(err instanceof GeolocationPositionError ? 'Location access denied.' : err.message || 'Check-out failed.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await api.put(`/api/milestones/${milestone.id}/submit`, {});
      onComplete();
    } catch (err: any) {
      setError(err.message || 'Submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const canSubmit = confirmed && photos.length > 0 && !isSubmitting;

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="p-4 md:p-6 border-b border-[#E2E8F0]">
        <button onClick={onBack} className="flex items-center gap-2 text-[13.5px] font-semibold text-[#64748B] hover:text-[#0F172A] mb-4 transition-colors">
          <ArrowLeft size={16} /> Back to Milestone
        </button>
        <h2 className="text-[22px] md:text-[24px] font-bold text-[#0F172A] mb-1">Review & Submit</h2>
        <p className="text-[14.5px] text-[#64748B]">{milestone.name}</p>
      </div>

      <div className="p-4 md:p-6 flex-1 bg-white overflow-y-auto">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl mb-4">
            <p className="text-[13px] text-red-600">{error}</p>
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-bold text-[#0F172A]">Site Photos ({photos.length})</h3>
            <button
              onClick={() => setIsCameraOpen(true)}
              disabled={isUploading}
              className="flex items-center gap-2 bg-[#0F172A] text-white px-4 py-2 rounded-lg text-[13.5px] font-semibold hover:bg-black transition-colors disabled:opacity-60"
            >
              {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
              {isUploading ? 'Uploading...' : 'Add Photo'}
            </button>
          </div>

          {photos.length === 0 ? (
            <div className="bg-white border border-dashed border-[#E2E8F0] rounded-xl p-10 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#F8FAFC] flex items-center justify-center mb-3">
                <Camera size={24} className="text-[#94A3B8]" />
              </div>
              <p className="text-[14.5px] font-bold text-[#0F172A] mb-1">No photos added yet</p>
              <p className="text-[13.5px] text-[#64748B] max-w-[300px]">Tap "Add Photo" on mobile to capture a live site photo.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
                  <div className="aspect-[4/3] bg-gray-100 relative">
                    <img src={photo.storageUrl} alt="Site capture" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <span className="text-[10px] bg-[#ECFDF5] text-[#059669] px-1.5 py-0.5 rounded font-bold">Verified on site</span>
                    <div className="flex flex-col gap-1.5 mt-2">
                      <div className="text-[11.5px] flex items-start gap-1.5">
                        <span className="shrink-0 text-[#64748B]">clock</span>
                        <span className="font-medium text-[#0F172A]">{formatDateTime(photo.takenAt)}</span>
                      </div>
                      {photo.locationName && (
                        <div className="text-[11.5px] flex items-start gap-1.5">
                          <span className="shrink-0 text-[#64748B]">pin</span>
                          <span className="font-medium text-[#0F172A]">{photo.locationName}</span>
                        </div>
                      )}
                      {photo.mapsUrl && (
                        <a href={photo.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-[11.5px] text-[#3B82F6] font-bold hover:underline">View on Google Maps</a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-5 md:p-6 rounded-xl border border-[#E2E8F0] mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h4 className="text-[15px] font-bold text-[#0F172A] mb-1">Check Out</h4>
            <p className="text-[13.5px] text-[#64748B]">Confirm your departure location before submitting.</p>
          </div>
          <button
            onClick={handleCheckOut}
            disabled={isCheckingOut || hasCheckedOut}
            className="flex items-center justify-center gap-2 bg-[#0F172A] text-white px-5 py-2.5 rounded-lg text-[14px] font-bold hover:bg-black transition-colors disabled:opacity-60 w-full md:w-auto"
          >
            {isCheckingOut ? <Loader2 size={16} className="animate-spin" /> : null}
            {hasCheckedOut ? 'Checked Out' : isCheckingOut ? 'Checking out...' : 'Check Out'}
          </button>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-xl border border-[#E2E8F0] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#ECFDF5] flex items-center justify-center shrink-0">
              <FileCheck2 size={20} className="text-[#10B981]" />
            </div>
            <div>
              <h4 className="text-[15px] font-bold text-[#0F172A] mb-1">Confirm Submission</h4>
              <p className="text-[13px] text-[#64748B] mb-3 max-w-[400px]">I confirm that the above information is accurate and the photos were taken on-site.</p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="w-4 h-4 rounded border-[#E2E8F0] text-[#10B981] focus:ring-[#10B981]" />
                <span className="text-[13.5px] font-bold text-[#0F172A]">I confirm</span>
              </label>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex-1 sm:flex-none justify-center bg-[#10B981] hover:bg-[#059669] text-white px-6 py-2.5 rounded-lg text-[14px] font-bold transition-colors disabled:opacity-50 w-full md:w-auto"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Milestone'}
          </button>
        </div>

        {!canSubmit && (
          <div className="mt-4 flex flex-col gap-1.5">
            {photos.length === 0 && <p className="text-[12.5px] text-[#94A3B8]">- Add at least one site photo</p>}
            {!hasCheckedOut && <p className="text-[12.5px] text-[#94A3B8]">- Check out before submitting</p>}
            {!confirmed && <p className="text-[12.5px] text-[#94A3B8]">- Tick the confirmation checkbox</p>}
          </div>
        )}
      </div>
      
      <LiveCameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCapture}
      />
    </div>
  );
}
