import { Bell, Search } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-cnc-gray-100 flex items-center px-6 sticky top-0 z-30 gap-4">
      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-heading font-bold text-cnc-black truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-cnc-gray-400 truncate">{subtitle}</p>
        )}
      </div>

      {/* Actions slot */}
      {actions && <div className="flex items-center gap-2">{actions}</div>}

      {/* Right icons */}
      <div className="flex items-center gap-1">
        <button className="w-9 h-9 flex items-center justify-center rounded-lg text-cnc-gray-400 hover:text-cnc-black hover:bg-cnc-gray-50 transition-colors">
          <Search className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-lg text-cnc-gray-400 hover:text-cnc-black hover:bg-cnc-gray-50 transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cnc-red rounded-full" />
        </button>
      </div>
    </header>
  )
}
