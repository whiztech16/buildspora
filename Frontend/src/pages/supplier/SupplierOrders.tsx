import { useState } from "react";
import { ShoppingCart, Truck } from "lucide-react";
import PreviewToggle from "../../components/shared/PreviewToggle";

const FONT = "'Inter', sans-serif";

// ── Types ──────────────────────────────────────────────────────────────────────
type OrderStatus = "Paid" | "In Delivery" | "Delivered";
type TabId = "active" | "delivered" | "all";

interface Order {
  id: string;
  client: string;
  item: string;
  quantity: string;
  amount: string;
  address: string;
  status: OrderStatus;
  date: string;
}

// ── Mock data (backend will replace this) ─────────────────────────────────────
const MOCK_ORDERS: Order[] = [
  { id: "BSP-001", client: "Chioma Adeyemi",  item: "Dangote Cement (50kg bag)", quantity: "200 bags",   amount: "₦900,000", address: "15 Admiralty Way, Lekki, Lagos",  status: "Paid",        date: "27 Jun 2026" },
  { id: "BSP-002", client: "Ngozi Okonkwo",   item: "Iron Rod 12mm (6m)",        quantity: "50 pieces",  amount: "₦425,000", address: "8 Oregun Road, Ikeja, Lagos",    status: "In Delivery", date: "26 Jun 2026" },
  { id: "BSP-003", client: "Emeka Nwachukwu", item: "Zinc Roofing Sheet",        quantity: "80 sheets",  amount: "₦320,000", address: "3 Trans-Amadi, Port Harcourt",   status: "Delivered",   date: "20 Jun 2026" },
  { id: "BSP-004", client: "Adaeze Obi",      item: "BUA Cement 50kg",           quantity: "150 bags",   amount: "₦840,000", address: "22 Wuse Zone 4, Abuja",          status: "Delivered",   date: "18 Jun 2026" },
];

// ── Preview states ─────────────────────────────────────────────────────────────
const PREVIEW_STATES = [
  { label: "New Supplier",    description: "No orders yet" },
  { label: "Active Supplier", description: "Orders present" },
];

// ── Status badge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: OrderStatus }) {
  const styles: Record<OrderStatus, string> = {
    "Paid":        "bg-[#ECFDF5] text-[#059669]",
    "In Delivery": "bg-[#FEF3C7] text-[#D97706]",
    "Delivered":   "bg-[#F1F5F9] text-[#64748B]",
  };
  return (
    <span className={`text-[12px] font-bold px-3 py-1 rounded-md ${styles[status]}`} style={{ fontFamily: FONT }}>
      {status}
    </span>
  );
}

// ── Order card ─────────────────────────────────────────────────────────────────
function OrderCard({ order, onMarkDelivered }: {
  order: Order;
  onMarkDelivered: (id: string) => void;
}) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[4px] p-5 hover:border-[#CBD5E1] transition-all" style={{ fontFamily: FONT }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[13px] font-bold text-[#0F172A]">#{order.id}</span>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-[12px] text-[#94A3B8]">{order.date}</p>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        {[
          { label: "Client",           value: order.client },
          { label: "Item",             value: order.item },
          { label: "Quantity",         value: order.quantity },
          { label: "Amount",           value: order.amount, bold: true },
          { label: "Delivery Address", value: order.address },
        ].map(r => (
          <div key={r.label} className="flex items-start justify-between gap-4">
            <span className="text-[12.5px] text-[#64748B] shrink-0">{r.label}</span>
            <span className={`text-right ${r.bold ? "text-[14px] font-bold text-[#0F172A]" : "text-[12.5px] font-medium text-[#475569]"}`}>
              {r.value}
            </span>
          </div>
        ))}
      </div>
      {order.status === "Paid" && (
        <button
          onClick={() => onMarkDelivered(order.id)}
          className="w-full flex items-center justify-center gap-2 h-[38px] rounded-lg border border-[#059669] text-[#059669] text-[13px] font-semibold hover:bg-[#ECFDF5] transition-colors"
        >
          <Truck size={14} />
          Mark as Delivered
        </button>
      )}
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────────
function EmptyOrders({ label }: { label: string }) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[4px] flex flex-col items-center justify-center text-center py-20 px-8">
      <div className="w-14 h-14 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-4">
        <ShoppingCart size={26} className="text-[#94A3B8]" />
      </div>
      <h3 className="text-[16px] font-bold text-[#0F172A] mb-1.5">No {label} yet</h3>
      <p className="text-[13.5px] text-[#64748B] max-w-[260px] leading-relaxed">
        {label === "orders"
          ? "Orders will appear here once clients accept your quotes."
          : `${label.charAt(0).toUpperCase() + label.slice(1)} orders will appear here.`}
      </p>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function SupplierOrders() {
  const [previewIdx, setPreviewIdx] = useState(0);
  const [tab, setTab] = useState<TabId>("active");
  const [localOrders, setLocalOrders] = useState<Order[]>(MOCK_ORDERS);

  // In production: orders come from the API
  const orders: Order[] = previewIdx === 0 ? [] : localOrders;

  const markDelivered = (id: string) => {
    setLocalOrders(prev => prev.map(o => o.id === id ? { ...o, status: "Delivered" as OrderStatus } : o));
  };

  const filtered = orders.filter(o => {
    if (tab === "active")    return o.status === "Paid" || o.status === "In Delivery";
    if (tab === "delivered") return o.status === "Delivered";
    return true;
  });

  const activeCount = orders.filter(o => o.status === "Paid" || o.status === "In Delivery").length;

  const TABS: { id: TabId; label: string }[] = [
    { id: "active",    label: "Active" },
    { id: "delivered", label: "Delivered" },
    { id: "all",       label: "All" },
  ];

  return (
    <div style={{ fontFamily: FONT }}>
      <PreviewToggle states={PREVIEW_STATES} current={previewIdx} onChange={setPreviewIdx} />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[24px] font-bold text-[#0F172A]">Orders</h1>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-[#E2E8F0]">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-[13.5px] font-semibold border-b-2 transition-colors -mb-px ${
              tab === t.id
                ? "border-[#059669] text-[#059669]"
                : "border-transparent text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            {t.label}
            {t.id === "active" && activeCount > 0 && (
              <span className="ml-1.5 text-[11px] font-bold bg-[#059669] text-white px-1.5 py-0.5 rounded-full">
                {activeCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyOrders label={tab === "active" ? "orders" : tab === "delivered" ? "delivered orders" : "orders"} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(order => (
            <OrderCard key={order.id} order={order} onMarkDelivered={markDelivered} />
          ))}
        </div>
      )}
    </div>
  );
}
