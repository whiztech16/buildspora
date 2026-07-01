import { ChevronLeft, ChevronRight } from "lucide-react";

const FONT = "'Inter', sans-serif";

interface State {
  label: string;
  description: string;
}

interface PreviewToggleProps {
  states: State[];
  current: number;
  onChange: (index: number) => void;
}

/**
 * Dev-only preview bar to switch between UI states (e.g. Empty ↔ Active).
 * Remove or hide behind an env flag before going to production.
 */
export default function PreviewToggle({ states, current, onChange }: PreviewToggleProps) {
  const prev = () => onChange(current === 0 ? states.length - 1 : current - 1);
  const next = () => onChange(current === states.length - 1 ? 0 : current + 1);

  return (
    <div
      className="flex items-center justify-between px-4 py-2 mb-6 rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAFC]"
      style={{ fontFamily: FONT }}
    >
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest">Preview</span>
        <span className="w-px h-3.5 bg-[#E2E8F0]" />
        <span className="text-[12.5px] font-bold text-[#475569]">{states[current].label}</span>
        <span className="text-[12px] text-[#94A3B8]">— {states[current].description}</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={prev}
          className="w-7 h-7 rounded-md flex items-center justify-center text-[#64748B] hover:bg-[#E2E8F0] transition-colors"
          title="Previous state"
        >
          <ChevronLeft size={15} />
        </button>
        <div className="flex items-center gap-1 px-1">
          {states.map((_, i) => (
            <button
              key={i}
              onClick={() => onChange(i)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === current ? "bg-[#059669]" : "bg-[#CBD5E1] hover:bg-[#94A3B8]"
              }`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="w-7 h-7 rounded-md flex items-center justify-center text-[#64748B] hover:bg-[#E2E8F0] transition-colors"
          title="Next state"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
