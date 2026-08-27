import React, { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { mockCustomers, mockJobCards, createInvoiceOrEstimate } from '../../services/billingService'

export default function NewEstimateModal({ isOpen, onClose, onCreated }) {
  const [docType, setDocType] = useState('Estimate') // 'Estimate' or 'Invoice'

  // Selection states
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [selectedJobCardId, setSelectedJobCardId] = useState('')

  // Form field states (auto-filled or custom)
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [vehicle, setVehicle] = useState('')

  // Line items state matching screenshot defaults
  const [items, setItems] = useState([
    { id: 1, description: 'Engine Oil Change', qty: '', price: '' },
    { id: 2, description: 'Oil Filter', qty: '', price: '' },
  ])

  // Financial & note settings
  const [discount, setDiscount] = useState('0')
  const [gstRate, setGstRate] = useState('18')
  const [paymentMode, setPaymentMode] = useState('UPI')
  const [notes, setNotes] = useState('')

  if (!isOpen) return null

  // Handle Customer Select
  const handleCustomerSelect = (e) => {
    const custId = e.target.value
    setSelectedCustomerId(custId)

    if (custId === 'CUSTOM') {
      setCustomerName('')
      setCustomerEmail('')
      setCustomerPhone('')
      setVehicle('')
      return
    }

    const found = mockCustomers.find((c) => c.id === custId)
    if (found) {
      setCustomerName(found.name)
      setCustomerEmail(found.email)
      setCustomerPhone(found.phone)
      setVehicle(found.vehicle)
    }
  }

  // Handle Job Card Select
  const handleJobCardSelect = (e) => {
    const jcId = e.target.value
    setSelectedJobCardId(jcId)

    if (jcId) {
      const foundJc = mockJobCards.find((j) => j.id === jcId)
      if (foundJc) {
        setCustomerName(foundJc.customerName)
        setCustomerPhone(foundJc.phone)
        setCustomerEmail(foundJc.email)
        setVehicle(foundJc.vehicle)
        // Also select customer if matching
        const matchingCust = mockCustomers.find((c) => c.name === foundJc.customerName)
        if (matchingCust) {
          setSelectedCustomerId(matchingCust.id)
        }
      }
    }
  }

  // Line item handlers
  const handleAddItem = () => {
    setItems([
      ...items,
      { id: Date.now(), description: '', qty: '', price: '' },
    ])
  }

  const handleRemoveItem = (id) => {
    if (items.length <= 1) return
    setItems(items.filter((item) => item.id !== id))
  }

  const handleItemChange = (id, field, value) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value }
        }
        return item
      })
    )
  }

  // Calculations
  const subtotal = items.reduce((sum, item) => {
    const q = Number(item.qty) || 0
    const p = Number(item.price) || 0
    return sum + q * p
  }, 0)

  const numDiscount = Number(discount) || 0
  const taxableSubtotal = Math.max(0, subtotal - numDiscount)
  const numGstRate = Number(gstRate) || 0
  const gstAmount = Math.round((taxableSubtotal * numGstRate) / 100)
  const grandTotal = taxableSubtotal + gstAmount

  const handleSubmit = (e) => {
    e.preventDefault()

    const finalCustomerName = customerName || 'Walk-in Customer'
    const finalVehicle = vehicle || 'Vehicle'

    const formattedItems = items
      .filter((i) => i.description.trim() !== '')
      .map((i) => ({
        id: i.id,
        type: 'Service',
        description: i.description,
        qty: Number(i.qty) || 1,
        price: Number(i.price) || 0,
        total: (Number(i.qty) || 1) * (Number(i.price) || 0),
      }))

    createInvoiceOrEstimate({
      docType,
      customerName: finalCustomerName,
      customerEmail: customerEmail || 'customer@example.com',
      customerPhone: customerPhone || '+91 99999 00000',
      vehicle: finalVehicle,
      jobCardId: selectedJobCardId || `JC-${Math.floor(2480 + Math.random() * 20)}`,
      subtotal,
      discount: numDiscount,
      gstRate: numGstRate,
      gst: gstAmount,
      total: grandTotal,
      mode: paymentMode,
      notes,
      items: formattedItems.length > 0 ? formattedItems : [
        { id: 1, type: 'Service', description: 'General Service', qty: 1, price: subtotal, total: subtotal }
      ],
    })

    if (onCreated) onCreated()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-lg bg-[#141515] border border-[#242626] rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#242626]">
          <h2 className="text-sm font-black text-white uppercase tracking-wider font-display">
            NEW ESTIMATE / INVOICE
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
          {/* Document Type Toggle Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#191a1a] border border-[#242626] rounded-xl">
            <button
              type="button"
              onClick={() => setDocType('Estimate')}
              className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-bold transition-all cursor-pointer ${
                docType === 'Estimate'
                  ? 'bg-[#242626] text-white shadow-inner'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  docType === 'Estimate'
                    ? 'bg-[#c8f135] shadow-[0_0_8px_#c8f135]'
                    : 'bg-zinc-600'
                }`}
              />
              Estimate
            </button>

            <button
              type="button"
              onClick={() => setDocType('Invoice')}
              className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-bold transition-all cursor-pointer ${
                docType === 'Invoice'
                  ? 'bg-[#242626] text-white shadow-inner'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  docType === 'Invoice'
                    ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                    : 'bg-zinc-600'
                }`}
              />
              Invoice
            </button>
          </div>

          {/* CUSTOMER Select */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-[#6b6e6e] uppercase tracking-wider font-display">
              CUSTOMER
            </label>
            <select
              value={selectedCustomerId}
              onChange={handleCustomerSelect}
              className="w-full px-3 py-2.5 bg-[#191a1a] border border-[#242626] rounded-xl text-white appearance-none focus:outline-none focus:border-[#c8f135] transition-colors cursor-pointer"
            >
              <option value="">Select customer...</option>

              {mockCustomers.map((cust) => (
                <option key={cust.id} value={cust.id}>
                  {cust.name} ({cust.vehicle}) — {cust.phone}
                </option>
              ))}

              <option value="CUSTOM">+ Add custom customer details...</option>
            </select>
          </div>

          {/* If Custom Customer or Editing Details */}
          {(selectedCustomerId === 'CUSTOM' || (!selectedCustomerId && customerName)) && (
            <div className="grid grid-cols-2 gap-2.5 p-3 bg-[#191a1a] border border-[#242626] rounded-xl space-y-2">
              <div className="col-span-2">
                <input
                  type="text"
                  placeholder="Customer Name *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141515] border border-[#242626] rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[#c8f135]"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Phone (+91 99000 00000)"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141515] border border-[#242626] rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[#c8f135]"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Vehicle (e.g. Swift MH-12)"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141515] border border-[#242626] rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[#c8f135]"
                />
              </div>
            </div>
          )}

          {/* JOB CARD Select */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-[#6b6e6e] uppercase tracking-wider font-display">
              JOB CARD
            </label>
            <select
              value={selectedJobCardId}
              onChange={handleJobCardSelect}
              className="w-full px-3 py-2.5 bg-[#191a1a] border border-[#242626] rounded-xl text-white appearance-none focus:outline-none focus:border-[#c8f135] transition-colors cursor-pointer"
            >
              <option value="">Link to job card (optional)</option>

              {mockJobCards.map((jc) => (
                <option key={jc.id} value={jc.id}>
                  {jc.id} — {jc.customerName} ({jc.vehicle})
                </option>
              ))}
            </select>
          </div>

          {/* LINE ITEMS */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-[#6b6e6e] uppercase tracking-wider font-display">
              LINE ITEMS
            </label>

            <div className="space-y-2">
              {items.map((item) => {
                const lineTotal = (Number(item.qty) || 0) * (Number(item.price) || 0)
                const hasAmount = Number(item.qty) > 0 && Number(item.price) > 0

                return (
                  <div key={item.id} className="flex items-center gap-2">
                    {/* Item Description */}
                    <input
                      type="text"
                      placeholder="Item / Service name"
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                      className="flex-1 px-3 py-2 bg-[#191a1a] border border-[#242626] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#c8f135]"
                    />

                    {/* Qty */}
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.qty}
                      onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)}
                      className="w-16 px-2.5 py-2 bg-[#191a1a] border border-[#242626] rounded-xl text-white text-center placeholder-zinc-500 focus:outline-none focus:border-[#c8f135]"
                    />

                    {/* Price ₹ */}
                    <input
                      type="number"
                      min="0"
                      placeholder="Price ₹"
                      value={item.price}
                      onChange={(e) => handleItemChange(item.id, 'price', e.target.value)}
                      className="w-24 px-2.5 py-2 bg-[#191a1a] border border-[#242626] rounded-xl text-white text-right placeholder-zinc-500 focus:outline-none focus:border-[#c8f135]"
                    />

                    {/* Line total display */}
                    <div className="w-20 text-right font-mono font-medium text-zinc-400 text-xs shrink-0">
                      = ₹ {hasAmount ? lineTotal.toLocaleString('en-IN') : '—'}
                    </div>

                    {/* Delete item button */}
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-zinc-500 hover:text-rose-400 p-1 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>

            {/* + Add Line Item Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1.5 text-[#c8f135] hover:text-[#a8cc20] font-bold text-xs cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                Add Line Item
              </button>
            </div>
          </div>

          {/* DISCOUNT (₹) & GST RATE (%) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#6b6e6e] uppercase tracking-wider mb-1 font-display">
                DISCOUNT (₹)
              </label>
              <input
                type="number"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#191a1a] border border-[#242626] rounded-xl text-white focus:outline-none focus:border-[#c8f135]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6b6e6e] uppercase tracking-wider mb-1 font-display">
                GST RATE (%)
              </label>
              <select
                value={gstRate}
                onChange={(e) => setGstRate(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#191a1a] border border-[#242626] rounded-xl text-white appearance-none focus:outline-none focus:border-[#c8f135] transition-colors cursor-pointer"
              >
                <option value="0">0%</option>
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
                <option value="28">28%</option>
              </select>
            </div>
          </div>

          {/* PAYMENT MODE */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-[#6b6e6e] uppercase tracking-wider font-display">
              PAYMENT MODE
            </label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#191a1a] border border-[#242626] rounded-xl text-white appearance-none focus:outline-none focus:border-[#c8f135] transition-colors cursor-pointer"
            >
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Net Banking">Net Banking</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Pending">Pending / Later</option>
            </select>
          </div>

          {/* NOTES */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-[#6b6e6e] uppercase tracking-wider font-display">
              NOTES
            </label>
            <textarea
              rows={2}
              placeholder="Any special terms or notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-[#191a1a] border border-[#242626] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#c8f135] resize-none"
            />
          </div>

          {/* Calculations Summary Card */}
          {subtotal > 0 && (
            <div className="p-3.5 bg-[#191a1a] rounded-xl border border-[#242626] space-y-1.5 text-zinc-400 text-xs">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="text-white font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {numDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount:</span>
                  <span>- ₹{numDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>GST ({numGstRate}%):</span>
                <span className="text-zinc-300">₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-black text-white pt-2 border-t border-[#242626] text-sm">
                <span>Total ({docType}):</span>
                <span className="text-[#c8f135]">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}

          {/* Modal Actions */}
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
              className="px-5 py-2.5 rounded-xl bg-[#c8f135] text-black font-black hover:bg-[#a8cc20] shadow-[0_0_15px_rgba(200,241,53,0.3)] hover:scale-[1.02] transition-all cursor-pointer uppercase tracking-wider text-xs font-display"
            >
              Create {docType}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
