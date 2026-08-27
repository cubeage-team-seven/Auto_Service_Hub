// Frontend mock service for Customer Self-Service Portal

let mockCustomerProfile = {
  id: 'CUST-8801',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  address: '742 Evergreen Terrace, Sector 4, Metro City',
  emergencyContact: 'Jane Doe (+1 555-987-6543)',
  memberSince: 'March 2024',
  preferredBranch: 'SmartGarage Downtown Performance Center',
  notifications: {
    email: true,
    sms: true,
    whatsapp: true,
  },
}

let mockCustomerVehicles = [
  {
    id: 'VEH-01',
    customerName: 'John Doe',
    customerPhone: '+1 (555) 123-4567',
    vehicleName: 'Audi RS5 Coupe',
    licensePlate: 'MH-12-AB-9901',
    vin: 'WAUZZZF50KA092812',
    year: 2023,
    color: 'Nardo Grey',
    engine: '2.9L Twin-Turbo V6 (444 hp)',
    mileage: '14,200 km',
    status: 'In Workshop',
    lastServiceDate: '2026-08-25',
    nextServiceDue: '2027-02-25',
    activeJobCard: {
      jobCardNumber: 'JC-2026-904',
      status: 'Work in Progress',
      progressPercentage: 65,
      advisor: 'Alex Morgan',
      mechanic: 'David Miller (Master Tech)',
      bay: 'Bay #04 (Performance Tuning)',
      estimatedDelivery: 'Today at 5:30 PM',
      receivedTime: '2026-08-25 09:15 AM',
      currentStageDesc: 'Replacing front ceramic brake pads & recalibrating sensor suite.',
      timeline: [
        { title: 'Vehicle Drop-Off & Check-In', time: '09:15 AM', completed: true, desc: 'Initial walkaround & mileage logged (14,200 km).' },
        { title: 'AI Diagnostics & Multi-Point Inspection', time: '10:30 AM', completed: true, desc: 'Scanned 42 modules. All clear except brake pad wear.' },
        { title: 'Parts Assembly & Active Repair', time: '12:00 PM', completed: true, desc: 'Brembo OEM parts fetched from store.' },
        { title: 'Wheel Balancing & Sensor Calibration', time: '02:30 PM', completed: false, isCurrent: true, desc: 'Currently performing laser alignment.' },
        { title: 'Final Wash & Road Test', time: '04:45 PM', completed: false, desc: 'Clean exterior & interior vacuum.' },
        { title: 'Ready for Pickup', time: '05:30 PM', completed: false, desc: 'Invoice generated & ready.' },
      ],
      pendingInvoiceId: 'INV-2026-002',
      estimatedCost: 1050.20,
    },
  },
  {
    id: 'VEH-02',
    customerName: 'John Doe',
    customerPhone: '+1 (555) 123-4567',
    vehicleName: 'BMW M3 Competition',
    licensePlate: 'MH-12-DE-4410',
    vin: 'WBS83AY090K994102',
    year: 2024,
    color: 'Isle of Man Green',
    engine: '3.0L Inline-6 Twin-Power Turbo',
    mileage: '8,400 km',
    status: 'Healthy',
    lastServiceDate: '2026-05-10',
    nextServiceDue: '2026-11-10',
    activeJobCard: null,
  },
  {
    id: 'VEH-03',
    customerName: 'John Doe',
    customerPhone: '+1 (555) 123-4567',
    vehicleName: 'Porsche Macan GTS',
    licensePlate: 'MH-12-[#]-8820',
    vin: 'WP1AA2A94MLB88201',
    year: 2022,
    color: 'Chalk White',
    engine: '2.9L V6 Biturbo',
    mileage: '22,100 km',
    status: 'Service Due',
    lastServiceDate: '2025-09-01',
    nextServiceDue: '2026-09-01',
    activeJobCard: null,
  },
]

