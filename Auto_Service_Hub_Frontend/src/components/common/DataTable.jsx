import React from 'react'

export default function DataTable({
  columns = [],
  data = [],
  keyField = 'id',
  isLoading = false,
  emptyMessage = 'No records found',
  onRowClick,
}) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-zinc-800 bg-[#121216]">
      <table className="w-full text-left text-sm text-zinc-300">
        <thead className="bg-zinc-900/80 text-xs uppercase tracking-wider text-zinc-400 border-b border-zinc-800 font-semibold">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                className={`py-3.5 px-4 ${col.headerClassName || ''}`}
                style={{ width: col.width }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/60">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center text-zinc-500">
                <div className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-[#d8ff3d]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Loading data...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center text-zinc-500 text-sm">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={row[keyField] || rowIdx}
                onClick={() => onRowClick && onRowClick(row)}
                className={`transition-colors hover:bg-zinc-800/40 ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
              >
                {columns.map((col, colIdx) => (
                  <td key={col.key || colIdx} className={`py-4 px-4 ${col.className || ''}`}>
                    {col.render ? col.render(row, rowIdx) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
