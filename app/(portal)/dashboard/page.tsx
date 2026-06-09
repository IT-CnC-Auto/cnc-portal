"use client";

const CNC_RED = "#ED1B24";

const AfricanDivider = () => (
  <div className="w-full overflow-hidden" style={{ height: 14 }}>
    <svg viewBox="0 0 800 14" className="w-full h-full" preserveAspectRatio="none">
      {[...Array(40)].map((_, i) => (
        <polygon
          key={i}
          points={`${i * 20 + 10},0 ${i * 20 + 20},14 ${i * 20},14`}
          fill={
            i % 5 === 0 ? CNC_RED :
            i % 5 === 1 ? "#1a1a1a" :
            i % 5 === 2 ? "#c8a850" :
            i % 5 === 3 ? "#2a6496" : "#4a9e4a"
          }
        />
      ))}
    </svg>
  </div>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="w-1 h-5 rounded-full" style={{ background: CNC_RED }} />
    <h2 className="text-xs font-black uppercase tracking-widest text-gray-500">{children}</h2>
  </div>
);

interface MetricCardProps {
  icon: string;
  value: string;
  label: string;
  badge: string;
  badgeColor: string;
}
const MetricCard = ({ icon, value, label, badge, badgeColor }: MetricCardProps) => (
  <div
    className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    style={{ borderTop: `4px solid ${CNC_RED}` }}
  >
    <div className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ background: "#fff5f5" }}>
          {icon}
        </div>
        <span className="text-xs font-bold" style={{ color: badgeColor }}>{badge}</span>
      </div>
      <p className="text-2xl font-black text-gray-900 mb-1">{value}</p>
      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">{label}</p>
    </div>
  </div>
);

const QuickTile = ({ icon, label, href }: { icon: string; label: string; href: string }) => (
  <a
    href={href}
    className="flex flex-col items-center justify-center gap-2 py-6 bg-white border border-gray-100 rounded-sm shadow-sm hover:border-red-200 hover:shadow-md transition-all group cursor-pointer"
  >
    <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl group-hover:scale-110 transition-transform" style={{ background: "#fff5f5" }}>
      {icon}
    </div>
    <span className="text-xs font-bold uppercase tracking-widest text-gray-600 group-hover:text-red-600 transition-colors">
      {label}
    </span>
  </a>
);

type ActivityStatus = "completed" | "pending" | "urgent";
interface ActivityRow { action: string; module: string; time: string; status: ActivityStatus; }

const statusStyle: Record<ActivityStatus, string> = {
  completed: "bg-green-50 text-green-700",
  pending:   "bg-yellow-50 text-yellow-700",
  urgent:    "bg-red-50 text-red-700",
};

const metrics: MetricCardProps[] = [
  { icon: "🩺", value: "5,842",   label: "Medical Tests This Month",  badge: "+8.2%",         badgeColor: "#16a34a" },
  { icon: "🏢", value: "124",     label: "Active Clients",            badge: "+3 new",         badgeColor: "#16a34a" },
  { icon: "💰", value: "R 1.23M", label: "Monthly Revenue",           badge: "+12.4%",         badgeColor: "#16a34a" },
  { icon: "📈", value: "R 380K",  label: "Open Sales Pipeline",       badge: "−4 deals",       badgeColor: CNC_RED   },
  { icon: "👥", value: "47",      label: "Staff Headcount",           badge: "+2 this month",  badgeColor: "#16a34a" },
  { icon: "📋", value: "12",      label: "Pending Approvals",         badge: "3 urgent",       badgeColor: CNC_RED   },
];

const quickLinks = [
  { icon: "👤", label: "Staff & HR",  href: "/staff"      },
  { icon: "💵", label: "Finance",     href: "/finance"    },
  { icon: "📊", label: "Sales & CRM", href: "/sales"      },
  { icon: "⚙️",  label: "Operations", href: "/operations" },
  { icon: "🔧", label: "Admin",       href: "/admin"      },
];

