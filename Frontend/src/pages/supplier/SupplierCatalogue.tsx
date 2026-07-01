import { useState } from "react";
import { Package, Plus, Pencil, Trash2, X } from "lucide-react";
import SearchableSelect from "../../components/shared/SearchableSelect";
import PreviewToggle from "../../components/shared/PreviewToggle";

const FONT = "'Inter', sans-serif";

// ── Options ───────────────────────────────────────────────────────────────────
const CATEGORIES = [
  "Cement & Concrete", "Iron Rods & Steel", "Roofing Materials",
  "Tiles & Flooring", "Paint & Finishes", "Electrical Materials",
  "Plumbing Materials", "Timber & Wood", "Blocks & Bricks", "Interior Fittings",
];
const UNIT_TYPES = [
  "Per Bag", "Per Tonne", "Per Piece", "Per Bundle", "Per Roll",
  "Per Sheet", "Per Litre", "Per Carton", "Per Truck", "Per Metre",
];

// ── Types ──────────────────────────────────────────────────────────────────────
interface CatalogueItem {
  id: number;
  name: string;
  category: string;
  unit: string;
  price: string;
  stock: "In Stock" | "Low Stock" | "Out of Stock";
}

// ── Mock data (backend will replace this) ─────────────────────────────────────
const MOCK_ITEMS: CatalogueItem[] = [
  { id: 1, name: "Dangote Cement 50kg",  category: "Cement & Concrete", unit: "Per Bag",   price: "5,800", stock: "In Stock" },
  { id: 2, name: "BUA Cement 50kg",      category: "Cement & Concrete", unit: "Per Bag",   price: "5,600", stock: "In Stock" },
  { id: 3, name: "Iron Rod 12mm (6m)",   category: "Iron Rods & Steel", unit: "Per Piece", price: "9,200", stock: "Low Stock" },
  { id: 4, name: "Zinc Roofing Sheet",   category: "Roofing Materials", unit: "Per Sheet", price: "4,500", stock: "In Stock" },
];

// ── Preview states ─────────────────────────────────────────────────────────────
const PREVIEW_STATES = [
  { label: "New Supplier",    description: "Empty catalogue" },
  { label: "Active Supplier", description: "Items listed" },
];

