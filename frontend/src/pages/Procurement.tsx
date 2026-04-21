import { useState } from "react";
import React from "react";
import {
  Truck,
  FileText,
  DollarSign,
  Plus,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Building,
  Wallet,
  ReceiptText,
  CreditCard,
  ShieldOff,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

type Tab = "suppliers" | "orders" | "finance";

const glassCard = {
  background: "rgba(255,255,255,0.72)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.9)",
  boxShadow: "0 8px 32px rgba(61,26,46,0.06)",
  borderRadius: "20px",
};

// ─── Suppliers ───────────────────────────────────────────────────────────────
const suppliers = [
  { id: "SUP-001", name: "L'Oréal Vietnam", contact: "Ms. Linh Phạm", phone: "028 3822 1188", email: "linh.pham@loreal.vn", category: "Makeup / Skincare", orders: 24, lastOrder: "Apr 2, 2026", status: "Active", rating: 5 },
  { id: "SUP-002", name: "Shiseido Import", contact: "Mr. Kenji Tanaka", phone: "028 3911 2234", email: "kenji.t@shiseido-vn.com", category: "Skincare / Fragrance", orders: 18, lastOrder: "Mar 28, 2026", status: "Active", rating: 5 },
  { id: "SUP-003", name: "Coty Vietnam Ltd.", contact: "Ms. An Nguyễn", phone: "028 3822 5566", email: "an.nguyen@coty.vn", category: "Fragrance", orders: 11, lastOrder: "Mar 15, 2026", status: "Active", rating: 4 },
  { id: "SUP-004", name: "TH Cosmetics Supply", contact: "Mr. Hưng Trần", phone: "091 234 5678", email: "hung.tran@th-cosmetics.vn", category: "Packaging / Accessories", orders: 7, lastOrder: "Feb 20, 2026", status: "Inactive", rating: 3 },
  { id: "SUP-005", name: "Natural Essence Co.", contact: "Ms. Mai Lê", phone: "028 3913 9900", email: "mai.le@naturalessence.vn", category: "Body Care / Wellness", orders: 14, lastOrder: "Apr 8, 2026", status: "Active", rating: 4 },
];

type OrderStatus = "Delivered" | "In Transit" | "Processing" | "Cancelled";

interface PurchaseOrder {
  id: string;
  supplier: string;
  items: number;
  value: number;
  date: string;
  eta: string;
  status: OrderStatus;
}

const purchaseOrders: PurchaseOrder[] = [
  { id: "PO-2026-041", supplier: "L'Oréal Vietnam", items: 8, value: 48500000, date: "Apr 10, 2026", eta: "Apr 15, 2026", status: "In Transit" },
  { id: "PO-2026-040", supplier: "Shiseido Import", items: 5, value: 72000000, date: "Apr 8, 2026", eta: "Apr 13, 2026", status: "In Transit" },
  { id: "PO-2026-039", supplier: "Natural Essence Co.", items: 12, value: 31200000, date: "Apr 5, 2026", eta: "Apr 9, 2026", status: "Delivered" },
  { id: "PO-2026-038", supplier: "Coty Vietnam Ltd.", items: 4, value: 54000000, date: "Mar 28, 2026", eta: "Apr 3, 2026", status: "Delivered" },
  { id: "PO-2026-037", supplier: "L'Oréal Vietnam", items: 6, value: 38800000, date: "Mar 20, 2026", eta: "Mar 27, 2026", status: "Delivered" },
  { id: "PO-2026-036", supplier: "TH Cosmetics Supply", items: 3, value: 12000000, date: "Mar 15, 2026", eta: "Mar 22, 2026", status: "Cancelled" },
];

const poStatusStyle: Record<OrderStatus, { bg: string; color: string; icon: React.ElementType }> = {
  Delivered: { bg: "rgba(74,222,128,0.12)", color: "#16a34a", icon: CheckCircle2 },
  "In Transit": { bg: "rgba(212,175,55,0.15)", color: "#92740d", icon: Truck },
  Processing: { bg: "rgba(147,197,253,0.2)", color: "#1d4ed8", icon: Clock },
  Cancelled: { bg: "rgba(244,63,94,0.1)", color: "#dc2626", icon: AlertTriangle },
};

// ─── Finance ──────────────────────────────────────────────────────────────────
interface FinanceTransaction {
  id: string;
  type: "income" | "expense" | "return" | "supplier";
  desc: string;
  amount: number;
  date: string;
  account: "cash" | "bank";
  ref: string;
}

const financeTransactions: FinanceTransaction[] = [
  { id: "TXF-0081", type: "income", desc: "Daily Sales — CH1", amount: 18400000, date: "Apr 12, 2026", account: "cash", ref: "REV-0081" },
  { id: "TXF-0082", type: "income", desc: "Online Orders", amount: 32100000, date: "Apr 12, 2026", account: "bank", ref: "REV-0082" },
  { id: "TXF-0083", type: "expense", desc: "Rent — CH1 (April)", amount: -15000000, date: "Apr 10, 2026", account: "bank", ref: "EXP-RENT" },
  { id: "TXF-0084", type: "expense", desc: "Utilities — HQ", amount: -3200000, date: "Apr 10, 2026", account: "bank", ref: "EXP-UTIL" },
  { id: "TXF-0085", type: "return", desc: "Trả tiền khách — INV-4419", amount: -1200000, date: "Apr 11, 2026", account: "cash", ref: "RET-0041" },
  { id: "TXF-0086", type: "supplier", desc: "Trả NCC — Shiseido PO-038", amount: -54000000, date: "Apr 9, 2026", account: "bank", ref: "PAY-SUP-038" },
  { id: "TXF-0087", type: "income", desc: "Daily Sales — CH2", amount: 14800000, date: "Apr 12, 2026", account: "cash", ref: "REV-0083" },
  { id: "TXF-0088", type: "expense", desc: "Rent — CH2 (April)", amount: -12000000, date: "Apr 10, 2026", account: "bank", ref: "EXP-RENT2" },
];

const expenses = [
  { name: "Rent — CH1", amount: 15000000, account: "bank", due: "Apr 10" },
  { name: "Rent — CH2", amount: 12000000, account: "bank", due: "Apr 10" },
  { name: "Utilities — HQ", amount: 3200000, account: "bank", due: "Apr 10" },
  { name: "Internet & Phone", amount: 800000, account: "cash", due: "Apr 15" },
  { name: "Cleaning Services", amount: 2400000, account: "cash", due: "Apr 20" },
];

function fmtVND(n: number) {
  return Math.abs(n).toLocaleString("vi-VN") + " ₫";
}

export function Procurement() {
  const [activeTab, setActiveTab] = useState<Tab>("suppliers");
  const [showPOModal, setShowPOModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";
  const cashBalance = 24800000;
  const bankBalance = 312400000;

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "suppliers", label: "Supplier Directory", icon: Building },
    { key: "orders", label: "Purchase Orders", icon: FileText },
    { key: "finance", label: "Finance & Cash Flow", icon: DollarSign },
  ];

  const txTypeStyle = {
    income: { color: "#16a34a", sign: "+" },
    expense: { color: "#dc2626", sign: "" },
    return: { color: "#be185d", sign: "" },
    supplier: { color: "#7c3aed", sign: "" },
  };

  const txTypeLabel: Record<FinanceTransaction["type"], string> = {
    income: "Revenue",
    expense: "Expense",
    return: "Trả Tiền Khách",
    supplier: "Trả NCC",
  };

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p style={{ color: "#9d6b7a", fontSize: "13px", fontWeight: 500, letterSpacing: "0.05em" }}>
            Supply Chain & Accounting
          </p>
          <h1 style={{ color: "#3d1a2e", fontSize: "26px", fontWeight: 700, marginTop: 2 }}>
            Procurement & Finance
          </h1>
        </div>
        <button
          onClick={() => setShowPOModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl"
          style={{ background: "linear-gradient(135deg, #D4AF37, #C9A94E)", boxShadow: "0 6px 20px rgba(212,175,55,0.4)", color: "white", fontSize: "13px", fontWeight: 600 }}
        >
          <Plus size={16} />
          New Purchase Order
        </button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {[
          { label: "Cash on Hand", value: fmtVND(cashBalance), icon: Wallet, color: "#4ade80", sub: "All branches combined" },
          { label: "Bank Balance", value: fmtVND(bankBalance), icon: CreditCard, color: "#D4AF37", sub: "Shared company account" },
          { label: "Pending Orders", value: "2", icon: Truck, color: "#F48FB1", sub: "In transit to warehouse" },
          { label: "Monthly Expenses", value: fmtVND(33400000), icon: ReceiptText, color: "#C084FC", sub: "Rent, utilities & ops" },
        ].map((k) => (
          <div key={k.label} style={glassCard} className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${k.color}18` }}>
              <k.icon size={22} color={k.color} strokeWidth={1.8} />
            </div>
            <div>
              <p style={{ color: "#9d6b7a", fontSize: "12px" }}>{k.label}</p>
              <p style={{ color: "#3d1a2e", fontSize: "15px", fontWeight: 700, marginTop: 2 }}>{k.value}</p>
              <p style={{ color: "#c9a0b0", fontSize: "10px", marginTop: 2 }}>{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
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
          </button>
        ))}
      </div>

      {/* ── SUPPLIERS ────────────────────────────────────────────────────── */}
      {activeTab === "suppliers" && (
        <div className="grid grid-cols-1 gap-4">
          {suppliers.map((s) => (
            <div
              key={s.id}
              style={{ ...glassCard, cursor: "pointer" }}
              className="p-5 transition-all"
              onClick={() => setSelectedSupplier(selectedSupplier === s.id ? null : s.id)}
            >
              <div className="flex items-start gap-5">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.15), rgba(244,143,177,0.1))", border: "1px solid rgba(212,175,55,0.25)" }}
                >
                  <Building size={22} color="#D4AF37" strokeWidth={1.8} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p style={{ color: "#3d1a2e", fontSize: "15px", fontWeight: 700 }}>{s.name}</p>
                    <span
                      className="px-2 py-0.5 rounded-full"
                      style={{
                        background: s.status === "Active" ? "rgba(74,222,128,0.12)" : "rgba(244,63,94,0.1)",
                        color: s.status === "Active" ? "#16a34a" : "#dc2626",
                        fontSize: "10px",
                        fontWeight: 600,
                      }}
                    >
                      {s.status}
                    </span>
                    <span style={{ color: "rgba(212,175,55,0.9)", fontSize: "13px" }}>{"★".repeat(s.rating)}</span>
                  </div>
                  <p style={{ color: "#9d6b7a", fontSize: "12px", marginTop: 3 }}>{s.contact} · {s.category}</p>
                </div>
                <div className="text-right shrink-0">
                  <p style={{ color: "#D4AF37", fontSize: "18px", fontWeight: 800 }}>{s.orders}</p>
                  <p style={{ color: "#9d6b7a", fontSize: "11px" }}>orders placed</p>
                  <p style={{ color: "#c9a0b0", fontSize: "10px", marginTop: 2 }}>Last: {s.lastOrder}</p>
                </div>
              </div>

              {selectedSupplier === s.id && (
                <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4" style={{ borderColor: "rgba(212,175,55,0.15)" }}>
                  <div className="flex items-center gap-2">
                    <Phone size={13} color="#D4AF37" />
                    <span style={{ color: "#6b4153", fontSize: "12px" }}>{s.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={13} color="#D4AF37" />
                    <span style={{ color: "#6b4153", fontSize: "12px" }}>{s.email}</span>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      className="px-4 py-1.5 rounded-lg"
                      style={{ background: "rgba(212,175,55,0.12)", color: "#92740d", fontSize: "12px", fontWeight: 600 }}
                    >
                      View Orders
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowPOModal(true); }}
                      className="px-4 py-1.5 rounded-lg"
                      style={{ background: "linear-gradient(135deg, #D4AF37, #C9A94E)", color: "white", fontSize: "12px", fontWeight: 600 }}
                    >
                      New PO
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── PURCHASE ORDERS ───────────────────────────────────────────────── */}
      {activeTab === "orders" && (
        <div style={glassCard}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 style={{ color: "#3d1a2e", fontSize: "16px", fontWeight: 700 }}>Purchase Orders</h2>
              <div className="flex gap-3 items-center">
                <span style={{ color: "#9d6b7a", fontSize: "12px" }}>
                  Total: <strong style={{ color: "#D4AF37" }}>
                    {fmtVND(purchaseOrders.reduce((s, o) => s + o.value, 0))}
                  </strong>
                </span>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(212,175,55,0.15)" }}>
                  {["PO Number", "Supplier", "Items", "Order Value", "Order Date", "ETA", "Status"].map((h) => (
                    <th key={h} style={{ color: "#9d6b7a", fontSize: "10.5px", fontWeight: 600, letterSpacing: "0.07em", padding: "10px 12px", textAlign: "left" }}>
                      {h.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {purchaseOrders.map((po) => {
                  const ss = poStatusStyle[po.status];
                  const StatusIcon = ss.icon;
                  return (
                    <tr key={po.id} style={{ borderBottom: "1px solid rgba(212,175,55,0.07)" }}>
                      <td style={{ padding: "13px 12px" }}>
                        <span style={{ color: "#D4AF37", fontSize: "12px", fontWeight: 700 }}>{po.id}</span>
                      </td>
                      <td style={{ padding: "13px 12px" }}>
                        <span style={{ color: "#3d1a2e", fontSize: "13px", fontWeight: 600 }}>{po.supplier}</span>
                      </td>
                      <td style={{ padding: "13px 12px" }}>
                        <span style={{ color: "#9d6b7a", fontSize: "13px" }}>{po.items} SKUs</span>
                      </td>
                      <td style={{ padding: "13px 12px" }}>
                        <span style={{ color: "#3d1a2e", fontSize: "13px", fontWeight: 700 }}>{fmtVND(po.value)}</span>
                      </td>
                      <td style={{ padding: "13px 12px" }}>
                        <span style={{ color: "#9d6b7a", fontSize: "12px" }}>{po.date}</span>
                      </td>
                      <td style={{ padding: "13px 12px" }}>
                        <span style={{ color: "#6b4153", fontSize: "12px" }}>{po.eta}</span>
                      </td>
                      <td style={{ padding: "13px 12px" }}>
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit" style={{ background: ss.bg, color: ss.color, fontSize: "11px", fontWeight: 600 }}>
                          <StatusIcon size={11} />
                          {po.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── FINANCE ───────────────────────────────────────────────────────── */}
      {activeTab === "finance" && (
        <div>
          {/* Balance Cards */}
          <div className="grid grid-cols-2 gap-5 mb-6">
            <div style={glassCard} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wallet size={20} color="#4ade80" />
                  <h3 style={{ color: "#3d1a2e", fontSize: "15px", fontWeight: 700 }}>Cash Balance</h3>
                </div>
                <span style={{ color: "#9d6b7a", fontSize: "11px" }}>Branch-level</span>
              </div>
              <p style={{ color: "#4ade80", fontSize: "28px", fontWeight: 800 }}>{fmtVND(cashBalance)}</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)" }}>
                  <p style={{ color: "#9d6b7a", fontSize: "10px" }}>HQ Vault</p>
                  <p style={{ color: "#3d1a2e", fontSize: "14px", fontWeight: 700 }}>{fmtVND(8400000)}</p>
                </div>
                <div className="p-3 rounded-xl" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)" }}>
                  <p style={{ color: "#9d6b7a", fontSize: "10px" }}>CH1 + CH2</p>
                  <p style={{ color: "#3d1a2e", fontSize: "14px", fontWeight: 700 }}>{fmtVND(16400000)}</p>
                </div>
              </div>
            </div>

            {/* Bank Account — Admin only */}
            {isAdmin ? (
              <div style={glassCard} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CreditCard size={20} color="#D4AF37" />
                    <h3 style={{ color: "#3d1a2e", fontSize: "15px", fontWeight: 700 }}>Bank Account</h3>
                  </div>
                  <span style={{ color: "#9d6b7a", fontSize: "11px" }}>Shared company</span>
                </div>
                <p style={{ color: "#D4AF37", fontSize: "28px", fontWeight: 800 }}>{fmtVND(bankBalance)}</p>
                <div className="mt-4 p-3 rounded-xl" style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)" }}>
                  <p style={{ color: "#9d6b7a", fontSize: "10px" }}>VCB — 123 456 789 000</p>
                  <p style={{ color: "#6b4153", fontSize: "12px", fontWeight: 600 }}>Lumière Beauty Studio Co., Ltd.</p>
                </div>
              </div>
            ) : (
              /* Restricted Bank Balance for non-admin */
              <div
                style={{ ...glassCard, position: "relative", overflow: "hidden" }}
                className="p-6 flex flex-col items-center justify-center"
              >
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.6)",
                    backdropFilter: "blur(10px)",
                    zIndex: 1,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.25)" }}
                  >
                    <ShieldOff size={22} color="#f43f5e" />
                  </div>
                  <p style={{ color: "#3d1a2e", fontSize: "14px", fontWeight: 700, marginBottom: 4 }}>
                    Restricted
                  </p>
                  <p style={{ color: "#9d6b7a", fontSize: "12px", textAlign: "center" }}>
                    Shared Bank Account is<br />visible to Admins only.
                  </p>
                </div>
                {/* Blurred background content */}
                <div style={{ filter: "blur(6px)", opacity: 0.3 }}>
                  <p style={{ color: "#D4AF37", fontSize: "28px", fontWeight: 800 }}>••• ••• •••</p>
                  <p style={{ color: "#9d6b7a", fontSize: "12px" }}>VCB — ••• ••• ••• •••</p>
                </div>
              </div>
            )}
          </div>

          {/* Expenses + Transactions */}
          <div className="grid grid-cols-5 gap-5">
            {/* Fixed Expenses */}
            <div className="col-span-2" style={glassCard}>
              <div className="p-5">
                <h3 style={{ color: "#3d1a2e", fontSize: "14px", fontWeight: 700, marginBottom: 16 }}>Monthly Fixed Expenses</h3>
                <div className="space-y-3">
                  {expenses.map((e) => (
                    <div key={e.name} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.5)", border: "1px solid rgba(244,63,94,0.08)" }}>
                      <div>
                        <p style={{ color: "#3d1a2e", fontSize: "12px", fontWeight: 600 }}>{e.name}</p>
                        <p style={{ color: "#9d6b7a", fontSize: "10px" }}>
                          Due: {e.due} · {e.account === "bank" ? "Bank" : "Cash"}
                        </p>
                      </div>
                      <span style={{ color: "#dc2626", fontSize: "13px", fontWeight: 700 }}>−{fmtVND(e.amount)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t flex justify-between" style={{ borderColor: "rgba(212,175,55,0.15)" }}>
                  <span style={{ color: "#6b4153", fontSize: "13px", fontWeight: 700 }}>Total Expenses</span>
                  <span style={{ color: "#dc2626", fontSize: "14px", fontWeight: 800 }}>
                    −{fmtVND(expenses.reduce((s, e) => s + e.amount, 0))}
                  </span>
                </div>
              </div>
            </div>

            {/* Transaction Log */}
            <div className="col-span-3" style={glassCard}>
              <div className="p-5">
                <h3 style={{ color: "#3d1a2e", fontSize: "14px", fontWeight: 700, marginBottom: 16 }}>Transaction Log</h3>
                <div className="space-y-2.5">
                  {financeTransactions.map((tx) => {
                    const ts = txTypeStyle[tx.type];
                    const isPositive = tx.amount > 0;
                    return (
                      <div key={tx.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.5)", border: "1px solid rgba(212,175,55,0.08)" }}>
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: isPositive ? "rgba(74,222,128,0.12)" : "rgba(244,63,94,0.08)" }}
                        >
                          {isPositive
                            ? <ArrowUpRight size={16} color="#16a34a" />
                            : <ArrowDownRight size={16} color="#dc2626" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p style={{ color: "#3d1a2e", fontSize: "12px", fontWeight: 600 }} className="truncate">{tx.desc}</p>
                            <span
                              className="px-1.5 py-0.5 rounded shrink-0"
                              style={{ background: `${ts.color}15`, color: ts.color, fontSize: "9px", fontWeight: 700 }}
                            >
                              {txTypeLabel[tx.type]}
                            </span>
                          </div>
                          <p style={{ color: "#9d6b7a", fontSize: "10px" }}>{tx.date} · {tx.account === "bank" ? "Bank" : "Cash"} · {tx.ref}</p>
                        </div>
                        <span style={{ color: isPositive ? "#16a34a" : "#dc2626", fontSize: "13px", fontWeight: 700, flexShrink: 0 }}>
                          {isPositive ? "+" : "−"}{fmtVND(tx.amount)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── New PO Modal ─────────────────────────────────────────────────── */}
      {showPOModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(61,26,46,0.55)", backdropFilter: "blur(8px)" }}>
          <div className="rounded-2xl p-6" style={{ background: "white", width: 480, boxShadow: "0 32px 80px rgba(61,26,46,0.3)" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 style={{ color: "#3d1a2e", fontSize: "18px", fontWeight: 700 }}>New Purchase Order</h2>
              <button onClick={() => setShowPOModal(false)} style={{ color: "#9d6b7a" }}>✕</button>
            </div>
            <div className="space-y-4">
              {[
                { label: "Supplier", type: "select", options: suppliers.map((s) => s.name) },
                { label: "Delivery To", type: "select", options: ["Kho Tổng", "Kho CH1", "Kho CH2"] },
                { label: "Expected Delivery Date", type: "date" },
                { label: "Notes / Special Instructions", type: "textarea" },
              ].map((field) => (
                <div key={field.label}>
                  <label style={{ color: "#6b4153", fontSize: "12px", fontWeight: 600, display: "block", marginBottom: 6 }}>{field.label}</label>
                  {field.type === "select" ? (
                    <select style={{ width: "100%", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 12, padding: "10px 14px", fontSize: "13px", color: "#3d1a2e", outline: "none", background: "rgba(253,242,248,0.3)" }}>
                      {field.options?.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  ) : field.type === "textarea" ? (
                    <textarea
                      rows={3}
                      style={{ width: "100%", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 12, padding: "10px 14px", fontSize: "13px", color: "#3d1a2e", outline: "none", background: "rgba(253,242,248,0.3)", resize: "none" }}
                    />
                  ) : (
                    <input
                      type="date"
                      style={{ width: "100%", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 12, padding: "10px 14px", fontSize: "13px", color: "#3d1a2e", outline: "none", background: "rgba(253,242,248,0.3)" }}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowPOModal(false)} className="flex-1 py-2.5 rounded-xl" style={{ background: "rgba(212,175,55,0.1)", color: "#92740d", fontWeight: 600, fontSize: "13px", border: "1px solid rgba(212,175,55,0.2)" }}>
                Cancel
              </button>
              <button onClick={() => setShowPOModal(false)} className="flex-1 py-2.5 rounded-xl" style={{ background: "linear-gradient(135deg, #D4AF37, #C9A94E)", color: "white", fontWeight: 700, fontSize: "13px", boxShadow: "0 4px 14px rgba(212,175,55,0.4)" }}>
                Create PO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}