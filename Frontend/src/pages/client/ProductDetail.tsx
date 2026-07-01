import { useState } from "react";
import { MessageSquare, Bell, ShoppingCart, Heart, MapPin, ChevronDown, ChevronRight, FileText, Store, Star, Menu, Package } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import ClientSidebar from "../../components/layout/Sidebar";
import { MATERIALS } from "./MarketplacePage";

const FONT = "'Inter', sans-serif";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [quantity, setQuantity] = useState(50);
  const [imgError, setImgError] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const product = MATERIALS.find((m) => m.id === Number(id)) || MATERIALS[0];
  const price = Number(product.price.replace(/\D/g, ""));
  const unit = product.price.includes("/") ? "/" + product.price.split("/")[1] : "";

  const desktopMarginClass = desktopOpen ? "md:ml-[240px]" : "md:ml-[68px]";

  const toggleAccordion = (key: string) =>
    setOpenAccordion((prev) => (prev === key ? null : key));

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: FONT }}>
      <ClientSidebar
        active="marketplace"
        setActive={() => {}}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        desktopOpen={desktopOpen}
        setDesktopOpen={setDesktopOpen}
      />

      <main className={`min-h-screen transition-all duration-300 ease-in-out flex flex-col ${desktopMarginClass}`}>
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between px-4 sm:px-6 h-[64px] border-b border-[#E5E7EB] shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 -ml-2 rounded-xl hover:bg-[#F3F4F6] text-[#0F172A] cursor-pointer"
            >
              <Menu size={20} strokeWidth={1.8} />
            </button>
            <span className="text-[18px] font-bold tracking-tight select-none">
              <span style={{ color: "#0F172A" }}>Build</span>
              <span style={{ color: "#059669" }}>Spora</span>
            </span>
          </div>
          <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 relative">
            <ShoppingCart size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </div>

        <div className="w-full flex-1 flex flex-col items-center pt-6 pb-16 sm:pb-24">
          {/* Breadcrumbs + top-right actions */}
          <div className="w-full px-4 sm:px-6 md:px-10 max-w-[1200px] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-1.5 text-[13.5px] font-medium text-gray-500">
              <span
                className="cursor-pointer hover:text-gray-900"
                onClick={() => navigate("/dashboard/client", { state: { activeTab: "marketplace" } })}
              >
                Marketplace
              </span>
              <ChevronRight className="text-gray-400" size={16} />
              <span className="cursor-pointer hover:text-gray-900">Materials</span>
              <ChevronRight className="text-gray-400" size={16} />
              <span className="cursor-pointer hover:text-gray-900">Cement</span>
              <ChevronRight className="text-gray-400" size={16} />
              <span className="text-gray-900 font-semibold">{product.name}</span>
            </div>

            <div className="hidden sm:flex items-center gap-5">
              <button className="text-gray-500 hover:text-gray-900 transition-colors">
                <MessageSquare size={22} strokeWidth={1.8} />
              </button>
              <button className="text-gray-500 hover:text-gray-900 transition-colors relative">
                <Bell size={22} strokeWidth={1.8} />
                <span className="absolute -top-1 -right-1 w-[16px] h-[16px] bg-[#16A34A] flex items-center justify-center rounded-full text-[10px] font-bold text-white border border-white">
                  3
                </span>
              </button>
              <button className="flex items-center gap-2 px-5 py-2 border border-gray-200 bg-white rounded-full text-[14px] font-bold text-gray-700 hover:bg-gray-50 transition-colors ml-2">
                <ShoppingCart size={18} /> Cart (2)
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-full px-4 sm:px-6 md:px-10 max-w-[1000px] mx-auto">
            {/* Main Product Layout */}
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 mb-12">
              {/* Left: Images */}
              <div className="w-full md:w-[340px] shrink-0">
                <div className="bg-[#F8FAFC] rounded-2xl aspect-square mb-4 flex items-center justify-center overflow-hidden border border-gray-100 p-2">
                  {!imgError ? (
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-full h-full object-contain mix-blend-multiply"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-300">
                      <Package size={48} strokeWidth={1.5} />
                      <span className="text-[12px] font-medium mt-2">No image available</span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`aspect-square rounded-[10px] flex items-center justify-center cursor-pointer p-1 ${
                        i === 0
                          ? "border-[1.5px] border-[#16A34A] bg-[#F0FDF4]"
                          : "border border-gray-200 bg-[#F8FAFC] hover:border-gray-300"
                      }`}
                    >
                      {!imgError ? (
                        <img
                          src={product.img}
                          alt="Thumbnail"
                          className="w-full h-full object-contain mix-blend-multiply rounded-md"
                          onError={() => setImgError(true)}
                        />
                      ) : (
                        <Package size={20} className="text-gray-300" strokeWidth={1.5} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Details */}
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h1 className="text-[28px] font-bold text-gray-900 leading-tight tracking-tight">
                    {product.name}
                  </h1>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-colors shrink-0">
                    <Heart size={16} /> Save
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-[15px] text-gray-600 font-medium">BuildRight Materials</span>
                  <span className="bg-[#ECFDF5] text-[#10B981] text-[12px] font-bold px-2.5 py-1 rounded-full border border-[#DCFCE7]">
                    Verified Supplier
                  </span>
                </div>

                <div className="flex items-center gap-4 text-[13.5px] text-gray-600 mb-8">
                  <div className="flex items-center gap-1.5">
                    <Star size={16} className="fill-[#F59E0B] text-[#F59E0B]" />
                    <span className="font-bold text-gray-900">4.8</span>
                    <span>(126 reviews)</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={16} />
                    Lagos, Nigeria
                  </div>
                </div>

                <div className="mb-8 pb-6 border-b border-gray-100">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-[32px] font-bold text-gray-900 tracking-tight">
                      ₦{price.toLocaleString()}
                    </span>
                    <span className="text-[14px] text-gray-500 font-medium">{unit}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[13px]">
                    <span className="text-[#16A34A] font-bold">In stock</span>
                    <span className="text-gray-400">Minimum order: 50 bags</span>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-[14px] font-bold text-gray-900 mb-3">Quantity (Bags)</p>
                  <div className="flex flex-col xl:flex-row xl:items-center gap-6">
                    <div className="flex items-center w-full xl:w-auto h-[44px] rounded-lg border border-gray-200 overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(50, quantity - 10))}
                        className="w-12 h-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors font-bold text-[18px]"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value) || 0)}
                        className="w-20 h-full text-center text-[15px] font-bold text-gray-900 border-x border-gray-200 focus:outline-none bg-white"
                      />
                      <button
                        onClick={() => setQuantity(quantity + 10)}
                        className="w-12 h-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors font-bold text-[18px]"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center justify-between xl:justify-start gap-12">
                      <div className="flex flex-col">
                        <span className="text-[13px] text-gray-500 mb-0.5">Total</span>
                        <span className="text-[18px] font-bold text-gray-900 tracking-tight">
                          ₦{(price * quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mb-5">
                  <button className="w-full h-[50px] bg-[#16A34A] text-white rounded-[10px] font-bold text-[15px] flex items-center justify-center gap-2 hover:bg-[#15803d] transition-colors shadow-sm">
                    <ShoppingCart size={18} /> Add to Cart
                  </button>
                  <button className="w-full h-[50px] bg-white border border-[#16A34A] text-[#16A34A] rounded-[10px] font-bold text-[15px] flex items-center justify-center hover:bg-[#F0FDF4] transition-colors">
                    Buy Now
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-[13px] font-medium text-gray-500">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  Secure payment. Your details are safe with us.
                </div>
              </div>
            </div>

            {/* Accordions */}
            <div className="flex flex-col gap-3">
              {[
                { key: "description", label: "Description", icon: FileText, content: ((product as Record<string, unknown>).description as string) || "No description provided yet." },
                { key: "supplier", label: "Supplier", icon: Store, content: "BuildRight Materials — Verified supplier based in Lagos, Nigeria." },
                { key: "reviews", label: "Reviews (126)", icon: Star, content: "Reviews coming soon." },
              ].map(({ key, label, icon: Icon, content }) => (
                <div key={key} className="bg-white rounded-[16px] border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => toggleAccordion(key)}
                    className="w-full p-6 flex items-center justify-between cursor-pointer hover:border-gray-200 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Icon size={20} className="text-gray-400" />
                      <span className="text-[15px] font-bold text-gray-900">{label}</span>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`text-gray-400 transition-transform ${openAccordion === key ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openAccordion === key && (
                    <div className="px-6 pb-6 text-[14px] text-gray-600 -mt-2">{content}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}