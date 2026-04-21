import React, { useState } from "react";
import {
  Users,
  DollarSign,
  Calendar,
  Clock,
  UserCheck,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Minus,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

type Tab = "staff" | "payroll" | "attendance";

const glassCard = {
  background: "rgba(255,255,255,0.72)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.9)",
  boxShadow: "0 8px 32px rgba(61,26,46,0.06)",
  borderRadius: "20px",
};

const staff = [
  { id: "EMP-001", name: "Sophia Laurent", role: "Store Manager", dept: "Management", store: "HQ", phone: "0912 345 678", email: "sophia@lumiere.vn", img: "https://images.unsplash.com/photo-1745434159123-5b99b94206ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200", status: "Active", joined: "Jan 2022" },
  { id: "EMP-002", name: "Linh Nguyễn", role: "Lead Esthetician", dept: "Spa", store: "CH1", phone: "0987 654 321", email: "linh.n@lumiere.vn", img: "https://images.unsplash.com/photo-1758600587683-d86675a2f6e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200", status: "Active", joined: "Mar 2022" },
  { id: "EMP-003", name: "Mia Trần", role: "Beauty Advisor", dept: "Sales", store: "CH1", phone: "0901 234 567", email: "mia.t@lumiere.vn", img: "https://images.unsplash.com/photo-1745434159123-5b99b94206ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200", status: "Active", joined: "Jun 2023" },
  { id: "EMP-004", name: "Emma Phạm", role: "Cashier", dept: "Sales", store: "CH2", phone: "0978 123 456", email: "emma.p@lumiere.vn", img: "https://images.unsplash.com/photo-1758600587683-d86675a2f6e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200", status: "On Leave", joined: "Sep 2023" },
  { id: "EMP-005", name: "Anna Lê", role: "Spa Therapist", dept: "Spa", store: "CH2", phone: "0965 432 187", email: "anna.le@lumiere.vn", img: "https://images.unsplash.com/photo-1745434159123-5b99b94206ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200", status: "Active", joined: "Nov 2023" },
  { id: "EMP-006", name: "Hana Võ", role: "Inventory Specialist", dept: "Logistics", store: "HQ", phone: "0934 567 890", email: "hana.v@lumiere.vn", img: "https://images.unsplash.com/photo-1758600587683-d86675a2f6e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200", status: "Active", joined: "Feb 2024" },
];

const payrollData = [
  { id: "EMP-001", name: "Sophia Laurent", dept: "Management", gross: 28000000, si: 2800000, pit: 1260000, net: 23940000 },
  { id: "EMP-002", name: "Linh Nguyễn", dept: "Spa", gross: 18000000, si: 1800000, pit: 540000, net: 15660000 },
  { id: "EMP-003", name: "Mia Trần", dept: "Sales", gross: 14000000, si: 1400000, pit: 210000, net: 12390000 },
  { id: "EMP-004", name: "Emma Phạm", dept: "Sales", gross: 12000000, si: 1200000, pit: 120000, net: 10680000 },
  { id: "EMP-005", name: "Anna Lê", dept: "Spa", gross: 15000000, si: 1500000, pit: 300000, net: 13200000 },
  { id: "EMP-006", name: "Hana Võ", dept: "Logistics", gross: 13000000, si: 1300000, pit: 156000, net: 11544000 },
];

type AttendanceStatus = "Present" | "Late" | "Annual Leave" | "Sick Leave" | "Off";

const attendanceData: { name: string; days: AttendanceStatus[] }[] = [
  { name: "Sophia Laurent", days: ["Present", "Present", "Present", "Present", "Present", "Off", "Off"] },
  { name: "Linh Nguyễn", days: ["Present", "Late", "Present", "Present", "Present", "Off", "Off"] },
  { name: "Mia Trần", days: ["Present", "Present", "Annual Leave", "Annual Leave", "Present", "Off", "Off"] },
  { name: "Emma Phạm", days: ["Sick Leave", "Sick Leave", "Sick Leave", "Present", "Present", "Off", "Off"] },
  { name: "Anna Lê", days: ["Present", "Present", "Present", "Late", "Present", "Off", "Off"] },
  { name: "Hana Võ", days: ["Present", "Present", "Present", "Present", "Annual Leave", "Off", "Off"] },
];

const overtimeData = [
  { name: "Sophia Laurent", ot: 4 },
  { name: "Linh Nguyễn", ot: 6 },
  { name: "Mia Trần", ot: 0 },
  { name: "Emma Phạm", ot: 2 },
  { name: "Anna Lê", ot: 8 },
  { name: "Hana Võ", ot: 3 },
];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const attendanceColors: Record<AttendanceStatus, { bg: string; color: string; label: string }> = {
  Present: { bg: "rgba(74,222,128,0.15)", color: "#16a34a", label: "✓" },
  Late: { bg: "rgba(212,175,55,0.18)", color: "#92740d", label: "!" },
  "Annual Leave": { bg: "rgba(147,197,253,0.3)", color: "#1d4ed8", label: "AL" },
  "Sick Leave": { bg: "rgba(253,164,175,0.3)", color: "#be185d", label: "SL" },
  Off: { bg: "rgba(200,200,200,0.15)", color: "#94a3b8", label: "—" },
};

const deptColors: Record<string, string> = {
  Management: "#D4AF37",
  Spa: "#F48FB1",
  Sales: "#C084FC",
  Logistics: "#FDA4AF",
};

const statusColors: Record<string, { bg: string; color: string; dot: string }> = {
  Active: { bg: "rgba(74,222,128,0.12)", color: "#16a34a", dot: "#4ade80" },
  "On Leave": { bg: "rgba(212,175,55,0.15)", color: "#92740d", dot: "#D4AF37" },
};

function fmt(n: number) {
  return (n / 1_000_000).toFixed(1) + "M";
}

export function HRPayroll() {
  const [activeTab, setActiveTab] = useState<Tab>("staff");
  const [selectedEmp, setSelectedEmp] = useState<string | null>(null);

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "staff", label: "Staff Directory", icon: Users },
    { key: "payroll", label: "Payroll — April 2026", icon: DollarSign },
    { key: "attendance", label: "Attendance (This Week)", icon: Calendar },
  ];

  const totalPayroll = payrollData.reduce((s, e) => s + e.net, 0);
  const totalGross = payrollData.reduce((s, e) => s + e.gross, 0);

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p style={{ color: "#9d6b7a", fontSize: "13px", fontWeight: 500, letterSpacing: "0.05em" }}>
            People Management
          </p>
          <h1 style={{ color: "#3d1a2e", fontSize: "26px", fontWeight: 700, marginTop: 2 }}>
            HR & Payroll
          </h1>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl"
          style={{ background: "linear-gradient(135deg, #D4AF37, #C9A94E)", boxShadow: "0 6px 20px rgba(212,175,55,0.4)", color: "white", fontSize: "13px", fontWeight: 600 }}
        >
          + Add Employee
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {[
          { label: "Total Staff", value: "6", sub: "Across all locations", icon: Users, color: "#D4AF37" },
          { label: "Total Payroll", value: `${fmt(totalGross)} VND`, sub: "Gross this month", icon: DollarSign, color: "#F48FB1" },
          { label: "Net Disbursed", value: `${fmt(totalPayroll)} VND`, sub: "After SI & PIT", icon: TrendingUp, color: "#4ade80" },
          { label: "On Leave Today", value: "1", sub: "1 sick, 0 annual", icon: AlertCircle, color: "#C084FC" },
        ].map((k) => (
          <div key={k.label} style={glassCard} className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${k.color}18` }}>
              <k.icon size={22} color={k.color} strokeWidth={1.8} />
            </div>
            <div>
              <p style={{ color: "#9d6b7a", fontSize: "12px" }}>{k.label}</p>
              <p style={{ color: "#3d1a2e", fontSize: "18px", fontWeight: 700, marginTop: 2 }}>{k.value}</p>
              <p style={{ color: "#c9a0b0", fontSize: "10px" }}>{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Bar */}
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

      {/* ── STAFF DIRECTORY ───────────────────────────────────────────────── */}
      {activeTab === "staff" && (
        <div className="grid grid-cols-3 gap-5">
          {staff.map((emp) => (
            <div
              key={emp.id}
              style={glassCard}
              className="p-5 cursor-pointer transition-all"
              onClick={() => setSelectedEmp(selectedEmp === emp.id ? null : emp.id)}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-2xl overflow-hidden shrink-0"
                  style={{ border: `2px solid ${deptColors[emp.dept]}40`, boxShadow: `0 4px 16px ${deptColors[emp.dept]}30` }}
                >
                  <ImageWithFallback src={emp.img} alt={emp.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p style={{ color: "#3d1a2e", fontSize: "14px", fontWeight: 700 }}>{emp.name}</p>
                    <span
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                      style={{ background: statusColors[emp.status].bg, color: statusColors[emp.status].color, fontSize: "10px", fontWeight: 600 }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColors[emp.status].dot }} />
                      {emp.status}
                    </span>
                  </div>
                  <p style={{ color: "#9d6b7a", fontSize: "12px", marginTop: 2 }}>{emp.role}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className="px-2 py-0.5 rounded-full"
                      style={{ background: `${deptColors[emp.dept]}18`, color: deptColors[emp.dept], fontSize: "11px", fontWeight: 600 }}
                    >
                      {emp.dept}
                    </span>
                    <span style={{ color: "#c9a0b0", fontSize: "11px" }}>
                      <MapPin size={10} style={{ display: "inline", marginRight: 2 }} />
                      {emp.store}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedEmp === emp.id && (
                <div className="mt-4 pt-4 border-t space-y-2" style={{ borderColor: "rgba(212,175,55,0.15)" }}>
                  <div className="flex items-center gap-2">
                    <Phone size={12} color="#9d6b7a" />
                    <span style={{ color: "#6b4153", fontSize: "12px" }}>{emp.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={12} color="#9d6b7a" />
                    <span style={{ color: "#6b4153", fontSize: "12px" }}>{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={12} color="#9d6b7a" />
                    <span style={{ color: "#6b4153", fontSize: "12px" }}>Joined: {emp.joined}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{ color: "#9d6b7a", fontSize: "11px", fontFamily: "monospace" }}>{emp.id}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 py-1.5 rounded-lg text-center" style={{ background: "rgba(212,175,55,0.12)", color: "#92740d", fontSize: "11px", fontWeight: 600 }}>Edit</button>
                    <button className="flex-1 py-1.5 rounded-lg text-center" style={{ background: "rgba(192,132,252,0.12)", color: "#7c3aed", fontSize: "11px", fontWeight: 600 }}>Schedule</button>
                  </div>
                </div>
              )}
              <ChevronRight size={14} color="#c9a0b0" style={{ position: "absolute", right: 16, top: 20 }} className="absolute" />
            </div>
          ))}
        </div>
      )}

      {/* ── PAYROLL ───────────────────────────────────────────────────────── */}
      {activeTab === "payroll" && (
        <div>
          {/* Summary Row */}
          <div className="grid grid-cols-3 gap-5 mb-6">
            <div style={glassCard} className="p-5">
              <p style={{ color: "#9d6b7a", fontSize: "12px" }}>Total Gross Salary</p>
              <p style={{ color: "#3d1a2e", fontSize: "22px", fontWeight: 800, marginTop: 4 }}>{fmt(totalGross)} VND</p>
              <div className="mt-3 h-1.5 rounded-full" style={{ background: "rgba(212,175,55,0.15)" }}>
                <div className="h-full rounded-full" style={{ width: "100%", background: "linear-gradient(90deg, #D4AF37, #C9A94E)" }} />
              </div>
            </div>
            <div style={glassCard} className="p-5">
              <p style={{ color: "#9d6b7a", fontSize: "12px" }}>Total Deductions (SI + PIT)</p>
              <p style={{ color: "#3d1a2e", fontSize: "22px", fontWeight: 800, marginTop: 4 }}>
                {fmt(payrollData.reduce((s, e) => s + e.si + e.pit, 0))} VND
              </p>
              <div className="mt-3 h-1.5 rounded-full" style={{ background: "rgba(244,143,177,0.15)" }}>
                <div className="h-full rounded-full" style={{ width: "13%", background: "linear-gradient(90deg, #F48FB1, #E879A0)" }} />
              </div>
            </div>
            <div style={glassCard} className="p-5">
              <p style={{ color: "#9d6b7a", fontSize: "12px" }}>Total Net Disbursed</p>
              <p style={{ color: "#D4AF37", fontSize: "22px", fontWeight: 800, marginTop: 4 }}>{fmt(totalPayroll)} VND</p>
              <div className="mt-3 h-1.5 rounded-full" style={{ background: "rgba(74,222,128,0.15)" }}>
                <div className="h-full rounded-full" style={{ width: "87%", background: "linear-gradient(90deg, #4ade80, #22c55e)" }} />
              </div>
            </div>
          </div>

          {/* Payroll Table */}
          <div style={glassCard}>
            <div className="p-6">
              <h2 style={{ color: "#3d1a2e", fontSize: "16px", fontWeight: 700, marginBottom: 20 }}>
                April 2026 — Payroll Detail
              </h2>
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(212,175,55,0.15)" }}>
                    {["Employee", "Department", "Gross Salary", "Social Insurance (10%)", "Personal Income Tax", "Net Salary", "Status"].map((h) => (
                      <th key={h} style={{ color: "#9d6b7a", fontSize: "10.5px", fontWeight: 600, letterSpacing: "0.06em", padding: "10px 12px", textAlign: "left" }}>
                        {h.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payrollData.map((row) => (
                    <tr key={row.id} style={{ borderBottom: "1px solid rgba(212,175,55,0.07)" }}>
                      <td style={{ padding: "13px 12px" }}>
                        <p style={{ color: "#3d1a2e", fontSize: "13px", fontWeight: 600 }}>{row.name}</p>
                        <p style={{ color: "#9d6b7a", fontSize: "10px", fontFamily: "monospace" }}>{row.id}</p>
                      </td>
                      <td style={{ padding: "13px 12px" }}>
                        <span className="px-2 py-1 rounded-full" style={{ background: `${deptColors[row.dept]}18`, color: deptColors[row.dept], fontSize: "11px", fontWeight: 600 }}>
                          {row.dept}
                        </span>
                      </td>
                      <td style={{ padding: "13px 12px" }}>
                        <span style={{ color: "#3d1a2e", fontSize: "13px", fontWeight: 600 }}>{row.gross.toLocaleString("vi-VN")} ₫</span>
                      </td>
                      <td style={{ padding: "13px 12px" }}>
                        <span style={{ color: "#F48FB1", fontSize: "13px", fontWeight: 600 }}>− {row.si.toLocaleString("vi-VN")} ₫</span>
                      </td>
                      <td style={{ padding: "13px 12px" }}>
                        <span style={{ color: "#C084FC", fontSize: "13px", fontWeight: 600 }}>− {row.pit.toLocaleString("vi-VN")} ₫</span>
                      </td>
                      <td style={{ padding: "13px 12px" }}>
                        <span style={{ color: "#D4AF37", fontSize: "14px", fontWeight: 800 }}>{row.net.toLocaleString("vi-VN")} ₫</span>
                      </td>
                      <td style={{ padding: "13px 12px" }}>
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full w-fit" style={{ background: "rgba(74,222,128,0.12)", color: "#16a34a", fontSize: "11px", fontWeight: 600 }}>
                          <CheckCircle2 size={11} />
                          Pending
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end mt-5">
                <button
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl"
                  style={{ background: "linear-gradient(135deg, #D4AF37, #C9A94E)", color: "white", fontWeight: 600, fontSize: "13px", boxShadow: "0 4px 14px rgba(212,175,55,0.4)" }}
                >
                  Approve & Process Payroll
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ATTENDANCE ───────────────────────────────────────────────────── */}
      {activeTab === "attendance" && (
        <div>
          {/* Legend */}
          <div className="flex items-center gap-5 mb-5 px-2">
            {(Object.keys(attendanceColors) as AttendanceStatus[]).map((k) => (
              <div key={k} className="flex items-center gap-1.5">
                <div
                  className="w-5 h-5 rounded flex items-center justify-center"
                  style={{ background: attendanceColors[k].bg }}
                >
                  <span style={{ color: attendanceColors[k].color, fontSize: "8px", fontWeight: 700 }}>{attendanceColors[k].label}</span>
                </div>
                <span style={{ color: "#9d6b7a", fontSize: "11px" }}>{k}</span>
              </div>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <Clock size={14} color="#D4AF37" />
              <span style={{ color: "#6b4153", fontSize: "12px", fontWeight: 600 }}>Week: Apr 7 – Apr 13, 2026</span>
            </div>
          </div>

          <div style={glassCard}>
            <div className="p-6">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(212,175,55,0.15)" }}>
                    <th style={{ color: "#9d6b7a", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", padding: "10px 12px", textAlign: "left" }}>EMPLOYEE</th>
                    {weekDays.map((d, i) => (
                      <th key={d} style={{ color: i >= 5 ? "#c9a0b0" : "#9d6b7a", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", padding: "10px 12px", textAlign: "center" }}>
                        {d}
                      </th>
                    ))}
                    <th style={{ color: "#9d6b7a", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", padding: "10px 12px", textAlign: "center" }}>OT HRS</th>
                    <th style={{ color: "#9d6b7a", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", padding: "10px 12px", textAlign: "center" }}>SUMMARY</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((row, ri) => {
                    const ot = overtimeData.find((o) => o.name === row.name)?.ot ?? 0;
                    const present = row.days.filter((d) => d === "Present").length;
                    const late = row.days.filter((d) => d === "Late").length;
                    return (
                      <tr key={row.name} style={{ borderBottom: "1px solid rgba(212,175,55,0.07)" }}>
                        <td style={{ padding: "12px" }}>
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                              style={{ background: `${["#F48FB1","#D4AF37","#C084FC","#FDA4AF","#4ade80","#93c5fd"][ri % 6]}30` }}
                            >
                              <span style={{ color: ["#F48FB1","#D4AF37","#C084FC","#FDA4AF","#4ade80","#93c5fd"][ri % 6], fontSize: "11px", fontWeight: 700 }}>
                                {row.name.charAt(0)}
                              </span>
                            </div>
                            <span style={{ color: "#3d1a2e", fontSize: "12.5px", fontWeight: 600 }}>{row.name}</span>
                          </div>
                        </td>
                        {row.days.map((day, di) => (
                          <td key={di} style={{ padding: "12px", textAlign: "center" }}>
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center mx-auto"
                              style={{ background: attendanceColors[day].bg }}
                            >
                              <span style={{ color: attendanceColors[day].color, fontSize: "9px", fontWeight: 700 }}>{attendanceColors[day].label}</span>
                            </div>
                          </td>
                        ))}
                        <td style={{ padding: "12px", textAlign: "center" }}>
                          {ot > 0 ? (
                            <span
                              className="px-2.5 py-1 rounded-full"
                              style={{ background: "rgba(212,175,55,0.15)", color: "#92740d", fontSize: "11px", fontWeight: 700 }}
                            >
                              +{ot}h
                            </span>
                          ) : (
                            <Minus size={14} color="#c9a0b0" style={{ margin: "0 auto" }} />
                          )}
                        </td>
                        <td style={{ padding: "12px", textAlign: "center" }}>
                          <div className="text-center">
                            <span style={{ color: "#16a34a", fontSize: "11px", fontWeight: 700 }}>{present}P</span>
                            {late > 0 && <span style={{ color: "#92740d", fontSize: "11px", fontWeight: 700 }}> {late}L</span>}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          {/* Clock In/Out Log Sample */}
          <div className="mt-5" style={glassCard}>
            <div className="p-5">
              <h3 style={{ color: "#3d1a2e", fontSize: "14px", fontWeight: 700, marginBottom: 12 }}>Today's Clock-In / Out Log</h3>
              <div className="grid grid-cols-3 gap-3">
                {staff.slice(0, 6).map((emp, i) => (
                  <div key={emp.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.5)", border: "1px solid rgba(212,175,55,0.1)" }}>
                    <div className="w-1.5 h-10 rounded-full" style={{ background: i < 5 ? "linear-gradient(180deg, #4ade80, #22c55e)" : "linear-gradient(180deg, #D4AF37, #C9A94E)" }} />
                    <div>
                      <p style={{ color: "#3d1a2e", fontSize: "12px", fontWeight: 600 }}>{emp.name.split(" ")[0]}</p>
                      <p style={{ color: "#9d6b7a", fontSize: "10px" }}>
                        <UserCheck size={9} style={{ display: "inline", marginRight: 2 }} />
                        {["08:02", "07:58", "08:15", "08:30", "07:55", "08:07"][i]} — {["17:10", "17:05", "17:00", "—", "17:12", "17:02"][i]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}