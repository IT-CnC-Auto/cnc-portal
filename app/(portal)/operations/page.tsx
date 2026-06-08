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

const stages = [
  { name:"Lead Captured", count:18, color:"#94a3b8" },
  { name:"Qualified",     count:12, color:"#60a5fa" },
  { name:"Proposal Sent", count:7,  color:CNC_RED   },
  { name:"Negotiation",   count:4,  color:"#f97316" },
  { name:"Closed Won",    count:9,  color:"#22c55e" },
];
const reps = [
  { name:"Sire",      leads:14, won:5, value:"R 142 000" },
  { name:"Gladys",    leads:11, won:4, value:"R 118 000" },
  { name:"Elsie",     leads:9,  won:3, value:"R 97 500"  },
  { name:"Celeste",   leads:8,  won:2, value:"R 74 000"  },
  { name:"Maryna",    leads:6,  won:2, value:"R 61 000"  },
  { name:"Annemarie", leads:5,  won:1, value:"R 38 500"  },
];
const leads = [
  { name:"Highveld Mining Ltd",     industry:"Mining",        stage:"Proposal Sent", rep:"Sire",     value:"R 48 000" },
  { name:"BuildRight Construction", industry:"Construction",  stage:"Qualified",     rep:"Gladys",   value:"R 22 000" },
  { name:"Agri-Fresh Packers",      industry:"Agriculture",   stage:"Negotiation",   rep:"Elsie",    value:"R 31 500" },
  { name:"SA Steel Manufacturing",  industry:"Manufacturing", stage:"Lead Captured", rep:"Celeste",  value:"R 17 000" },
  { name:"Swift Logistics",         industry:"Transport",     stage:"Closed Won",    rep:"Maryna",   value:"R 29 000" },
];
const stageBadge: Record<string,string> = {
  "Lead Captured":"bg-gray-100 text-gray-600","Qualified":"bg-blue-50 text-blue-700",
  "Proposal Sent":"bg-red-50 text-red-700","Negotiation":"bg-orange-50 text-orange-700","Closed Won":"bg-green-50 text-green-700",
};
const totalLeads = stages.reduce((a,b)=>a+b.count,0);

export default function SalesCRMPage() {
  const [activeNav, setActiveNav] = useState("Sales & CRM");
  const navItems = ["Dashboard","Staff & HR","Finance","Sales & CRM","Operations","Admin"];
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white text-xs px-6 py-1.5 flex justify-between items-center">
        <div className="flex gap-4"><span>📞 +27 60 070 2723</span><span>✉️ salesdesk@carenetconsultants.co.za</span></div>
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
            <h1 className="text-2xl font-black uppercase tracking-wide text-gray-900">SALES & CRM</h1>
          </div>
          <p className="text-sm text-gray-400 ml-4">AutoHive CRM · Live sync · {new Date().toLocaleDateString("en-ZA",{month:"long",year:"numeric"})}</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <KpiCard icon="💼" value="R 531K"  label="Total Pipeline Value"  badge="Active"      badgeColor="#16a34a" />
          <KpiCard icon="📊" value="50"      label="Active Opportunities"  badge="+18 new"     badgeColor="#16a34a" />
          <KpiCard icon="✅" value="9"       label="Closed Won MTD"        badge="R 193 500"   badgeColor="#16a34a" />
          <KpiCard icon="📈" value="18%"     label="Conversion Rate"       badge="+3% vs prev" badgeColor="#16a34a" />
        </div>

        <div className="bg-white rounded-sm shadow-sm border border-gray-100 mb-8 overflow-hidden">
          <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-center gap-3">
            <div className="w-1 h-5 rounded-full" style={{ background:CNC_RED }} />
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-700">PIPELINE BY STAGE</h2>
          </div>
          <div className="flex divide-x divide-gray-100">
            {stages.map(s => (
              <div key={s.name} className="flex-1 px-5 py-5 text-center hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-black mx-auto mb-2" style={{ background:s.color }}>{s.count}</div>
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wide leading-tight">{s.name}</p>
              </div>
            ))}
          </div>
          <div className="px-6 pb-5">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex">
              {stages.map(s => <div key={s.name} style={{ background:s.color, width:`${(s.count/totalLeads)*100}%` }} />)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="col-span-2 bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 rounded-full" style={{ background:CNC_RED }} />
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-700">RECENT LEADS</h2>
              </div>
              <button className="text-xs font-bold uppercase tracking-wide text-white px-3 py-1.5" style={{ background:CNC_RED }}>+ Add Lead</button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">{["Company","Industry","Stage","Rep","Value"].map(h=><th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-400">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leads.map((l,i)=>(
                  <tr key={i} className="hover:bg-red-50 cursor-pointer transition-colors">
                    <td className="px-5 py-3 text-sm font-semibold text-gray-800">{l.name}</td>
                    <td className="px-5 py-3 text-xs text-gray-500">{l.industry}</td>
                    <td className="px-5 py-3"><span className={`text-xs font-bold px-2 py-1 rounded-full ${stageBadge[l.stage]}`}>{l.stage}</span></td>
                    <td className="px-5 py-3 text-xs text-gray-600">{l.rep}</td>
                    <td className="px-5 py-3 text-sm font-bold text-gray-800">{l.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-1 h-5 rounded-full" style={{ background:CNC_RED }} />
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-700">SALES TEAM</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {reps.map((r,i)=>(
                <div key={i} className="px-5 py-3 hover:bg-red-50 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black" style={{ background:i===0?CNC_RED:"#9ca3af" }}>{r.name[0]}</div>
                      <span className="text-sm font-bold text-gray-800">{r.name}</span>
                    </div>
                    <span className="text-xs font-black text-gray-700">{r.value}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width:`${(r.leads/14)*100}%`, background:i===0?CNC_RED:"#d1d5db" }} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1"><span>{r.leads} leads</span><span>{r.won} won</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <AfricanDivider />
        <p className="text-center text-xs text-gray-400 mt-3 pb-6">Care Net Consultants (Pty) Ltd · Internal Portal · POPIA Act 4 of 2013 · Confidential</p>
      </main>
      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform" style={{ background:CNC_RED }} title="Chat with Sr Thandi"><span className="text-xl">🎧</span></button>
      </div>
    </div>
  );
}