let mockServiceHistory = [
  {
    id: 'SH-2026-08',
    date: '2026-08-25',
    serviceTitle: 'Brake Servicing & Periodical Maintenance',
    vehicle: 'Audi RS5 Coupe (MH-12-AB-9901)',
    mileage: '14,200 KM',
    invoiceId: 'INV-2026-002',
    amount: 1050.20,
    status: 'Pending Payment',
    advisor: 'Alex Morgan',
    pdfUrl: '#',
    items: [
      { name: 'Front Ceramic Brake Pads (Brembo OEM)', qty: 1, price: 580.00 },
      { name: 'Brake Fluid Flush & Sensor Recalibration', qty: 1, price: 220.00 },
      { name: 'Labour & Performance Inspection', qty: 3, price: 250.20 },
    ]
  },
  {
    id: 'SH-2026-02',
    date: '2026-02-14',
    serviceTitle: 'Engine Oil Change & AC Sanitization',
    vehicle: 'Audi RS5 Coupe (MH-12-AB-9901)',
    mileage: '8,500 KM',
    invoiceId: 'INV-2026-001',
    amount: 450.00,
    status: 'Paid',
    advisor: 'Sarah Connor',
    pdfUrl: '#',
    items: [
      { name: 'Motul 300V Synthetic Engine Oil (6L)', qty: 1, price: 210.00 },
      { name: 'OEM Oil Filter & O-Rings', qty: 1, price: 40.00 },
      { name: 'AC Sanitization & Cabin Pollen Filter', qty: 1, price: 200.00 },
    ]
  },
  {
    id: 'SH-2025-11',
    date: '2025-11-20',
    serviceTitle: 'Annual Performance Scan & Wheel Alignment',
    vehicle: 'BMW M3 Competition (MH-12-DE-4410)',
    mileage: '4,100 KM',
    invoiceId: 'INV-2025-998',
    amount: 320.00,
    status: 'Paid',
    advisor: 'Alex Morgan',
    pdfUrl: '#',
    items: [
      { name: '3D Laser Wheel Alignment', qty: 1, price: 150.00 },
      { name: 'OBD-II Full System Scan', qty: 1, price: 90.00 },
      { name: 'Wheel Balancing & Tire Rotation', qty: 1, price: 80.00 },
    ]
  },
]

let mockAppointments = [
  {
    id: 'APT-1001',
    vehicle: 'Porsche Macan GTS (MH-12-[#]-8820)',
    serviceType: 'Periodical Service & Oil Change',
    date: '2026-09-15',
    timeSlot: '10:00 AM - 11:30 AM',
    pickupRequired: true,
    pickupAddress: '742 Evergreen Terrace, Sector 4',
    notes: 'Please inspect front suspension for slight squeaking during slow turns.',
    status: 'Confirmed',
  },
  {
    id: 'APT-0994',
    vehicle: 'BMW M3 Competition (MH-12-DE-4410)',
    serviceType: 'AC Climate Care & Sanitization',
    date: '2026-10-02',
    timeSlot: '02:00 PM - 03:30 PM',
    pickupRequired: false,
    pickupAddress: 'N/A (Self Drop-off)',
    notes: 'Routine AC antibacterial wash before summer.',
    status: 'Scheduled',
  },
]

let mockNotifications = [
  {
    id: 'NOTIF-01',
    title: 'Service Due Reminder',
    message: 'Your Porsche Macan GTS (MH-12-[#]-8820) is due for annual periodical service in 7 days.',
    date: 'Today, 09:30 AM',
    type: 'warning', // 'info', 'warning', 'success'
    read: false,
    actionUrl: '/portal/book',
    actionText: 'Book Service Now',
  },
  {
    id: 'NOTIF-02',
    title: 'Live Service Update',
    message: 'Work in Progress: Brembo ceramic brake pads installation is underway for Audi RS5 Coupe.',
    date: 'Today, 12:05 PM',
    type: 'info',
    read: false,
    actionUrl: '/portal',
    actionText: 'View Live Tracker',
  },
  {
    id: 'NOTIF-03',
    title: 'Invoice Generated',
    message: 'Invoice INV-2026-002 ($1,050.20) for Audi RS5 Coupe is ready for review and online payment.',
    date: 'Today, 01:15 PM',
    type: 'success',
    read: true,
    actionUrl: '/portal/history',
    actionText: 'Pay Invoice',
  },
  {
    id: 'NOTIF-04',
    title: 'Appointment Confirmed',
    message: 'Your appointment APT-1001 for Porsche Macan GTS on Sep 15, 2026 (10:00 AM) is confirmed.',
    date: 'Yesterday',
    type: 'success',
    read: true,
    actionUrl: '/portal/appointments',
    actionText: 'View Details',
  },
]

