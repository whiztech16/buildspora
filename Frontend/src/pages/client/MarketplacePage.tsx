import { Search, MessageSquare, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components
export const MATERIALS = [
  { id: 1, name: "Dangote Cement 50kg", price: "₦7,000 / bag", listings: "50+", img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=400&auto=format&fit=crop" },
  { id: 2, name: "6 Inches Concrete Block", price: "₦250 / piece", listings: "40+", img: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=400&auto=format&fit=crop" },
  { id: 3, name: "Long Span Roofing Sheet", price: "₦6,500 / piece", listings: "32+", img: "https://images.unsplash.com/photo-1628186178306-6966687dc9ec?q=80&w=400&auto=format&fit=crop" },
  { id: 4, name: "Electrical Wire (2.5mm)", price: "₦350 / meter", listings: "45+", img: "https://images.unsplash.com/photo-1558442074-3c19857bc1dc?q=80&w=400&auto=format&fit=crop" },
  { id: 5, name: "12mm Steel Rod", price: "₦7,200 / piece", listings: "38+", img: "https://images.unsplash.com/photo-1501719539451-126fd8b2515c?q=80&w=400&auto=format&fit=crop" },
  { id: 6, name: "4\" PVC Pipe", price: "₦4,500 / piece", listings: "28+", img: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=400&auto=format&fit=crop" },
  { id: 7, name: "60x60 Floor Tile", price: "₦3,800 / piece", listings: "22+", img: "https://images.unsplash.com/photo-1581428982868-e410dd047a90?q=80&w=400&auto=format&fit=crop" },
  { id: 8, name: "Security Door", price: "₦45,000 / piece", listings: "18+", img: "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?q=80&w=400&auto=format&fit=crop" }
];

export default function Marketplace() {
  const navigate = useNavigate();

  const goToTalents = () => {
    navigate('/dashboard/client', { state: { activeTab: 'talents' } });
  };

  return (
    <div className="flex flex-col animate-fade-in pb-10">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-[#0F172A] leading-tight">Marketplace</h1>
          <p className="text-[14px] text-[#64748B] mt-1">Find quality materials, equipment, services and talents for your projects.</p>
        </div>
        <div className="flex items-center gap-4 self-start sm:self-auto">
          <button className="p-2 text-gray-500 hover:text-gray-900 transition-colors">
            <MessageSquare size={22} strokeWidth={1.8} />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-900 transition-colors relative">
            <Bell size={22} strokeWidth={1.8} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
          </button>
        </div>
      </div>

      {/* Search and Tabs Row */}
      <div className="flex flex-col lg:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search materials, services, equipment, or talents..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full text-[14px] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all shadow-sm"
          />
        </div>
        
        <div className="flex gap-3 overflow-x-auto hide-scrollbar shrink-0">
          <button className="flex items-center justify-center px-6 py-3 bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7] rounded-full text-[14px] font-semibold min-w-[120px] transition-colors whitespace-nowrap">
            Materials
          </button>
          <button 
            onClick={goToTalents}
            className="flex items-center justify-center px-6 py-3 bg-white text-[#0F172A] border border-gray-200 hover:bg-gray-50 rounded-full text-[14px] font-semibold min-w-[120px] transition-colors whitespace-nowrap"
          >
            Talents
          </button>
          <button className="flex items-center justify-center px-6 py-3 bg-white text-[#0F172A] border border-gray-200 hover:bg-gray-50 rounded-full text-[14px] font-semibold min-w-[120px] transition-colors whitespace-nowrap">
            Suppliers
          </button>
        </div>
      </div>

      {/* Popular Materials Header */}
      <div className="mb-6">
        <h2 className="text-[18px] font-bold text-[#0F172A]">Popular Materials</h2>
        <p className="text-[14px] text-gray-500 mt-0.5">Browse top construction materials.</p>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 mb-12">
        {MATERIALS.map(item => (
          <div 
            key={item.id} 
            onClick={() => navigate('/dashboard/client/marketplace/product/' + item.id)}
            className="bg-white border border-gray-200 rounded-none overflow-hidden hover:shadow-md transition-shadow group cursor-pointer"
          >
            <div className="h-[150px] bg-gray-100 overflow-hidden relative">
              <img 
                src={item.img} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
            <div className="p-4 sm:p-5">
              <h3 className="text-[15px] font-bold text-[#0F172A] mb-1.5 line-clamp-1">{item.name}</h3>
              <p className="text-[14px] font-bold text-[#16A34A] mb-3">{item.price}</p>
              <p className="text-[13px] text-gray-500 font-medium">{item.listings} listings</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA Banner */}
      <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h3 className="text-[16px] sm:text-[18px] font-bold text-[#0F172A] mb-1">Need skilled professionals?</h3>
          <p className="text-[13.5px] sm:text-[14px] text-[#475569]">Hire trusted talents for your construction project.</p>
        </div>
        <button 
          onClick={goToTalents}
          className="bg-[#16A34A] text-white px-6 py-3 rounded-lg text-[14px] font-semibold hover:bg-[#15803d] transition-colors whitespace-nowrap w-full sm:w-auto"
        >
          Hire a Talent
        </button>
      </div>

    </div>
  );
}
