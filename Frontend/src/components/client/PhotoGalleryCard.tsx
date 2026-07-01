import { ArrowLeft } from "lucide-react";

export default function PhotoGalleryCard() {
  return (
    <div className="bg-white rounded-[16px] border border-gray-100 p-6 sm:p-8 shadow-sm mt-8">
      <h2 className="text-[15px] font-bold text-gray-900 mb-4">Site Photos (3)</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 mb-2">
        <img src="https://images.unsplash.com/photo-1541888086425-d81bb19240f5?w=400&q=80" alt="Construction site 1" className="w-[140px] h-[140px] object-cover rounded-[12px] border border-gray-200" />
        <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80" alt="Construction site 2" className="w-[140px] h-[140px] object-cover rounded-[12px] border border-gray-200" />
        <img src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=80" alt="Construction site 3" className="w-[140px] h-[140px] object-cover rounded-[12px] border border-gray-200" />
      </div>
      <button className="text-[13.5px] font-bold text-[#16A34A] hover:underline flex items-center gap-1">
        View all photos <ArrowLeft className="rotate-180" size={14} />
      </button>
    </div>
  );
}
