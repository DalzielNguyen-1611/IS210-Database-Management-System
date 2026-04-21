import { Search, Users, Heart, Star, UserPlus } from "lucide-react";

const glassCard = {
  background: "rgba(255,255,255,0.72)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.9)",
  boxShadow: "0 8px 32px rgba(61,26,46,0.06)",
  borderRadius: "20px",
};

const customers = [
  { id: "C-1001", name: "Emma Rosé", email: "emma.rose@email.com", joined: "Jan 2024", orders: 24, spent: "$2,840", tier: "VIP", avatar: "ER" },
  { id: "C-1002", name: "Isabelle Chen", email: "isabelle.chen@email.com", joined: "Mar 2024", orders: 18, spent: "$1,920", tier: "Gold", avatar: "IC" },
  { id: "C-1003", name: "Natalie Park", email: "natalie.park@email.com", joined: "Feb 2023", orders: 41, spent: "$5,210", tier: "VIP", avatar: "NP" },
  { id: "C-1004", name: "Olivia Martin", email: "olivia.m@email.com", joined: "Jun 2024", orders: 7, spent: "$680", tier: "Silver", avatar: "OM" },
  { id: "C-1005", name: "Charlotte Dubois", email: "charlotte.d@email.com", joined: "Aug 2023", orders: 29, spent: "$3,450", tier: "Gold", avatar: "CD" },
  { id: "C-1006", name: "Amelia Foster", email: "amelia.f@email.com", joined: "Nov 2023", orders: 15, spent: "$1,680", tier: "Silver", avatar: "AF" },
  { id: "C-1007", name: "Sophia Wells", email: "sophia.w@email.com", joined: "Dec 2022", orders: 67, spent: "$8,940", tier: "VIP", avatar: "SW" },
  { id: "C-1008", name: "Luna García", email: "luna.garcia@email.com", joined: "Apr 2024", orders: 11, spent: "$1,140", tier: "Silver", avatar: "LG" },
];

const tierStyle: Record<string, { bg: string; color: string; glow: string }> = {
  VIP: { bg: "linear-gradient(135deg, #D4AF37, #C9A94E)", color: "white", glow: "rgba(212,175,55,0.4)" },
  Gold: { bg: "rgba(212,175,55,0.15)", color: "#92740d", glow: "none" },
  Silver: { bg: "rgba(148,163,184,0.15)", color: "#64748b", glow: "none" },
};

const avatarColors = ["#F48FB1", "#D4AF37", "#C084FC", "#FDA4AF", "#F9A8D4", "#FCA5A5", "#86EFAC", "#93C5FD"];

export function Customers() {
  return (
    <div className="p-8 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p style={{ color: "#9d6b7a", fontSize: "13px", fontWeight: 500, letterSpacing: "0.05em" }}>
            Customer Relations
          </p>
          <h1 style={{ color: "#3d1a2e", fontSize: "26px", fontWeight: 700, marginTop: 2 }}>
            Customers
          </h1>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl"
          style={{ background: "linear-gradient(135deg, #D4AF37, #C9A94E)", boxShadow: "0 6px 20px rgba(212,175,55,0.4)", color: "white", fontSize: "13px", fontWeight: 600 }}
        >
          <UserPlus size={16} />
          Add Customer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {[
          { label: "Total Customers", value: "4,621", icon: Users, color: "#D4AF37", bg: "rgba(212,175,55,0.12)" },
          { label: "VIP Members", value: "284", icon: Star, color: "#C084FC", bg: "rgba(192,132,252,0.12)" },
          { label: "New This Month", value: "142", icon: UserPlus, color: "#4ade80", bg: "rgba(74,222,128,0.12)" },
          { label: "Loyalty Points Given", value: "98.4K", icon: Heart, color: "#F48FB1", bg: "rgba(244,143,177,0.12)" },
        ].map((s) => (
          <div key={s.label} style={glassCard} className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
              <s.icon size={22} color={s.color} strokeWidth={1.8} />
            </div>
            <div>
              <p style={{ color: "#9d6b7a", fontSize: "12px" }}>{s.label}</p>
              <p style={{ color: "#3d1a2e", fontSize: "22px", fontWeight: 700 }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {[
          { tier: "VIP", count: 284, label: "Spent > $2,000", color: "#D4AF37" },
          { tier: "Gold", count: 812, label: "Spent $500–$2,000", color: "#C9A94E" },
          { tier: "Silver", count: 2140, label: "Spent $100–$500", color: "#94a3b8" },
          { tier: "New", count: 1385, label: "First purchase", color: "#F48FB1" },
        ].map((seg) => (
          <div key={seg.tier} style={glassCard} className="p-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${seg.color}20` }}
            >
              <Star size={18} color={seg.color} strokeWidth={2} />
            </div>
            <p style={{ color: "#3d1a2e", fontSize: "22px", fontWeight: 700 }}>{seg.count.toLocaleString()}</p>
            <p style={{ color: "#9d6b7a", fontSize: "12px", marginTop: 2 }}>{seg.tier} Members</p>
            <p style={{ color: "#c9a0b0", fontSize: "11px", marginTop: 4 }}>{seg.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={glassCard}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 style={{ color: "#3d1a2e", fontSize: "16px", fontWeight: 700 }}>Customer Directory</h2>
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
              style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(212,175,55,0.2)" }}
            >
              <Search size={15} color="#9d6b7a" />
              <input
                placeholder="Search customers..."
                style={{ border: "none", outline: "none", background: "transparent", color: "#3d1a2e", fontSize: "13px", width: "200px" }}
              />
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(212,175,55,0.15)" }}>
                {["Customer", "Email", "Joined", "Orders", "Total Spent", "Tier"].map((h) => (
                  <th key={h} style={{ color: "#9d6b7a", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", padding: "10px 12px", textAlign: "left" }}>
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={c.id} style={{ borderBottom: "1px solid rgba(212,175,55,0.08)" }}>
                  <td style={{ padding: "12px" }}>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center"
                        style={{ background: avatarColors[i % avatarColors.length] + "30", border: `2px solid ${avatarColors[i % avatarColors.length]}50` }}
                      >
                        <span style={{ color: avatarColors[i % avatarColors.length], fontSize: "11px", fontWeight: 700 }}>{c.avatar}</span>
                      </div>
                      <div>
                        <p style={{ color: "#3d1a2e", fontSize: "13px", fontWeight: 600 }}>{c.name}</p>
                        <p style={{ color: "#9d6b7a", fontSize: "11px" }}>{c.id}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ color: "#6b4153", fontSize: "12px" }}>{c.email}</span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ color: "#9d6b7a", fontSize: "12px" }}>{c.joined}</span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ color: "#3d1a2e", fontSize: "13px", fontWeight: 600 }}>{c.orders}</span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ color: "#3d1a2e", fontSize: "13px", fontWeight: 700 }}>{c.spent}</span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span
                      className="px-2.5 py-1 rounded-full"
                      style={{
                        background: tierStyle[c.tier].bg,
                        color: tierStyle[c.tier].color,
                        fontSize: "11px",
                        fontWeight: 700,
                        boxShadow: c.tier === "VIP" ? `0 4px 12px ${tierStyle[c.tier].glow}` : "none",
                      }}
                    >
                      {c.tier === "VIP" ? "★ VIP" : c.tier}
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
