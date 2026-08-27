// Mock service for Billing & Payments Module matching Figma design exactly

export const mockCustomers = [
  { id: 'CUST-001', name: 'Rohit Desai', email: 'rohit.desai@gmail.com', phone: '+91 99876 54321', vehicle: 'Innova GJ-05' },
  { id: 'CUST-002', name: 'Kavita Rao', email: 'kavita.rao@gmail.com', phone: '+91 66543 21098', vehicle: 'Baleno KA-03' },
  { id: 'CUST-003', name: 'Neha Joshi', email: 'neha.joshi@gmail.com', phone: '+91 88765 43210', vehicle: 'City MH-14' },
  { id: 'CUST-004', name: 'Sunil Nair', email: 'sunil.nair@gmail.com', phone: '+91 55432 10987', vehicle: 'Fortuner UP-78' },
  { id: 'CUST-005', name: 'Divya Kapoor', email: 'divya.kapoor@gmail.com', phone: '+91 44321 09876', vehicle: 'Polo MH-09' },
  { id: 'CUST-006', name: 'Arjun Mehta', email: 'arjun.mehta@gmail.com', phone: '+91 98201 45678', vehicle: 'Swift MH-12' },
  { id: 'CUST-007', name: 'Priya Sharma', email: 'priya.sharma@gmail.com', phone: '+91 91234 56789', vehicle: 'Creta DL-01' },
  { id: 'CUST-008', name: 'Vikram Singh', email: 'vikram.singh@gmail.com', phone: '+91 77654 32109', vehicle: 'Fortuner UP-32' },
]

export const mockJobCards = [
  { id: 'JC-2406', customerName: 'Rohit Desai', phone: '+91 99876 54321', email: 'rohit.desai@gmail.com', vehicle: 'Innova GJ-05' },
  { id: 'JC-2403', customerName: 'Kavita Rao', phone: '+91 66543 21098', email: 'kavita.rao@gmail.com', vehicle: 'Baleno KA-03' },
  { id: 'JC-2405', customerName: 'Neha Joshi', phone: '+91 88765 43210', email: 'neha.joshi@gmail.com', vehicle: 'City MH-14' },
  { id: 'JC-2401', customerName: 'Sunil Nair', phone: '+91 55432 10987', email: 'sunil.nair@gmail.com', vehicle: 'Fortuner UP-78' },
  { id: 'JC-2399', customerName: 'Divya Kapoor', phone: '+91 44321 09876', email: 'divya.kapoor@gmail.com', vehicle: 'Polo MH-09' },
]

