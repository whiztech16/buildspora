
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Search } from "lucide-react";

const FONT = "'Inter', sans-serif";

interface SearchableSelectProps {
  id: string;
  label: string;
  placeholder?: string;
  options: string[];
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

/**
 * Drop-in replacement for <select> across all BuildSpora forms.
 * Supports keyboard-friendly search filtering.
 */
export default function SearchableSelect({
  id,
  label,
  placeholder = "Search or select…",
  options,
  required,
  value: controlled,
  onChange,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(controlled ?? "");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Sync controlled value
  useEffect(() => {
    if (controlled !== undefined) setSelected(controlled);
  }, [controlled]);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(query.toLowerCase())
  );

  const pick = (opt: string) => {
    setSelected(opt);
    onChange?.(opt);
    setOpen(false);
    setQuery("");
  };

  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div ref={containerRef} className="relative" style={{ fontFamily: FONT }}>
      {/* Label */}
      <label
        htmlFor={id}
        className="block text-[13.5px] font-semibold text-[#0F172A] mb-1.5"
        style={{ fontFamily: FONT }}
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {/* Trigger */}
      <button
        id={id}
        type="button"
        onClick={handleOpen}
        className={
          "w-full h-[46px] px-4 rounded-lg border text-[14px] text-left flex items-center justify-between transition-all " +
          (open
            ? "border-[#059669] ring-2 ring-[#059669]/10 bg-white"
            : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]")
        }
      >
        <span className={selected ? "text-[#0F172A]" : "text-[#CBD5E1]"}>
          {selected || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={"text-[#94A3B8] transition-transform " + (open ? "rotate-180" : "")}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-[#E2E8F0] rounded-xl shadow-lg overflow-hidden">
          {/* Search box */}
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[#F1F5F9]">
            <Search size={14} className="text-[#94A3B8] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="flex-1 text-[13.5px] text-[#0F172A] placeholder-[#CBD5E1] outline-none bg-transparent"
              style={{ fontFamily: FONT }}
            />
          </div>

          {/* Options list */}
          <ul className="max-h-[220px] overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map((opt) => (
                <li key={opt}>
                  <button
                    type="button"
                    onClick={() => pick(opt)}
                    className={
                      "w-full text-left px-4 py-2.5 text-[13.5px] flex items-center justify-between transition-colors " +
                      (opt === selected
                        ? "bg-[#F0FDF4] text-[#059669] font-semibold"
                        : "text-[#0F172A] hover:bg-[#F8FAFC]")
                    }
                    style={{ fontFamily: FONT }}
                  >
                    {opt}
                    {opt === selected && (
                      <Check size={14} className="text-[#059669] shrink-0" />
                    )}
                  </button>
                </li>
              ))
            ) : (
              <li className="px-4 py-4 text-[13px] text-[#94A3B8] text-center">
                No results found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