const activity: ActivityRow[] = [
  { action: "Invoice #INV-2094 issued to Harmony Mining",    module: "Finance",    time: "2 min ago",  status: "completed" },
  { action: "New client onboarded: Impala Platinum Holdings",module: "Sales",      time: "18 min ago", status: "completed" },
  { action: "Spirometry batch completed – Elandsfontein",    module: "Operations", time: "34 min ago", status: "completed" },
  { action: "Leave request submitted – T. Mthembu",          module: "HR",         time: "1 hr ago",   status: "pending"   },
  { action: "SLA breach risk flagged – Glencore site",       module: "Operations", time: "2 hr ago",   status: "urgent"    },
  { action: "EMP201 submission reminder",                    module: "Finance",    time: "3 hr ago",   status: "pending"   },
];

export default function DashboardPage() {
  const today = new Date().toLocaleDateString("en-ZA", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="max-w-screen-xl mx-auto">

      {/* Page heading */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1 h-7 rounded-full" style={{ background: CNC_RED }} />
            <h1 className="text-2xl font-black uppercase tracking-wide text-gray-900">DASHBOARD</h1>
          </div>
          <p className="text-sm text-gray-400 ml-4">{today}</p>
        </div>
        <button className="relative p-2 rounded-full bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <span className="text-lg">🔔</span>
          <span
            className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-black"
            style={{ background: CNC_RED, fontSize: 9 }}
          >3</span>
        </button>
      </div>

      {/* Welcome banner */}
      <div className="rounded-sm mb-8 overflow-hidden relative" style={{ background: CNC_RED }}>
        <div className="px-8 py-6 relative z-10">
          <p className="text-red-200 text-xs font-bold uppercase tracking-widest mb-1">WELCOME BACK</p>
          <h2 className="text-white text-2xl font-black mb-1">Care Net Consultants Portal</h2>
          <p className="text-red-100 text-sm">4 fixed clinics · National mobile units · 5,000+ medical tests/month</p>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10">
          <svg viewBox="0 0 500 80" className="w-64 h-16">
            <polyline points="0,40 80,40 110,10 140,70 170,10 200,40 300,40 330,20 360,60 390,40 500,40" fill="none" stroke="white" strokeWidth="4" />
          </svg>
        </div>
        <div className="absolute right-32 top-1/2 -translate-y-1/2 opacity-10 text-8xl">🫀</div>
      </div>

      {/* Alert banner */}
      <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-sm px-5 py-3 flex items-center gap-3">
        <span className="text-yellow-500 text-base">⚠️</span>
        <p className="text-sm text-yellow-800">
          <span className="font-black">3 items need attention: </span>
          Leave approval pending ·{" "}
          <span className="underline cursor-pointer">VAT201 due in 8 days</span> ·{" "}
          <span className="underline cursor-pointer">1 SLA breach risk (Glencore site)</span>
        </p>
      </div>

      {/* Key metrics */}
      <SectionLabel>KEY METRICS</SectionLabel>
      <div className="grid grid-cols-3 gap-4 mb-10">
        {metrics.map((m, i) => <MetricCard key={i} {...m} />)}
      </div>

      {/* Quick access */}
      <SectionLabel>QUICK ACCESS</SectionLabel>
      <div className="grid grid-cols-5 gap-4 mb-10">
        {quickLinks.map((q) => <QuickTile key={q.label} {...q} />)}
      </div>

      {/* Recent activity */}
      <SectionLabel>RECENT ACTIVITY</SectionLabel>
      <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden mb-8">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {["Action", "Module", "Time", "Status"].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-xs font-black uppercase tracking-widest text-gray-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {activity.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 cursor-pointer transition-colors">
                <td className="px-6 py-3 text-sm text-gray-700">{row.action}</td>
                <td className="px-6 py-3 text-xs text-gray-500">{row.module}</td>
                <td className="px-6 py-3 text-xs text-gray-400">{row.time}</td>
                <td className="px-6 py-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusStyle[row.status]}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer accent */}
      <AfricanDivider />
      <p className="text-center text-xs text-gray-400 mt-3 pb-6">
        Care Net Consultants (Pty) Ltd · Internal Portal · POPIA Act 4 of 2013 · Confidential
      </p>

      {/* Sr Thandi floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform"
          style={{ background: CNC_RED }}
          title="Chat with Sr Thandi"
        >
          <span className="text-xl">🎧</span>
        </button>
      </div>

    </div>
  );
}