let mockInvoices = [
  {
    id: 'INV-0892',
    docType: 'Invoice',
    customerName: 'Rohit Desai',
    customerEmail: 'rohit.desai@gmail.com',
    customerPhone: '+91 99876 54321',
    vehicle: 'Innova GJ-05',
    jobCardId: 'JC-2406',
    date: '16 Aug 2026',
    amount: 12400,
    gst: 2232,
    total: 14632,
    status: 'Paid',
    mode: 'UPI',
    items: [
      { id: 1, type: 'Service', description: 'Full Service & Transmission Flush', qty: 1, price: 8400, total: 8400 },
      { id: 2, type: 'Parts', description: 'Synthetic Engine Oil (4L)', qty: 1, price: 4000, total: 4000 },
    ],
  },
  {
    id: 'INV-0891',
    docType: 'Invoice',
    customerName: 'Kavita Rao',
    customerEmail: 'kavita.rao@gmail.com',
    customerPhone: '+91 66543 21098',
    vehicle: 'Baleno KA-03',
    jobCardId: 'JC-2403',
    date: '16 Aug 2026',
    amount: 3200,
    gst: 576,
    total: 3776,
    status: 'Paid',
    mode: 'Cash',
    items: [
      { id: 1, type: 'Service', description: 'Wheel Alignment & Balancing', qty: 1, price: 1800, total: 1800 },
      { id: 2, type: 'Parts', description: 'Cabin Filter Replacement', qty: 1, price: 1400, total: 1400 },
    ],
  },
  {
    id: 'INV-0890',
    docType: 'Invoice',
    customerName: 'Neha Joshi',
    customerEmail: 'neha.joshi@gmail.com',
    customerPhone: '+91 88765 43210',
    vehicle: 'City MH-14',
    jobCardId: 'JC-2405',
    date: '17 Aug 2026',
    amount: 4800,
    gst: 864,
    total: 5664,
    status: 'Pending',
    mode: '—',
    items: [
      { id: 1, type: 'Service', description: 'Brake System Inspection & Pad Change', qty: 1, price: 3200, total: 3200 },
      { id: 2, type: 'Parts', description: 'Brake Fluid Top-up', qty: 1, price: 1600, total: 1600 },
    ],
  },
  {
    id: 'INV-0889',
    docType: 'Invoice',
    customerName: 'Sunil Nair',
    customerEmail: 'sunil.nair@gmail.com',
    customerPhone: '+91 55432 10987',
    vehicle: 'Fortuner UP-78',
    jobCardId: 'JC-2401',
    date: '11 Aug 2026',
    amount: 28500,
    gst: 5130,
    total: 33630,
    status: 'Overdue',
    mode: '—',
    items: [
      { id: 1, type: 'Service', description: 'Major Engine Overhaul & Timing Belt', qty: 1, price: 20000, total: 20000 },
      { id: 2, type: 'Parts', description: 'Turbocharger Gasket Set', qty: 1, price: 8500, total: 8500 },
    ],
  },
  {
    id: 'INV-0888',
    docType: 'Invoice',
    customerName: 'Divya Kapoor',
    customerEmail: 'divya.kapoor@gmail.com',
    customerPhone: '+91 44321 09876',
    vehicle: 'Polo MH-09',
    jobCardId: 'JC-2399',
    date: '10 Aug 2026',
    amount: 7600,
    gst: 1368,
    total: 8968,
    status: 'Paid',
    mode: 'Card',
    items: [
      { id: 1, type: 'Service', description: 'AC Evaporator Servicing & Gas Charging', qty: 1, price: 5200, total: 5200 },
      { id: 2, type: 'Parts', description: 'AC Filter Element', qty: 1, price: 2400, total: 2400 },
    ],
  },
]

export const getCustomers = () => mockCustomers
export const getJobCards = () => mockJobCards

export const getBillingMetrics = () => {
  return {
    thisMonth: '₹4.8L',
    pending: '₹48,294',
    overdue: '₹33,630',
    avgInvoice: '₹12,400',
  }
}

export const getInvoices = (search = '') => {
  if (!search) return mockInvoices
  const q = search.toLowerCase()
  return mockInvoices.filter(
    (inv) =>
      inv.id.toLowerCase().includes(q) ||
      inv.customerName.toLowerCase().includes(q) ||
      inv.vehicle.toLowerCase().includes(q) ||
      inv.jobCardId.toLowerCase().includes(q)
  )
}

export const getInvoiceById = (id) => {
  return mockInvoices.find((inv) => inv.id === id) || null
}

export const createInvoiceOrEstimate = (formData) => {
  const newNum = Math.floor(893 + Math.random() * 100)
  const isEstimate = formData.docType === 'Estimate'
  const prefix = isEstimate ? 'EST' : 'INV'
  
  const newRecord = {
    id: `${prefix}-0${newNum}`,
    docType: formData.docType || 'Estimate',
    customerName: formData.customerName || 'New Customer',
    customerEmail: formData.customerEmail || 'customer@example.com',
    customerPhone: formData.customerPhone || '+91 99999 00000',
    vehicle: formData.vehicle || 'Vehicle MH-01',
    jobCardId: formData.jobCardId || `JC-${Math.floor(2400 + Math.random() * 10)}`,
    date: '17 Aug 2026',
    amount: Number(formData.subtotal) || 0,
    discount: Number(formData.discount) || 0,
    gstRate: Number(formData.gstRate) || 18,
    gst: Number(formData.gst) || Math.round((Number(formData.subtotal) || 0) * 0.18),
    total: Number(formData.total) || 0,
    status: isEstimate ? 'Estimate' : (formData.status || 'Pending'),
    mode: formData.mode || 'UPI',
    notes: formData.notes || '',
    items: formData.items || [],
  }

  mockInvoices.unshift(newRecord)
  return newRecord
}
