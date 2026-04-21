import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Bell,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const revenueData = [
  { month: "Jan", revenue: 42000, orders: 180 },
  { month: "Feb", revenue: 38000, orders: 155 },
  { month: "Mar", revenue: 55000, orders: 220 },
  { month: "Apr", revenue: 49000, orders: 196 },
  { month: "May", revenue: 63000, orders: 251 },
  { month: "Jun", revenue: 71000, orders: 284 },
  { month: "Jul", revenue: 68000, orders: 272 },
  { month: "Aug", revenue: 82000, orders: 329 },
  { month: "Sep", revenue: 76000, orders: 304 },
  { month: "Oct", revenue: 91000, orders: 364 },
  { month: "Nov", revenue: 88000, orders: 352 },
  { month: "Dec", revenue: 105000, orders: 420 },
];

const topProducts = [
  {
    name: "Rose Velvet Lip Serum",
    category: "Lips",
    sales: 1842,
    revenue: "$36,840",
    growth: 24.5,
    color: "#F48FB1",
    img: "https://images.unsplash.com/photo-1773372238338-f26460145162?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
  },
  {
    name: "Golden Glow Foundation",
    category: "Face",
    sales: 1654,
    revenue: "$49,620",
    growth: 18.2,
    color: "#D4AF37",
    img: "https://images.unsplash.com/photo-1650529192390-19528c5db606?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
  },
  {
    name: "Lumière Perfume Eau",
    category: "Fragrance",
    sales: 1421,
    revenue: "$71,050",
    growth: 31.7,
    color: "#C084FC",
    img: "https://images.unsplash.com/photo-1630573133526-8d090e0269af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
  },
  {
    name: "Pearl Radiance Cream",
    category: "Skincare",
    sales: 1287,
    revenue: "$38,610",
    growth: -4.2,
    color: "#FDA4AF",
    img: "https://images.unsplash.com/photo-1772191530787-b9546da02fbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
  },
  {
    name: "Midnight Eye Palette",
    category: "Eyes",
    sales: 1103,
    revenue: "$44,120",
    growth: 12.8,
    color: "#F9A8D4",
    img: "https://images.unsplash.com/photo-1513122991877-4a5678e6d72f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
  },
];

const categoryData = [
  { name: "Skincare", value: 35, color: "#F48FB1" },
  { name: "Makeup", value: 28, color: "#D4AF37" },
  { name: "Fragrance", value: 18, color: "#C084FC" },
  { name: "Haircare", value: 12, color: "#FDA4AF" },
  { name: "Body Care", value: 7, color: "#FDE68A" },
];

const recentOrders = [
  { id: "#ORD-8821", customer: "Emma Rosé", product: "Rose Velvet Lip Serum", amount: "$198", status: "Delivered" },
  { id: "#ORD-8820", customer: "Isabelle Chen", product: "Golden Glow Foundation", amount: "$320", status: "Processing" },
  { id: "#ORD-8819", customer: "Natalie Park", product: "Lumière Perfume Eau", amount: "$450", status: "Shipped" },
  { id: "#ORD-8818", customer: "Olivia Martin", product: "Pearl Radiance Cream", amount: "$156", status: "Delivered" },
  { id: "#ORD-8817", customer: "Charlotte Dubois", product: "Midnight Eye Palette", amount: "$278", status: "Pending" },
];

const statusStyle: Record<string, { bg: string; color: string }> = {
  Delivered: { bg: "rgba(74,222,128,0.15)", color: "#16a34a" },
  Processing: { bg: "rgba(212,175,55,0.15)", color: "#92740d" },
  Shipped: { bg: "rgba(147,51,234,0.15)", color: "#7c3aed" },
  Pending: { bg: "rgba(244,143,177,0.15)", color: "#be185d" },
};

const glassCard = {
  background: "rgba(255,255,255,0.72)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.9)",
  boxShadow: "0 8px 32px rgba(61,26,46,0.06)",
  borderRadius: "20px",
};

interface TooltipProps {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "rgba(255,255,255,0.95)",
          border: "1px solid rgba(212,175,55,0.3)",
          borderRadius: "12px",
          padding: "12px 16px",
          boxShadow: "0 8px 24px rgba(61,26,46,0.12)",
        }}
      >
        <p style={{ color: "#7a3055", fontSize: "12px", fontWeight: 600, marginBottom: 4 }}>{label}</p>
        <p style={{ color: "#D4AF37", fontSize: "14px", fontWeight: 700 }}>
          ${(payload[0].value / 1000).toFixed(0)}K
        </p>
      </div>
    );
  }
  return null;
};

