"use client";
import { useState } from "react";
const CNC_RED = "#ED1B24";

const AfricanDivider = () => (
  <div className="w-full overflow-hidden" style={{ height: 14 }}>
    <svg viewBox="0 0 800 14" className="w-full h-full" preserveAspectRatio="none">
      {[...Array(40)].map((_, i) => (
        <polygon key={i} points={`${i*20+10},0 ${i*20+20},14 ${i*20},14`}
          fill={i%5===0?CNC_RED:i%5===1?"#1a1a1a":i%5===2?"#c8a850":i%5===3?"#2a6496":"#4a9e4a"} />
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
const KpiCard = ({ icon, value, label, badge, badgeColor }: { icon:string;value:string;label:string;badge:string;badgeColor:string }) => (
  <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden" style={{ borderTop:`4px solid ${CNC_RED}` }}>
    <div className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ background:"#fff5f5" }}>{icon}</div>
        <span className="text-xs font-bold" style={{ color:badgeColor }}>{badge}</span>
      </div>
      <p className="text-2xl font-black text-gray-900 mb-1">{value}</p>
      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">{label}</p>
    </div>
  </div>
);

const invoices = [
  { number:"INV-2094", client:"Harmony Mining Ltd",      amount:"R 48 000", date:"05 Jun 2026", status:"Paid"    },
  { number:"INV-2093", client:"BuildRight Construction",  amount:"R 22 000", date:"04 Jun 2026", status:"Pending" },
  { number:"INV-2092", client:"Impala Platinum Holdings", amount:"R 67 500", date:"03 Jun 2026", status:"Paid"    },
  { number:"INV-2091", client:"Agri-Fresh Packers",       amount:"R 31 500", date:"02 Jun 2026", status:"Overdue" },
  { number:"INV-2090", client:"SA Steel Manufacturing",   amount:"R 17 000", date:"01 Jun 2026", status:"Pending" },
];

const taxCalendar = [
  { item:"VAT201 Submission",  due:"30 Jun 2026", daysLeft:22, urgent:true  },
  { item:"EMP201 Monthly",     due:"07 Jul 2026", daysLeft:29, urgent:false },
  { item:"Provisional Tax",    due:"31 Aug 2026", daysLeft:83, urgent:false },
  { item:"EMP501 Reconciliation",due:"31 Oct 2026",daysLeft:145,urgent:false },
];

const statusStyle: Record<string,string> = {
  Paid:    "bg-green-50 text-green-700",
  Pending: "bg-yellow-50 text-yellow-700",
  Overdue: "bg-red-50 text-red-700",
};

export default function FinancePage() {
  const [activeNav, setActiveNav] = useState("Finance");
  const navItems = ["Dashboard","Staff & HR","Finance","Sales & CRM","Operations","Admin"];
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white text-xs px-6 py-1.5 flex justify-between items-center">
        <div className="flex gap-4"><span>📞 +27 60 070 2723</span><span>✉️ ops@carenetconsultants.co.za</span></div>
        <div className="flex gap-3 items-center">
          <span className="text-gray-400">Internal Portal · POPIA Protected</span>
          <span className="w-px h-3 bg-gray-600" />
          <span style={{ color:CNC_RED }} className="font-bold">● LIVE</span>
        </div>
      </div>
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-screen-xl mx-auto px-6 py-3 flex items-center justify-between">
          <img src="/care-net-logo.png" alt="Care Net Consultants" className="h-16 w-auto" />
          <nav className="flex gap-1">
            {navItems.map(item => (
              <button key={item} onClick={() => setActiveNav(item)}
                className="px-4 py-2 text-sm font-bold uppercase tracking-wide transition-all"
                style={{ color:activeNav===item?"white":"#374151", background:activeNav===item?CNC_RED:"transparent", letterSpacing:"0.06em" }}>
                {item}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <div className="text-right"><p className="text-sm font-bold text-gray-800">Portal Admin</p><p className="text-xs text-gray-400">carenetconsultants.co.za</p></div>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-black" style={{ background:CNC_RED }}>CN</div>
          </div>
        </div>
        <AfricanDivider />
      </header>
      <main className="max-w-screen-xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1 h-7 rounded-full" style={{ background:CNC_RED }} />
            <h1 className="text-2xl font-black uppercase tracking-wide text-gray-900">FINANCE</h1>
          </div>
          <p className="text-sm text-gray-400 ml-4">Invoicing · Tax · Budget · Reporting</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <KpiCard icon="💰" value="R 1.23M" label="Monthly Revenue"      badge="+12.4%"      badgeColor="#16a34a" />
          <KpiCard icon="📄" value="R 186K"  label="Outstanding Invoices" badge="3 overdue"   badgeColor={CNC_RED} />
          <KpiCard icon="📉" value="R 412K"  label="MTD Expenses"         badge="-2.1% vs budget" badgeColor="#16a34a" />
          <KpiCard icon="🏦" value="R 847K"  label="Cash Position"        badge="Healthy"     badgeColor="#16a34a" />
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="col-span-2 bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 rounded-full" style={{ background:CNC_RED }} />
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-700">RECENT INVOICES</h2>
              </div>
              <button className="text-xs font-bold uppercase tracking-wide text-white px-3 py-1.5" style={{ background:CNC_RED }}>+ New Invoice</button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  {["Invoice","Client","Amount","Date","Status"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {invoices.map((inv,i) => (
                  <tr key={i} className="hover:bg-red-50 cursor-pointer transition-colors">
                    <td className="px-5 py-3 text-sm font-bold text-gray-800">{inv.number}</td>
                    <td className="px-5 py-3 text-sm text-gray-700">{inv.client}</td>
                    <td className="px-5 py-3 text-sm font-bold text-gray-900">{inv.amount}</td>
                    <td className="px-5 py-3 text-xs text-gray-400">{inv.date}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusStyle[inv.status]}`}>{inv.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-1 h-5 rounded-full" style={{ background:CNC_RED }} />
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-700">TAX CALENDAR</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {taxCalendar.map((t,i) => (
                <div key={i} className="px-5 py-4 hover:bg-red-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-800">{t.item}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Due: {t.due}</p>
                    </div>
                    <span className={`text-xs font-black px-2 py-1 rounded-full ${t.urgent?"bg-red-50 text-red-700":"bg-gray-100 text-gray-500"}`}>
                      {t.daysLeft}d
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width:`${Math.min(100,(180-t.daysLeft)/180*100)}%`, background:t.urgent?CNC_RED:"#86efac" }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-gray-100">
              <SectionLabel>QUICK ACTIONS</SectionLabel>
              <div className="space-y-2">
                {["Generate VAT201","Run Payroll","Export Management Accounts","Download IRP5s"].map(a => (
                  <button key={a} className="w-full text-left text-xs font-bold text-gray-700 py-2 px-3 bg-gray-50 hover:bg-red-50 hover:text-red-700 transition-colors rounded-sm">
                    → {a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <AfricanDivider />
        <p className="text-center text-xs text-gray-400 mt-3 pb-6">Care Net Consultants (Pty) Ltd · Internal Portal · POPIA Act 4 of 2013 · Confidential</p>
      </main>
      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform" style={{ background:CNC_RED }} title="Chat with Sr Thandi">
          <span className="text-xl">🎧</span>
        </button>
      </div>
    </div>
  );
}
