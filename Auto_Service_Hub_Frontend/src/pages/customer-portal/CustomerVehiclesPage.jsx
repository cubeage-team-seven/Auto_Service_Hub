import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CustomerPortalLayout from '../../components/layout/CustomerPortalLayout'
import Button from '../../components/common/Button'
import { getCustomerVehicles, addCustomerVehicle } from '../../services/customerPortalService'
import { Car, Calendar, ShieldCheck, Wrench, Plus, Check, X, Sparkles, Clock, AlertCircle } from 'lucide-react'

export default function CustomerVehiclesPage() {
  const navigate = useNavigate()
  const [vehicles, setVehicles] = useState(getCustomerVehicles())
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const [newMake, setNewMake] = useState('')
  const [newModel, setNewModel] = useState('')
  const [newLicensePlate, setNewLicensePlate] = useState('')
  const [newVin, setNewVin] = useState('')
  const [newYear, setNewYear] = useState('2024')
  const [newColor, setNewColor] = useState('')
  const [newMileage, setNewMileage] = useState('')

  const handleAddVehicle = (e) => {
    e.preventDefault()
    if (!newMake || !newModel || !newLicensePlate) return

    addCustomerVehicle({
      make: newMake,
      model: newModel,
      licensePlate: newLicensePlate,
      vin: newVin,
      year: newYear,
      color: newColor,
      mileage: newMileage,
    })

    setVehicles(getCustomerVehicles())
    setIsAddModalOpen(false)
    setNewMake('')
    setNewModel('')
    setNewLicensePlate('')
    setNewVin('')
    setNewColor('')
    setNewMileage('')
  }

  return (
    <CustomerPortalLayout>
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Car className="w-6 h-6 text-[#d8ff3d]" /> My Registered Vehicles
            </h2>
            <p className="text-xs text-zinc-400">
              Manage your personal vehicle fleet, view active service health, and request workshop appointments.
            </p>
          </div>

          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setIsAddModalOpen(true)}
          >
            Register New Vehicle
          </Button>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => {
            const isInWorkshop = v.status === 'In Workshop'
            const isDue = v.status === 'Service Due'

            return (
              <div
                key={v.id}
                className="glass-card p-6 rounded-2xl border border-zinc-800 space-y-5 bg-gradient-to-b from-zinc-950 to-zinc-900 flex flex-col justify-between group hover:border-[#d8ff3d]/60 transition-all"
              >
                <div className="space-y-4">
                  {/* Top Badge & Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                      {v.licensePlate}
                    </span>

                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        isInWorkshop
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                          : isDue
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}
                    >
                      {isInWorkshop && <Wrench className="w-3 h-3" />}
                      {isDue && <AlertCircle className="w-3 h-3" />}
                      {!isInWorkshop && !isDue && <ShieldCheck className="w-3 h-3" />}
                      {v.status}
                    </span>
                  </div>

                  {/* Vehicle Name & Details */}
                  <div>
                    <h3 className="text-xl font-extrabold text-white group-hover:text-[#d8ff3d] transition-colors">
                      {v.vehicleName}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {v.year} • {v.color} • {v.engine}
                    </p>
                  </div>

                  {/* Tech Specifications Box */}
                  <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">VIN Number:</span>
                      <span className="font-mono text-zinc-300 font-semibold">{v.vin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Current Odometer:</span>
                      <span className="font-semibold text-white">{v.mileage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Last Service Date:</span>
                      <span className="text-zinc-300">{v.lastServiceDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Next Service Target:</span>
                      <span className="text-[#d8ff3d] font-bold">{v.nextServiceDue}</span>
                    </div>
                  </div>

                  {/* Active Job Card summary banner if present */}
                  {v.activeJobCard && (
                    <div className="p-3 rounded-xl bg-[#d8ff3d]/10 border border-[#d8ff3d]/30 text-xs space-y-1">
                      <div className="flex justify-between items-center text-[#d8ff3d] font-bold">
                        <span>Job Card #{v.activeJobCard.jobCardNumber}</span>
                        <span>{v.activeJobCard.progressPercentage}%</span>
                      </div>
                      <p className="text-[11px] text-zinc-300">
                        Stage: <strong className="text-white">{v.activeJobCard.status}</strong>
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between gap-2">
                  {v.activeJobCard ? (
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      onClick={() => navigate('/portal')}
                      icon={Clock}
                    >
                      Track Active Service
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => navigate('/portal/book')}
                      icon={Calendar}
                    >
                      Book Service Appointment
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Add Vehicle Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="glass-panel max-w-lg w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Car className="w-5 h-5 text-[#d8ff3d]" /> Add Vehicle to Garage
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddVehicle} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">Make / Brand</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BMW, Audi, Mercedes"
                      value={newMake}
                      onChange={(e) => setNewMake(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#d8ff3d]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">Model</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. M3 Competition, RS5"
                      value={newModel}
                      onChange={(e) => setNewModel(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#d8ff3d]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">License Plate Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MH-12-AB-9901"
                      value={newLicensePlate}
                      onChange={(e) => setNewLicensePlate(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#d8ff3d]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">Year of Manufacture</label>
                    <input
                      type="number"
                      placeholder="2024"
                      value={newYear}
                      onChange={(e) => setNewYear(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#d8ff3d]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">VIN Number (Optional)</label>
                    <input
                      type="text"
                      placeholder="17-digit Chassis VIN"
                      value={newVin}
                      onChange={(e) => setNewVin(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#d8ff3d]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">Current Odometer (km)</label>
                    <input
                      type="text"
                      placeholder="e.g. 12,500"
                      value={newMileage}
                      onChange={(e) => setNewMileage(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#d8ff3d]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Color</label>
                  <input
                    type="text"
                    placeholder="e.g. Nardo Grey, Daytona Black"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#d8ff3d]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                  <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    Save Vehicle
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </CustomerPortalLayout>
  )
}
