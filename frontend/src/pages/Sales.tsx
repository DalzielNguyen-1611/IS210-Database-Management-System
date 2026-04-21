import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { TrendingUp, ShoppingBag, CreditCard, ArrowUpRight } from "lucide-react";

const glassCard = {
  background: "rgba(255,255,255,0.72)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.9)",
  boxShadow: "0 8px 32px rgba(61,26,46,0.06)",
  borderRadius: "20px",
};

const monthlyData = [
  { month: "Jan", online: 28000, inStore: 14000 },
  { month: "Feb", online: 22000, inStore: 16000 },
  { month: "Mar", online: 35000, inStore: 20000 },
  { month: "Apr", online: 31000, inStore: 18000 },
  { month: "May", online: 42000, inStore: 21000 },
  { month: "Jun", online: 48000, inStore: 23000 },
  { month: "Jul", online: 45000, inStore: 23000 },
  { month: "Aug", online: 56000, inStore: 26000 },
  { month: "Sep", online: 51000, inStore: 25000 },
  { month: "Oct", online: 63000, inStore: 28000 },
  { month: "Nov", online: 60000, inStore: 28000 },
  { month: "Dec", online: 74000, inStore: 31000 },
];

const weeklyData = [
  { day: "Mon", sales: 4200 },
  { day: "Tue", sales: 5800 },
  { day: "Wed", sales: 4900 },
  { day: "Thu", sales: 7200 },
  { day: "Fri", sales: 9100 },
  { day: "Sat", sales: 11400 },
  { day: "Sun", sales: 8600 },
];

const transactions = [
  { id: "#TXN-4421", customer: "Emma Rosé", items: 3, method: "Credit Card", amount: "$318.00", date: "Apr 12, 2026" },
  { id: "#TXN-4420", customer: "Isabelle Chen", items: 1, method: "PayPal", amount: "$95.00", date: "Apr 12, 2026" },
  { id: "#TXN-4419", customer: "Natalie Park", items: 5, method: "Credit Card", amount: "$524.00", date: "Apr 11, 2026" },
  { id: "#TXN-4418", customer: "Olivia Martin", items: 2, method: "Apple Pay", amount: "$136.00", date: "Apr 11, 2026" },
  { id: "#TXN-4417", customer: "Charlotte Dubois", items: 4, method: "Credit Card", amount: "$278.00", date: "Apr 11, 2026" },
  { id: "#TXN-4416", customer: "Amelia Foster", items: 1, method: "Google Pay", amount: "$68.00", date: "Apr 10, 2026" },
];

