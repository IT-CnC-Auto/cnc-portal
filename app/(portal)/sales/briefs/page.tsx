'use client'

import { useEffect, useState } from 'react'
import {
  Sunrise, CalendarDays, Users, Lock, Building2, Sparkles,
  MessageCircle, Globe, BarChart3, HelpCircle, Link2,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'

export const dynamic = 'force-dynamic'

// Icon vocabulary for client-vs-lead + channel (MD request 22/07/2026).
// Mirrors the digest email's emoji set semantically; the portal uses lucide
// icons to match the existing design language. Rendered ONLY from the
// deterministic brief_data.classification block — never from model prose.
const CHANNEL_META: Record<string, { label: string; Icon: typeof Globe }> = {
  chat: { label: 'Chat widget', Icon: MessageCircle },
  website: { label: 'Website', Icon: Globe },
  booking: { label: 'Booking form', Icon: CalendarDays },
  xero: { label: 'Xero', Icon: BarChart3 },
  other: { label: 'Other', Icon: Link2 },
  unknown: { label: 'Channel unknown', Icon: HelpCircle },
}
const CHANNEL_ORDER = ['chat', 'website', 'booking', 'xero', 'other', 'unknown']

interface LeadEntry {
  name: string
  age_days: number
  channel?: string
  existing_client?: boolean | null
  client_evidence?: string | null
}

interface Classification {
  existing_clients?: number
  new_business?: number
  unclassified?: number
  new_7d_by_channel?: Record<string, number>
  newest_leads?: LeadEntry[]
}

interface BriefData {
  headline?: string
  nothing_to_report?: boolean
  data_questions?: string[]
  classification?: Classification
}

interface Brief {
  id: string
  brief_date: string
  scope: 'consultant' | 'management'
  ghl_user_id: string | null
  body_md: string
  brief_data: BriefData
  model: string
  generated_at: string
}

const ddmmyyyy = (iso: string) => {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-cnc-gray-700 whitespace-nowrap">
      {children}
    </span>
  )
}

function ClientBadge({ existing }: { existing: boolean | null | undefined }) {
  if (existing === true) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-cnc-gray-600" title="Existing client (MCO/Xero record)">
        <Building2 size={13} className="shrink-0 text-cnc-gray-500" />
        Client
      </span>
    )
  }
  if (existing === false) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-cnc-gray-600" title="New business — no MCO/Xero record">
        <Sparkles size={13} className="shrink-0 text-amber-500" />
        New
      </span>
    )
  }
  return null
}

function ChannelBadge({ channel }: { channel?: string }) {
  const meta = CHANNEL_META[channel ?? 'unknown'] ?? CHANNEL_META.unknown
  const { Icon } = meta
  return (
    <span className="inline-flex items-center gap-1 text-xs text-cnc-gray-500" title={meta.label}>
      <Icon size={13} className="shrink-0" />
      {meta.label}
    </span>
  )
}

