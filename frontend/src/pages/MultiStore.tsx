import { useState } from "react";
import React from "react";
import {
  Building2,
  Package,
  ArrowRight,
  CheckCircle2,
  Truck,
  AlertTriangle,
  Plus,
  MapPin,
  BarChart3,
  RefreshCw,
  ChevronRight,
  Clock,
} from "lucide-react";

const glassCard = {
  background: "rgba(255,255,255,0.72)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.9)",
  boxShadow: "0 8px 32px rgba(61,26,46,0.06)",
  borderRadius: "20px",
};

type StoreKey = "tong" | "ch1" | "ch2";
type TransferStatus = "Đang vận chuyển" | "Đã nhận" | "Khiếu nại";

interface StockRow {
  name: string;
  sku: string;
  tong: number;
  ch1: number;
  ch2: number;
  minLevel: number;
}

const stockData: StockRow[] = [
  { name: "Rose Velvet Lip Serum", sku: "LVL-ROS-001", tong: 620, ch1: 142, ch2: 142, minLevel: 50 },
  { name: "Golden Glow Foundation", sku: "FAC-GLD-002", tong: 380, ch1: 88, ch2: 68, minLevel: 40 },
  { name: "Lumière Perfume Eau", sku: "FRG-LUM-003", tong: 120, ch1: 22, ch2: 20, minLevel: 30 },
  { name: "Pearl Radiance Cream", sku: "SKN-PRL-004", tong: 85, ch1: 8, ch2: 0, minLevel: 20 },
  { name: "Midnight Eye Palette", sku: "EYE-MID-005", tong: 445, ch1: 96, ch2: 97, minLevel: 40 },
  { name: "Rose Gold Blush", sku: "FAC-BLS-006", tong: 710, ch1: 168, ch2: 150, minLevel: 60 },
  { name: "Velvet Matte Lipstick", sku: "LPS-MAT-007", tong: 820, ch1: 205, ch2: 207, minLevel: 80 },
  { name: "Hydra Boost Serum", sku: "SKN-HYD-008", tong: 0, ch1: 0, ch2: 0, minLevel: 30 },
  { name: "Silk Brow Pencil", sku: "EYE-BRW-009", tong: 520, ch1: 117, ch2: 117, minLevel: 50 },
  { name: "Amber Rose Parfum", sku: "FRG-AMB-010", tong: 210, ch1: 34, ch2: 33, minLevel: 25 },
];

interface Transfer {
  id: string;
  from: string;
  to: string;
  items: number;
  date: string;
  status: TransferStatus;
  ref: string;
}

const transferHistory: Transfer[] = [
  { id: "TRF-0091", from: "Kho Tổng", to: "Kho CH1", items: 8, date: "Apr 10, 2026", status: "Đã nhận", ref: "REF-5521" },
  { id: "TRF-0092", from: "Kho Tổng", to: "Kho CH2", items: 5, date: "Apr 11, 2026", status: "Đang vận chuyển", ref: "REF-5522" },
  { id: "TRF-0093", from: "Kho CH1", to: "Kho CH2", items: 3, date: "Apr 12, 2026", status: "Đang vận chuyển", ref: "REF-5523" },
  { id: "TRF-0090", from: "Kho Tổng", to: "Kho CH1", items: 12, date: "Apr 8, 2026", status: "Đã nhận", ref: "REF-5520" },
  { id: "TRF-0089", from: "Kho Tổng", to: "Kho CH2", items: 6, date: "Apr 6, 2026", status: "Khiếu nại", ref: "REF-5519" },
];

const statusStyle: Record<TransferStatus, { bg: string; color: string; icon: React.ElementType }> = {
  "Đang vận chuyển": { bg: "rgba(212,175,55,0.15)", color: "#92740d", icon: Truck },
  "Đã nhận": { bg: "rgba(74,222,128,0.12)", color: "#16a34a", icon: CheckCircle2 },
  "Khiếu nại": { bg: "rgba(244,63,94,0.1)", color: "#dc2626", icon: AlertTriangle },
};

