import React, { useState } from 'react'
import CustomerPortalLayout from '../../components/layout/CustomerPortalLayout'
import StatusBadge from '../../components/common/StatusBadge'
import Button from '../../components/common/Button'
import DataTable from '../../components/common/DataTable'
import CustomerPayInvoiceModal from './CustomerPayInvoiceModal'
import { getCustomerServiceHistory } from '../../services/customerPortalService'
import { Download, CreditCard } from 'lucide-react'

export default function CustomerServiceHistoryPage() {
  const [history, setHistory] = useState(getCustomerServiceHistory())
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [payModalOpen, setPayModalOpen] = useState(false)

  const handlePayClick = (row) => {
    setSelectedInvoice(row)
    setPayModalOpen(true)
  }

  const columns = [
    {
      label: 'Service Date',
      key: 'date',
      render: (row) => (
        <div>
          <p className="font-bold text-white">{row.date}</p>
          <span className="text-[10px] text-zinc-500 font-mono">{row.mileage}</span>
        </div>
      ),
    },
    {
      label: 'Service Performed',
      key: 'serviceTitle',
      render: (row) => (
        <div>
          <p className="font-semibold text-zinc-100">{row.serviceTitle}</p>
          <p className="text-xs text-zinc-400">Advisor: {row.advisor}</p>
        </div>
      ),
    },
    {
      label: 'Invoice #',
      key: 'invoiceId',
      render: (row) => (
        <span className="font-mono text-xs font-bold text-[#d8ff3d]">{row.invoiceId}</span>
      ),
    },
    {
      label: 'Amount',
      key: 'amount',
      render: (row) => (
        <span className="font-extrabold text-white text-base">
          ${row.amount.toFixed(2)}
        </span>
      ),
    },
    {
      label: 'Payment Status',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      label: 'Actions',
      key: 'actions',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          {row.status !== 'Paid' ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handlePayClick(row)}
              icon={CreditCard}
            >
              Pay Now
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert(`Downloading PDF for ${row.invoiceId}`)}
              icon={Download}
            >
              Receipt
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <CustomerPortalLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Service Records & Invoices
          </h2>
          <p className="text-xs text-zinc-400">
            View complete maintenance log, audit billing breakdowns, and pay outstanding invoices.
          </p>
        </div>

        <div className="glass-panel rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
          <DataTable
            columns={columns}
            data={history}
            keyField="id"
            emptyMessage="No service history found."
          />
        </div>
      </div>

      <CustomerPayInvoiceModal
        isOpen={payModalOpen}
        onClose={() => {
          setPayModalOpen(false)
          setHistory(getCustomerServiceHistory())
        }}
        invoice={selectedInvoice}
        onSuccess={() => setHistory(getCustomerServiceHistory())}
      />
    </CustomerPortalLayout>
  )
}