let mockFeedbacks = [
  {
    id: 'FB-501',
    date: '2026-02-15',
    serviceTitle: 'Engine Oil Change & AC Sanitization',
    vehicle: 'Audi RS5 Coupe',
    rating: 5,
    advisor: 'Sarah Connor',
    comment: 'Exceptional service! The video inspection sent to my phone was clear, and the valet pickup arrived exactly on time.',
    response: 'Thank you John! We love keeping your Audi in top racing shape. — SmartGarage Team',
  },
  {
    id: 'FB-489',
    date: '2025-11-21',
    serviceTitle: '3D Laser Wheel Alignment',
    vehicle: 'BMW M3 Competition',
    rating: 5,
    advisor: 'Alex Morgan',
    comment: 'Precision alignment fixed the high-speed vibration. Very professional staff.',
    response: 'Glad we could assist! Drive safe. — Alex Morgan',
  },
]

// --- Helper Functions ---

export const getCustomerProfile = () => {
  return { ...mockCustomerProfile }
}

export const updateCustomerProfile = (updatedFields) => {
  mockCustomerProfile = { ...mockCustomerProfile, ...updatedFields }
  return { ...mockCustomerProfile }
}

export const getCustomerVehicleStatus = () => {
  return mockCustomerVehicles[0]
}

export const getCustomerVehicles = () => {
  return [...mockCustomerVehicles]
}

export const addCustomerVehicle = (vehicleData) => {
  const newVeh = {
    id: `VEH-0${mockCustomerVehicles.length + 1}`,
    customerName: mockCustomerProfile.name,
    customerPhone: mockCustomerProfile.phone,
    vehicleName: `${vehicleData.make} ${vehicleData.model}`,
    licensePlate: vehicleData.licensePlate,
    vin: vehicleData.vin || 'WAUZZZ' + Math.random().toString(36).substring(2, 10).toUpperCase(),
    year: parseInt(vehicleData.year, 10) || 2024,
    color: vehicleData.color || 'Black Sapphire',
    engine: vehicleData.engine || '2.0L Turbo',
    mileage: vehicleData.mileage ? `${vehicleData.mileage} km` : '1,000 km',
    status: 'Healthy',
    lastServiceDate: 'N/A',
    nextServiceDue: 'In 6 Months',
    activeJobCard: null,
  }
  mockCustomerVehicles.push(newVeh)
  return newVeh
}

export const getCustomerServiceHistory = () => {
  return [...mockServiceHistory]
}

export const getCustomerAppointments = () => {
  return [...mockAppointments]
}

export const bookNewAppointment = (appointmentData) => {
  const newApt = {
    id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
    vehicle: appointmentData.vehicle || 'Audi RS5 Coupe (MH-12-AB-9901)',
    serviceType: appointmentData.serviceType,
    date: appointmentData.date,
    timeSlot: appointmentData.timeSlot,
    pickupRequired: appointmentData.pickupRequired || false,
    pickupAddress: appointmentData.pickupRequired ? (appointmentData.pickupAddress || mockCustomerProfile.address) : 'N/A (Self Drop-off)',
    notes: appointmentData.notes || '',
    status: 'Confirmed',
  }
  mockAppointments.unshift(newApt)
  return newApt
}

export const cancelAppointment = (aptId) => {
  mockAppointments = mockAppointments.filter((a) => a.id !== aptId)
  return [...mockAppointments]
}

export const payCustomerInvoice = (invoiceId, paymentDetails) => {
  const historyItem = mockServiceHistory.find((sh) => sh.invoiceId === invoiceId)
  if (historyItem) {
    historyItem.status = 'Paid'
  }
  return { success: true, transactionId: `TXN_${Math.floor(1000000 + Math.random() * 9000000)}` }
}

export const getNotifications = () => {
  return [...mockNotifications]
}

export const markNotificationRead = (notifId) => {
  const notif = mockNotifications.find((n) => n.id === notifId)
  if (notif) notif.read = true
  return [...mockNotifications]
}

export const markAllNotificationsRead = () => {
  mockNotifications.forEach((n) => (n.read = true))
  return [...mockNotifications]
}

export const getFeedbacks = () => {
  return [...mockFeedbacks]
}

export const addFeedback = (feedbackData) => {
  const newFb = {
    id: `FB-${Math.floor(500 + Math.random() * 500)}`,
    date: new Date().toISOString().split('T')[0],
    serviceTitle: feedbackData.serviceTitle || 'General Workshop Service',
    vehicle: feedbackData.vehicle || 'Audi RS5 Coupe',
    rating: feedbackData.rating || 5,
    advisor: feedbackData.advisor || 'Alex Morgan',
    comment: feedbackData.comment,
    response: 'Thank you for your feedback! We are thrilled to serve you. — SmartGarage Team',
  }
  mockFeedbacks.unshift(newFb)
  return newFb
}

