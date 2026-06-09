"use client";
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

const staff = [
  { name:"Annemarie van Zyl",   role:"Sales Consultant",       dept:"Sales",      status:"Active",  leave:"" },
  { name:"Celeste Botha",       role:"Sales Consultant",       dept:"Sales",      status:"Active",  leave:"" },
  { name:"Elsie Nkosi",         role:"Sales Consultant",       dept:"Sales",      status:"Active",  leave:"" },
  { name:"Gladys Mthembu",      role:"Sales Consultant",       dept:"Sales",      status:"Active",  leave:"" },
  { name:"Maryna Pretorius",    role:"Sales Consultant",       dept:"Sales",      status:"Active",  leave:"" },
  { name:"Sire Dlamini",        role:"Senior Sales Consultant",dept:"Sales",      status:"Active",  leave:"" },
  { name:"T. Mthembu",          role:"OH Nurse Practitioner",  dept:"Operations", status:"On Leave",leave:"8–12 Jun" },
  { name:"Quintus de Beer",     role:"Database Administrator", dept:"IT",         status:"Active",  leave:"" },
  { name:"Cassandra Louw",      role:"Frontend Developer",     dept:"IT",         status:"Active",  leave:"" },
];

const leaveRequests = [
  { name:"T. Mthembu",       type:"Annual Leave",  dates:"8–12 Jun 2026",  status:"Pending" },
  { name:"G. Mthembu",       type:"Sick Leave",    dates:"5 Jun 2026",     status:"Approved" },
  { name:"C. Botha",         type:"Annual Leave",  dates:"23–27 Jun 2026", status:"Pending" },
];

export default function StaffPage() {
  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-7 rounded-full" style={{ background:CNC_RED }} />
          <h1 className="text-2xl font-black uppercase tracking-wide text-gray-900">STAFF & HR</h1>
        </div>
        <p className="text-sm text-gray-400 ml-4">People management · Compliance · Leave</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <KpiCard icon="👥" value="47"  label="Total Headcount"      badge="+2 this month" badgeColor="#16a34a" />
        <KpiCard icon="📋" value="3"   label="Open Positions"       badge="Urgent: 1"     badgeColor={CNC_RED} />
        <KpiCard icon="🏖️" value="3"   label="Leave Requests"       badge="2 pending"     badgeColor="#d97706" />
        <KpiCard icon="🎓" value="12"  label="CPD Credits Due"      badge="Jun deadline"  badgeColor={CNC_RED} />
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 rounded-full" style={{ background:CNC_RED }} />
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-700">STAFF DIRECTORY</h2>
            </div>
            <button className="text-xs font-bold uppercase tracking-wide text-white px-3 py-1.5" style={{ background:CNC_RED }}>+ Add Staff</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {["Name","Role","Department","Status","Leave"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {staff.map((s,i) => (
                <tr key={i} className="hover:bg-red-50 cursor-pointer transition-colors">
                  <td className="px-5 py-3 text-sm font-semibold text-gray-800">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black" style={{ background:CNC_RED }}>{s.name[0]}</div>
                      {s.name}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-600">{s.role}</td>
                  <td className="px-5 py-3 text-xs text-gray-500">{s.dept}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${s.status==="Active"?"bg-green-50 text-green-700":"bg-yellow-50 text-yellow-700"}`}>{s.status}</span>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-400">{s.leave || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex items-center gap-3">
            <div className="w-1 h-5 rounded-full" style={{ background:CNC_RED }} />
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-700">LEAVE REQUESTS</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {leaveRequests.map((r,i) => (
              <div key={i} className="px-5 py-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-gray-800">{r.name}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.status==="Approved"?"bg-green-50 text-green-700":"bg-yellow-50 text-yellow-700"}`}>{r.status}</span>
                </div>
                <p className="text-xs text-gray-500">{r.type}</p>
                <p className="text-xs text-gray-400 mt-0.5">📅 {r.dates}</p>
                {r.status==="Pending" && (
                  <div className="flex gap-2 mt-2">
                    <button className="text-xs font-bold text-white px-3 py-1" style={{ background:CNC_RED }}>Approve</button>
                    <button className="text-xs font-bold text-gray-500 px-3 py-1 border border-gray-200">Decline</button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="px-5 py-4 border-t border-gray-100">
            <SectionLabel>COMPLIANCE REMINDERS</SectionLabel>
            <div className="space-y-2">
              {[
                { label:"EE Report submission", date:"30 Jun 2026", urgent:true },
                { label:"WSP/ATR deadline",     date:"30 Jun 2026", urgent:true },
                { label:"IRP5 certificates",    date:"31 May 2026", urgent:false },
              ].map((c,i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-gray-700">{c.label}</span>
                  <span className={`font-bold ${c.urgent?"text-red-600":"text-gray-400"}`}>{c.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AfricanDivider />
      <p className="text-center text-xs text-gray-400 mt-3 pb-6">Care Net Consultants (Pty) Ltd · Internal Portal · POPIA Act 4 of 2013 · Confidential</p>

      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform" style={{ background:CNC_RED }} title="Chat with Sr Thandi">
          <span className="text-xl">🎧</span>
        </button>
      </div>
    </div>
  );
}
