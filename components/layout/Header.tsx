import { Mail, Stethoscope, MessageCircle, ExternalLink } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

// Asana icon — 3 circles (their brand mark)
function AsanaIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <circle cx="12" cy="6.2" r="3.1"/>
      <circle cx="6.4" cy="15.3" r="3.1"/>
      <circle cx="17.6" cy="15.3" r="3.1"/>
    </svg>
  )
}

const actionButtons = [
  { key: 'mail',   label: 'Email — Microsoft',      icon: <Mail className="w-[18px] h-[18px]" /> },
  { key: 'mco',    label: 'My Clinic Online',        icon: <Stethoscope className="w-[18px] h-[18px]" /> },
  { key: 'asana',  label: 'Asana — open your tasks', icon: <AsanaIcon /> },
  { key: 'wa',     label: 'WhatsApp',                icon: <MessageCircle className="w-[18px] h-[18px]" /> },
  { key: 'window', label: 'Open in second window',   icon: <ExternalLink className="w-[18px] h-[18px]" /> },
]

export function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header className="h-[62px] bg-white border-b border-[#D2D2D2] flex items-center justify-between px-[30px] sticky top-0 z-30 gap-4">
      {/* Page title — Bebas Neue style via font-heading at large size */}
      <div className="flex-1 min-w-0">
        <h1 className="text-[26px] font-heading font-black text-black leading-none tracking-wide uppercase truncate">
          {title}
        </h1>
        {subtitle && <p className="text-xs text-[#787878] truncate mt-0.5">{subtitle}</p>}
      </div>

      {/* Per-page actions slot */}
      {actions && <div className="flex items-center gap-2">{actions}</div>}

      {/* CNC quick-action buttons */}
      <div className="flex items-center gap-2.5">
        {actionButtons.map(({ key, label, icon }) => (
          <button
            key={key}
            title={label}
            aria-label={label}
            className="w-10 h-10 rounded-full border border-[#E2E2E2] bg-white flex items-center justify-center text-[#ED1B24] hover:border-[#ED1B24] hover:shadow-[0_2px_8px_rgba(237,27,36,0.18)] hover:-translate-y-px transition-all duration-150"
          >
            {icon}
          </button>
        ))}
      </div>
    </header>
  )
}
