'use client'

import { useEffect, useState } from 'react'
import { Sunrise, CalendarDays, Users, Lock } from 'lucide-react'
import { Header } from '@/components/layout/Header'

export const dynamic = 'force-dynamic'

interface BriefData {
  headline?: string
  nothing_to_report?: boolean
  data_questions?: string[]
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
