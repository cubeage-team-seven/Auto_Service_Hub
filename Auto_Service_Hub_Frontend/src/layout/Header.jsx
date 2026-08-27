import React from 'react'
import { Menu } from 'lucide-react'

export default function Header({ onToggleSidebar, activeModule = 'Billing' }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-[#242626] bg-[#0f1010]/95 px-4 md:px-6 backdrop-blur-md">
      {/* Left section: Hamburger (mobile) + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-1.5 rounded-md text-[#6b6e6e] hover:bg-[#191a1a] hover:text-[#f0f0f0] lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs text-[#6b6e6e] font-medium">
          <span className="font-semibold text-[#6b6e6e]">SmartGarage</span>
          <span className="text-[#3a3d3d]">/</span>
          <span className="font-bold text-[#f0f0f0] font-display uppercase tracking-wide">{activeModule}</span>
        </div>
      </div>

      {/* Right section: Badges & Action button */}
      <div className="flex items-center gap-2.5">
        {/* Module Badge */}
        <div className="px-2.5 py-1 rounded bg-[#191a1a] border border-[#242626] text-[#c8f135] text-[11px] font-bold tracking-widest uppercase font-mono">
          {activeModule.toUpperCase()}
        </div>

        {/* AI Alerts Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#141515] border border-[#242626] text-xs text-zinc-300 font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#c8f135] animate-pulse" />
          <span>3 AI alerts</span>
        </div>

        {/* Currency Action Button */}
        <button
          type="button"
          className="w-7 h-7 rounded-full bg-[#c8f135] text-black font-extrabold flex items-center justify-center text-sm shadow-[0_0_10px_rgba(200,241,53,0.3)] hover:scale-105 transition-transform"
          title="Currency & Finance Settings"
        >
          ₹
        </button>
      </div>
    </header>
  )
}