const stores: { key: StoreKey; label: string; short: string; color: string; address: string }[] = [
  { key: "tong", label: "Kho Tổng (HQ)", short: "Kho Tổng", color: "#D4AF37", address: "12 Nguyễn Huệ, Q.1, TP.HCM" },
  { key: "ch1", label: "Kho CH1", short: "Kho CH1", color: "#F48FB1", address: "56 Lê Lợi, Q.3, TP.HCM" },
  { key: "ch2", label: "Kho CH2", short: "Kho CH2", color: "#C084FC", address: "88 Trần Hưng Đạo, Q.5, TP.HCM" },
];

// Transfer Wizard
type WizardStep = 0 | 1 | 2 | 3;

export function MultiStore() {
  const [activeStore, setActiveStore] = useState<StoreKey>("tong");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<WizardStep>(0);
  const [transferFrom, setTransferFrom] = useState("Kho Tổng");
  const [transferTo, setTransferTo] = useState("Kho CH1");
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});

  const currentStore = stores.find((s) => s.key === activeStore)!;

  const getStockForStore = (row: StockRow) => row[activeStore];
  const isLow = (row: StockRow) => getStockForStore(row) < row.minLevel;

  const toggleItem = (sku: string) => {
    setSelectedItems((prev) => {
      if (prev[sku]) {
        const n = { ...prev };
        delete n[sku];
        return n;
      }
      return { ...prev, [sku]: 10 };
    });
  };

  const totalSelected = Object.values(selectedItems).reduce((a, b) => a + b, 0);
  const alertCount = stockData.filter((r) => getStockForStore(r) < r.minLevel).length;

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p style={{ color: "#9d6b7a", fontSize: "13px", fontWeight: 500, letterSpacing: "0.05em" }}>
            Warehouse & Delivery
          </p>
          <h1 style={{ color: "#3d1a2e", fontSize: "26px", fontWeight: 700, marginTop: 2 }}>
            Multi-Store & Logistics
          </h1>
        </div>
        <button
          onClick={() => { setWizardOpen(true); setWizardStep(0); setSelectedItems({}); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl"
          style={{ background: "linear-gradient(135deg, #D4AF37, #C9A94E)", boxShadow: "0 6px 20px rgba(212,175,55,0.4)", color: "white", fontSize: "13px", fontWeight: 600 }}
        >
          <Plus size={16} />
          New Transfer Order
        </button>
      </div>

      {/* Store Cards */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        {stores.map((s) => {
          const totalStock = stockData.reduce((sum, r) => sum + r[s.key], 0);
          const lowItems = stockData.filter((r) => r[s.key] < r.minLevel).length;
          return (
            <button
              key={s.key}
              onClick={() => setActiveStore(s.key)}
              style={{
                ...glassCard,
                border: activeStore === s.key ? `2px solid ${s.color}` : "1px solid rgba(255,255,255,0.9)",
                boxShadow: activeStore === s.key ? `0 8px 32px ${s.color}30` : "0 8px 32px rgba(61,26,46,0.06)",
                textAlign: "left",
                padding: "20px",
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: `${s.color}20` }}
                >
                  <Building2 size={22} color={s.color} strokeWidth={1.8} />
                </div>
                {activeStore === s.key && (
                  <span className="px-2 py-0.5 rounded-full" style={{ background: `${s.color}20`, color: s.color, fontSize: "10px", fontWeight: 700 }}>
                    Viewing
                  </span>
                )}
              </div>
              <p style={{ color: "#3d1a2e", fontSize: "15px", fontWeight: 700 }}>{s.short}</p>
              <p style={{ color: "#9d6b7a", fontSize: "11px", marginTop: 2 }}>
                <MapPin size={10} style={{ display: "inline", marginRight: 3 }} />
                {s.address}
              </p>
              <div className="flex items-center gap-4 mt-4">
                <div>
                  <p style={{ color: "#3d1a2e", fontSize: "20px", fontWeight: 800 }}>{totalStock.toLocaleString()}</p>
                  <p style={{ color: "#9d6b7a", fontSize: "11px" }}>Total units</p>
                </div>
                {lowItems > 0 && (
                  <div>
                    <p style={{ color: "#f43f5e", fontSize: "20px", fontWeight: 800 }}>{lowItems}</p>
                    <p style={{ color: "#9d6b7a", fontSize: "11px" }}>Low stock SKUs</p>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Alert Banner */}
      {alertCount > 0 && (
        <div
          className="flex items-center gap-3 px-5 py-3.5 rounded-2xl mb-6"
          style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)" }}
        >
          <AlertTriangle size={18} color="#D4AF37" />
          <p style={{ color: "#92740d", fontSize: "13px", fontWeight: 600 }}>
            {alertCount} product{alertCount > 1 ? "s" : ""} in <strong>{currentStore.short}</strong> are below minimum stock level. Consider initiating a transfer.
          </p>
          <button
            onClick={() => { setWizardOpen(true); setWizardStep(0); }}
            className="ml-auto px-3 py-1.5 rounded-lg"
            style={{ background: "rgba(212,175,55,0.2)", color: "#92740d", fontSize: "12px", fontWeight: 600 }}
          >
            Create Transfer
          </button>
        </div>
      )}

      {/* Stock Table + Transfer History */}
      <div className="grid grid-cols-3 gap-5">
        {/* Stock Table */}
        <div className="col-span-2" style={glassCard}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 style={{ color: "#3d1a2e", fontSize: "16px", fontWeight: 700 }}>
                  Stock Levels — {currentStore.short}
                </h2>
                <p style={{ color: "#9d6b7a", fontSize: "12px", marginTop: 2 }}>
                  Showing inventory for {currentStore.address}
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)" }}>
                <RefreshCw size={13} color="#D4AF37" />
                <span style={{ color: "#92740d", fontSize: "12px" }}>Sync: Just now</span>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(212,175,55,0.15)" }}>
                  {["Product", "SKU", `${currentStore.short} Stock`, "Min Level", "Status"].map((h) => (
                    <th key={h} style={{ color: "#9d6b7a", fontSize: "10.5px", fontWeight: 600, letterSpacing: "0.08em", padding: "10px 12px", textAlign: "left" }}>
                      {h.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stockData.map((row) => {
                  const qty = getStockForStore(row);
                  const pct = Math.min(100, (qty / (row.minLevel * 5)) * 100);
                  const low = qty < row.minLevel;
                  const oos = qty === 0;
                  return (
                    <tr key={row.sku} style={{ borderBottom: "1px solid rgba(212,175,55,0.07)" }}>
                      <td style={{ padding: "11px 12px" }}>
                        <span style={{ color: "#3d1a2e", fontSize: "12.5px", fontWeight: 600 }}>{row.name}</span>
                      </td>
                      <td style={{ padding: "11px 12px" }}>
                        <span style={{ color: "#9d6b7a", fontSize: "11px", fontFamily: "monospace" }}>{row.sku}</span>
                      </td>
                      <td style={{ padding: "11px 12px" }}>
                        <div className="flex items-center gap-3">
                          <span style={{ color: oos ? "#dc2626" : low ? "#92740d" : "#3d1a2e", fontSize: "14px", fontWeight: 700, minWidth: "40px" }}>{qty}</span>
                          <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(212,175,55,0.1)", minWidth: "60px" }}>
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${pct}%`,
                                background: oos ? "#f43f5e" : low ? "linear-gradient(90deg, #D4AF37, #C9A94E)" : "linear-gradient(90deg, #4ade80, #22c55e)",
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "11px 12px" }}>
                        <span style={{ color: "#9d6b7a", fontSize: "12px" }}>{row.minLevel}</span>
                      </td>
                      <td style={{ padding: "11px 12px" }}>
                        <span
                          className="flex items-center gap-1 px-2.5 py-1 rounded-full w-fit"
                          style={{
                            background: oos ? "rgba(244,63,94,0.1)" : low ? "rgba(212,175,55,0.15)" : "rgba(74,222,128,0.12)",
                            color: oos ? "#dc2626" : low ? "#92740d" : "#16a34a",
                            fontSize: "10.5px",
                            fontWeight: 600,
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: oos ? "#f43f5e" : low ? "#D4AF37" : "#4ade80" }} />
                          {oos ? "Out of Stock" : low ? "Low Stock" : "OK"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transfer History */}
        <div style={glassCard}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 style={{ color: "#3d1a2e", fontSize: "16px", fontWeight: 700 }}>Transfer History</h2>
              <BarChart3 size={16} color="#D4AF37" />
            </div>
            <div className="space-y-3">
              {transferHistory.map((t) => {
                const ss = statusStyle[t.status];
                const Icon = ss.icon;
                return (
                  <div
                    key={t.id}
                    className="p-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.5)", border: "1px solid rgba(212,175,55,0.1)" }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span style={{ color: "#D4AF37", fontSize: "11px", fontWeight: 700 }}>{t.id}</span>
                      <span
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                        style={{ background: ss.bg, color: ss.color, fontSize: "10px", fontWeight: 700 }}
                      >
                        <Icon size={9} />
                        {t.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ color: "#3d1a2e", fontSize: "12px", fontWeight: 600 }}>{t.from}</span>
                      <ArrowRight size={11} color="#9d6b7a" />
                      <span style={{ color: "#3d1a2e", fontSize: "12px", fontWeight: 600 }}>{t.to}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ color: "#9d6b7a", fontSize: "11px" }}>
                        <Package size={9} style={{ display: "inline", marginRight: 3 }} />
                        {t.items} SKUs
                      </span>
                      <span style={{ color: "#c9a0b0", fontSize: "10px" }}>
                        <Clock size={9} style={{ display: "inline", marginRight: 2 }} />
                        {t.date}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── TRANSFER WIZARD MODAL ─────────────────────────────────────────── */}
      {wizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(61,26,46,0.55)", backdropFilter: "blur(8px)" }}>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "white", width: 600, maxHeight: "88vh", overflow: "auto", boxShadow: "0 32px 80px rgba(61,26,46,0.3)" }}
          >
            {/* Wizard Header */}
            <div className="px-6 py-5 border-b" style={{ borderColor: "rgba(212,175,55,0.15)", background: "linear-gradient(135deg, #fdf2f8, #fff7ed)" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 style={{ color: "#3d1a2e", fontSize: "18px", fontWeight: 700 }}>Create Transfer Order</h2>
                <button onClick={() => setWizardOpen(false)} style={{ color: "#9d6b7a", fontSize: "18px" }}>✕</button>
              </div>
              {/* Progress Steps */}
              <div className="flex items-center gap-1">
                {["Select Route", "Choose Items", "Review & Confirm", "Done"].map((s, i) => (
                  <div key={s} className="flex items-center gap-1" style={{ flex: i < 3 ? "1 1 0" : "auto" }}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background: i <= wizardStep ? "linear-gradient(135deg, #D4AF37, #C9A94E)" : "rgba(212,175,55,0.12)",
                          color: i <= wizardStep ? "white" : "#9d6b7a",
                          fontSize: "12px",
                          fontWeight: 700,
                        }}
                      >
                        {i < wizardStep ? "✓" : i + 1}
                      </div>
                      <span style={{ color: i <= wizardStep ? "#3d1a2e" : "#9d6b7a", fontSize: "11px", fontWeight: i <= wizardStep ? 600 : 400, whiteSpace: "nowrap" }}>{s}</span>
                    </div>
                    {i < 3 && <div className="flex-1 h-0.5 mx-2" style={{ background: i < wizardStep ? "#D4AF37" : "rgba(212,175,55,0.2)" }} />}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6">
              {/* Step 0: Select Route */}
              {wizardStep === 0 && (
                <div>
                  <p style={{ color: "#9d6b7a", fontSize: "13px", marginBottom: 16 }}>Select the source and destination warehouse for this transfer.</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label style={{ color: "#6b4153", fontSize: "12px", fontWeight: 600, display: "block", marginBottom: 6 }}>FROM</label>
                      <select
                        value={transferFrom}
                        onChange={(e) => setTransferFrom(e.target.value)}
                        style={{ width: "100%", border: "1px solid rgba(212,175,55,0.35)", borderRadius: 12, padding: "10px 14px", fontSize: "13px", color: "#3d1a2e", outline: "none", background: "rgba(253,242,248,0.4)" }}
                      >
                        <option>Kho Tổng</option>
                        <option>Kho CH1</option>
                        <option>Kho CH2</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ color: "#6b4153", fontSize: "12px", fontWeight: 600, display: "block", marginBottom: 6 }}>TO</label>
                      <select
                        value={transferTo}
                        onChange={(e) => setTransferTo(e.target.value)}
                        style={{ width: "100%", border: "1px solid rgba(212,175,55,0.35)", borderRadius: 12, padding: "10px 14px", fontSize: "13px", color: "#3d1a2e", outline: "none", background: "rgba(253,242,248,0.4)" }}
                      >
                        <option>Kho CH1</option>
                        <option>Kho CH2</option>
                        <option>Kho Tổng</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.2)" }}>
                    <Truck size={16} color="#D4AF37" />
                    <span style={{ color: "#3d1a2e", fontSize: "13px", fontWeight: 600 }}>{transferFrom}</span>
                    <ArrowRight size={14} color="#9d6b7a" />
                    <span style={{ color: "#3d1a2e", fontSize: "13px", fontWeight: 600 }}>{transferTo}</span>
                    <span style={{ color: "#9d6b7a", fontSize: "12px", marginLeft: "auto" }}>Est. delivery: 1–2 hours</span>
                  </div>
                </div>
              )}

              {/* Step 1: Choose Items */}
              {wizardStep === 1 && (
                <div>
                  <p style={{ color: "#9d6b7a", fontSize: "13px", marginBottom: 12 }}>Select items and quantities to transfer from <strong style={{ color: "#3d1a2e" }}>{transferFrom}</strong>.</p>
                  <div className="max-h-72 overflow-y-auto space-y-2" style={{ scrollbarWidth: "thin" }}>
                    {stockData.map((row) => {
                      const checked = !!selectedItems[row.sku];
                      return (
                        <div
                          key={row.sku}
                          onClick={() => toggleItem(row.sku)}
                          className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                          style={{
                            background: checked ? "rgba(212,175,55,0.08)" : "rgba(255,255,255,0.6)",
                            border: `1px solid ${checked ? "rgba(212,175,55,0.4)" : "rgba(212,175,55,0.1)"}`,
                          }}
                        >
                          <div
                            className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                            style={{ background: checked ? "linear-gradient(135deg, #D4AF37, #C9A94E)" : "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)" }}
                          >
                            {checked && <span style={{ color: "white", fontSize: "11px" }}>✓</span>}
                          </div>
                          <div className="flex-1">
                            <p style={{ color: "#3d1a2e", fontSize: "12.5px", fontWeight: 600 }}>{row.name}</p>
                            <p style={{ color: "#9d6b7a", fontSize: "10.5px", fontFamily: "monospace" }}>{row.sku}</p>
                          </div>
                          <div className="text-right">
                            <p style={{ color: "#3d1a2e", fontSize: "12px" }}>Available: <strong>{row.tong}</strong></p>
                          </div>
                          {checked && (
                            <div onClick={(e) => e.stopPropagation()}>
                              <input
                                type="number"
                                value={selectedItems[row.sku]}
                                onChange={(e) => setSelectedItems((prev) => ({ ...prev, [row.sku]: parseInt(e.target.value) || 0 }))}
                                style={{ width: 55, border: "1px solid rgba(212,175,55,0.4)", borderRadius: 8, padding: "4px 8px", fontSize: "12px", textAlign: "center", outline: "none" }}
                                min={1}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {totalSelected > 0 && (
                    <div className="mt-3 px-3 py-2 rounded-xl" style={{ background: "rgba(212,175,55,0.08)" }}>
                      <span style={{ color: "#92740d", fontSize: "12px", fontWeight: 600 }}>
                        {Object.keys(selectedItems).length} SKUs selected · {totalSelected} units total
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Review */}
              {wizardStep === 2 && (
                <div>
                  <div className="p-4 rounded-xl mb-4" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.2)" }}>
                    <div className="flex items-center gap-3 mb-3">
                      <Truck size={18} color="#D4AF37" />
                      <div>
                        <p style={{ color: "#3d1a2e", fontSize: "14px", fontWeight: 700 }}>{transferFrom} → {transferTo}</p>
                        <p style={{ color: "#9d6b7a", fontSize: "11px" }}>Initiated: Apr 12, 2026 · By: Sophia Laurent</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.5)" }}>
                        <p style={{ color: "#9d6b7a", fontSize: "10px" }}>SKUs</p>
                        <p style={{ color: "#3d1a2e", fontSize: "16px", fontWeight: 700 }}>{Object.keys(selectedItems).length}</p>
                      </div>
                      <div className="p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.5)" }}>
                        <p style={{ color: "#9d6b7a", fontSize: "10px" }}>Units</p>
                        <p style={{ color: "#3d1a2e", fontSize: "16px", fontWeight: 700 }}>{totalSelected}</p>
                      </div>
                      <div className="p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.5)" }}>
                        <p style={{ color: "#9d6b7a", fontSize: "10px" }}>Est. Time</p>
                        <p style={{ color: "#3d1a2e", fontSize: "16px", fontWeight: 700 }}>~1.5h</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {Object.entries(selectedItems).map(([sku, qty]) => {
                      const product = stockData.find((r) => r.sku === sku);
                      return (
                        <div key={sku} className="flex justify-between items-center px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.5)", border: "1px solid rgba(212,175,55,0.1)" }}>
                          <div>
                            <p style={{ color: "#3d1a2e", fontSize: "12px", fontWeight: 600 }}>{product?.name}</p>
                            <p style={{ color: "#9d6b7a", fontSize: "10px", fontFamily: "monospace" }}>{sku}</p>
                          </div>
                          <span style={{ color: "#D4AF37", fontSize: "13px", fontWeight: 700 }}>{qty} units</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Done */}
              {wizardStep === 3 && (
                <div className="text-center py-8">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: "linear-gradient(135deg, #4ade80, #22c55e)", boxShadow: "0 8px 24px rgba(34,197,94,0.4)" }}
                  >
                    <CheckCircle2 size={32} color="white" />
                  </div>
                  <h3 style={{ color: "#3d1a2e", fontSize: "18px", fontWeight: 700, marginBottom: 8 }}>Transfer Order Created!</h3>
                  <p style={{ color: "#9d6b7a", fontSize: "13px", marginBottom: 4 }}>
                    {Object.keys(selectedItems).length} SKUs · {totalSelected} units
                  </p>
                  <p style={{ color: "#D4AF37", fontSize: "14px", fontWeight: 700, marginBottom: 4 }}>
                    {transferFrom} → {transferTo}
                  </p>
                  <p style={{ color: "#c9a0b0", fontSize: "12px" }}>Status: Đang vận chuyển · REF-{Date.now().toString().slice(-4)}</p>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-6">
                {wizardStep > 0 && wizardStep < 3 && (
                  <button
                    onClick={() => setWizardStep((s) => (s - 1) as WizardStep)}
                    className="px-5 py-2.5 rounded-xl"
                    style={{ background: "rgba(212,175,55,0.1)", color: "#92740d", fontWeight: 600, fontSize: "13px", border: "1px solid rgba(212,175,55,0.2)" }}
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={() => {
                    if (wizardStep === 3) { setWizardOpen(false); }
                    else { setWizardStep((s) => (s + 1) as WizardStep); }
                  }}
                  disabled={wizardStep === 1 && Object.keys(selectedItems).length === 0}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl"
                  style={{
                    background: (wizardStep === 1 && Object.keys(selectedItems).length === 0) ? "rgba(200,190,190,0.3)" : "linear-gradient(135deg, #D4AF37, #C9A94E)",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "13px",
                    boxShadow: (wizardStep === 1 && Object.keys(selectedItems).length === 0) ? "none" : "0 4px 14px rgba(212,175,55,0.4)",
                  }}
                >
                  {wizardStep === 3 ? "Close" : wizardStep === 2 ? "Confirm & Create" : "Next"}
                  {wizardStep < 3 && <ChevronRight size={15} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}