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

const approvals = [
  { item:"Leave request – T. Mthembu",         module:"HR",      submitted:"Today 08:12",   priority:"Normal" },
  { item:"Invoice write-off – INV-2078",        module:"Finance", submitted:"Yesterday",     priority:"High"   },
  { item:"New vendor – MedEquip SA",            module:"Procurement",submitted:"3 days ago", priority:"Normal" },
  { item:"Access request – Cassandra (GitHub)", module:"IT",      submitted:"3 days ago",    priority:"Low"    },
  { item:"Mobile unit deployment – Agri-Fresh", module:"Ops",     submitted:"4 days ago",    priority:"High"   },
];

const integrations = [
  { name:"AutoHive CRM",       status:"Connected", lastSync:"2 min ago",  icon:"🔗" },
  { name:"Make.com",           status:"Connected", lastSync:"5 min ago",  icon:"⚡" },
  { name:"Supabase",           status:"Connected", lastSync:"Live",       icon:"🗄️"  },
  { name:"ElevenLabs (Thandi)",status:"Connected", lastSync:"Active",     icon:"🎧" },
  { name:"Telnyx",             status:"Connected", lastSync:"Active",     icon:"📞" },
  { name:"MyClinicOnline",     status:"Connected", lastSync:"15 min ago", icon:"🏥" },
];

const users = [
  { name:"Odendaal Oosthuizen", role:"IT Admin",        access:"Full",    lastLogin:"Today 07:55"  },
  { name:"Barteld Jans Bakker", role:"MD / Director",   access:"Full",    lastLogin:"Today 08:30"  },
  { name:"Cassandra Louw",      role:"Frontend Dev",    access:"Limited", lastLogin:"Yesterday"    },
  { name:"Quintus de Beer",     role:"DB Admin",        access:"Limited", lastLogin:"2 days ago"   },
];

export default function AdminPage() {
  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-7 rounded-full" style={{ background:CNC_RED }} />
          <h1 className="text-2xl font-black uppercase tracking-wide text-gray-900">ADMIN</h1>
        </div>
        <p className="text-sm text-gray-400 ml-4">System · Users · Integrations · Approvals</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <KpiCard icon="👤" value="4"    label="Portal Users"        badge="All active"  badgeColor="#16a34a" />
        <KpiCard icon="📋" value="12"   label="Pending Approvals"   badge="3 urgent"    badgeColor={CNC_RED} />
        <KpiCard icon="🔗" value="6/6"  label="Integrations Active" badge="All healthy" badgeColor="#16a34a" />
        <KpiCard icon="🛡️" value="100%" label="System Uptime"       badge="30 days"     badgeColor="#16a34a" />
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 rounded-full" style={{ background:CNC_RED }} />
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-700">PENDING APPROVALS</h2>
            </div>
            <span className="text-xs font-bold text-white px-2 py-1 rounded-full" style={{ background:CNC_RED }}>12 pending</span>
          </div>
          <div className="divide-y divide-gray-50">
            {approvals.map((a,i) => (
              <div key={i} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800">{a.item}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-400">{a.module}</span>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs text-gray-400">{a.submitted}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${a.priority==="High"?"bg-red-50 text-red-700":a.priority==="Normal"?"bg-gray-100 text-gray-600":"bg-blue-50 text-blue-600"}`}>{a.priority}</span>
                    <button className="text-xs font-bold text-white px-3 py-1.5" style={{ background:CNC_RED }}>Approve</button>
                    <button className="text-xs font-bold text-gray-500 px-3 py-1.5 border border-gray-200">Decline</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-1 h-5 rounded-full" style={{ background:CNC_RED }} />
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-700">INTEGRATIONS</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {integrations.map((int,i) => (
                <div key={i} className="px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{int.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-gray-800">{int.name}</p>
                      <p className="text-xs text-gray-400">{int.lastSync}</p>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-1 h-5 rounded-full" style={{ background:CNC_RED }} />
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-700">PORTAL USERS</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {users.map((u,i) => (
                <div key={i} className="px-5 py-3">
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black" style={{ background:CNC_RED }}>{u.name[0]}</div>
                    <span className="text-xs font-bold text-gray-800">{u.name}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 ml-8">
                    <span>{u.role}</span>
                    <span className={`font-bold ${u.access==="Full"?"text-red-600":"text-gray-500"}`}>{u.access}</span>
                  </div>
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
