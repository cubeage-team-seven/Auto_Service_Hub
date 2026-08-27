import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CustomerPortalLayout from '../../components/layout/CustomerPortalLayout'
import Button from '../../components/common/Button'
import { getCustomerAppointments, cancelAppointment } from '../../services/customerPortalService'
import {
  Calendar,
  Clock,
  Car,
  Truck,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
} from 'lucide-react'

export default function CustomerAppointmentsPage() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState(getCustomerAppointments())

  const handleCancel = (id) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      const updated = cancelAppointment(id)
      setAppointments(updated)
    }
  }

  return (
    <CustomerPortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Calendar className="w-6 h-6 text-[#d8ff3d]" /> Scheduled Appointments
            </h2>
            <p className="text-xs text-zinc-400">
              View upcoming workshop service reservations, track pickup status, or manage schedules.
            </p>
          </div>

          <Button
            variant="primary"
            icon={Plus}
            onClick={() => navigate('/portal/book')}
          >
            Book New Appointment
          </Button>
        </div>

        {/* Appointments List */}
        {appointments.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl border border-zinc-800 text-center space-y-4">
            <Calendar className="w-12 h-12 text-zinc-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Upcoming Appointments</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              You currently have no active workshop bookings. Schedule a periodical service or diagnostic scan anytime.
            </p>
            <Button variant="primary" size="sm" onClick={() => navigate('/portal/book')}>
              Schedule Appointment Now
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="glass-card p-6 rounded-2xl border border-zinc-800 space-y-5 bg-gradient-to-b from-zinc-950 to-zinc-900 flex flex-col justify-between hover:border-[#d8ff3d]/50 transition-all"
              >
                <div className="space-y-4">
                  {/* Top Ref & Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#d8ff3d] bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800">
                      {apt.id}
                    </span>

                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {apt.status}
                    </span>
                  </div>

                  {/* Title & Service Package */}
                  <div>
                    <h3 className="text-lg font-bold text-white">{apt.serviceType}</h3>
                    <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-1">
                      <Car className="w-4 h-4 text-zinc-500" /> {apt.vehicle}
                    </p>
                  </div>

                  {/* Schedule Details Box */}
                  <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/80 text-xs space-y-2.5">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Calendar className="w-4 h-4 text-[#d8ff3d] shrink-0" />
                      <span>Date: <strong className="text-white">{apt.date}</strong></span>
                    </div>

                    <div className="flex items-center gap-2 text-zinc-300">
                      <Clock className="w-4 h-4 text-[#d8ff3d] shrink-0" />
                      <span>Slot: <strong className="text-white">{apt.timeSlot}</strong></span>
                    </div>

                    <div className="flex items-start gap-2 text-zinc-300 pt-1 border-t border-zinc-800">
                      <Truck className="w-4 h-4 text-[#d8ff3d] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-white">Valet Pickup & Drop</p>
                        <p className="text-[11px] text-zinc-400">{apt.pickupAddress}</p>
                      </div>
                    </div>

                    {apt.notes && (
                      <div className="p-2.5 rounded bg-zinc-950 text-[11px] text-zinc-400 border border-zinc-800/50">
                        <strong className="text-zinc-300">Notes:</strong> "{apt.notes}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
                    icon={Trash2}
                    onClick={() => handleCancel(apt.id)}
                  >
                    Cancel Booking
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CustomerPortalLayout>
  )
}
