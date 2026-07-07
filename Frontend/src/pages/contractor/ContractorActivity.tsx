import { useState, useEffect, useCallback } from "react";
import { MapPin, LogIn as LogInIcon, LogOut as LogOutIcon, Clock, Loader2 } from "lucide-react";
import { api } from "../../lib/api";

interface ActivityEntry {
  milestoneId: string;
  milestoneName: string;
  checkInTime: string;
  checkInLocationName: string | null;
  checkInMapsUrl?: string;
  checkOutTime: string | null;
  checkOutLocationName: string | null;
  checkOutMapsUrl?: string;
}

interface ActiveMilestone {
  id: string;
  name: string;
}

/** Returns true if the string looks like raw "lat, lng" fallback coordinates */
const isCoordString = (s: string | null): boolean => {
  if (!s) return false;
  return /^-?\d{1,3}\.\d+,?\s*-?\d{1,3}\.\d+$/.test(s.trim());
};

const getGPS = () =>
  new Promise<GeolocationPosition>((res, rej) =>
    navigator.geolocation.getCurrentPosition(res, rej, {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0,
    })
  );

/**
 * Reverse geocode using two services:
 * 1. Nominatim (OpenStreetMap) — best detail
 * 2. BigDataCloud — no API key, fast Nigerian coverage
 * Falls back to coordinate string only if both fail.
 */
