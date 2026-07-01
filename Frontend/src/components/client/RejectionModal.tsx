import { X } from "lucide-react";
import { useState } from "react";

interface RejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: (reason: string) => void;
}

export default function RejectionModal({ isOpen, onClose, onReject }: RejectionModalProps) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/55 z-[1000] p-4 flex items-center justify-center backdrop-blur-[2px]">
      <div className="bg-white rounded-[16px] w-full max-w-[420px] p-7 shadow-xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-[17px] font-bold text-gray-900 mb-1">Reject Milestone</h3>
            <p className="text-[13px] text-gray-500">Provide feedback for the contractor</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-md">
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        
        <div className="mb-6">
          <label className="block text-[13px] font-medium text-gray-700 mb-2">
            Reason for rejection
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., The finishing on the east wall is not smooth enough..."
            className="w-full border border-gray-200 rounded-lg p-3 text-[14px] outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] min-h-[120px] resize-none"
          ></textarea>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-lg border border-gray-200 text-gray-700 font-semibold text-[14px] hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onReject(reason)}
            disabled={!reason.trim()}
            className="flex-1 py-2.5 px-4 rounded-lg bg-red-500 text-white font-semibold text-[14px] hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
}
