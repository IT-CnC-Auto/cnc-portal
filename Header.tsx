import { Mail, Stethoscope, Bell, MessageCircle, MoreHorizontal } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

// Placeholder handlers — links to be wired in later:
//  - Email  → Microsoft email
//  - MCO    → My Clinic Online login
//  - WhatsApp → opens WhatsApp app
//  - 5th    → to be decided
const actionButtons = [
  { key: 'mail', label: 'Email — Microsoft', Icon: Mail },
  { key: 'mco', label: 'My Clinic Online', Icon: Stethoscope },
  { key: 'bell', label: 'Notifications — internal updates', Icon: Bell },
  { key: 'whatsapp', label: 'WhatsApp', Icon: MessageCircle },
  { key: 'more', label: 'More (coming soon)', Icon: MoreHorizontal },
]

export function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-cnc-gray-100 flex items-center px-6 sticky top-0 z-30 gap-4">
      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-heading font-bold text-cnc-black truncate">
          {title}
        </h1>
        {subtitle && <p className="text-xs text-cnc-gray-400 truncate">{subtitle}</p>}
      </div>

      {/* Per-page actions slot (kept from original) */}
      {actions && <div className="flex items-center gap-2">{actions}</div>}

      {/* CNC quick-action buttons — horizontal, circular */}
      <div className="flex items-center gap-2.5">
        {actionButtons.map(({ key, label, Icon }) => (
          <button
            key={key}
            title={label}
            aria-label={label}
            className="w-10 h-10 rounded-full border border-cnc-gray-100 bg-white flex items-center justify-center text-cnc-red hover:border-cnc-red hover:shadow-cnc-red hover:-translate-y-0.5 transition-all"
          >
            <Icon className="w-[18px] h-[18px]" />
          </button>
        ))}
      </div>
    </header>
  )
}