// ── Stock badge ────────────────────────────────────────────────────────────────
function StockBadge({ stock }: { stock: string }) {
  const map: Record<string, string> = {
    "In Stock":    "bg-[#ECFDF5] text-[#059669]",
    "Low Stock":   "bg-[#FEF3C7] text-[#D97706]",
    "Out of Stock":"bg-[#FEF2F2] text-[#DC2626]",
  };
  return (
    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${map[stock] ?? ""}`}>
      {stock}
    </span>
  );
}

// ── Add Item Modal ─────────────────────────────────────────────────────────────
function AddItemModal({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (item: Omit<CatalogueItem, "id">) => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = () => {
    if (!name || !category || !unit || !price) return;
    onAdd({ name, category, unit, price, stock: "In Stock" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ fontFamily: FONT }}>
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-[480px] shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F1F5F9]">
          <h2 className="text-[17px] font-bold text-[#0F172A]">Add Catalogue Item</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-[13.5px] font-semibold text-[#0F172A] mb-1.5">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. Dangote Cement 50kg"
              className="w-full h-[44px] px-4 rounded-lg border border-[#E2E8F0] text-[14px] text-[#0F172A] placeholder-[#CBD5E1] bg-white outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/10 transition-all"
              style={{ fontFamily: FONT }}
            />
          </div>
          <SearchableSelect id="modal-cat"  label="Category"  required options={CATEGORIES} placeholder="Search category…" onChange={setCategory} />
          <SearchableSelect id="modal-unit" label="Unit Type" required options={UNIT_TYPES}  placeholder="Search unit type…" onChange={setUnit} />
          <div>
            <label className="block text-[13.5px] font-semibold text-[#0F172A] mb-1.5">
              Listed Price (₦) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] font-semibold text-[#64748B]">₦</span>
              <input
                value={price} onChange={e => setPrice(e.target.value)} type="text" placeholder="0.00"
                className="w-full h-[44px] pl-8 pr-4 rounded-lg border border-[#E2E8F0] text-[14px] text-[#0F172A] placeholder-[#CBD5E1] bg-white outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/10 transition-all"
                style={{ fontFamily: FONT }}
              />
            </div>
          </div>
          <div>
            <label className="block text-[13.5px] font-semibold text-[#0F172A] mb-1.5">
              Item Photo <span className="text-[#94A3B8] font-normal">(Optional)</span>
            </label>
            <label
              htmlFor="modal-photo"
              className="flex flex-col items-center justify-center gap-1.5 w-full h-[80px] rounded-lg border-2 border-dashed border-[#E2E8F0] bg-[#FAFAFA] cursor-pointer hover:border-[#059669] hover:bg-[#F0FDF4] transition-all"
            >
              <Package size={18} className="text-[#94A3B8]" />
              <span className="text-[12.5px] text-[#64748B]" style={{ fontFamily: FONT }}>Upload photo</span>
              <input id="modal-photo" type="file" accept="image/*" className="hidden" />
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3 px-6 py-4 border-t border-[#F1F5F9]">
          <button onClick={onClose} className="flex-1 h-[42px] rounded-lg border border-[#E2E8F0] text-[13.5px] font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors" style={{ fontFamily: FONT }}>
            Cancel
          </button>
          <button onClick={handleSubmit} className="flex-1 h-[42px] rounded-lg bg-[#059669] hover:bg-[#047857] text-white text-[13.5px] font-semibold transition-colors" style={{ fontFamily: FONT }}>
            Add Item
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function SupplierCatalogue() {
  const [previewIdx, setPreviewIdx] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [added, setAdded] = useState<CatalogueItem[]>([]);

  // In production: items come from the API
  const baseItems: CatalogueItem[] = previewIdx === 1 ? MOCK_ITEMS : [];
  const items = [...baseItems, ...added];

  const handleAdd = (item: Omit<CatalogueItem, "id">) => {
    setAdded(prev => [...prev, { ...item, id: Date.now() }]);
  };
  const handleDelete = (id: number) => {
    setAdded(prev => prev.filter(i => i.id !== id));
    // Note: can't delete mock items in preview; in production call DELETE /api/items/:id
  };

  return (
    <div style={{ fontFamily: FONT }}>
      <PreviewToggle states={PREVIEW_STATES} current={previewIdx} onChange={setPreviewIdx} />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[24px] font-bold text-[#0F172A]">My Catalogue</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#059669] hover:bg-[#047857] text-white text-[13.5px] font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} strokeWidth={2} />
          Add Item
        </button>
      </div>

      {/* Empty state */}
      {items.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-[4px] flex flex-col items-center justify-center text-center py-20 px-8">
          <div className="w-14 h-14 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-4">
            <Package size={26} className="text-[#94A3B8]" />
          </div>
          <h3 className="text-[16px] font-bold text-[#0F172A] mb-1.5">No items in your catalogue yet</h3>
          <p className="text-[13.5px] text-[#64748B] mb-6 max-w-[260px] leading-relaxed">
            Add items to let clients know what you sell and start receiving orders.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#059669] hover:bg-[#047857] text-white text-[13.5px] font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={15} />
            Add Item
          </button>
        </div>
      ) : (
        <>
          <p className="text-[13.5px] text-[#64748B] mb-4">{items.length} item{items.length !== 1 ? "s" : ""} listed</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map(item => (
              <div key={item.id} className="bg-white border border-[#E2E8F0] rounded-[4px] p-5 flex flex-col gap-3 hover:border-[#CBD5E1] transition-all">
                <div className="w-full h-[120px] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg flex items-center justify-center">
                  <Package size={32} className="text-[#CBD5E1]" />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-[14.5px] font-bold text-[#0F172A] leading-tight">{item.name}</p>
                    <span className="inline-block text-[11.5px] font-semibold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-md mt-1">
                      {item.category}
                    </span>
                  </div>
                  <StockBadge stock={item.stock} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[12px] text-[#94A3B8]">Unit: {item.unit}</p>
                    <p className="text-[15px] font-bold text-[#0F172A]">From ₦{item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-[12.5px] font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors">
                      <Pencil size={13} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#FEE2E2] text-[12.5px] font-semibold text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showModal && <AddItemModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}
    </div>
  );
}