export function Dashboard() {
  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p style={{ color: "#9d6b7a", fontSize: "13px", fontWeight: 500, letterSpacing: "0.05em" }}>
            Sunday, April 12, 2026
          </p>
          <h1 style={{ color: "#3d1a2e", fontSize: "26px", fontWeight: 700, marginTop: 2 }}>
            Welcome back, Sophia ✨
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.72)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 4px 16px rgba(61,26,46,0.06)" }}
          >
            <Search size={16} color="#9d6b7a" />
            <input
              placeholder="Search products..."
              style={{ border: "none", outline: "none", background: "transparent", color: "#3d1a2e", fontSize: "13px", width: "180px" }}
            />
          </div>
          <button
            className="relative w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.72)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 4px 16px rgba(61,26,46,0.06)" }}
          >
            <Bell size={18} color="#7a3055" />
            <span
              className="absolute top-2 right-2 w-2 h-2 rounded-full"
              style={{ background: "#F48FB1", boxShadow: "0 0 6px #F48FB1" }}
            />
          </button>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer"
            style={{ background: "linear-gradient(135deg, #D4AF37, #C9A94E)", boxShadow: "0 4px 16px rgba(212,175,55,0.35)" }}
          >
            <Sparkles size={14} color="white" />
            <span style={{ color: "white", fontSize: "13px", fontWeight: 600 }}>New Report</span>
            <ChevronDown size={14} color="white" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {[
          {
            label: "Total Revenue",
            value: "$847,320",
            change: "+18.4%",
            up: true,
            sub: "vs. last year",
            icon: TrendingUp,
            gradient: "linear-gradient(135deg, #D4AF37, #C9A94E)",
            glow: "rgba(212,175,55,0.35)",
          },
          {
            label: "Total Orders",
            value: "12,847",
            change: "+12.1%",
            up: true,
            sub: "vs. last month",
            icon: ShoppingBag,
            gradient: "linear-gradient(135deg, #F48FB1, #E879A0)",
            glow: "rgba(244,143,177,0.35)",
          },
          {
            label: "Active Customers",
            value: "4,621",
            change: "+8.9%",
            up: true,
            sub: "new this quarter",
            icon: Users,
            gradient: "linear-gradient(135deg, #C084FC, #A855F7)",
            glow: "rgba(192,132,252,0.35)",
          },
          {
            label: "Avg. Rating",
            value: "4.92",
            change: "+0.3",
            up: true,
            sub: "from 2,104 reviews",
            icon: Star,
            gradient: "linear-gradient(135deg, #FDA4AF, #FB7185)",
            glow: "rgba(253,164,175,0.35)",
          },
        ].map((stat) => (
          <div key={stat.label} style={glassCard} className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p style={{ color: "#9d6b7a", fontSize: "12px", fontWeight: 500, letterSpacing: "0.05em" }}>
                  {stat.label}
                </p>
                <p style={{ color: "#3d1a2e", fontSize: "24px", fontWeight: 700, marginTop: 4 }}>
                  {stat.value}
                </p>
              </div>
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: stat.gradient, boxShadow: `0 6px 20px ${stat.glow}` }}
              >
                <stat.icon size={20} color="white" strokeWidth={2} />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="flex items-center gap-0.5 px-2 py-0.5 rounded-full"
                style={{ background: stat.up ? "rgba(74,222,128,0.12)" : "rgba(244,63,94,0.12)" }}
              >
                {stat.up ? (
                  <ArrowUpRight size={12} color="#16a34a" />
                ) : (
                  <ArrowDownRight size={12} color="#dc2626" />
                )}
                <span style={{ color: stat.up ? "#16a34a" : "#dc2626", fontSize: "11px", fontWeight: 600 }}>
                  {stat.change}
                </span>
              </div>
              <span style={{ color: "#9d6b7a", fontSize: "11px" }}>{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        {/* Revenue Chart */}
        <div className="col-span-2" style={glassCard}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 style={{ color: "#3d1a2e", fontSize: "16px", fontWeight: 700 }}>Revenue Overview</h2>
                <p style={{ color: "#9d6b7a", fontSize: "12px", marginTop: 2 }}>Annual performance 2025</p>
              </div>
              <div className="flex gap-2">
                {["1W", "1M", "1Y"].map((t, i) => (
                  <button
                    key={t}
                    className="px-3 py-1.5 rounded-lg text-sm"
                    style={{
                      background: i === 2 ? "linear-gradient(135deg, #D4AF37, #C9A94E)" : "rgba(212,175,55,0.08)",
                      color: i === 2 ? "white" : "#9d6b7a",
                      fontSize: "12px",
                      fontWeight: i === 2 ? 600 : 400,
                      border: "1px solid",
                      borderColor: i === 2 ? "transparent" : "rgba(212,175,55,0.2)",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#D4AF37" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="pinkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F48FB1" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#F48FB1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)" />
                <XAxis dataKey="month" tick={{ fill: "#9d6b7a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9d6b7a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#D4AF37"
                  strokeWidth={2.5}
                  fill="url(#revenueGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#D4AF37", stroke: "white", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie */}
        <div style={glassCard} className="p-6">
          <h2 style={{ color: "#3d1a2e", fontSize: "16px", fontWeight: 700, marginBottom: 4 }}>
            Sales by Category
          </h2>
          <p style={{ color: "#9d6b7a", fontSize: "12px", marginBottom: 20 }}>Revenue distribution</p>
          <div className="flex justify-center">
            <PieChart width={160} height={160}>
              <Pie
                data={categoryData}
                cx={75}
                cy={75}
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </div>
          <div className="space-y-2 mt-2">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                  <span style={{ color: "#6b4153", fontSize: "12px" }}>{cat.name}</span>
                </div>
                <span style={{ color: "#3d1a2e", fontSize: "12px", fontWeight: 600 }}>{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-5 gap-5">
        {/* Top Products */}
        <div className="col-span-3" style={glassCard}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 style={{ color: "#3d1a2e", fontSize: "16px", fontWeight: 700 }}>Top Selling Products</h2>
                <p style={{ color: "#9d6b7a", fontSize: "12px", marginTop: 2 }}>Best performers this month</p>
              </div>
              <button
                style={{
                  background: "rgba(212,175,55,0.1)",
                  border: "1px solid rgba(212,175,55,0.25)",
                  color: "#92740d",
                  fontSize: "12px",
                  fontWeight: 600,
                  borderRadius: "10px",
                  padding: "6px 14px",
                }}
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center gap-4 p-3 rounded-xl transition-all"
                  style={{ background: "rgba(255,255,255,0.5)" }}
                >
                  <span style={{ color: "#c9a0b0", fontSize: "12px", fontWeight: 700, minWidth: "20px" }}>
                    #{index + 1}
                  </span>
                  <div
                    className="w-10 h-10 rounded-xl overflow-hidden shrink-0"
                    style={{ border: `2px solid ${product.color}40` }}
                  >
                    <ImageWithFallback src={product.img} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ color: "#3d1a2e", fontSize: "13px", fontWeight: 600 }}>{product.name}</p>
                    <p style={{ color: "#9d6b7a", fontSize: "11px" }}>{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p style={{ color: "#3d1a2e", fontSize: "13px", fontWeight: 600 }}>{product.revenue}</p>
                    <p style={{ color: "#9d6b7a", fontSize: "11px" }}>{product.sales.toLocaleString()} units</p>
                  </div>
                  <div
                    className="flex items-center gap-0.5 px-2 py-0.5 rounded-full"
                    style={{
                      background: product.growth > 0 ? "rgba(74,222,128,0.12)" : "rgba(244,63,94,0.12)",
                      minWidth: "56px",
                      justifyContent: "center",
                    }}
                  >
                    {product.growth > 0 ? (
                      <ArrowUpRight size={11} color="#16a34a" />
                    ) : (
                      <ArrowDownRight size={11} color="#dc2626" />
                    )}
                    <span
                      style={{
                        color: product.growth > 0 ? "#16a34a" : "#dc2626",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      {Math.abs(product.growth)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="col-span-2" style={glassCard}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 style={{ color: "#3d1a2e", fontSize: "16px", fontWeight: 700 }}>Recent Orders</h2>
                <p style={{ color: "#9d6b7a", fontSize: "12px", marginTop: 2 }}>Latest transactions</p>
              </div>
              <button
                style={{
                  background: "rgba(212,175,55,0.1)",
                  border: "1px solid rgba(212,175,55,0.25)",
                  color: "#92740d",
                  fontSize: "12px",
                  fontWeight: 600,
                  borderRadius: "10px",
                  padding: "6px 14px",
                }}
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.5)" }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span style={{ color: "#D4AF37", fontSize: "11px", fontWeight: 700 }}>{order.id}</span>
                    <span
                      className="px-2 py-0.5 rounded-full"
                      style={{
                        background: statusStyle[order.status].bg,
                        color: statusStyle[order.status].color,
                        fontSize: "10px",
                        fontWeight: 600,
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p style={{ color: "#3d1a2e", fontSize: "12px", fontWeight: 600 }}>{order.customer}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p style={{ color: "#9d6b7a", fontSize: "11px" }}>{order.product}</p>
                    <p style={{ color: "#3d1a2e", fontSize: "12px", fontWeight: 700 }}>{order.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
