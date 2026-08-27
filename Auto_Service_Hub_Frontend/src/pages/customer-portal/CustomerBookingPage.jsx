import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CustomerPortalLayout from '../../components/layout/CustomerPortalLayout'
import Button from '../../components/common/Button'
import { bookNewAppointment } from '../../services/customerPortalService'
import {
  Calendar,
  Clock,
  Car,
  CheckCircle2,
  Wrench,
  Truck,
  Sparkles,
  ArrowLeft,
} from 'lucide-react'

export default function CustomerBookingPage() {
  const navigate = useNavigate()

  const [vehicle, setVehicle] = useState('Audi RS5 Coupe (MH-12-AB-9901)')
  const [serviceType, setServiceType] = useState('Periodical Service')
  const [date, setDate] = useState(
    new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]
  )
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 11:30 AM')
  const [pickupRequired, setPickupRequired] = useState(true)
  const [notes, setNotes] = useState('')
  const [isBooked, setIsBooked] = useState(false)
  const [bookingRef, setBookingRef] = useState(null)

  const servicePackages = [
    {
      title: 'Periodical Service',
      desc: 'Engine oil change, oil filter, air filter, 40-point safety inspection & vehicle wash.',
      price: '$180',
    },
    {
      title: 'Brake System Servicing',
      desc: 'Pads & rotor wear inspection, caliper lubrication, fluid flush & sensor diagnostics.',
      price: '$250',
    },
    {
      title: 'AC Climate Care & Sanitization',
      desc: 'Gas refilling, evaporator antibacterial treatment, pollen cabin filter replacement.',
      price: '$140',
    },
    {
      title: 'General Diagnostics & Inspection',
      desc: 'Computerized OBD-II diagnostic scan, battery health test & road check.',
      price: '$95',
    },
  ]

  const timeSlots = [
    '09:00 AM - 10:30 AM',
    '10:00 AM - 11:30 AM',
    '01:00 PM - 02:30 PM',
    '03:00 PM - 04:30 PM',
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    const apt = bookNewAppointment({
      vehicle,
      serviceType,
      date,
      timeSlot,
      pickupRequired,
      notes,
    })
    setBookingRef(apt)
    setIsBooked(true)
  }

  return (
    <CustomerPortalLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Schedule Workshop Appointment
          </h2>
          <p className="text-xs text-zinc-400">
            Choose your preferred date, service package, and valet pickup options.
          </p>
        </div>

        {isBooked ? (
          <div className="glass-panel p-8 rounded-2xl border border-zinc-800 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#d8ff3d]/20 text-[#d8ff3d] border border-[#d8ff3d]/40 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">Booking Confirmed!</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Booking Reference: <span className="font-mono text-[#d8ff3d] font-bold">{bookingRef.id}</span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 max-w-md mx-auto text-left space-y-1.5">
              <p><strong>Vehicle:</strong> {bookingRef.vehicle}</p>
              <p><strong>Package:</strong> {bookingRef.serviceType}</p>
              <p><strong>Date & Time:</strong> {bookingRef.date} ({bookingRef.timeSlot})</p>
              <p><strong>Valet Pickup:</strong> {bookingRef.pickupRequired ? 'Yes (Doorstep Pickup)' : 'No (Self Drop-off)'}</p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <Button variant="outline" onClick={() => setIsBooked(false)}>
                Book Another Service
              </Button>
              <Button variant="primary" onClick={() => navigate('/portal')}>
                Return to Live Tracker
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Select Package */}
            <div className="glass-panel p-6 rounded-2xl border border-zinc-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#d8ff3d]" /> Select Service Package
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {servicePackages.map((pkg) => {
                  const isSelected = serviceType === pkg.title
                  return (
                    <div
                      key={pkg.title}
                      onClick={() => setServiceType(pkg.title)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#d8ff3d]/10 border-[#d8ff3d] shadow-[0_0_15px_rgba(216,255,61,0.2)]'
                          : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-white text-sm">{pkg.title}</h4>
                        <span className="text-xs font-black text-[#d8ff3d]">{pkg.price}</span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-2">{pkg.desc}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Step 2: Date & Slot Picker */}
            <div className="glass-panel p-6 rounded-2xl border border-zinc-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#d8ff3d]" /> Preferred Schedule
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">
                    Service Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-[#d8ff3d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">
                    Time Slot
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-[#d8ff3d]"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Pickup & Notes */}
            <div className="glass-panel p-6 rounded-2xl border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-[#d8ff3d]" />
                  <div>
                    <p className="text-xs font-bold text-white">Doorstep Valet Pickup & Drop</p>
                    <p className="text-[11px] text-zinc-400">Complimentary within 15 km of workshop.</p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={pickupRequired}
                  onChange={(e) => setPickupRequired(e.target.checked)}
                  className="w-4 h-4 accent-[#d8ff3d] rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Specific Requests or Symptoms (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe any squeaks, warning lights, or specific requests..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#d8ff3d]"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3">
              <Button variant="primary" type="submit" icon={Calendar}>
                Confirm Appointment Booking
              </Button>
            </div>
          </form>
        )}
      </div>
    </CustomerPortalLayout>
  )
}
