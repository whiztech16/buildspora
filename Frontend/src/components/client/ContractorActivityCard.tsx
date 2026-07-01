import { CheckCircle2, Image as ImageIcon, Clock } from "lucide-react";

export default function ContractorActivityCard() {
  return (
    <div className="bg-white rounded-[16px] border border-gray-100 p-6 sm:p-8 shadow-sm">
      <h2 className="text-[15px] font-bold text-gray-900 mb-6">Contractor Activity</h2>
      
      <div className="relative pl-4 border-l-[1.5px] border-gray-100 ml-4 mb-2 flex flex-col gap-8">
        <div className="relative">
          <div className="absolute -left-[30px] top-0.5 w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#16A34A]">
            <CheckCircle2 size={24} className="fill-[#DCFCE7]" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-gray-900 mb-0.5">Checked in</h3>
            <p className="text-[13px] text-gray-500">9:45 AM - Lekki, Lagos</p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-[28px] top-0.5 w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#16A34A]">
            <ImageIcon size={20} strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-gray-900 mb-0.5">3 photos uploaded</h3>
            <p className="text-[13px] text-gray-500">11:15 AM</p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-[30px] top-0.5 w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#16A34A]">
            <CheckCircle2 size={24} className="fill-[#DCFCE7]" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-gray-900 mb-0.5">Checked out</h3>
            <p className="text-[13px] text-gray-500">1:30 PM</p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-[28px] top-0.5 w-6 h-6 rounded-full bg-white flex items-center justify-center text-gray-400">
            <Clock size={20} strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-gray-900 mb-0.5">Time on site</h3>
            <p className="text-[13px] text-gray-500">3hrs 45mins</p>
          </div>
        </div>
      </div>
    </div>
  );
}
