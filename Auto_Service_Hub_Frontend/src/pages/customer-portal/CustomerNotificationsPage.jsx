import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CustomerPortalLayout from '../../components/layout/CustomerPortalLayout'
import Button from '../../components/common/Button'
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../../services/customerPortalService'
import { Bell, CheckCheck, Sparkles, AlertTriangle, Info, CheckCircle2, ArrowRight } from 'lucide-react'

export default function CustomerNotificationsPage() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(getNotifications())

  const handleMarkRead = (id) => {
    const updated = markNotificationRead(id)
    setNotifications(updated)
  }

  const handleMarkAllRead = () => {
    const updated = markAllNotificationsRead()
    setNotifications(updated)
  }

  return (
    <CustomerPortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Bell className="w-6 h-6 text-[#d8ff3d]" /> Service Reminders & Alerts
            </h2>
            <p className="text-xs text-zinc-400">
              Stay informed with real-time workshop updates, maintenance due dates, and invoice alerts.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={CheckCheck}
            onClick={handleMarkAllRead}
          >
            Mark All as Read
          </Button>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map((n) => {
            const isWarning = n.type === 'warning'
            const isSuccess = n.type === 'success'

            return (
              <div
                key={n.id}
                onClick={() => handleMarkRead(n.id)}
                className={`glass-panel p-5 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer ${
                  !n.read
                    ? 'border-[#d8ff3d]/50 bg-zinc-900/90 shadow-[0_0_15px_rgba(216,255,61,0.08)]'
                    : 'border-zinc-800 bg-zinc-950/60 opacity-80'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`p-3 rounded-xl shrink-0 ${
                      isWarning
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : isSuccess
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-[#d8ff3d]/20 text-[#d8ff3d] border border-[#d8ff3d]/40'
                    }`}
                  >
                    {isWarning && <AlertTriangle className="w-5 h-5" />}
                    {isSuccess && <CheckCircle2 className="w-5 h-5" />}
                    {!isWarning && !isSuccess && <Info className="w-5 h-5" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{n.title}</h3>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-[#d8ff3d] animate-pulse" />
                      )}
                      <span className="text-[10px] text-zinc-500 font-mono">({n.date})</span>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed">{n.message}</p>
                  </div>
                </div>

                {n.actionUrl && (
                  <Button
                    variant={!n.read ? 'primary' : 'outline'}
                    size="sm"
                    className="shrink-0"
                    icon={ArrowRight}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleMarkRead(n.id)
                      navigate(n.actionUrl)
                    }}
                  >
                    {n.actionText || 'View Action'}
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </CustomerPortalLayout>
  )
}
