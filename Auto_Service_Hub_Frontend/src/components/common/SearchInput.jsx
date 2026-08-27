import React from 'react'
import { Search, X } from 'lucide-react'

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  onClear,
}) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="absolute left-3 w-4 h-4 text-zinc-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-9 py-2 bg-zinc-900/90 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#d8ff3d] focus:ring-1 focus:ring-[#d8ff3d] transition-all duration-200"
      />
      {value && (
        <button
          type="button"
          onClick={() => (onClear ? onClear() : onChange(''))}
          className="absolute right-3 text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
