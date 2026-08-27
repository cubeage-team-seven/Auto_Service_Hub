import React from 'react'

export default function KpiCard({
  title,
  value,
  subtitle,
  change,
  changeType = 'neutral', // 'positive', 'negative', 'neutral'
  icon: Icon,
  accentColor = 'lime', // 'lime', 'blue', 'emerald', 'amber', 'rose'
  className = '',
}) {
  const accentClasses = {
    lime: 'text-[#d8ff3d] bg-[#d8ff3d]/10 border-[#d8ff3d]/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  }

  return (
    <div
      className={`glass-card relative overflow-hidden rounded-xl p-5 border transition-all duration-300 hover:border-zinc-700 hover:shadow-[0_4px_25px_rgba(0,0,0,0.5)] ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">{title}</p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-white">{value}</h3>
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg border ${accentClasses[accentColor]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || change) && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          {change && (
            <span
              className={`font-semibold px-1.5 py-0.5 rounded ${
                changeType === 'positive'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : changeType === 'negative'
                  ? 'bg-rose-500/20 text-rose-400'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {change}
            </span>
          )}
          {subtitle && <span className="text-zinc-400">{subtitle}</span>}
        </div>
      )}
    </div>
  )
}
