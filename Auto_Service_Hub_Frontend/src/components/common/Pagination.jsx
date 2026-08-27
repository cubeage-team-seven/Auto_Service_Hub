import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  className = '',
}) {
  if (totalPages <= 1) return null

  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-4 border-t border-zinc-800 text-xs text-zinc-400 ${className}`}>
      <div>
        Showing <span className="font-medium text-zinc-200">{startItem}</span> to{' '}
        <span className="font-medium text-zinc-200">{endItem}</span> of{' '}
        <span className="font-medium text-zinc-200">{totalItems}</span> results
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-1.5 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`min-w-[32px] h-8 px-2 rounded-md border text-xs font-medium transition-all ${
              page === currentPage
                ? 'bg-[#d8ff3d] border-[#d8ff3d] text-black font-bold shadow-[0_0_10px_rgba(216,255,61,0.3)]'
                : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-1.5 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