// Renders the deterministic classification block: client-mix chips, the
// 7-day channel breakdown, and (consultant briefs) the newest leads with
// per-lead icons. Silently renders nothing for pre-22/07 briefs.
function ClassificationPanel({ cls, scope }: { cls?: Classification; scope: Brief['scope'] }) {
  if (!cls) return null
  const hasMix = typeof cls.existing_clients === 'number' && typeof cls.new_business === 'number'
  const channels = CHANNEL_ORDER.filter((k) => (cls.new_7d_by_channel?.[k] ?? 0) > 0)
  const leads = cls.newest_leads ?? []
  if (!hasMix && channels.length === 0 && leads.length === 0) return null

  return (
    <div className="mb-5 rounded-lg border border-gray-100 bg-gray-50/60 p-4 space-y-3">
      {hasMix && (
        <div className="flex flex-wrap gap-2">
          <Chip>
            <Building2 size={13} className="text-cnc-gray-500" />
            Existing clients: <strong>{cls.existing_clients}</strong>
          </Chip>
          <Chip>
            <Sparkles size={13} className="text-amber-500" />
            New business: <strong>{cls.new_business}</strong>
          </Chip>
          {(cls.unclassified ?? 0) > 0 && (
            <Chip>
              <HelpCircle size={13} />
              Unclassified: <strong>{cls.unclassified}</strong>
            </Chip>
          )}
        </div>
      )}
      {channels.length > 0 && (
        <div>
          <p className="text-[11px] uppercase tracking-wide text-cnc-gray-400 mb-1.5">
            New leads (last 7 days) by channel
          </p>
          <div className="flex flex-wrap gap-2">
            {channels.map((k) => {
              const { label, Icon } = CHANNEL_META[k]
              return (
                <Chip key={k}>
                  <Icon size={13} />
                  {label}: <strong>{cls.new_7d_by_channel?.[k]}</strong>
                </Chip>
              )
            })}
          </div>
        </div>
      )}
      {scope === 'consultant' && leads.length > 0 && (
        <div>
          <p className="text-[11px] uppercase tracking-wide text-cnc-gray-400 mb-1.5">
            Newest leads
          </p>
          <ul className="space-y-1.5">
            {leads.map((l, i) => (
              <li key={i} className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-cnc-gray-700">
                <span className="font-medium">{l.name}</span>
                <span className="text-xs text-cnc-gray-400">{l.age_days}d old</span>
                <ClientBadge existing={l.existing_client} />
                <ChannelBadge channel={l.channel} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// Minimal renderer for the brief's constrained markdown (bold, bullets, paragraphs).
// No external markdown dependency on purpose.
function BriefBody({ md }: { md: string }) {
  const inline = (s: string) =>
    s.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        <span key={i}>{part}</span>
      ),
    )

  const blocks = md.split(/\n{2,}/)
  return (
    <div className="space-y-3 text-sm leading-relaxed text-cnc-gray-700">
      {blocks.map((b, bi) => {
        const lines = b.split('\n').map((l) => l.trim()).filter(Boolean)
        if (lines.length > 0 && lines.every((l) => l.startsWith('- '))) {
          return (
            <ul key={bi} className="list-disc pl-5 space-y-1">
              {lines.map((l, li) => (
                <li key={li}>{inline(l.slice(2))}</li>
              ))}
            </ul>
          )
        }
        return (
          <p key={bi}>
            {lines.map((l, li) => (
              <span key={li}>
                {inline(l)}
                {li < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        )
      })}
    </div>
  )
}

export default function BriefsPage() {
  const [briefs, setBriefs] = useState<Brief[]>([])
  const [selected, setSelected] = useState<Brief | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/sales/briefs')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((d: { briefs: Brief[] }) => {
        setBriefs(d.briefs)
        setSelected(d.briefs[0] ?? null)
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Header title="Daily Briefs" subtitle="MA-CN-003 · generated each weekday 06:00" />
      <div className="p-6 max-w-5xl">
        <div className="flex items-start gap-2 mb-6 text-xs text-cnc-gray-400">
          <Lock size={14} className="mt-0.5 shrink-0" />
          <p>
            You only see briefs meant for you. Consultant briefs are private to their
            consultant; the management brief carries team aggregates only.
          </p>
        </div>

        {loading && <p className="text-sm text-cnc-gray-400">Loading briefs…</p>}
        {error && <p className="text-sm text-red-600">Could not load briefs: {error}</p>}
        {!loading && !error && briefs.length === 0 && (
          <p className="text-sm text-cnc-gray-400">
            No briefs are visible for your account yet. Consultant briefs appear once your
            portal account is linked by IT.
          </p>
        )}

        {briefs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
            <aside>
              <p className="text-xs font-heading font-semibold text-cnc-gray-400 uppercase tracking-widest mb-3">
                History
              </p>
              <ul className="space-y-1">
                {briefs.map((b) => (
                  <li key={b.id}>
                    <button
                      onClick={() => setSelected(b)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                        selected?.id === b.id
                          ? 'bg-red-50 text-cnc-gray-900 font-medium'
                          : 'text-cnc-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {b.scope === 'management' ? (
                        <Users size={14} className="shrink-0" />
                      ) : (
                        <Sunrise size={14} className="shrink-0" />
                      )}
                      <span>{ddmmyyyy(b.brief_date)}</span>
                      <span className="ml-auto text-[10px] uppercase tracking-wide text-cnc-gray-400">
                        {b.scope === 'management' ? 'Team' : 'Mine'}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            <section className="bg-white border border-gray-200 rounded-xl p-6">
              {selected && (
                <>
                  <div className="flex items-center gap-2 text-xs text-cnc-gray-400 mb-1">
                    <CalendarDays size={14} />
                    <span>
                      {ddmmyyyy(selected.brief_date)} ·{' '}
                      {selected.scope === 'management'
                        ? 'Management roll-up (aggregates only)'
                        : 'Your private brief'}
                    </span>
                  </div>
                  {selected.brief_data?.headline && (
                    <h2 className="text-lg font-heading font-semibold text-cnc-gray-900 mb-4">
                      {selected.brief_data.headline}
                    </h2>
                  )}
                  <ClassificationPanel
                    cls={selected.brief_data?.classification}
                    scope={selected.scope}
                  />
                  <BriefBody md={selected.body_md} />
                </>
              )}
            </section>
          </div>
        )}
      </div>
    </>
  )
}
