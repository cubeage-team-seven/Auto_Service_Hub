import React from 'react'

export default function StatusBadge({ status, className = '' }) {
  const normalized = (status || '').toLowerCase().replace(/_/g, ' ')

  const getStatusStyles = () => {
    switch (normalized) {
      case 'paid':
      case 'completed':
      case 'ready for pickup':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
        }
      case 'pending':
      case 'work in progress':
      case 'in progress':
      case 'partially paid':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          dot: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]',
        }
      case 'overdue':
      case 'failed':
      case 'cancelled':
      case 'unpaid':
        return {
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          dot: 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]',
        }
      case 'estimate':
      case 'draft':
      case 'inspection':
        return {
          bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
          dot: 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]',
        }
      default:
        return {
          bg: 'bg-zinc-800 text-zinc-400 border-zinc-700',
          dot: 'bg-zinc-400',
        }
    }
  }

  const style = getStatusStyles()

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${style.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      <span className="capitalize">{status}</span>
    </span>
  )
}
