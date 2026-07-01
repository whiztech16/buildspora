import { X, Check, Clock } from "lucide-react";

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: "success" | "failed" | "pending";
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function StatusModal({
  isOpen,
  onClose,
  status,
  title,
  description,
  actionLabel = "Done",
  onAction
}: StatusModalProps) {
  if (!isOpen) return null;

  const handleAction = () => {
    if (onAction) onAction();
    else onClose();
  };

  const getIcon = () => {
    switch (status) {
      case "success":
        return (
          <div className="w-[48px] h-[48px] rounded-full bg-[#DCFCE7] flex items-center justify-center mb-4">
            <Check size={24} className="text-[#16A34A]" strokeWidth={3} />
          </div>
        );
      case "failed":
        return (
          <div className="w-[48px] h-[48px] rounded-full bg-[#FEE2E2] flex items-center justify-center mb-4">
            <X size={24} className="text-[#EF4444]" strokeWidth={3} />
          </div>
        );
      case "pending":
        return (
          <div className="w-[48px] h-[48px] rounded-full bg-[#FEF3C7] flex items-center justify-center mb-4">
            <Clock size={24} className="text-[#D97706]" strokeWidth={3} />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-[1000] p-4 flex items-center justify-center backdrop-blur-[2px]">
      <div className="bg-white rounded-[20px] w-full max-w-[400px] p-8 shadow-xl relative flex flex-col items-center text-center">
        
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 p-1 hover:bg-gray-100 rounded-md transition-colors"
        >
          <X size={18} className="text-gray-500" />
        </button>

        {getIcon()}

        <h3 className="text-[18px] font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-[14px] text-gray-600 leading-relaxed mb-8 max-w-[280px]">
          {description}
        </p>

        <button
          onClick={handleAction}
          className="w-auto min-w-[160px] px-6 py-2.5 rounded-full border border-gray-300 text-[14px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
