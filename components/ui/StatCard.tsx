import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  change?: string
  changePositive?: boolean
  icon: LucideIcon
  iconBg?: string
  iconColor?: string
}

export function StatCard({
  title,
  value,
  change,
  changePositive = true,
  icon: Icon,
  iconBg = 'bg-cnc-red/10',
  iconColor = 'text-cnc-red',
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-cnc-gray-100 p-5 hover:border-cnc-gray-200 hover:shadow-cnc-sm transition-all">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}
        >
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        {change && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              changePositive
                ? 'bg-green-50 text-green-600'
                : 'bg-red-50 text-cnc-red'
            }`}
          >
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-heading font-bold text-cnc-black leading-none mb-1">
        {value}
      </p>
      <p className="text-xs text-cnc-gray-400 font-medium">{title}</p>
    </div>
  )
}
