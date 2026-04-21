import { useState } from "react";
import React from "react";
import {
  RotateCcw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Package,
  XCircle,
  Settings,
  Bell,
  Shield,
  Palette,
  Globe,
  Printer,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

type Tab = "returns" | "general" | "notifications" | "security";

const glassCard = {
  background: "rgba(255,255,255,0.72)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.9)",
  boxShadow: "0 8px 32px rgba(61,26,46,0.06)",
  borderRadius: "20px",
};

// Mock invoice data
const mockInvoices: Record<string, { customer: string; date: string; items: ReturnableItem[] }> = {
  "INV-4419": {
    customer: "Natalie Park",
    date: "Apr 9, 2026",
    items: [
      { id: 1, name: "Lumière Perfume Eau", sku: "FRG-LUM-003", price: 95, qty: 2, img: "https://images.unsplash.com/photo-1630573133526-8d090e0269af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200" },
      { id: 2, name: "Pearl Radiance Cream", sku: "SKN-PRL-004", price: 68, qty: 1, img: "https://images.unsplash.com/photo-1772191530787-b9546da02fbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200" },
      { id: 3, name: "Rose Velvet Lip Serum", sku: "LVL-ROS-001", price: 32, qty: 3, img: "https://images.unsplash.com/photo-1773372238338-f26460145162?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200" },
    ],
  },
  "INV-4418": {
    customer: "Olivia Martin",
    date: "Apr 9, 2026",
    items: [
      { id: 4, name: "Golden Glow Foundation", sku: "FAC-GLD-002", price: 48, qty: 1, img: "https://images.unsplash.com/photo-1650529192390-19528c5db606?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200" },
      { id: 5, name: "Midnight Eye Palette", sku: "EYE-MID-005", price: 58, qty: 1, img: "https://images.unsplash.com/photo-1662289031972-df424bb541bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200" },
    ],
  },
};

interface ReturnableItem {
  id: number;
  name: string;
  sku: string;
  price: number;
  qty: number;
  img: string;
}

interface ReturnItem extends ReturnableItem {
  returnQty: number;
  reason: string;
  restock: boolean;
}

const returnReasons = [
  "Kích ứng da (Skin Reaction)",
  "Lỗi màu (Wrong Shade)",
  "Sản phẩm bị lỗi (Defective Product)",
  "Không đúng mô tả (Not as Described)",
  "Đổi ý (Change of Mind)",
  "Quà tặng / Trùng lặp (Gift / Duplicate)",
];

const recentReturns = [
  { id: "RET-0041", customer: "Emma Rosé", invoice: "INV-4411", items: 2, refund: "$127.00", date: "Apr 10, 2026", status: "Processed" },
  { id: "RET-0040", customer: "Linh Nguyễn", invoice: "INV-4408", items: 1, refund: "$68.00", date: "Apr 8, 2026", status: "Restocked" },
  { id: "RET-0039", customer: "Charlotte Dubois", invoice: "INV-4395", items: 3, refund: "$186.00", date: "Apr 5, 2026", status: "Wasted" },
];

const settings = {
  general: [
    { icon: Globe, label: "Language", value: "Vietnamese (Tiếng Việt)" },
    { icon: Palette, label: "Theme", value: "Light (Glassmorphism)" },
    { icon: Printer, label: "Receipt Printer", value: "Epson TM-T88VII (Connected)" },
    { icon: Settings, label: "VAT Rate", value: "10% (Default)" },
    { icon: Settings, label: "Currency", value: "VND (₫) / USD ($)" },
  ],
  notifications: [
    { label: "Low Stock Alerts", enabled: true },
    { label: "New Order Notifications", enabled: true },
    { label: "Daily Sales Summary (Email)", enabled: true },
    { label: "Payroll Reminders", enabled: false },
    { label: "Supplier Order Updates", enabled: true },
    { label: "Return Requests", enabled: true },
    { label: "SMS Notifications", enabled: false },
  ],
};

export function SettingsReturns() {
  const [activeTab, setActiveTab] = useState<Tab>("returns");
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [foundInvoice, setFoundInvoice] = useState<{ customer: string; date: string; items: ReturnableItem[] } | null>(null);
  const [invoiceId, setInvoiceId] = useState("");
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);
  const [returnStep, setReturnStep] = useState<"search" | "select" | "confirm" | "done">("search");
  const [notifSettings, setNotifSettings] = useState(settings.notifications);

  const searchInvoice = () => {
    const key = invoiceSearch.trim().toUpperCase();
    const found = mockInvoices[key];
    if (found) {
      setFoundInvoice(found);
      setInvoiceId(key);
      setReturnStep("select");
      setReturnItems(
        found.items.map((item) => ({
          ...item,
          returnQty: 0,
          reason: returnReasons[0],
          restock: true,
        }))
      );
    }
  };

  const updateReturnItem = (id: number, field: keyof ReturnItem, value: unknown) => {
    setReturnItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const activeReturnItems = returnItems.filter((i) => i.returnQty > 0);
  const totalRefund = activeReturnItems.reduce((s, i) => s + i.price * i.returnQty, 0);

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "returns", label: "Returns Processing", icon: RotateCcw },
    { key: "general", label: "General Settings", icon: Settings },
    { key: "notifications", label: "Notifications", icon: Bell },
    { key: "security", label: "Security & Access", icon: Shield },
  ];

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <p style={{ color: "#9d6b7a", fontSize: "13px", fontWeight: 500, letterSpacing: "0.05em" }}>
          Configuration & After-Sale Service
        </p>
        <h1 style={{ color: "#3d1a2e", fontSize: "26px", fontWeight: 700, marginTop: 2 }}>
          Settings & Returns
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-7">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all"
            style={{
              background: activeTab === key ? "linear-gradient(135deg, #D4AF37, #C9A94E)" : "rgba(255,255,255,0.7)",
              color: activeTab === key ? "white" : "#6b4153",
              fontSize: "13px",
              fontWeight: activeTab === key ? 700 : 400,
              border: "1px solid",
              borderColor: activeTab === key ? "transparent" : "rgba(255,255,255,0.9)",
              boxShadow: activeTab === key ? "0 4px 16px rgba(212,175,55,0.4)" : "0 2px 8px rgba(61,26,46,0.04)",
            }}
          >
            <Icon size={15} />
            {label}
            {key === "returns" && (
              <span
                className="px-1.5 py-0.5 rounded-full ml-1"
                style={{ background: "rgba(244,143,177,0.25)", color: "#be185d", fontSize: "9px", fontWeight: 700 }}
              >
                3
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── RETURNS ───────────────────────────────────────────────────────── */}
      {activeTab === "returns" && (
        <div className="grid grid-cols-5 gap-6">
          {/* Returns Form */}
          <div className="col-span-3">
            <div style={glassCard}>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <RotateCcw size={18} color="#D4AF37" />
                  <h2 style={{ color: "#3d1a2e", fontSize: "16px", fontWeight: 700 }}>Process Return</h2>
                  {/* Step indicator */}
                  <div className="ml-auto flex items-center gap-1.5">
                    {(["search", "select", "confirm", "done"] as const).map((s, i) => (
                      <div
                        key={s}
                        className="flex items-center"
                      >
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{
                            background: returnStep === s ? "linear-gradient(135deg, #D4AF37, #C9A94E)" :
                              ["search", "select", "confirm", "done"].indexOf(returnStep) > i ? "rgba(74,222,128,0.2)" : "rgba(212,175,55,0.1)",
                            color: returnStep === s ? "white" : "#9d6b7a",
                            fontSize: "10px",
                            fontWeight: 700,
                          }}
                        >
                          {["search", "select", "confirm", "done"].indexOf(returnStep) > i ? "✓" : i + 1}
                        </div>
                        {i < 3 && <div className="w-4 h-0.5 mx-0.5" style={{ background: "rgba(212,175,55,0.2)" }} />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step: Search Invoice */}
                {returnStep === "search" && (
                  <div>
                    <p style={{ color: "#9d6b7a", fontSize: "13px", marginBottom: 16 }}>
                      Search for the original invoice to process a return. Try: <strong style={{ color: "#D4AF37" }}>INV-4419</strong> or <strong style={{ color: "#D4AF37" }}>INV-4418</strong>
                    </p>
                    <div className="flex gap-3">
                      <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(212,175,55,0.3)" }}>
                        <Search size={16} color="#9d6b7a" />
                        <input
                          value={invoiceSearch}
                          onChange={(e) => setInvoiceSearch(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && searchInvoice()}
                          placeholder="Enter Invoice ID (e.g. INV-4419)…"
                          style={{ border: "none", outline: "none", background: "transparent", color: "#3d1a2e", fontSize: "13px", flex: 1 }}
                        />
                      </div>
                      <button
                        onClick={searchInvoice}
                        className="px-5 py-3 rounded-xl"
                        style={{ background: "linear-gradient(135deg, #D4AF37, #C9A94E)", color: "white", fontWeight: 700, fontSize: "13px", boxShadow: "0 4px 14px rgba(212,175,55,0.4)" }}
                      >
                        Search
                      </button>
                    </div>
                  </div>
                )}

                {/* Step: Select Items */}
                {returnStep === "select" && foundInvoice && (
                  <div>
                    <div className="flex items-center gap-4 p-3 rounded-xl mb-5" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.2)" }}>
                      <div>
                        <p style={{ color: "#D4AF37", fontSize: "12px", fontWeight: 700 }}>{invoiceId}</p>
                        <p style={{ color: "#3d1a2e", fontSize: "13px", fontWeight: 600 }}>{foundInvoice.customer}</p>
                      </div>
                      <div className="ml-auto">
                        <p style={{ color: "#9d6b7a", fontSize: "11px" }}>Purchased: {foundInvoice.date}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {returnItems.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 rounded-xl"
                          style={{
                            background: item.returnQty > 0 ? "rgba(212,175,55,0.05)" : "rgba(255,255,255,0.5)",
                            border: `1px solid ${item.returnQty > 0 ? "rgba(212,175,55,0.3)" : "rgba(212,175,55,0.1)"}`,
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                              <ImageWithFallback src={item.img} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p style={{ color: "#3d1a2e", fontSize: "13px", fontWeight: 600 }}>{item.name}</p>
                              <p style={{ color: "#9d6b7a", fontSize: "11px" }}>{item.sku} · Purchased: {item.qty} · ${item.price}/ea</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span style={{ color: "#9d6b7a", fontSize: "11px" }}>Qty to return:</span>
                              <div className="flex items-center gap-1">
                                {[0, 1, 2, 3].filter((n) => n <= item.qty).map((n) => (
                                  <button
                                    key={n}
                                    onClick={() => updateReturnItem(item.id, "returnQty", n)}
                                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                                    style={{
                                      background: item.returnQty === n ? "linear-gradient(135deg, #D4AF37, #C9A94E)" : "rgba(212,175,55,0.1)",
                                      color: item.returnQty === n ? "white" : "#92740d",
                                      fontSize: "12px",
                                      fontWeight: 700,
                                      border: "1px solid rgba(212,175,55,0.25)",
                                    }}
                                  >
                                    {n}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {item.returnQty > 0 && (
                            <div className="mt-3 grid grid-cols-2 gap-3">
                              {/* Reason */}
                              <div>
                                <label style={{ color: "#6b4153", fontSize: "10px", fontWeight: 600, display: "block", marginBottom: 4 }}>RETURN REASON</label>
                                <select
                                  value={item.reason}
                                  onChange={(e) => updateReturnItem(item.id, "reason", e.target.value)}
                                  style={{ width: "100%", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 10, padding: "7px 10px", fontSize: "11.5px", color: "#3d1a2e", outline: "none", background: "rgba(253,242,248,0.5)" }}
                                >
                                  {returnReasons.map((r) => <option key={r}>{r}</option>)}
                                </select>
                              </div>
                              {/* Restock Toggle */}
                              <div>
                                <label style={{ color: "#6b4153", fontSize: "10px", fontWeight: 600, display: "block", marginBottom: 4 }}>TRANG THAI NHAP KHO</label>
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => updateReturnItem(item.id, "restock", !item.restock)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all"
                                    style={{
                                      background: item.restock ? "rgba(74,222,128,0.12)" : "rgba(244,63,94,0.1)",
                                      border: `1px solid ${item.restock ? "rgba(74,222,128,0.3)" : "rgba(244,63,94,0.2)"}`,
                                    }}
                                  >
                                    {item.restock ? (
                                      <ToggleRight size={18} color="#16a34a" />
                                    ) : (
                                      <ToggleLeft size={18} color="#dc2626" />
                                    )}
                                    <span style={{ color: item.restock ? "#16a34a" : "#dc2626", fontSize: "11px", fontWeight: 700 }}>
                                      {item.restock ? "Restock (Nhập kho)" : "Waste (Hủy)"}
                                    </span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {activeReturnItems.length > 0 && (
                      <div className="mt-4 p-3 rounded-xl flex items-center justify-between" style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)" }}>
                        <span style={{ color: "#6b4153", fontSize: "13px", fontWeight: 700 }}>
                          {activeReturnItems.length} item{activeReturnItems.length > 1 ? "s" : ""} selected
                        </span>
                        <span style={{ color: "#D4AF37", fontSize: "16px", fontWeight: 800 }}>
                          Refund: ${totalRefund.toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => { setReturnStep("search"); setFoundInvoice(null); }}
                        className="px-5 py-2.5 rounded-xl"
                        style={{ background: "rgba(212,175,55,0.1)", color: "#92740d", fontWeight: 600, fontSize: "13px" }}
                      >
                        ← Back
                      </button>
                      <button
                        onClick={() => setReturnStep("confirm")}
                        disabled={activeReturnItems.length === 0}
                        className="flex-1 py-2.5 rounded-xl"
                        style={{
                          background: activeReturnItems.length > 0 ? "linear-gradient(135deg, #D4AF37, #C9A94E)" : "rgba(200,190,190,0.3)",
                          color: "white", fontWeight: 700, fontSize: "13px",
                          boxShadow: activeReturnItems.length > 0 ? "0 4px 14px rgba(212,175,55,0.4)" : "none",
                        }}
                      >
                        Review Return →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step: Confirm */}
                {returnStep === "confirm" && (
                  <div>
                    <div className="p-4 rounded-xl mb-4" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.2)" }}>
                      <div className="flex justify-between mb-2">
                        <span style={{ color: "#9d6b7a", fontSize: "12px" }}>Invoice</span>
                        <span style={{ color: "#D4AF37", fontSize: "12px", fontWeight: 700 }}>{invoiceId}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span style={{ color: "#9d6b7a", fontSize: "12px" }}>Customer</span>
                        <span style={{ color: "#3d1a2e", fontSize: "12px", fontWeight: 600 }}>{foundInvoice?.customer}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span style={{ color: "#9d6b7a", fontSize: "12px" }}>Items Returning</span>
                        <span style={{ color: "#3d1a2e", fontSize: "12px", fontWeight: 600 }}>{activeReturnItems.length}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t" style={{ borderColor: "rgba(212,175,55,0.2)" }}>
                        <span style={{ color: "#6b4153", fontSize: "14px", fontWeight: 700 }}>Total Refund</span>
                        <span style={{ color: "#D4AF37", fontSize: "18px", fontWeight: 800 }}>${totalRefund.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {activeReturnItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.5)", border: "1px solid rgba(212,175,55,0.1)" }}>
                          <div className="flex-1">
                            <p style={{ color: "#3d1a2e", fontSize: "12px", fontWeight: 600 }}>{item.name}</p>
                            <p style={{ color: "#9d6b7a", fontSize: "10px" }}>Qty: {item.returnQty} · {item.reason.split("(")[0].trim()}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.restock ? (
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: "rgba(74,222,128,0.12)", color: "#16a34a", fontSize: "10px", fontWeight: 600 }}>
                                <Package size={9} />Restock
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: "rgba(244,63,94,0.1)", color: "#dc2626", fontSize: "10px", fontWeight: 600 }}>
                                <XCircle size={9} />Waste
                              </span>
                            )}
                            <span style={{ color: "#D4AF37", fontSize: "13px", fontWeight: 700 }}>
                              ${(item.price * item.returnQty).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setReturnStep("select")}
                        className="px-5 py-2.5 rounded-xl"
                        style={{ background: "rgba(212,175,55,0.1)", color: "#92740d", fontWeight: 600, fontSize: "13px" }}
                      >
                        ← Edit
                      </button>
                      <button
                        onClick={() => setReturnStep("done")}
                        className="flex-1 py-2.5 rounded-xl"
                        style={{ background: "linear-gradient(135deg, #F48FB1, #E879A0)", color: "white", fontWeight: 700, fontSize: "13px", boxShadow: "0 4px 14px rgba(244,143,177,0.4)" }}
                      >
                        ✓ Process Return & Refund
                      </button>
                    </div>
                  </div>
                )}

                {/* Step: Done */}
                {returnStep === "done" && (
                  <div className="text-center py-8">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ background: "linear-gradient(135deg, #F48FB1, #E879A0)", boxShadow: "0 8px 24px rgba(244,143,177,0.4)" }}
                    >
                      <CheckCircle2 size={32} color="white" />
                    </div>
                    <h3 style={{ color: "#3d1a2e", fontSize: "18px", fontWeight: 700, marginBottom: 6 }}>Return Processed!</h3>
                    <p style={{ color: "#D4AF37", fontSize: "22px", fontWeight: 800, marginBottom: 4 }}>${totalRefund.toFixed(2)} Refunded</p>
                    <p style={{ color: "#9d6b7a", fontSize: "12px", marginBottom: 4 }}>to {foundInvoice?.customer}</p>
                    <p style={{ color: "#c9a0b0", fontSize: "11px", marginBottom: 20 }}>
                      {activeReturnItems.filter((i) => i.restock).length} items restocked · {activeReturnItems.filter((i) => !i.restock).length} items wasted
                    </p>
                    <button
                      onClick={() => { setReturnStep("search"); setFoundInvoice(null); setInvoiceSearch(""); setReturnItems([]); }}
                      className="px-6 py-2.5 rounded-xl"
                      style={{ background: "linear-gradient(135deg, #D4AF37, #C9A94E)", color: "white", fontWeight: 700, fontSize: "13px" }}
                    >
                      New Return
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Returns */}
          <div className="col-span-2" style={glassCard}>
            <div className="p-5">
              <h3 style={{ color: "#3d1a2e", fontSize: "14px", fontWeight: 700, marginBottom: 16 }}>Recent Returns</h3>
              <div className="space-y-3">
                {recentReturns.map((r) => (
                  <div key={r.id} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.5)", border: "1px solid rgba(212,175,55,0.1)" }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span style={{ color: "#D4AF37", fontSize: "11px", fontWeight: 700 }}>{r.id}</span>
                      <span
                        className="px-2 py-0.5 rounded-full"
                        style={{
                          background: r.status === "Processed" ? "rgba(212,175,55,0.15)" : r.status === "Restocked" ? "rgba(74,222,128,0.12)" : "rgba(244,63,94,0.1)",
                          color: r.status === "Processed" ? "#92740d" : r.status === "Restocked" ? "#16a34a" : "#dc2626",
                          fontSize: "10px",
                          fontWeight: 600,
                        }}
                      >
                        {r.status}
                      </span>
                    </div>
                    <p style={{ color: "#3d1a2e", fontSize: "13px", fontWeight: 600 }}>{r.customer}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span style={{ color: "#9d6b7a", fontSize: "11px" }}>{r.invoice} · {r.items} items</span>
                      <span style={{ color: "#F48FB1", fontSize: "13px", fontWeight: 700 }}>−{r.refund}</span>
                    </div>
                    <p style={{ color: "#c9a0b0", fontSize: "10px", marginTop: 2 }}>{r.date}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-xl" style={{ background: "rgba(244,143,177,0.08)", border: "1px solid rgba(244,143,177,0.2)" }}>
                <div className="flex justify-between">
                  <span style={{ color: "#6b4153", fontSize: "12px", fontWeight: 600 }}>Total Refunded (Apr)</span>
                  <span style={{ color: "#F48FB1", fontSize: "14px", fontWeight: 800 }}>−$381.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── GENERAL SETTINGS ─────────────────────────────────────────────── */}
      {activeTab === "general" && (
        <div style={glassCard}>
          <div className="p-6">
            <h2 style={{ color: "#3d1a2e", fontSize: "16px", fontWeight: 700, marginBottom: 20 }}>General Configuration</h2>
            <div className="space-y-2">
              {settings.general.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 p-4 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.5)", border: "1px solid rgba(212,175,55,0.1)" }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(212,175,55,0.1)" }}>
                    <Icon size={17} color="#D4AF37" strokeWidth={1.8} />
                  </div>
                  <div className="flex-1">
                    <p style={{ color: "#9d6b7a", fontSize: "11px" }}>{label}</p>
                    <p style={{ color: "#3d1a2e", fontSize: "13px", fontWeight: 600 }}>{value}</p>
                  </div>
                  <ChevronRight size={16} color="#c9a0b0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── NOTIFICATIONS ──────────────────────────────────────────────────── */}
      {activeTab === "notifications" && (
        <div style={glassCard}>
          <div className="p-6">
            <h2 style={{ color: "#3d1a2e", fontSize: "16px", fontWeight: 700, marginBottom: 20 }}>Notification Preferences</h2>
            <div className="space-y-3">
              {notifSettings.map((n, i) => (
                <div
                  key={n.label}
                  className="flex items-center justify-between p-4 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.5)", border: "1px solid rgba(212,175,55,0.1)" }}
                >
                  <div className="flex items-center gap-3">
                    <Bell size={16} color={n.enabled ? "#D4AF37" : "#c9a0b0"} />
                    <p style={{ color: n.enabled ? "#3d1a2e" : "#9d6b7a", fontSize: "13px", fontWeight: n.enabled ? 600 : 400 }}>{n.label}</p>
                  </div>
                  <button
                    onClick={() => {
                      const updated = [...notifSettings];
                      updated[i] = { ...updated[i], enabled: !updated[i].enabled };
                      setNotifSettings(updated);
                    }}
                  >
                    {n.enabled
                      ? <ToggleRight size={28} color="#D4AF37" />
                      : <ToggleLeft size={28} color="#c9a0b0" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SECURITY ───────────────────────────────────────────────────────── */}
      {activeTab === "security" && (
        <div className="grid grid-cols-2 gap-5">
          {[
            { title: "Change Password", desc: "Update your login credentials", icon: Shield, color: "#D4AF37" },
            { title: "Two-Factor Authentication", desc: "Add an extra layer of security", icon: Shield, color: "#4ade80" },
            { title: "Role & Permission Management", desc: "Configure access per user role", icon: Settings, color: "#C084FC" },
            { title: "Active Sessions", desc: "View and manage logged-in devices", icon: Globe, color: "#F48FB1" },
          ].map((s) => (
            <div key={s.title} style={{ ...glassCard, cursor: "pointer" }} className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${s.color}18` }}>
                <s.icon size={22} color={s.color} strokeWidth={1.8} />
              </div>
              <div className="flex-1">
                <p style={{ color: "#3d1a2e", fontSize: "14px", fontWeight: 700 }}>{s.title}</p>
                <p style={{ color: "#9d6b7a", fontSize: "12px", marginTop: 2 }}>{s.desc}</p>
              </div>
              <ChevronRight size={16} color="#c9a0b0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}