import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutGrid, Star, Users, ChevronLeft, Box, UserCheck, Grid } from 'lucide-react'

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()

  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutGrid,
    },
    {
      label: 'Billing',
      path: '/billing',
      icon: Star,
    },
    {
      label: 'Customers',
      path: '/customers',
      icon: Users,
    },
  ]

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-60 border-r border-[#242626] bg-[#0f1010] flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="flex items-center gap-3 px-5 py-5 border-b border-[#242626]">
            <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#c8f135] text-black font-extrabold shadow-[0_0_12px_rgba(200,241,53,0.3)]">
              <Box className="w-4 h-4 text-black stroke-[2.5]" />
            </div>
            <span className="text-sm font-extrabold tracking-widest text-[#f0f0f0] uppercase font-display">
              SMARTGARAGE
            </span>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1.5 mt-2">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path === '/billing' && location.pathname.startsWith('/billing')) ||
                (item.path === '/customers' && location.pathname.startsWith('/customers')) ||
                (item.path === '/dashboard' && location.pathname === '/dashboard')

              const Icon = item.icon

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all ${
                    isActive
                      ? 'bg-[#191a1a] text-[#c8f135] border border-[#242626] shadow-[0_0_10px_rgba(200,241,53,0.1)] font-display'
                      : 'text-[#6b6e6e] hover:text-[#f0f0f0] hover:bg-[#191a1a]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#c8f135]' : 'text-[#6b6e6e]'}`} />
                  <span>{item.label}</span>
                </Link>
              )
            })}

            {/* Select Module Link */}
            <div className="pt-4 border-t border-[#242626]">
              <Link
                to="/modules"
                onClick={onClose}
                className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-semibold text-[#6b6e6e] hover:text-[#f0f0f0] hover:bg-[#191a1a] transition-all font-display"
              >
                <Grid className="w-4 h-4 text-[#6b6e6e]" />
                <span>Select Module</span>
              </Link>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer collapse toggle indicator matching Figma screenshot */}
        <div className="p-4 border-t border-[#242626] flex items-center justify-between text-[#6b6e6e]">
          <ChevronLeft className="w-4 h-4 cursor-pointer hover:text-[#f0f0f0] transition-colors" />
        </div>
      </aside>
    </>
  )
}
