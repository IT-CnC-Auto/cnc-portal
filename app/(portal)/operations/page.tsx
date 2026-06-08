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

const clinics = [
  { name:"Cape Town",       address:"Parow Industria",        today:42, capacity:60, status:"Open"   },
  { name:"Elandsfontein",   address:"Ekurhuleni",             today:38, capacity:50, status:"Open"   },
  { name:"Gqeberha",        address:"Port Elizabeth",         today:21, capacity:40, status:"Open"   },
  { name:"Midrand",         address:"Johannesburg North",     today:0,  capacity:50, status:"Closed" },
];
const mobileUnits = [
  { unit:"MU-01", site:"Highveld Mining – Witbank",     tests:85,  crew:"Sr Dlamini + 1", status:"Active"    },
  { unit:"MU-02", site:"BuildRight – Centurion",        tests:43,  crew:"Sr Nkosi + 1",   status:"Active"    },
  { unit:"MU-03", site:"En route to Agri-Fresh",        tests:0,   crew:"Sr Pretorius",   status:"In Transit"},
];
const recentTests = [
  { type:"Spirometry",         clinic:"Cape Town",     count:18, time:"09:45" },
  { type:"Audiometry",         clinic:"Elandsfontein", count:12, time:"10:15" },
  { type:"Drug Screening",     clinic:"Cape Town",     count:9,  time:"10:30" },
  { type:"Full Medical",       clinic:"MU-01",         count:7,  time:"11:00" },
  { type:"Vision Test",        clinic:"Gqeberha",      count:14, time:"11:20" },
];

export default function OperationsPage() {
  const [activeNav, setActiveNav] = useState("Operations");
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
            <h1 className="text-2xl font-black uppercase tracking-wide text-gray-900">OPERATIONS</h1>
          </div>
          <p className="text-sm text-gray-400 ml-4">4 Fixed Clinics · National Mobile Units · MyClinicOnline</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <KpiCard icon="🩺" value="5,842" label="Tests This Month"       badge="+8.2%"       badgeColor="#16a34a" />
          <KpiCard icon="🏥" value="3/4"   label="Clinics Active Today"   badge="Midrand closed" badgeColor="#d97706" />
          <KpiCard icon="🚐" value="2/3"   label="Mobile Units Deployed"  badge="1 in transit"  badgeColor="#2563eb" />
          <KpiCard icon="⚙️"  value="4"    label="Calibrations Due"       badge="This week"     badgeColor={CNC_RED} />
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-1 h-5 rounded-full" style={{ background:CNC_RED }} />
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-700">FIXED CLINICS — TODAY</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {clinics.map((c,i) => (
                <div key={i} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-bold text-gray-800">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.address}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${c.status==="Open"?"bg-green-50 text-green-700":"bg-gray-100 text-gray-500"}`}>{c.status}</span>
                  </div>
                  {c.status==="Open" && (
                    <>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{c.today} tests done</span>
                        <span>Capacity: {c.capacity}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width:`${(c.today/c.capacity)*100}%`, background:CNC_RED }} />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-1 h-5 rounded-full" style={{ background:CNC_RED }} />
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-700">MOBILE UNITS</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {mobileUnits.map((m,i) => (
                <div key={i} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black px-2 py-0.5 text-white rounded-sm" style={{ background:CNC_RED }}>{m.unit}</span>
                        <p className="text-sm font-bold text-gray-800">{m.site}</p>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">Crew: {m.crew}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${m.status==="Active"?"bg-green-50 text-green-700":"bg-blue-50 text-blue-700"}`}>{m.status}</span>
                  </div>
                  {m.tests > 0 && <p className="text-xs text-gray-500 mt-1">{m.tests} tests completed today</p>}
                </div>
              ))}
            </div>
            <div className="px-6 pt-4 pb-5 border-t border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1 h-4 rounded-full" style={{ background:CNC_RED }} />
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">RECENT TEST ACTIVITY</h3>
              </div>
              <div className="space-y-2">
                {recentTests.map((t,i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-gray-700 font-semibold">{t.type}</span>
                    <span className="text-gray-400">{t.clinic}</span>
                    <span className="font-bold text-gray-800">{t.count} tests</span>
                    <span className="text-gray-400">{t.time}</span>
                  </div>
                ))}
              </div>
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
