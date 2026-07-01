/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from 'react';
import { ChevronRight, ChevronDown, CheckCircle2, ArrowLeft, Camera, FileCheck2, Calendar, CreditCard, Building2, Monitor, Flag } from 'lucide-react';
import { getContractorMilestones, getProjectType } from '../../data/mockData';


export default function ContractorMilestones() {
  // Read the same project type as the client — simulates shared DB records
  const MILESTONES = getContractorMilestones(getProjectType());
  const [view, setView] = useState<'list' | 'detail' | 'submit'>('list');
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null);

  const handleSelect = (milestone: any) => {
    setSelectedMilestone(milestone);
    setView('detail');
  };

  return (
    <div className="bg-white rounded-[12px] border border-[#E2E8F0] overflow-hidden min-h-[600px] flex flex-col">
      {view === 'list' && (
        <MilestoneList milestones={MILESTONES} onSelect={handleSelect} />
      )}
      {view === 'detail' && (
        <MilestoneDetail 
          milestones={MILESTONES}
          milestone={selectedMilestone} 
          onBack={() => setView('list')} 
          onSubmit={() => setView('submit')} 
        />
      )}
      {view === 'submit' && (
        <MilestoneSubmit 
          milestone={selectedMilestone} 
          onBack={() => setView('detail')} 
          onComplete={() => setView('list')}
        />
      )}
    </div>
  );
}

