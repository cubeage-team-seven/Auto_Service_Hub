import React, { useState } from 'react'
import DashboardLayout from '../../layout/DashboardLayout'
import { getCustomers } from '../../services/customerService'
import { Plus, Search, X, Phone, Mail, Car, MapPin, Award } from 'lucide-react'
import NewCustomerModal from '../../components/customers/NewCustomerModal'

export default function CustomerListPage() {
  const [search, setSearch] = useState('')
  const [customers, setCustomers] = useState(getCustomers(''))
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const handleSearchChange = (e) => {
    const val = e.target.value
    setSearch(val)
    setCustomers(getCustomers(val))
  }

  const getLoyaltyBadge = (loyalty) => {
    switch (loyalty) {
      case 'Platinum':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-[#38bdf8]/10 border border-[#38bdf8]/40 text-[#38bdf8] font-display">
            Platinum
          </span>
        )
      case 'Gold':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-[#f59e0b]/10 border border-[#f59e0b]/40 text-[#f59e0b] font-display">
            Gold
          </span>
        )
      case 'Silver':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-[#94a3b8]/10 border border-[#94a3b8]/40 text-[#94a3b8] font-display">
            Silver
          </span>
        )
      case 'Bronze':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-[#f97316]/10 border border-[#f97316]/40 text-[#f97316] font-display">
            Bronze
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-[#191a1a] border border-[#242626] text-[#6b6e6e] font-display">
            {loyalty}
          </span>
        )
    }
  }

  return (
    <DashboardLayout activeModule="Customers">
      <div className="space-y-6">
        {/* Top Header & Action Row */}
        <div className="flex items-center justify-between pt-1">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wider text-[#f0f0f0] uppercase font-display">
            CUSTOMERS
          </h1>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#c8f135] text-black font-extrabold text-xs shadow-[0_0_12px_rgba(200,241,53,0.3)] hover:bg-[#a8cc20] hover:scale-[1.02] transition-all cursor-pointer font-display tracking-wider uppercase"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ NEW CUSTOMER</span>
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="bg-[#141515] border border-[#242626] rounded-xl p-3.5 shadow-lg">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#6b6e6e] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 bg-[#191a1a] border border-[#242626] rounded-lg text-xs text-[#f0f0f0] placeholder-[#6b6e6e] focus:outline-none focus:border-[#c8f135] transition-colors font-sans"
            />
          </div>
        </div>

        {/* Main Customers Table Card */}
        <div className="bg-[#141515] border border-[#242626] rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#242626] text-[11px] font-bold text-[#6b6e6e] uppercase tracking-widest font-display bg-[#0f1010]">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">NAME</th>
                  <th className="py-3 px-4">PHONE</th>
                  <th className="py-3 px-4">EMAIL</th>
                  <th className="py-3 px-4 text-center">VEHICLES</th>
                  <th className="py-3 px-4 text-center">VISITS</th>
                  <th className="py-3 px-4">LAST VISIT</th>
                  <th className="py-3 px-4">LOYALTY</th>
                  <th className="py-3 px-4">BALANCE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242626]">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-[#6b6e6e] text-xs font-medium">
                      No customers found matching your search.
                    </td>
                  </tr>
                ) : (
                  customers.map((cust) => (
                    <tr
                      key={cust.id}
                      className="hover:bg-[#191a1a] transition-colors border-b border-[#242626] group cursor-pointer"
                      onClick={() => setSelectedCustomer(cust)}
                    >
                      {/* Customer ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-xs md:text-sm text-[#c8f135] tracking-wide">
                        {cust.id}
                      </td>

                      {/* Name */}
                      <td className="py-3.5 px-4 font-bold text-sm text-[#f0f0f0]">
                        {cust.name}
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 text-xs text-zinc-300 font-mono">
                        {cust.phone}
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 text-xs text-[#6b6e6e] font-medium">
                        {cust.email}
                      </td>

                      {/* Vehicles Count */}
                      <td className="py-3.5 px-4 text-xs text-[#f0f0f0] font-bold font-mono text-center">
                        {cust.vehiclesCount}
                      </td>

                      {/* Total Visits */}
                      <td className="py-3.5 px-4 text-xs text-[#f0f0f0] font-bold font-mono text-center">
                        {cust.visits}
                      </td>

                      {/* Last Visit */}
                      <td className="py-3.5 px-4 text-xs text-[#6b6e6e] font-medium">
                        {cust.lastVisit}
                      </td>

                      {/* Loyalty Badge */}
                      <td className="py-3.5 px-4">
                        {getLoyaltyBadge(cust.loyalty)}
                      </td>

                      {/* Balance */}
                      <td className="py-3.5 px-4 font-mono font-bold text-xs md:text-sm">
                        {cust.numericBalance === 0 ? (
                          <span className="text-[#6b6e6e]">{cust.balance}</span>
                        ) : (
                          <span className="text-[#f43f5e]">{cust.balance}</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Customer Detail Profile Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#141515] border border-[#242626] rounded-2xl shadow-2xl p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#242626] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#191a1a] border border-[#242626] text-[#c8f135] font-extrabold flex items-center justify-center text-sm font-mono shadow-[0_0_12px_rgba(200,241,53,0.2)]">
                  {selectedCustomer.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{selectedCustomer.name}</h3>
                  <p className="text-xs font-mono text-[#c8f135] mt-0.5">{selectedCustomer.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getLoyaltyBadge(selectedCustomer.loyalty)}
                <button
                  type="button"
                  onClick={() => setSelectedCustomer(null)}
                  className="text-[#6b6e6e] hover:text-white p-1 rounded-md cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Customer Information List */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 p-3 bg-[#191a1a] rounded-xl border border-[#242626]">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-[#6b6e6e] uppercase block font-display">Phone Number</span>
                  <span className="font-mono text-white text-xs font-semibold">{selectedCustomer.phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#191a1a] rounded-xl border border-[#242626]">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-[#6b6e6e] uppercase block font-display">Email Address</span>
                  <span className="text-white text-xs font-medium">{selectedCustomer.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#191a1a] rounded-xl border border-[#242626]">
                <Car className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-[#6b6e6e] uppercase block font-display">Associated Vehicles</span>
                  <span className="text-white text-xs font-semibold">{selectedCustomer.vehicles.join(', ')}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#191a1a] rounded-xl border border-[#242626]">
                <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-[#6b6e6e] uppercase block font-display">Address</span>
                  <span className="text-zinc-300 text-xs font-medium">{selectedCustomer.address || 'Address not provided'}</span>
                </div>
              </div>
            </div>

            {/* Visit & Balance Overview */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#191a1a] rounded-xl border border-[#242626] text-xs font-mono">
              <div>
                <span className="text-[10px] font-bold text-[#6b6e6e] uppercase block font-display">Total Service Visits</span>
                <span className="text-white font-extrabold text-base">{selectedCustomer.visits} Visits</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#6b6e6e] uppercase block font-display">Current Balance</span>
                <span className={`font-extrabold text-base ${selectedCustomer.numericBalance > 0 ? 'text-[#f43f5e]' : 'text-[#6b6e6e]'}`}>
                  {selectedCustomer.balance}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end pt-2 border-t border-[#242626]">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 rounded-lg bg-[#242626] text-[#f0f0f0] font-bold hover:bg-[#3a3d3d] text-xs transition-colors cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Customer Modal */}
      <NewCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCreated={() => setCustomers(getCustomers(search))}
      />
    </DashboardLayout>
  )
}
