import React, { useState } from 'react'
import { X, UserPlus } from 'lucide-react'
import { createCustomer } from '../../services/customerService'

export default function NewCustomerModal({ isOpen, onClose, onCreated }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [loyalty, setLoyalty] = useState('Silver')
  const [vehicles, setVehicles] = useState('')
  const [address, setAddress] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return

    createCustomer({
      name: name.trim(),
      phone: phone.trim() || '+91 99999 00000',
      email: email.trim() || 'customer@gmail.com',
      loyalty,
      vehiclesCount: vehicles ? 1 : 1,
      vehicles: vehicles ? [vehicles] : ['Vehicle'],
      address,
    })

    // Reset Form
    setName('')
    setPhone('')
    setEmail('')
    setLoyalty('Silver')
    setVehicles('')
    setAddress('')

    if (onCreated) onCreated()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
      <div className="w-full max-w-md bg-[#141515] border border-[#242626] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#242626]">
          <h2 className="text-sm font-black text-white uppercase tracking-wider font-display flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-[#c8f135]" />
            ADD NEW CUSTOMER
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-[#6b6e6e] uppercase tracking-wider font-display">
              CUSTOMER NAME *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Patel"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#191a1a] border border-[#242626] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#c8f135] font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#6b6e6e] uppercase tracking-wider mb-1 font-display">
                PHONE NUMBER
              </label>
              <input
                type="text"
                placeholder="+91 98000 00000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#191a1a] border border-[#242626] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#c8f135] font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6b6e6e] uppercase tracking-wider mb-1 font-display">
                LOYALTY TIER
              </label>
              <select
                value={loyalty}
                onChange={(e) => setLoyalty(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#191a1a] border border-[#242626] rounded-xl text-white appearance-none focus:outline-none focus:border-[#c8f135] cursor-pointer"
              >
                <option value="Platinum">Platinum</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Bronze">Bronze</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-[#6b6e6e] uppercase tracking-wider font-display">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              placeholder="customer@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#191a1a] border border-[#242626] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#c8f135]"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-[#6b6e6e] uppercase tracking-wider font-display">
              VEHICLE DETAILS
            </label>
            <input
              type="text"
              placeholder="e.g. Swift (MH-12-AB-1234)"
              value={vehicles}
              onChange={(e) => setVehicles(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#191a1a] border border-[#242626] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#c8f135]"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-[#6b6e6e] uppercase tracking-wider font-display">
              ADDRESS
            </label>
            <textarea
              rows={2}
              placeholder="Residential / Business Address..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 bg-[#191a1a] border border-[#242626] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#c8f135] resize-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#242626]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#191a1a] text-zinc-300 font-bold hover:bg-[#242626] transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#c8f135] text-black font-extrabold hover:bg-[#a8cc20] shadow-[0_0_15px_rgba(200,241,53,0.3)] hover:scale-[1.02] transition-all cursor-pointer uppercase tracking-wider text-xs font-display"
            >
              Save Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