export function Sales() {
  return (
    <div className="p-8 min-h-screen">
      <div className="mb-8">
        <p style={{ color: "#9d6b7a", fontSize: "13px", fontWeight: 500, letterSpacing: "0.05em" }}>
          Revenue & Transactions
        </p>
        <h1 style={{ color: "#3d1a2e", fontSize: "26px", fontWeight: 700, marginTop: 2 }}>
          Sales Overview
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        {[
          { label: "Total Sales Today", value: "$12,840", change: "+14.2%", icon: TrendingUp, gradient: "linear-gradient(135deg, #D4AF37, #C9A94E)", glow: "rgba(212,175,55,0.35)" },
          { label: "Orders Today", value: "284", change: "+8.5%", icon: ShoppingBag, gradient: "linear-gradient(135deg, #F48FB1, #E879A0)", glow: "rgba(244,143,177,0.35)" },
          { label: "Avg. Order Value", value: "$45.21", change: "+5.1%", icon: CreditCard, gradient: "linear-gradient(135deg, #C084FC, #A855F7)", glow: "rgba(192,132,252,0.35)" },
        ].map((s) => (
          <div key={s.label} style={glassCard} className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p style={{ color: "#9d6b7a", fontSize: "12px" }}>{s.label}</p>
                <p style={{ color: "#3d1a2e", fontSize: "26px", fontWeight: 700, marginTop: 4 }}>{s.value}</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: s.gradient, boxShadow: `0 6px 20px ${s.glow}` }}>
                <s.icon size={22} color="white" strokeWidth={2} />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <ArrowUpRight size={13} color="#16a34a" />
              <span style={{ color: "#16a34a", fontSize: "12px", fontWeight: 600 }}>{s.change}</span>
              <span style={{ color: "#9d6b7a", fontSize: "12px" }}> vs. yesterday</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-5 mb-8">
        {/* Bar Chart */}
        <div className="col-span-3" style={glassCard}>
          <div className="p-6">
            <h2 style={{ color: "#3d1a2e", fontSize: "16px", fontWeight: 700, marginBottom: 4 }}>Online vs In-Store Sales</h2>
            <p style={{ color: "#9d6b7a", fontSize: "12px", marginBottom: 20 }}>Monthly breakdown 2025</p>
            <div className="flex items-center gap-5 mb-4">
              {[{ label: "Online", color: "#D4AF37" }, { label: "In-Store", color: "#F48FB1" }].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm" style={{ background: l.color }} />
                  <span style={{ color: "#9d6b7a", fontSize: "12px" }}>{l.label}</span>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#9d6b7a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9d6b7a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(255,255,255,0.95)",
                    border: "1px solid rgba(212,175,55,0.3)",
                    borderRadius: "12px",
                    boxShadow: "0 8px 24px rgba(61,26,46,0.12)",
                  }}
                  labelStyle={{ color: "#7a3055", fontWeight: 600 }}
                />
                <Bar dataKey="online" fill="#D4AF37" radius={[4, 4, 0, 0]} maxBarSize={24} />
                <Bar dataKey="inStore" fill="#F48FB1" radius={[4, 4, 0, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Line */}
        <div className="col-span-2" style={glassCard}>
          <div className="p-6">
            <h2 style={{ color: "#3d1a2e", fontSize: "16px", fontWeight: 700, marginBottom: 4 }}>Weekly Performance</h2>
            <p style={{ color: "#9d6b7a", fontSize: "12px", marginBottom: 20 }}>Sales trend this week</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={weeklyData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="weekGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#F48FB1" />
                    <stop offset="100%" stopColor="#D4AF37" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)" />
                <XAxis dataKey="day" tick={{ fill: "#9d6b7a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9d6b7a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(255,255,255,0.95)",
                    border: "1px solid rgba(212,175,55,0.3)",
                    borderRadius: "12px",
                    boxShadow: "0 8px 24px rgba(61,26,46,0.12)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="url(#weekGrad)"
                  strokeWidth={3}
                  dot={{ fill: "#D4AF37", strokeWidth: 2, r: 5, stroke: "white" }}
                  activeDot={{ r: 6, fill: "#D4AF37" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div style={glassCard}>
        <div className="p-6">
          <h2 style={{ color: "#3d1a2e", fontSize: "16px", fontWeight: 700, marginBottom: 20 }}>Recent Transactions</h2>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(212,175,55,0.15)" }}>
                {["Transaction", "Customer", "Items", "Payment Method", "Amount", "Date"].map((h) => (
                  <th key={h} style={{ color: "#9d6b7a", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", padding: "10px 12px", textAlign: "left" }}>
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} style={{ borderBottom: "1px solid rgba(212,175,55,0.08)" }}>
                  <td style={{ padding: "12px" }}>
                    <span style={{ color: "#D4AF37", fontSize: "12px", fontWeight: 700 }}>{t.id}</span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ color: "#3d1a2e", fontSize: "13px", fontWeight: 600 }}>{t.customer}</span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ color: "#9d6b7a", fontSize: "13px" }}>{t.items}</span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span className="px-2.5 py-1 rounded-full" style={{ background: "rgba(212,175,55,0.1)", color: "#92740d", fontSize: "11px", fontWeight: 600 }}>
                      {t.method}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ color: "#3d1a2e", fontSize: "13px", fontWeight: 700 }}>{t.amount}</span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ color: "#9d6b7a", fontSize: "12px" }}>{t.date}</span>
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