function MilestoneList({ milestones, onSelect }: { milestones: any[]; onSelect: (m: any) => void }) {
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
          Victoria Island Duplex
          <span className="text-[11.5px] bg-[#ECFDF5] text-[#059669] px-2 py-0.5 rounded-md ml-2">Active</span>
          <ChevronDown size={16} className="text-[#64748B] ml-1 cursor-pointer" />
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
              <div className="w-full md:col-span-6 font-bold md:font-medium">{milestone.id}. {milestone.title}</div>
              <div className="w-full flex justify-between md:block md:col-span-3 text-[13.5px] text-[#64748B] md:text-[#0F172A] border-b border-[#E2E8F0] md:border-0 pb-3 md:pb-0">
                <span className="md:hidden font-medium text-[#0F172A]">Payment</span>
                {milestone.amount}
              </div>
              <div className="w-full flex items-center justify-between md:col-span-3">
                {milestone.status === 'completed' && (
                  <span className="text-[#059669] bg-[#ECFDF5] px-2.5 py-1 rounded-md text-[12.5px] font-bold flex items-center gap-1.5">
                    Completed <CheckCircle2 size={14} />
                  </span>
                )}
                {milestone.status === 'in_review' && (
                  <span className="text-[#3B82F6] bg-[#EFF6FF] px-2.5 py-1 rounded-md text-[12.5px] font-bold">
                    In Review
                  </span>
                )}
                {milestone.status === 'pending' && (
                  <span className="text-[#64748B] bg-[#F1F5F9] px-2.5 py-1 rounded-md text-[12.5px] font-bold">
                    Pending
                  </span>
                )}
                <ChevronRight size={16} className="text-[#94A3B8]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MilestoneDetail({ milestones, milestone, onBack, onSubmit }: { milestones: any[]; milestone: any; onBack: () => void; onSubmit: () => void }) {
  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="p-4 md:p-6 border-b border-[#E2E8F0]">
        <button onClick={onBack} className="flex items-center gap-2 text-[13.5px] font-semibold text-[#64748B] hover:text-[#0F172A] mb-4 transition-colors">
          <ArrowLeft size={16} /> Back to Milestones
        </button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-[22px] md:text-[24px] font-bold text-[#0F172A] mb-2">{milestone.title}</h2>
            <div className="flex items-center gap-3 text-[13.5px] font-medium">
              <span className="bg-[#F1F5F9] text-[#64748B] px-2.5 py-1 rounded-md">Pending</span>
              <span className="text-[#64748B]">Milestone {milestone.id} of 8</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button className="flex items-center justify-center gap-2 border border-[#E2E8F0] px-4 py-2 rounded-lg text-[13.5px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] transition-colors w-full sm:w-auto">
              <Monitor size={16} /> Message Client
            </button>
            <button onClick={onSubmit} className="flex justify-center bg-[#0F172A] text-white px-5 py-2 rounded-lg text-[13.5px] font-semibold hover:bg-black transition-colors w-full sm:w-auto">
              Submit Milestone
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 flex-1 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
          <div className="bg-white p-5 md:p-6 rounded-xl border border-[#E2E8F0]">
            <h4 className="text-[13.5px] font-bold text-[#64748B] mb-2">Milestone Description</h4>
            <p className="text-[14.5px] text-[#0F172A] leading-relaxed">
              Complete all ground floor block work up to lintel level. Ensure proper alignment and mortar mix ratio as specified in the structural drawings.
            </p>
          </div>
          <div className="bg-white p-5 md:p-6 rounded-xl border border-[#E2E8F0] flex flex-col justify-center gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#64748B] text-[13.5px]"><Calendar size={16} /> Due Date</div>
              <div className="text-[14px] font-bold text-[#0F172A]">25 June 2026</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#64748B] text-[13.5px]"><CreditCard size={16} /> Client Payment</div>
              <div className="text-[14px] font-bold text-[#0F172A]">{milestone.amount}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#64748B] text-[13.5px]"><CheckCircle2 size={16} /> Payment on Approval</div>
              <div className="text-[14px] font-bold text-[#0F172A]">100%</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-xl border border-[#E2E8F0] mb-6">
          <h3 className="text-[16px] font-bold text-[#0F172A] mb-1">Best Practices</h3>
          <p className="text-[13.5px] text-[#64748B] mb-5">Follow these guidelines to ensure quality work and faster approval.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            {[
              "Ensure block walls are straight, level and properly aligned.",
              "Use the approved block type and mix ratio as specified.",
              "All joints properly and ensure consistent mortar thickness.",
              "Check wall corners and junctions for proper bonding.",
              "Ensure openings for doors, windows and services match the drawings.",
              "Keep the work area clean and safe at all times.",
              "Take clear photos from all sides showing overall progress and key details.",
              "Work must match the approved drawings and specifications."
            ].map((practice, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-[#10B981] shrink-0 mt-0.5" />
                <span className="text-[13.5px] text-[#0F172A] leading-relaxed">{practice}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-xl border border-[#E2E8F0] mb-6">
          <h3 className="text-[16px] font-bold text-[#0F172A] mb-1">Milestone Progress</h3>
          <p className="text-[13.5px] text-[#64748B] mb-8">Track the progress of your project.</p>
          
          <div className="w-full overflow-x-auto pb-4 hide-scrollbar">
            <div className="min-w-[600px] relative flex justify-between items-center px-4">
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-[#E2E8F0] -z-10 -translate-y-1/2"></div>
            {milestones.map((m) => {
              const isPast = m.id < milestone.id;
              const isCurrent = m.id === milestone.id;
              return (
                <div key={m.id} className="flex flex-col items-center gap-2 bg-white px-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center border-2 
                    ${isPast ? 'bg-[#10B981] border-[#10B981]' : isCurrent ? 'bg-white border-[#10B981]' : 'bg-white border-[#E2E8F0]'}`}>
                    {isPast && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                    {isCurrent && <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full"></div>}
                  </div>
                  <span className={`text-[11.5px] font-bold ${isPast || isCurrent ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`}>{m.title}</span>
                </div>
              );
            })}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-xl border border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-[16px] font-bold text-[#0F172A] mb-1">Ready to submit your work?</h3>
            <p className="text-[13.5px] text-[#64748B]">Take live photos and add a summary of the completed work for client review.</p>
          </div>
          <button onClick={onSubmit} className="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-2.5 rounded-lg text-[14px] font-bold transition-colors w-full md:w-auto">
            Submit Milestone
          </button>
        </div>

      </div>
    </div>
  );
}

function MilestoneSubmit({ milestone, onBack, onComplete }: { milestone: any; onBack: () => void; onComplete: () => void }) {
  const [photos, setPhotos] = useState<any[]>([]);
  const [summary, setSummary] = useState("");
  const cameraRef = useRef<HTMLInputElement>(null);
  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let { width, height } = img;
          if (width > 1200 || height > 1200) {
            const ratio = Math.min(1200 / width, 1200 / height);
            width *= ratio;
            height *= ratio;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        };
        img.onerror = () => resolve(event.target?.result as string);
      };
      reader.onerror = () => resolve("");
    });
  };

  const getLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser (or you are not using HTTPS)"));
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      }
    });
  };

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    let position: GeolocationPosition | null = null;
    try {
      position = await getLocation();
    } catch (err: unknown) {
      console.warn("Could not get location", err);
      alert(`Location access failed: ${err instanceof Error ? err.message : String(err)}. Your photos will be uploaded without location tags.`);
    }

    const getDeviceName = () => {
      const ua = navigator.userAgent;
      if (/iPhone/i.test(ua)) return "iPhone";
      if (/iPad/i.test(ua)) return "iPad";
      if (/Android/i.test(ua)) {
        const match = ua.match(/Android.*?; (.*?) Build/i);
        return match ? match[1] : "Android Device";
      }
      if (/Windows NT/i.test(ua)) return "Windows PC";
      if (/Macintosh/i.test(ua)) return "Mac";
      if (/Linux/i.test(ua)) return "Linux PC";
      return "Unknown Device";
    };

    let address = "Unknown Location";
    if (position) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
        const data = await res.json();
        address = data.display_name || `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`;
      } catch {
        address = `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`;
      }
    }

    const newPhotosPromises = files.map(async (file) => {
      const compressedDataUrl = await compressImage(file);
      return {
        preview: compressedDataUrl,
        file: file,
        takenAt: new Date(),
        device: getDeviceName(),
        lat: position?.coords.latitude,
        lng: position?.coords.longitude,
        locationName: position ? address : "Unknown Location",
        mapsUrl: position ? `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}` : "#"
      };
    });

    const newPhotos = await Promise.all(newPhotosPromises);
    setPhotos((prev) => [...prev, ...newPhotos]);
    
    // Clear the input so the same files can be selected again if needed
    if (cameraRef.current) {
      cameraRef.current.value = '';
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + 
           date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="p-4 md:p-6 border-b border-[#E2E8F0]">
        <button onClick={onBack} className="flex items-center gap-2 text-[13.5px] font-semibold text-[#64748B] hover:text-[#0F172A] mb-4 transition-colors">
          <ArrowLeft size={16} /> Back to Milestone
        </button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-[22px] md:text-[24px] font-bold text-[#0F172A] mb-1">Review & Submit</h2>
            <p className="text-[14.5px] text-[#64748B]">{milestone.title}</p>
          </div>
          <div className="flex items-center gap-3 text-[13.5px] font-bold overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <div className="flex items-center gap-2 text-[#10B981] whitespace-nowrap">
              <CheckCircle2 size={18} /> Photos & Summary
            </div>
            <div className="w-8 md:w-12 h-px bg-[#E2E8F0] shrink-0"></div>
            <div className="flex items-center gap-2 text-[#0F172A] whitespace-nowrap">
              <div className="w-5 h-5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[11px]">2</div> Review & Submit
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 flex-1 bg-white overflow-y-auto">
        <div className="bg-white p-5 md:p-6 rounded-xl border border-[#E2E8F0] mb-6">
          <h3 className="text-[16px] font-bold text-[#0F172A] mb-5">Submission Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <Flag size={18} className="text-[#10B981] mt-0.5" />
              <div>
                <p className="text-[12.5px] text-[#64748B] mb-0.5">Milestone</p>
                <p className="text-[13.5px] font-bold text-[#0F172A]">{milestone.title}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Building2 size={18} className="text-[#10B981] mt-0.5" />
              <div>
                <p className="text-[12.5px] text-[#64748B] mb-0.5">Project</p>
                <p className="text-[13.5px] font-bold text-[#0F172A]">Victoria Island Duplex</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 size={18} className="text-[#10B981] mt-0.5" />
              <div>
                <p className="text-[12.5px] text-[#64748B] mb-0.5">Submitted by</p>
                <p className="text-[13.5px] font-bold text-[#0F172A]">Emeka Okafor</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar size={18} className="text-[#10B981] mt-0.5" />
              <div>
                <p className="text-[12.5px] text-[#64748B] mb-0.5">Submission Date</p>
                <p className="text-[13.5px] font-bold text-[#0F172A]">25 June 2026, 10:42 AM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-bold text-[#0F172A]">Site Photos ({photos.length})</h3>
            {isMobileDevice ? (
              <button 
                onClick={() => cameraRef.current?.click()}
                className="flex items-center gap-2 bg-[#0F172A] text-white px-4 py-2 rounded-lg text-[13.5px] font-semibold hover:bg-black transition-colors"
              >
                <Camera size={16} /> Add Photos
              </button>
            ) : (
              <span className="text-[12px] text-[#64748B] bg-[#F1F5F9] px-3 py-1.5 rounded-lg font-medium border border-[#E2E8F0]">
                Live capture is required (Mobile device only)
              </span>
            )}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              multiple={false}
              onChange={handleCapture}
              style={{ display: 'none' }}
              ref={cameraRef}
            />
          </div>

          {photos.length === 0 ? (
            <div className="bg-white border border-dashed border-[#E2E8F0] rounded-xl p-10 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#F8FAFC] flex items-center justify-center mb-3">
                <Camera size={24} className="text-[#94A3B8]" />
              </div>
              <p className="text-[14.5px] font-bold text-[#0F172A] mb-1">No photos added yet</p>
              <p className="text-[13.5px] text-[#64748B] max-w-[300px]">Click the button above to capture live site photos or upload from your gallery.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {photos.map((photo, i) => (
                <div key={i} className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
                  <div className="aspect-[4/3] bg-gray-100 relative">
                    <img src={photo.preview} alt="Site capture" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] bg-[#ECFDF5] text-[#059669] px-1.5 py-0.5 rounded font-bold">Verified on site</span>
                    </div>
                    <div className="flex flex-col gap-1.5 mt-2">
                      <div className="text-[11.5px] flex items-start gap-1.5">
                        <span className="shrink-0 text-[#64748B]">🕒</span> 
                        <span className="font-medium text-[#0F172A]">{formatDateTime(photo.takenAt)}</span>
                      </div>
                      <div className="text-[11.5px] flex items-start gap-1.5">
                        <span className="shrink-0 text-[#64748B]">📱</span> 
                        <span className="font-medium text-[#0F172A]">{photo.device}</span>
                      </div>
                      <div className="text-[11.5px] flex items-start gap-1.5">
                        <span className="shrink-0 text-[#64748B]">📍</span> 
                        <span className="font-medium text-[#0F172A]">{photo.locationName}</span>
                      </div>
                      
                      {photo.mapsUrl !== "#" && (
                        <>
                          <a 
                            href={photo.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11.5px] text-[#3B82F6] font-bold hover:underline"
                          >
                            View on Google Maps ↗
                          </a>
                          <div className="mt-1">
                            <iframe 
                              src={`https://maps.google.com/maps?q=${photo.lat},${photo.lng}&hl=en&z=14&output=embed`} 
                              width="100%" 
                              height="80" 
                              style={{ border: 0, borderRadius: '8px' }} 
                              allowFullScreen={false} 
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2 bg-white p-5 md:p-6 rounded-xl border border-[#E2E8F0]">
            <h3 className="text-[16px] font-bold text-[#0F172A] mb-3">Work Summary</h3>
            <textarea
              rows={4}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Describe the work completed, any issues faced, and next steps..."
              className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#10B981] text-[14px] text-[#0F172A] resize-none"
            ></textarea>
          </div>
          
          <div className="bg-white p-5 md:p-6 rounded-xl border border-[#E2E8F0]">
            <h3 className="text-[16px] font-bold text-[#0F172A] mb-4">Verification Checklist</h3>
            <div className="flex flex-col gap-3">
              {[
                { label: "Live photos captured", active: photos.length > 0 },
                { label: "Location captured", active: photos.some(p => p.lat) },
                { label: "Timestamp captured", active: photos.length > 0 },
                { label: "Work summary added", active: summary.length > 0 }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[13.5px] text-[#475569]">
                    <CheckCircle2 size={16} className={item.active ? "text-[#10B981]" : "text-[#CBD5E1]"} />
                    {item.label}
                  </div>
                  {item.active && <span className="text-[11.5px] font-bold text-[#10B981]">Verified</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-xl border border-[#E2E8F0] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#ECFDF5] flex items-center justify-center shrink-0">
              <FileCheck2 size={20} className="text-[#10B981]" />
            </div>
            <div>
              <h4 className="text-[15px] font-bold text-[#0F172A] mb-1">Confirm Submission</h4>
              <p className="text-[13px] text-[#64748B] mb-3 max-w-[400px]">
                I confirm that the above information is accurate and the photos were taken on-site for this milestone.
              </p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-[#E2E8F0] text-[#10B981] focus:ring-[#10B981]" />
                <span className="text-[13.5px] font-bold text-[#0F172A]">I confirm</span>
              </label>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
            <button className="flex-1 sm:flex-none justify-center px-5 py-2.5 rounded-lg border border-[#E2E8F0] text-[#0F172A] text-[14px] font-bold hover:bg-[#F8FAFC] transition-colors">
              Save Draft
            </button>
            <button onClick={onComplete} className="flex-1 sm:flex-none justify-center bg-[#10B981] hover:bg-[#059669] text-white px-6 py-2.5 rounded-lg text-[14px] font-bold transition-colors">
              Submit Milestone
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
