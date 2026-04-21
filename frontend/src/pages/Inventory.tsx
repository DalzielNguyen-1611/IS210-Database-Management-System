import { Search, Filter, Plus, AlertTriangle, Package } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const glassCard = {
  background: "rgba(255,255,255,0.72)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.9)",
  boxShadow: "0 8px 32px rgba(61,26,46,0.06)",
  borderRadius: "20px",
};

const products = [
  {
    id: "PRD-001",
    name: "Rose Velvet Lip Serum",
    category: "Lips",
    price: "$32.00",
    stock: 284,
    status: "In Stock",
    sku: "LVL-ROS-001",
    img: "https://images.unsplash.com/photo-1773372238338-f26460145162?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
  },
  {
    id: "PRD-002",
    name: "Golden Glow Foundation",
    category: "Face",
    price: "$48.00",
    stock: 156,
    status: "In Stock",
    sku: "FAC-GLD-002",
    img: "https://images.unsplash.com/photo-1650529192390-19528c5db606?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
  },
  {
    id: "PRD-003",
    name: "Lumière Perfume Eau",
    category: "Fragrance",
    price: "$95.00",
    stock: 42,
    status: "Low Stock",
    sku: "FRG-LUM-003",
    img: "https://images.unsplash.com/photo-1630573133526-8d090e0269af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
  },
  {
    id: "PRD-004",
    name: "Pearl Radiance Cream",
    category: "Skincare",
    price: "$68.00",
    stock: 0,
    status: "Out of Stock",
    sku: "SKN-PRL-004",
    img: "https://images.unsplash.com/photo-1772191530787-b9546da02fbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
  },
  {
    id: "PRD-005",
    name: "Midnight Eye Palette",
    category: "Eyes",
    price: "$58.00",
    stock: 193,
    status: "In Stock",
    sku: "EYE-MID-005",
    img: "https://images.unsplash.com/photo-1513122991877-4a5678e6d72f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
  },
  {
    id: "PRD-006",
    name: "Rose Velvet Lip Serum – Nude",
    category: "Lips",
    price: "$32.00",
    stock: 77,
    status: "In Stock",
    sku: "LVL-NUD-006",
    img: "https://images.unsplash.com/photo-1773372238338-f26460145162?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
  },
  {
    id: "PRD-007",
    name: "Golden Glow Highlighter",
    category: "Face",
    price: "$38.00",
    stock: 23,
    status: "Low Stock",
    sku: "FAC-HGL-007",
    img: "https://images.unsplash.com/photo-1650529192390-19528c5db606?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
  },
  {
    id: "PRD-008",
    name: "Velvet Rose Blush",
    category: "Face",
    price: "$42.00",
    stock: 318,
    status: "In Stock",
    sku: "FAC-BLS-008",
    img: "https://images.unsplash.com/photo-1513122991877-4a5678e6d72f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
  },
];

const statusStyle: Record<string, { bg: string; color: string; dot: string }> = {
  "In Stock": { bg: "rgba(74,222,128,0.12)", color: "#16a34a", dot: "#4ade80" },
  "Low Stock": { bg: "rgba(212,175,55,0.15)", color: "#92740d", dot: "#D4AF37" },
  "Out of Stock": { bg: "rgba(244,63,94,0.1)", color: "#dc2626", dot: "#f43f5e" },
};

export function Inventory() {
  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p style={{ color: "#9d6b7a", fontSize: "13px", fontWeight: 500, letterSpacing: "0.05em" }}>
            Product Management
          </p>
          <h1 style={{ color: "#3d1a2e", fontSize: "26px", fontWeight: 700, marginTop: 2 }}>
            Inventory
          </h1>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl"
          style={{
            background: "linear-gradient(135deg, #D4AF37, #C9A94E)",
            boxShadow: "0 6px 20px rgba(212,175,55,0.4)",
            color: "white",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        {[
          { label: "Total Products", value: "1,284", icon: Package, color: "#D4AF37" },
          { label: "In Stock", value: "1,102", icon: Package, color: "#4ade80" },
          { label: "Low Stock", value: "84", icon: AlertTriangle, color: "#D4AF37" },
          { label: "Out of Stock", value: "98", icon: AlertTriangle, color: "#f43f5e" },
        ].map((s) => (
          <div key={s.label} style={glassCard} className="p-5 flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: `${s.color}20` }}
            >
              <s.icon size={22} color={s.color} strokeWidth={1.8} />
            </div>
            <div>
              <p style={{ color: "#9d6b7a", fontSize: "12px" }}>{s.label}</p>
              <p style={{ color: "#3d1a2e", fontSize: "22px", fontWeight: 700 }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={glassCard}>
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-5">
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
              style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(212,175,55,0.2)" }}
            >
              <Search size={15} color="#9d6b7a" />
              <input
                placeholder="Search inventory..."
                style={{ border: "none", outline: "none", background: "transparent", color: "#3d1a2e", fontSize: "13px", width: "220px" }}
              />
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
              style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.25)", color: "#92740d", fontSize: "13px" }}
            >
              <Filter size={14} />
              Filters
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(212,175,55,0.15)" }}>
                {["Product", "SKU", "Category", "Price", "Stock", "Status"].map((h) => (
                  <th
                    key={h}
                    style={{ color: "#9d6b7a", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", padding: "10px 12px", textAlign: "left" }}
                  >
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p.id}
                  style={{ borderBottom: "1px solid rgba(212,175,55,0.08)" }}
                  className="transition-all"
                >
                  <td style={{ padding: "12px" }}>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl overflow-hidden"
                        style={{ border: "1px solid rgba(212,175,55,0.2)" }}
                      >
                        <ImageWithFallback src={p.img} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <span style={{ color: "#3d1a2e", fontSize: "13px", fontWeight: 600 }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ color: "#9d6b7a", fontSize: "12px", fontFamily: "monospace" }}>{p.sku}</span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span
                      className="px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(212,175,55,0.1)", color: "#92740d", fontSize: "11px", fontWeight: 600 }}
                    >
                      {p.category}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ color: "#3d1a2e", fontSize: "13px", fontWeight: 700 }}>{p.price}</span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ color: p.stock === 0 ? "#dc2626" : p.stock < 50 ? "#92740d" : "#3d1a2e", fontSize: "13px", fontWeight: 600 }}>
                      {p.stock}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit"
                      style={{ background: statusStyle[p.status].bg, color: statusStyle[p.status].color, fontSize: "11px", fontWeight: 600 }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusStyle[p.status].dot }} />
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
