import { Check } from "lucide-react";

const FONT = "'Inter', sans-serif";

interface AgreeCheckboxesProps {
  agreed: boolean;
  onToggle: (v: boolean) => void;
  /** If true, show a red warning when not ticked */
  showError?: boolean;
}

/**
 * Reusable Terms & Conditions + Privacy Policy checkbox block.
 * Links open in a new tab so the user doesn't lose their signup progress.
 * The parent is responsible for blocking submission when `agreed` is false.
 */
export default function AgreeCheckboxes({ agreed, onToggle, showError }: AgreeCheckboxesProps) {
  return (
    <div className="space-y-1">
      <label className="flex items-start gap-3 cursor-pointer select-none">
        {/* Custom checkbox */}
        <div
          role="checkbox"
          aria-checked={agreed}
          tabIndex={0}
          onClick={() => onToggle(!agreed)}
          onKeyDown={e => e.key === " " && onToggle(!agreed)}
          className={
            "mt-0.5 w-[18px] h-[18px] shrink-0 rounded border-2 flex items-center justify-center transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#059669]/30 " +
            (agreed
              ? "bg-[#059669] border-[#059669]"
              : showError
              ? "border-red-400 bg-white"
              : "border-[#CBD5E1] bg-white")
          }
        >
          {agreed && <Check size={12} strokeWidth={3} className="text-white" />}
        </div>

        {/* Label text */}
        <span className="text-[13.5px] text-[#475569] leading-snug" style={{ fontFamily: FONT }}>
          I have read and agree to the{" "}
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#059669] font-semibold hover:underline"
            onClick={e => e.stopPropagation()}
          >
            Terms &amp; Conditions
          </a>
          {" "}and the{" "}
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#059669] font-semibold hover:underline"
            onClick={e => e.stopPropagation()}
          >
            Privacy Policy
          </a>
          .
        </span>
      </label>

      {showError && !agreed && (
        <p className="text-[12px] text-red-500 pl-[30px]" style={{ fontFamily: FONT }}>
          You must accept the Terms &amp; Conditions to continue.
        </p>
      )}
    </div>
  );
}
