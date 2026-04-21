import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { TrendingUp, Eye, MousePointer, ShoppingCart } from "lucide-react";

const glassCard = {
  background: "rgba(255,255,255,0.72)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.9)",
  boxShadow: "0 8px 32px rgba(61,26,46,0.06)",
  borderRadius: "20px",
};

const performanceData = [
  { subject: "Skincare", A: 92 },
  { subject: "Makeup", A: 78 },
  { subject: "Fragrance", A: 85 },
  { subject: "Haircare", A: 64 },
  { subject: "Body Care", A: 71 },
  { subject: "Wellness", A: 56 },
];

const trendData = [
  { month: "Jan", sessions: 12400, conversions: 880 },
  { month: "Feb", sessions: 10800, conversions: 760 },
  { month: "Mar", sessions: 15200, conversions: 1100 },
  { month: "Apr", sessions: 13600, conversions: 970 },
  { month: "May", sessions: 18000, conversions: 1380 },
  { month: "Jun", sessions: 21400, conversions: 1680 },
  { month: "Jul", sessions: 19800, conversions: 1540 },
  { month: "Aug", sessions: 24200, conversions: 1920 },
  { month: "Sep", sessions: 22600, conversions: 1780 },
  { month: "Oct", sessions: 28000, conversions: 2240 },
  { month: "Nov", sessions: 26400, conversions: 2100 },
  { month: "Dec", sessions: 32000, conversions: 2620 },
];

const channelData = [
  { channel: "Organic", revenue: 42000, color: "#D4AF37" },
  { channel: "Social", revenue: 28000, color: "#F48FB1" },
  { channel: "Email", revenue: 19000, color: "#C084FC" },
  { channel: "Paid Ads", revenue: 15000, color: "#FDA4AF" },
  { channel: "Referral", revenue: 8000, color: "#FDE68A" },
];

const insights = [
  { label: "Conversion Rate", value: "7.2%", change: "+1.4%", color: "#D4AF37" },
  { label: "Avg Session Duration", value: "4m 32s", change: "+0:28", color: "#F48FB1" },
  { label: "Bounce Rate", value: "28.4%", change: "-3.1%", color: "#4ade80" },
  { label: "Pages per Session", value: "6.8", change: "+0.9", color: "#C084FC" },
];

export function Analytics() {
  return (
    <div className="p-8 min-h-screen">
      <div className="mb-8">
        <p style={{ color: "#9d6b7a", fontSize: "13px", fontWeight: 500, letterSpacing: "0.05em" }}>
          Business Intelligence
        </p>
        <h1 style={{ color: "#3d1a2e", fontSize: "26px", fontWeight: 700, marginTop: 2 }}>
          Analytics
        </h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {[
          { label: "Total Sessions", value: "234.8K", icon: Eye, gradient: "linear-gradient(135deg, #D4AF37, #C9A94E)", glow: "rgba(212,175,55,0.35)" },
          { label: "Click-Through Rate", value: "9.4%", icon: MousePointer, gradient: "linear-gradient(135deg, #F48FB1, #E879A0)", glow: "rgba(244,143,177,0.35)" },
          { label: "Add-to-Cart Rate", value: "18.7%", icon: ShoppingCart, gradient: "linear-gradient(135deg, #C084FC, #A855F7)", glow: "rgba(192,132,252,0.35)" },
          { label: "Revenue Growth", value: "+31.2%", icon: TrendingUp, gradient: "linear-gradient(135deg, #4ade80, #22c55e)", glow: "rgba(74,222,128,0.35)" },
        ].map((k) => (
          <div key={k.label} style={glassCard} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p style={{ color: "#9d6b7a", fontSize: "12px" }}>{k.label}</p>
                <p style={{ color: "#3d1a2e", fontSize: "26px", fontWeight: 700, marginTop: 4 }}>{k.value}</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: k.gradient, boxShadow: `0 6px 20px ${k.glow}` }}>
                <k.icon size={22} color="white" strokeWidth={2} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5 mb-8">
        {/* Sessions & Conversions */}
        <div className="col-span-2" style={glassCard}>
          <div className="p-6">
            <h2 style={{ color: "#3d1a2e", fontSize: "16px", fontWeight: 700, marginBottom: 4 }}>Sessions & Conversions</h2>
            <p style={{ color: "#9d6b7a", fontSize: "12px", marginBottom: 16 }}>Website traffic and conversion tracking</p>
            <div className="flex items-center gap-5 mb-4">
              {[{ label: "Sessions", color: "#D4AF37" }, { label: "Conversions", color: "#F48FB1" }].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className="w-3 h-1 rounded-full" style={{ background: l.color }} />
                  <span style={{ color: "#9d6b7a", fontSize: "12px" }}>{l.label}</span>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trendData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="sessGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#D4AF37" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F48FB1" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#F48FB1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)" />
                <XAxis dataKey="month" tick={{ fill: "#9d6b7a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9d6b7a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(255,255,255,0.95)",
                    border: "1px solid rgba(212,175,55,0.3)",
                    borderRadius: "12px",
                  }}
                />
                <Area type="monotone" dataKey="sessions" stroke="#D4AF37" strokeWidth={2} fill="url(#sessGrad)" dot={false} />
                <Area type="monotone" dataKey="conversions" stroke="#F48FB1" strokeWidth={2} fill="url(#convGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Radar */}
        <div style={glassCard}>
          <div className="p-6">
            <h2 style={{ color: "#3d1a2e", fontSize: "16px", fontWeight: 700, marginBottom: 4 }}>Category Performance</h2>
            <p style={{ color: "#9d6b7a", fontSize: "12px", marginBottom: 8 }}>Sales performance score</p>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={performanceData}>
                <PolarGrid stroke="rgba(212,175,55,0.2)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#9d6b7a", fontSize: 11 }} />
                <Radar name="Score" dataKey="A" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-5">
        {/* Channel Bar Chart */}
        <div className="col-span-3" style={glassCard}>
          <div className="p-6">
            <h2 style={{ color: "#3d1a2e", fontSize: "16px", fontWeight: 700, marginBottom: 4 }}>Revenue by Channel</h2>
            <p style={{ color: "#9d6b7a", fontSize: "12px", marginBottom: 20 }}>Traffic source performance this month</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={channelData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#9d6b7a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="channel" tick={{ fill: "#9d6b7a", fontSize: 12 }} axisLine={false} tickLine={false} width={60} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(255,255,255,0.95)",
                    border: "1px solid rgba(212,175,55,0.3)",
                    borderRadius: "12px",
                  }}
                />
                <Bar dataKey="revenue" radius={[0, 6, 6, 0]} maxBarSize={22}>
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insight Cards */}
        <div className="col-span-2 grid grid-rows-4 gap-5">
          {insights.map((ins) => (
            <div key={ins.label} style={glassCard} className="p-4 flex items-center justify-between">
              <div>
                <p style={{ color: "#9d6b7a", fontSize: "12px" }}>{ins.label}</p>
                <p style={{ color: "#3d1a2e", fontSize: "20px", fontWeight: 700, marginTop: 2 }}>{ins.value}</p>
              </div>
              <div
                className="px-3 py-1.5 rounded-xl"
                style={{ background: `${ins.color}15`, border: `1px solid ${ins.color}30` }}
              >
                <span style={{ color: ins.color, fontSize: "13px", fontWeight: 700 }}>{ins.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
