interface HeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

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
    </header>
  )
}
