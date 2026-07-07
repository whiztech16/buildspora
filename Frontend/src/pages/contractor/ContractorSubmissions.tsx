import { useState, useEffect } from "react";
import { CheckCircle2, Clock } from "lucide-react";
import { api } from "../../lib/api";

interface SubmittedMilestone {
  id: string;
  name: string;
  status: string;
  images?: { storageUrl: string }[];
  summary?: string;
}

export default function ContractorSubmissions() {
  const [submissions, setSubmissions] = useState<SubmittedMilestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const projectsRes = await api.get<{ success: boolean; projects: { id: string }[] }>('/api/projects');
        const project = projectsRes.projects[0];
        if (!project) return;

        const detailRes = await api.get<{ success: boolean; milestones: (SubmittedMilestone & { id: string; name: string })[] }>(`/api/projects/${project.id}`);
        const relevant = detailRes.milestones.filter(m => m.status === 'submitted' || m.status === 'approved' || m.status === 'rejected');

        // Fetch details (images and summary) for each submitted milestone
        const withDetails = await Promise.all(relevant.map(async (m) => {
          try {
            const detail = await api.get<{ success: boolean; milestone: { images: { storageUrl: string }[], submissionSummary?: string } }>(`/api/milestones/${m.id}`);
            return { ...m, images: detail.milestone.images || [], summary: detail.milestone.submissionSummary };
          } catch { return m; }
        }));
        setSubmissions(withDetails);
      } catch {
        // silently fail
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="bg-white rounded-[12px] border border-[#E2E8F0] overflow-hidden min-h-[600px] flex flex-col">
      <div className="p-4 md:p-6 border-b border-[#E2E8F0]">
        <h2 className="text-[20px] font-bold text-[#0F172A] mb-1">Submissions</h2>
        <p className="text-[13.5px] text-[#475569]">View the photos and summaries you submitted for completed milestones.</p>
      </div>

      <div className="p-4 md:p-6 flex-1">
        {isLoading ? (
          <div className="text-center text-[#64748B] text-[14px]">Loading submissions...</div>
        ) : submissions.length === 0 ? (
          <div className="text-center text-[#64748B] text-[14px]">You haven't submitted any milestones yet.</div>
        ) : (
          <div className="flex flex-col gap-6">
            {submissions.map((m) => (
              <div key={m.id} className="border border-[#E2E8F0] rounded-xl p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-[16px] font-bold text-[#0F172A] mb-1">{m.name}</h3>
                    <span className={`text-[12px] font-bold px-2.5 py-1 rounded-md inline-flex items-center gap-1.5 ${
                      m.status === 'approved' ? 'bg-[#ECFDF5] text-[#059669]' :
                      m.status === 'rejected' ? 'bg-[#FEF2F2] text-[#DC2626]' :
                      'bg-[#EFF6FF] text-[#3B82F6]'
                    }`}>
                      {m.status === 'approved' ? <><CheckCircle2 size={14} /> Approved</> :
                       m.status === 'rejected' ? 'Rejected' :
                       <><Clock size={14} /> In Review</>}
                    </span>
                  </div>
                </div>

                {m.summary && (
                  <div className="mb-4">
                    <p className="text-[13px] font-semibold text-[#0F172A] mb-1.5">Summary</p>
                    <p className="text-[13.5px] text-[#475569] leading-relaxed bg-[#F8FAFC] p-4 rounded-xl border border-[#F1F5F9] whitespace-pre-wrap">
                      {m.summary}
                    </p>
                  </div>
                )}

                {m.images && m.images.length > 0 && (
                  <div>
                    <p className="text-[13px] font-semibold text-[#0F172A] mb-2.5">Attached Photos</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {m.images.map((img, i) => (
                        <a key={i} href={img.storageUrl} target="_blank" rel="noreferrer" className="block aspect-square rounded-xl overflow-hidden border border-[#E2E8F0] hover:border-[#10B981] transition-colors">
                          <img src={img.storageUrl} alt={`Photo ${i+1}`} className="w-full h-full object-cover" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
