import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Wrench,
  Calendar,
  Clock,
  History,
  User,
  ArrowLeft,
  Shield,
  Car,
  Bell,
  MessageSquare,
  Sparkles,
  Grid,
  CheckCircle,
} from 'lucide-react'
import { getNotifications } from '../../services/customerPortalService'

export default function CustomerPortalLayout({ children }) {
  const location = useLocation()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const notifs = getNotifications()
    setUnreadCount(notifs.filter((n) => !n.read).length)
  }, [location.pathname])

  const navItems = [
    { label: 'Live Service Status', path: '/portal', icon: Clock },
    { label: 'My Vehicles', path: '/portal/vehicles', icon: Car },
    { label: 'Book Appointment', path: '/portal/book', icon: Calendar },
    { label: 'Appointments', path: '/portal/appointments', icon: CheckCircle },
    { label: 'Service History', path: '/portal/history', icon: History },
    { label: 'Notifications', path: '/portal/notifications', icon: Bell, badge: unreadCount },
    { label: 'Feedback', path: '/portal/feedback', icon: MessageSquare },
    { label: 'Profile', path: '/portal/profile', icon: User },
  ]

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans">
      {/* Top Customer Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-800 bg-[#09090b]/95 backdrop-blur-md px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/modules" className="group flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#d8ff3d] to-lime-500 text-black shadow-[0_0_15px_rgba(216,255,61,0.4)] group-hover:scale-105 transition-transform">
                <Wrench className="w-5 h-5 font-black" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-1.5">
                  SMARTGARAGE <span className="text-[#d8ff3d]">PORTAL</span>
                </h1>
                <p className="text-[10px] text-zinc-400">Customer Self-Service Workspace</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/modules"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all"
            >
              <Grid className="w-3.5 h-3.5 text-[#d8ff3d]" />
              <span className="hidden sm:inline">Select</span> Module
            </Link>

            <Link
              to="/billing"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to</span> Admin
            </Link>

            <Link
              to="/portal/profile"
              className="flex items-center gap-2 pl-2 border-l border-zinc-800 hover:opacity-90 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-[#d8ff3d]/20 border border-[#d8ff3d]/40 text-[#d8ff3d] font-black text-xs flex items-center justify-center shadow-[0_0_10px_rgba(216,255,61,0.2)]">
                JD
              </div>
              <div className="hidden md:block text-left text-xs">
                <p className="font-semibold text-white leading-none">John Doe</p>
                <p className="text-[10px] text-zinc-400 leading-none mt-0.5">Audi RS5 (MH-12-AB-9901)</p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation Sub-bar */}
      <nav className="border-b border-zinc-800 bg-zinc-950 px-4 py-2">
        <div className="mx-auto flex max-w-7xl items-center justify-start gap-1.5 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#d8ff3d] text-black shadow-[0_0_12px_rgba(216,255,61,0.3)]'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                      isActive ? 'bg-black text-[#d8ff3d]' : 'bg-[#d8ff3d] text-black'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Main Customer Container */}
      <main className="flex-1 mx-auto max-w-7xl w-full p-4 sm:p-6 md:p-8">{children}</main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-6 px-4 text-center text-xs text-zinc-500">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 SmartGarage Self-Service Hub • 24/7 Roadside Assistance: +1 (800) 555-AUTO</p>
          <div className="flex items-center gap-4 text-zinc-400">
            <span className="flex items-center gap-1 text-[11px]">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> SSL Encrypted & Secure Payments
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}