const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  // Try Nominatim first with proper headers
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=16&addressdetails=1`,
      {
        headers: {
          "Accept-Language": "en",
          "User-Agent": "BuildSpora-App/1.0",
        },
      }
    );
    if (r.ok) {
      const d = await r.json();
      if (d && d.address) {
        const a = d.address;
        // Build a human-readable string: road / suburb / city / state
        const parts = [
          a.road || a.pedestrian || a.footway,
          a.suburb || a.neighbourhood || a.quarter,
          a.city || a.town || a.village || a.municipality,
          a.state,
        ].filter(Boolean);
        if (parts.length >= 2) return parts.join(", ");
      }
      // Fallback: first 3 segments of display_name
      if (d?.display_name) {
        return d.display_name.split(",").slice(0, 3).join(",").trim();
      }
    }
  } catch {
    // Nominatim failed — try second service
  }

  // Try BigDataCloud (free, no key, good African coverage)
  try {
    const r2 = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    );
    if (r2.ok) {
      const d2 = await r2.json();
      const parts2 = [
        d2.locality,
        d2.principalSubdivision,
        d2.countryName,
      ].filter(Boolean);
      if (parts2.length > 0) return parts2.join(", ");
    }
  } catch {
    // Both failed
  }

  return `${lat.toFixed(6)},${lng.toFixed(6)}`;
};

export default function ContractorActivity() {
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Active project / milestone for check-in/out
  const [activeMilestone, setActiveMilestone] = useState<ActiveMilestone | null>(null);

  // Action states
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const loadActivity = useCallback(async () => {
    try {
      setLoadError(null);
      const projectsRes = await api.get<{ success: boolean; projects: { id: string }[] }>(
        "/api/projects"
      );
      const project = projectsRes.projects[0];
      if (!project) {
        setIsLoading(false);
        return;
      }

      const detailRes = await api.get<{
        success: boolean;
        milestones: { id: string; name: string; status: string }[];
      }>(`/api/projects/${project.id}`);

      // Identify active milestone (first non-approved)
      const cur = detailRes.milestones.find((m) => m.status !== "approved") || null;
      setActiveMilestone(cur ? { id: cur.id, name: cur.name } : null);

      const activityItems: ActivityEntry[] = [];
      for (const m of detailRes.milestones) {
        try {
          const detail = await api.get<{
            success: boolean;
            milestone: { checkIns: ActivityEntry[] };
          }>(`/api/milestones/${m.id}`);
          if (detail?.milestone?.checkIns) {
            for (const ci of detail.milestone.checkIns) {
              activityItems.push({ ...ci, milestoneId: m.id, milestoneName: m.name });
            }
          }
        } catch (err: any) {
          console.error(`Failed to load check-ins for milestone ${m.id}`, err);
        }
      }

      activityItems.sort(
        (a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime()
      );
      setActivity(activityItems);
    } catch (err: any) {
      console.error("Activity load error:", err);
      setLoadError(
        err.message || "Failed to load activity. Make sure the backend is running."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActivity();
  }, [loadActivity]);

  const handleCheckIn = async () => {
    if (!activeMilestone) return;
    setIsCheckingIn(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      const pos = await getGPS();
      const locationName = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
      await api.post(`/api/milestones/${activeMilestone.id}/checkin`, {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        locationName,
      });
      setActionSuccess(`Checked in at ${locationName}`);
      setIsLoading(true);
      await loadActivity();
    } catch (err: any) {
      setActionError(
        err instanceof GeolocationPositionError
          ? "Location access denied. Please enable location in your browser."
          : err.message || "Check-in failed."
      );
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    if (!activeMilestone) return;
    setIsCheckingOut(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      const pos = await getGPS();
      const locationName = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
      await api.post(`/api/milestones/${activeMilestone.id}/checkout`, {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        locationName,
      });
      setActionSuccess(`Checked out from ${locationName}`);
      setIsLoading(true);
      await loadActivity();
    } catch (err: any) {
      setActionError(
        err instanceof GeolocationPositionError
          ? "Location access denied. Please enable location in your browser."
          : err.message || "Check-out failed."
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  const fmtTimeFull = (iso: string) =>
    new Date(iso).toLocaleString("en-NG", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  /**
   * Prefer the stored mapsUrl from the DB (has the exact GPS point).
   * If not available, build a proper lat,lng query URL.
   * Never use location name as a text search — Google Maps shows raw coords.
   */
  const buildMapsUrl = (
    storedUrl: string | undefined | null,
    locationName: string | null
  ): string | null => {
    if (storedUrl) return storedUrl;
    // If locationName is itself a coord string, extract and use as lat,lng
    if (locationName && isCoordString(locationName)) {
      const [latS, lngS] = locationName.split(/[,\s]+/);
      return `https://www.google.com/maps/search/?api=1&query=${latS},${lngS}`;
    }
    // Otherwise search by name (only for real place names)
    if (locationName) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName)}`;
    return null;
  };

  return (
    <div
      className="bg-white rounded-[12px] border border-[#E2E8F0] overflow-hidden min-h-[600px] flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Header + action buttons */}
      <div className="p-4 md:p-6 border-b border-[#E2E8F0]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-[20px] font-bold text-[#0F172A] mb-1">Activity Log</h2>
            <p className="text-[13.5px] text-[#475569]">
              History of your site visits, check-ins, and check-outs.
            </p>
          </div>

          {activeMilestone && (
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={handleCheckIn}
                disabled={isCheckingIn || isCheckingOut}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#10B981] text-white text-[13.5px] font-semibold hover:bg-[#059669] transition-colors shadow-sm disabled:opacity-60"
              >
                {isCheckingIn ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <LogInIcon size={15} />
                )}
                {isCheckingIn ? "Getting location…" : "Check In"}
              </button>
              <button
                onClick={handleCheckOut}
                disabled={isCheckingIn || isCheckingOut}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0F172A] text-white text-[13.5px] font-semibold hover:bg-black transition-colors shadow-sm disabled:opacity-60"
              >
                {isCheckingOut ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <LogOutIcon size={15} />
                )}
                {isCheckingOut ? "Getting location…" : "Check Out"}
              </button>
            </div>
          )}
        </div>

        {activeMilestone && (
          <p className="text-[12px] text-[#64748B] mt-3">
            Active milestone:{" "}
            <span className="font-semibold text-[#10B981]">{activeMilestone.name}</span>
          </p>
        )}

        {actionSuccess && (
          <div className="mt-3 text-[13px] font-semibold text-[#059669] bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg px-4 py-2">
            ✓ {actionSuccess}
          </div>
        )}
        {actionError && (
          <div className="mt-3 text-[13px] font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            {actionError}
          </div>
        )}
      </div>

      {/* Activity list */}
      <div className="p-4 md:p-6 flex-1">
        {loadError ? (
          <div className="text-center text-red-500 font-medium text-[14px] bg-red-50 p-4 rounded-xl border border-red-200">
            {loadError}
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center gap-2 text-[#64748B] text-[14px] py-16">
            <Loader2 size={18} className="animate-spin" />
            Loading activity…
          </div>
        ) : activity.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-4">
              <Clock size={24} className="text-[#94A3B8]" />
            </div>
            <h3 className="text-[15px] font-bold text-[#0F172A] mb-1">No activity yet</h3>
            <p className="text-[13.5px] text-[#64748B] max-w-[260px]">
              Use the Check In button above when you arrive on site. Your activity log will appear here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {activity.map((entry, i) => (
              <div
                key={`${entry.milestoneId}-${i}`}
                className="border border-[#E2E8F0] rounded-xl p-5 hover:border-[#CBD5E1] transition-colors"
              >
                <h3 className="text-[15.5px] font-bold text-[#0F172A] mb-4 pb-3 border-b border-[#F1F5F9]">
                  {entry.milestoneName}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Check In */}
                  <div className="flex items-start gap-3 bg-[#F0FDF4] border border-[#BBF7D0] p-4 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center shrink-0">
                      <LogInIcon size={15} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-[#059669] uppercase tracking-wider mb-1">
                        Checked In
                      </p>
                      <p className="text-[13.5px] font-semibold text-[#0F172A] flex items-start gap-1.5">
                        <MapPin size={14} className="shrink-0 mt-0.5 text-[#10B981]" />
                        <span>
                          {isCoordString(entry.checkInLocationName)
                            ? "Location captured"
                            : entry.checkInLocationName || "Location captured"}
                        </span>
                      </p>
                      <p className="text-[12px] text-[#64748B] mt-1 pl-5">
                        {fmtTimeFull(entry.checkInTime)}
                      </p>
                      {(() => {
                        const url = buildMapsUrl(entry.checkInMapsUrl, entry.checkInLocationName);
                        return url ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10.5px] text-[#059669] font-semibold hover:underline pl-5 block mt-0.5"
                          >
                            View on map ↗
                          </a>
                        ) : null;
                      })()}
                    </div>
                  </div>

                  {/* Check Out */}
                  {entry.checkOutTime ? (
                    <div className="flex items-start gap-3 bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-[#0F172A] flex items-center justify-center shrink-0">
                        <LogOutIcon size={15} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-[#0F172A] uppercase tracking-wider mb-1">
                          Checked Out
                        </p>
                        <p className="text-[13.5px] font-semibold text-[#0F172A] flex items-start gap-1.5">
                          <MapPin size={14} className="shrink-0 mt-0.5 text-[#475569]" />
                          <span>
                            {isCoordString(entry.checkOutLocationName)
                              ? "Location captured"
                              : entry.checkOutLocationName || "Location captured"}
                          </span>
                        </p>
                        <p className="text-[12px] text-[#64748B] mt-1 pl-5">
                          {fmtTimeFull(entry.checkOutTime)}
                        </p>
                        {(() => {
                          const url = buildMapsUrl(entry.checkOutMapsUrl, entry.checkOutLocationName);
                          return url ? (
                            <a
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10.5px] text-[#64748B] font-semibold hover:underline pl-5 block mt-0.5"
                            >
                              View on map ↗
                            </a>
                          ) : null;
                        })()}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 bg-[#FFFBEB] border border-dashed border-[#FDE68A] p-4 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-[#FDE68A] flex items-center justify-center shrink-0">
                        <Clock size={15} className="text-[#D97706]" />
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-[#D97706] uppercase tracking-wide mb-0.5">
                          On Site
                        </p>
                        <p className="text-[13px] font-medium text-[#92400E]">
                          Currently active — not yet checked out
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
