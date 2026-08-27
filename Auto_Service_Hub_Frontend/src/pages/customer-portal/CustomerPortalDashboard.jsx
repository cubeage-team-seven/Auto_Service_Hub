import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CustomerPortalLayout from '../../components/layout/CustomerPortalLayout'
import StatusBadge from '../../components/common/StatusBadge'
import Button from '../../components/common/Button'
import CustomerPayInvoiceModal from './CustomerPayInvoiceModal'
import { getCustomerVehicleStatus } from '../../services/customerPortalService'
import {
  Car,
  Clock,
  Wrench,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  CreditCard,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'

export default function CustomerPortalDashboard() {
  const navigate = useNavigate()
  const vehicleData = getCustomerVehicleStatus()
  const jobCard = vehicleData.activeJobCard

  const [payModalOpen, setPayModalOpen] = useState(false)

  return (
    <CustomerPortalLayout>
      <div className="space-y-6">
        {/* Top Welcome & Live Alert Banner */}
        <div className="glass-panel p-6 rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-[#d8ff3d]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-[#d8ff3d] text-black shadow-[0_0_10px_rgba(216,255,61,0.4)]">
                <Sparkles className="w-3 h-3" /> Live Tracking Active
              </span>
              <span className="text-xs text-zinc-400">Updated 2 mins ago</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Hello, {vehicleData.customerName}!
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Your <strong className="text-white">{vehicleData.vehicleName}</strong> ({vehicleData.licensePlate}) is currently being serviced.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/portal/book')}
            >
              Book Next Service
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setPayModalOpen(true)}
              icon={CreditCard}
            >
              Pay Invoice (${jobCard.estimatedCost.toFixed(2)})
            </Button>
          </div>
        </div>

        {/* Main Status Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Detailed Progress Tracker */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Stage & Progress Bar Card */}
            <div className="glass-card p-6 rounded-2xl border border-zinc-800 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Current Service Stage
                  </span>
                  <h3 className="text-xl font-bold text-[#d8ff3d] mt-0.5 flex items-center gap-2">
                    {jobCard.status}
                  </h3>
                </div>
                <StatusBadge status={jobCard.status} />
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs font-bold text-zinc-300 mb-2">
                  <span>Overall Repair Progress</span>
                  <span className="text-[#d8ff3d]">{jobCard.progressPercentage}%</span>
                </div>
                <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-lime-400 to-[#d8ff3d] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(216,255,61,0.5)]"
                    style={{ width: `${jobCard.progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Live Stage Description box */}
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/80 flex items-start gap-3">
                <Wrench className="w-5 h-5 text-[#d8ff3d] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-white">Technician Note:</p>
                  <p className="text-zinc-400 mt-0.5">{jobCard.currentStageDesc}</p>
                </div>
              </div>
            </div>

            {/* Vertical Timeline Steps */}
            <div className="glass-card p-6 rounded-2xl border border-zinc-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
                Service Progress Milestones
              </h3>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-800">
                {jobCard.timeline.map((step, idx) => (
                  <div key={idx} className="relative flex items-start justify-between gap-4">
                    {/* Bullet */}
                    <div
                      className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] ${
                        step.completed
                          ? 'bg-[#d8ff3d] border-[#d8ff3d] text-black shadow-[0_0_10px_rgba(216,255,61,0.4)]'
                          : step.isCurrent
                          ? 'bg-amber-500 border-amber-400 text-black animate-pulse'
                          : 'bg-zinc-900 border-zinc-700 text-zinc-600'
                      }`}
                    >
                      {step.completed ? <CheckCircle2 className="w-3 h-3" /> : idx + 1}
                    </div>

                    <div className="text-xs">
                      <p
                        className={`font-bold ${
                          step.completed
                            ? 'text-white'
                            : step.isCurrent
                            ? 'text-amber-400 font-extrabold'
                            : 'text-zinc-500'
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{step.desc}</p>
                    </div>

                    <span className="text-[11px] font-mono text-zinc-500 shrink-0">
                      {step.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 1 Col: Vehicle & Technician Details */}
          <div className="space-y-6">
            {/* Vehicle Card */}
            <div className="glass-card p-5 rounded-2xl border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-zinc-400">
                <Car className="w-4 h-4 text-[#d8ff3d]" /> Vehicle Summary
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">{vehicleData.vehicleName}</h4>
                <span className="inline-block mt-1 px-2 py-0.5 bg-zinc-800 text-zinc-300 font-mono text-xs rounded border border-zinc-700">
                  {vehicleData.licensePlate}
                </span>
              </div>
              <div className="pt-2 border-t border-zinc-800 text-xs text-zinc-400 space-y-1">
                <p>VIN: <span className="font-mono text-zinc-300">{vehicleData.vin}</span></p>
                <p>Job Card #: <span className="font-mono text-zinc-300">{jobCard.jobCardNumber}</span></p>
              </div>
            </div>

            {/* Assigned Staff Card */}
            <div className="glass-card p-5 rounded-2xl border border-zinc-800 space-y-3 text-xs">
              <div className="flex items-center gap-2 font-bold uppercase text-zinc-400">
                <Wrench className="w-4 h-4 text-[#d8ff3d]" /> Service Team
              </div>

              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div>
                  <p className="text-[10px] uppercase text-zinc-500">Service Advisor</p>
                  <p className="font-semibold text-white">{jobCard.advisor}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-zinc-500">Lead Mechanic</p>
                  <p className="font-semibold text-white">{jobCard.mechanic}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-zinc-500">Workshop Bay</p>
                  <p className="font-semibold text-[#d8ff3d]">{jobCard.bay}</p>
                </div>
              </div>
            </div>

            {/* Estimated Delivery Box */}
            <div className="glass-card p-5 rounded-2xl border border-zinc-800 space-y-2 text-center bg-gradient-to-b from-zinc-900 to-zinc-950">
              <Clock className="w-6 h-6 text-[#d8ff3d] mx-auto" />
              <p className="text-xs uppercase text-zinc-400 font-bold">Estimated Delivery</p>
              <p className="text-lg font-black text-white">{jobCard.estimatedDelivery}</p>
              <p className="text-[11px] text-zinc-500">We will notify you via SMS when ready.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pay Invoice Modal */}
      <CustomerPayInvoiceModal
        isOpen={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        invoice={{
          invoiceId: jobCard.pendingInvoiceId,
          amount: jobCard.estimatedCost,
          serviceTitle: 'Brake Servicing & Calibration',
          vehicle: vehicleData.vehicleName,
        }}
      />
    </CustomerPortalLayout>
  )
}
