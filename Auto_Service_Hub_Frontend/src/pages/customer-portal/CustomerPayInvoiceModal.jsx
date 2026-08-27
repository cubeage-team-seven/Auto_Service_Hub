import React, { useState } from 'react'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import { payCustomerInvoice } from '../../services/customerPortalService'
import { CreditCard, CheckCircle2, QrCode, Lock } from 'lucide-react'

export default function CustomerPayInvoiceModal({ isOpen, onClose, invoice, onSuccess }) {
  const [paymentTab, setPaymentTab] = useState('card') // 'card' or 'upi'
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8910')
  const [cardExpiry, setCardExpiry] = useState('12/28')
  const [cardCvc, setCardCvc] = useState('889')
  const [cardName, setCardName] = useState('John Doe')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPaidSuccess, setIsPaidSuccess] = useState(false)
  const [txnRef, setTxnRef] = useState('')

  if (!invoice) return null

  const handlePaySubmit = (e) => {
    e.preventDefault()
    setIsProcessing(true)

    setTimeout(() => {
      const res = payCustomerInvoice(invoice.invoiceId, {
        method: paymentTab,
      })
      setIsProcessing(false)
      setIsPaidSuccess(true)
      setTxnRef(res.transactionId)
      if (onSuccess) onSuccess()
    }, 1200)
  }

  const handleModalClose = () => {
    setIsPaidSuccess(false)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={isPaidSuccess ? 'Payment Successful!' : `Pay Invoice #${invoice.invoiceId}`}
      subtitle={isPaidSuccess ? 'Receipt sent to your registered email' : `Total Amount Due: $${invoice.amount.toFixed(2)}`}
    >
      {isPaidSuccess ? (
        <div className="py-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white">Payment Received</h3>
            <p className="text-xs text-zinc-400 mt-1">Transaction Ref: <span className="font-mono text-zinc-200">{txnRef}</span></p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 max-w-sm mx-auto text-left">
            <p><strong>Service:</strong> {invoice.serviceTitle}</p>
            <p><strong>Vehicle:</strong> {invoice.vehicle}</p>
            <p><strong>Amount Paid:</strong> <span className="text-emerald-400 font-bold">${invoice.amount.toFixed(2)}</span></p>
          </div>
          <Button variant="primary" className="w-full max-w-xs mx-auto" onClick={handleModalClose}>
            Done & Download Receipt
          </Button>
        </div>
      ) : (
        <form onSubmit={handlePaySubmit} className="space-y-5">
          {/* Payment Method Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
            <button
              type="button"
              onClick={() => setPaymentTab('card')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                paymentTab === 'card'
                  ? 'bg-[#d8ff3d] text-black shadow-[0_0_10px_rgba(216,255,61,0.3)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-4 h-4" /> Credit / Debit Card
            </button>
            <button
              type="button"
              onClick={() => setPaymentTab('upi')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                paymentTab === 'upi'
                  ? 'bg-[#d8ff3d] text-black shadow-[0_0_10px_rgba(216,255,61,0.3)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <QrCode className="w-4 h-4" /> UPI / QR Scan
            </button>
          </div>

          {paymentTab === 'card' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-[#d8ff3d]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-[#d8ff3d]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">
                    Expiry (MM/YY)
                  </label>
                  <input
                    type="text"
                    required
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white font-mono text-center focus:outline-none focus:border-[#d8ff3d]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">
                    CVC / CVV
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    required
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white font-mono text-center focus:outline-none focus:border-[#d8ff3d]"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center space-y-3">
              <div className="p-4 bg-white rounded-xl max-w-[180px] mx-auto shadow-lg">
                <QrCode className="w-36 h-36 text-black mx-auto" />
              </div>
              <p className="text-xs text-zinc-400">
                Scan using Google Pay, PhonePe, Paytm, or Apple Pay
              </p>
            </div>
          )}

          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
            <span className="flex items-center gap-1 text-[11px] text-zinc-400">
              <Lock className="w-3.5 h-3.5 text-emerald-400" /> 256-bit Encrypted
            </span>

            <Button variant="primary" type="submit" isLoading={isProcessing} icon={CreditCard}>
              Pay ${invoice.amount.toFixed(2)}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
