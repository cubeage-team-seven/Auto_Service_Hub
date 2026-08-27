import React, { useState } from 'react'
import DashboardLayout from '../../layout/DashboardLayout'
import { getBillingMetrics, getInvoices } from '../../services/billingService'
import { Plus, X, Printer } from 'lucide-react'
import NewEstimateModal from '../../components/billing/NewEstimateModal'

export default function BillingPage() {
  const [metrics] = useState(getBillingMetrics())
  const [invoices, setInvoices] = useState(getInvoices())
  const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-[#22c55e]/10 border border-[#22c55e]/40 text-[#22c55e]">
            Paid
          </span>
        )
      case 'Pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-[#f59e0b]/10 border border-[#f59e0b]/40 text-[#f59e0b]">
            Pending
          </span>
        )
      case 'Overdue':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-[#f43f5e]/10 border border-[#f43f5e]/40 text-[#f43f5e]">
            Overdue
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-[#191a1a] border border-[#242626] text-[#6b6e6e]">
            {status}
          </span>
        )
    }
  }

  return (
    <DashboardLayout activeModule="Billing">
      <div className="space-y-6">
        {/* Top Header & Action Row */}
        <div className="flex items-center justify-between pt-1">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wider text-[#f0f0f0] uppercase font-display">
            BILLING & PAYMENTS
          </h1>

          <button
            type="button"
            onClick={() => setIsEstimateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#c8f135] text-black font-extrabold text-xs shadow-[0_0_12px_rgba(200,241,53,0.3)] hover:bg-[#a8cc20] hover:scale-[1.02] transition-all cursor-pointer font-display tracking-wider uppercase"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ NEW ESTIMATE</span>
          </button>
        </div>

        {/* 4 Stat KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: THIS MONTH */}
          <div className="bg-[#141515] border border-[#242626] rounded-xl p-4.5 space-y-1.5 hover:border-[#3a3d3d] transition-all">
            <span className="text-[11px] font-bold text-[#6b6e6e] uppercase tracking-widest block font-display">
              THIS MONTH
            </span>
            <div className="text-3xl md:text-4xl font-black text-[#f0f0f0] font-mono tracking-tight">
              {metrics.thisMonth}
            </div>
          </div>

          {/* Card 2: PENDING */}
          <div className="bg-[#141515] border border-[#242626] rounded-xl p-4.5 space-y-1.5 hover:border-[#3a3d3d] transition-all">
            <span className="text-[11px] font-bold text-[#6b6e6e] uppercase tracking-widest block font-display">
              PENDING
            </span>
            <div className="text-3xl md:text-4xl font-black text-[#c8f135] font-mono tracking-tight">
              {metrics.pending}
            </div>
          </div>

          {/* Card 3: OVERDUE */}
          <div className="bg-[#141515] border border-[#242626] rounded-xl p-4.5 space-y-1.5 hover:border-[#3a3d3d] transition-all">
            <span className="text-[11px] font-bold text-[#6b6e6e] uppercase tracking-widest block font-display">
              OVERDUE
            </span>
            <div className="text-3xl md:text-4xl font-black text-[#f0f0f0] font-mono tracking-tight">
              {metrics.overdue}
            </div>
          </div>

          {/* Card 4: AVG INVOICE */}
          <div className="bg-[#141515] border border-[#242626] rounded-xl p-4.5 space-y-1.5 hover:border-[#3a3d3d] transition-all">
            <span className="text-[11px] font-bold text-[#6b6e6e] uppercase tracking-widest block font-display">
              AVG INVOICE
            </span>
            <div className="text-3xl md:text-4xl font-black text-[#f0f0f0] font-mono tracking-tight">
              {metrics.avgInvoice}
            </div>
          </div>
        </div>

        {/* Main Invoices Table Card */}
        <div className="bg-[#141515] border border-[#242626] rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#242626] text-[11px] font-bold text-[#6b6e6e] uppercase tracking-widest font-display bg-[#0f1010]">
                  <th className="py-3 px-4">INVOICE</th>
                  <th className="py-3 px-4">CUSTOMER</th>
                  <th className="py-3 px-4">VEHICLE</th>
                  <th className="py-3 px-4">JOB CARD</th>
                  <th className="py-3 px-4">DATE</th>
                  <th className="py-3 px-4">AMOUNT</th>
                  <th className="py-3 px-4">GST (18%)</th>
                  <th className="py-3 px-4">TOTAL</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4">MODE</th>
                  <th className="py-3 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242626]">
                {invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-[#191a1a] transition-colors border-b border-[#242626] group cursor-pointer"
                    onClick={() => setSelectedInvoice(inv)}
                  >
                    {/* Invoice ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-xs md:text-sm text-[#c8f135] tracking-wide">
                      {inv.id}
                    </td>

                    {/* Customer Name */}
                    <td className="py-3.5 px-4 font-bold text-sm text-[#f0f0f0]">
                      {inv.customerName}
                    </td>

                    {/* Vehicle */}
                    <td className="py-3.5 px-4 text-xs text-zinc-300 font-medium">
                      {inv.vehicle}
                    </td>

                    {/* Job Card */}
                    <td className="py-3.5 px-4 text-xs text-[#6b6e6e] font-mono">
                      {inv.jobCardId}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-xs text-[#6b6e6e] font-medium">
                      {inv.date}
                    </td>

                    {/* Base Amount */}
                    <td className="py-3.5 px-4 font-semibold font-mono text-sm text-[#f0f0f0]">
                      ₹{inv.amount.toLocaleString('en-IN')}
                    </td>

                    {/* GST */}
                    <td className="py-3.5 px-4 text-xs text-[#6b6e6e] font-mono">
                      ₹{inv.gst.toLocaleString('en-IN')}
                    </td>

                    {/* Total */}
                    <td className="py-3.5 px-4 font-bold font-mono text-sm text-[#f0f0f0]">
                      ₹{inv.total.toLocaleString('en-IN')}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {getStatusBadge(inv.status)}
                    </td>

                    {/* Payment Mode */}
                    <td className="py-3.5 px-4 text-xs text-zinc-400 font-medium">
                      {inv.mode}
                    </td>

                    {/* Action Button */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedInvoice(inv)
                        }}
                        className="px-3 py-1 rounded bg-[#191a1a] border border-[#242626] text-[#6b6e6e] hover:text-[#f0f0f0] hover:bg-[#242626] text-xs font-medium transition-all cursor-pointer"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* New Estimate Modal Component */}
      <NewEstimateModal
        isOpen={isEstimateModalOpen}
        onClose={() => setIsEstimateModalOpen(false)}
        onCreated={() => setInvoices(getInvoices())}
      />

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-[#141515] border border-[#242626] rounded-xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#242626] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-base font-mono font-black text-[#c8f135]">
                  {selectedInvoice.id}
                </span>
                {getStatusBadge(selectedInvoice.status)}
              </div>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="text-[#6b6e6e] hover:text-white p-1 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Vehicle Info Grid */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-[#191a1a] rounded-lg border border-[#242626] text-xs">
              <div>
                <p className="text-[#6b6e6e] font-bold uppercase text-[10px] font-display">Customer Details</p>
                <p className="font-bold text-[#f0f0f0] text-sm mt-0.5">{selectedInvoice.customerName}</p>
                <p className="text-zinc-400 mt-0.5">{selectedInvoice.customerPhone}</p>
                <p className="text-zinc-400">{selectedInvoice.customerEmail}</p>
              </div>

              <div>
                <p className="text-[#6b6e6e] font-bold uppercase text-[10px] font-display">Vehicle & Job</p>
                <p className="font-bold text-[#f0f0f0] text-sm mt-0.5">{selectedInvoice.vehicle}</p>
                <p className="text-zinc-400 mt-0.5">Job Card: <span className="font-mono text-zinc-300">{selectedInvoice.jobCardId}</span></p>
                <p className="text-zinc-400">Date: {selectedInvoice.date}</p>
              </div>
            </div>

            {/* Line Items */}
            <div>
              <p className="text-xs font-bold text-[#6b6e6e] uppercase tracking-wider mb-2 font-display">Itemized Breakdown</p>
              <div className="bg-[#191a1a] rounded-lg border border-[#242626] overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#242626] text-[#6b6e6e] font-bold uppercase text-[10px] font-display">
                      <th className="py-2 px-3">Type</th>
                      <th className="py-2 px-3">Description</th>
                      <th className="py-2 px-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#242626] text-zinc-300">
                    {selectedInvoice.items && selectedInvoice.items.map((item, i) => (
                      <tr key={i}>
                        <td className="py-2 px-3">
                          <span className="px-1.5 py-0.5 rounded bg-[#242626] text-[10px] text-[#6b6e6e] font-bold font-display">
                            {item.type}
                          </span>
                        </td>
                        <td className="py-2 px-3">{item.description}</td>
                        <td className="py-2 px-3 text-right font-bold font-mono text-[#f0f0f0]">₹{item.total.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-4 bg-[#191a1a] rounded-lg border border-[#242626] space-y-1.5 text-xs text-zinc-400 font-mono">
              <div className="flex justify-between">
                <span>Subtotal Amount:</span>
                <span className="text-[#f0f0f0] font-semibold">₹{selectedInvoice.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%):</span>
                <span className="text-zinc-300">₹{selectedInvoice.gst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-[#f0f0f0] pt-2 border-t border-[#242626]">
                <span>Grand Total:</span>
                <span className="text-[#c8f135]">₹{selectedInvoice.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-[#242626]">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#191a1a] border border-[#242626] text-zinc-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Invoice
              </button>

              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 rounded-lg bg-[#242626] text-[#f0f0f0] font-bold hover:bg-[#3a3d3d] text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
