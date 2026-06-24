import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = { title: 'Marketing · CNC Portal' }

const CNC_RED = '#ED1B24'

function KpiCard({ icon, value, label, badge, badgeColor }: {
  icon: string; value: string; label: string; badge: string; badgeColor: string
}) {
  return (
    <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden" style={{ borderTop: `4px solid ${CNC_RED}` }}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ background: '#fff5f5' }}>{icon}</div>
          <span className="text-xs font-bold" style={{ color: badgeColor }}>{badge}</span>
        </div>
        <p className="text-2xl font-black text-gray-900 mb-1">{value}</p>
        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">{label}</p>
      </div>
    </div>
  )
}

function CardHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-1 h-5 rounded-full" style={{ background: CNC_RED }} />
        <h2 className="text-sm font-black uppercase tracking-widest text-gray-700">{title}</h2>
      </div>
      {action}
    </div>
  )
}

const campaigns = [
  { name: 'Mining Safety Month',   channels: 'LinkedIn + Email', status: 'Live',    leads: 5  },
  { name: 'Mobile Clinic Drive',   channels: 'WhatsApp + Email', status: 'Live',    leads: 4  },
  { name: 'IOD Awareness',         channels: 'Ghost CMS',        status: 'Live',    leads: 3  },
  { name: 'Q3 Client Newsletter',  channels: 'Email',            status: 'Draft',   leads: 0  },
  { name: 'ISO 45001 Webinar',     channels: 'LinkedIn + Zoom',  status: 'Planned', leads: 0  },
]

const ghostContent = [
  { title: 'Managing Noise-Induced Hearing Loss in Mining',              date: '20 Jun 2026', status: 'Published' },
  { title: 'What is an Occupational Health Assessment?',                 date: '14 Jun 2026', status: 'Published' },
  { title: 'Mobile Clinics: How We Bring Health to Your Site',           date: '07 Jun 2026', status: 'Published' },
  { title: 'COIDA: Your 5-Step Guide to Filing an IOD Claim',           date: '01 Jun 2026', status: 'Published' },
]

const campaignStatusStyle: Record<string, string> = {
  Live:    'bg-green-50 text-green-700',
  Draft:   'bg-yellow-50 text-yellow-700',
  Planned: 'bg-gray-100 text-gray-500',
}

export default function MarketingPage() {
  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-7 rounded-full" style={{ background: CNC_RED }} />
          <h1 className="text-2xl font-black uppercase tracking-wide text-gray-900">MARKETING</h1>
        </div>
        <p className="text-sm text-gray-400 ml-4">Campaigns · Content · Brand · Lead Generation</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <KpiCard icon="📣" value="3"     label="Active Campaigns"    badge="2 more in draft"  badgeColor="#16a34a" />
        <KpiCard icon="🌐" value="2 840" label="Website Visitors MTD" badge="+18% vs May"     badgeColor="#16a34a" />
        <KpiCard icon="📲" value="5 200" label="Social Reach MTD"    badge="LinkedIn + WA"    badgeColor="#16a34a" />
        <KpiCard icon="🎯" value="12"    label="Leads Generated"     badge="↑ 4 this week"   badgeColor="#16a34a" />
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          <CardHeader
            title="CAMPAIGN TRACKER"
            action={
              <button className="text-xs font-bold uppercase tracking-wide text-white px-3 py-1.5" style={{ background: CNC_RED }}>
                + New Campaign
              </button>
            }
          />
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {['Campaign', 'Channels', 'Status', 'Leads'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {campaigns.map((c, i) => (
                <tr key={i} className="hover:bg-red-50 cursor-pointer transition-colors">
                  <td className="px-5 py-3 text-sm font-semibold text-gray-800">{c.name}</td>
                  <td className="px-5 py-3 text-xs text-gray-500">{c.channels}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${campaignStatusStyle[c.status]}`}>{c.status}</span>
                  </td>
                  <td className="px-5 py-3 text-sm font-black text-gray-900">{c.leads > 0 ? c.leads : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          <CardHeader title="CNC STUDIO" />
          <div className="px-5 py-4 space-y-2">
            {[
              'Create New Blog Post',
              'Schedule LinkedIn Post',
              'Design Campaign Graphic',
              'Send Client Newsletter',
              'View Brand Guidelines',
              'Access Ghost CMS',
              'Download Media Kit',
              'Request AutoHive Email Blast',
            ].map(a => (
              <button key={a} className="w-full text-left text-xs font-bold text-gray-700 py-2 px-3 bg-gray-50 hover:bg-red-50 hover:text-red-700 transition-colors rounded-sm">
                → {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden mb-8">
        <CardHeader title="RECENT GHOST CMS CONTENT" action={
          <button className="text-xs font-bold uppercase tracking-wide text-white px-3 py-1.5" style={{ background: CNC_RED }}>
            + New Post
          </button>
        } />
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              {['Title', 'Published', 'Status'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {ghostContent.map((g, i) => (
              <tr key={i} className="hover:bg-red-50 cursor-pointer transition-colors">
                <td className="px-5 py-3 text-sm font-semibold text-gray-800">{g.title}</td>
                <td className="px-5 py-3 text-xs text-gray-400">{g.date}</td>
                <td className="px-5 py-3">
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-50 text-green-700">{g.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
