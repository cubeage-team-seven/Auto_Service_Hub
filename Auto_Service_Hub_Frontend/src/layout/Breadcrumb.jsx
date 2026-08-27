import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="flex items-center gap-2 text-xs text-zinc-400 py-2 mb-4">
      <Link to="/billing" className="flex items-center gap-1 hover:text-white transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span>Billing Hub</span>
      </Link>

      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          {item.path ? (
            <Link to={item.path} className="hover:text-white transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-zinc-200">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
