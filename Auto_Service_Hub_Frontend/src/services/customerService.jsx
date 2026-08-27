// Frontend Mock Service for Customer Module matching Figma Make single source of truth

export const mockCustomersList = [
  {
    id: 'C-1041',
    name: 'Arjun Mehta',
    phone: '+91 98201 45678',
    email: 'arjun.mehta@gmail.com',
    vehiclesCount: 2,
    vehicles: ['Swift (MH-12)', 'Innova (GJ-05)'],
    visits: 12,
    lastVisit: '17 Aug 2026',
    loyalty: 'Gold',
    balance: '₹0',
    numericBalance: 0,
    address: '501 Aundh Park, Pune',
  },
  {
    id: 'C-1040',
    name: 'Priya Sharma',
    phone: '+91 91234 56789',
    email: 'priya.sharma@gmail.com',
    vehiclesCount: 1,
    vehicles: ['Creta (DL-01)'],
    visits: 8,
    lastVisit: '17 Aug 2026',
    loyalty: 'Silver',
    balance: '₹0',
    numericBalance: 0,
    address: '77 Vasant Vihar, New Delhi',
  },
  {
    id: 'C-1039',
    name: 'Rohit Desai',
    phone: '+91 99876 54321',
    email: 'rohit.desai@gmail.com',
    vehiclesCount: 3,
    vehicles: ['Innova (GJ-05)', 'City (MH-14)', 'Baleno (KA-03)'],
    visits: 21,
    lastVisit: '16 Aug 2026',
    loyalty: 'Platinum',
    balance: '₹0',
    numericBalance: 0,
    address: '402 Sunset Towers, Bandra West, Mumbai',
  },
  {
    id: 'C-1038',
    name: 'Neha Joshi',
    phone: '+91 88765 43210',
    email: 'neha.joshi@gmail.com',
    vehiclesCount: 1,
    vehicles: ['City (MH-14)'],
    visits: 5,
    lastVisit: '17 Aug 2026',
    loyalty: 'Bronze',
    balance: '₹2,400',
    numericBalance: 2400,
    address: '88 Kothrud Greens, Pune',
  },
  {
    id: 'C-1037',
    name: 'Vikram Singh',
    phone: '+91 77654 32109',
    email: 'vikram.singh@gmail.com',
    vehiclesCount: 2,
    vehicles: ['Fortuner (UP-32)', 'Swift (MH-12)'],
    visits: 15,
    lastVisit: '15 Aug 2026',
    loyalty: 'Gold',
    balance: '₹0',
    numericBalance: 0,
    address: '10 Hazratganj, Lucknow',
  },
  {
    id: 'C-1036',
    name: 'Kavita Rao',
    phone: '+91 66543 21098',
    email: 'kavita.rao@gmail.com',
    vehiclesCount: 1,
    vehicles: ['Baleno (KA-03)'],
    visits: 4,
    lastVisit: '16 Aug 2026',
    loyalty: 'Bronze',
    balance: '₹0',
    numericBalance: 0,
    address: '12 Indiranagar 100ft Road, Bengaluru',
  },
  {
    id: 'C-1035',
    name: 'Sunil Nair',
    phone: '+91 55432 10987',
    email: 'sunil.nair@gmail.com',
    vehiclesCount: 1,
    vehicles: ['Fortuner (UP-78)'],
    visits: 9,
    lastVisit: '12 Aug 2026',
    loyalty: 'Silver',
    balance: '₹1,800',
    numericBalance: 1800,
    address: '15 Gomti Nagar, Lucknow',
  },
  {
    id: 'C-1034',
    name: 'Divya Kapoor',
    phone: '+91 44321 09876',
    email: 'divya.kapoor@gmail.com',
    vehiclesCount: 2,
    vehicles: ['Polo (MH-09)', 'City (MH-14)'],
    visits: 7,
    lastVisit: '10 Aug 2026',
    loyalty: 'Silver',
    balance: '₹0',
    numericBalance: 0,
    address: '22 Marine Drive, Mumbai',
  },
]

export const getCustomers = (search = '') => {
  if (!search) return mockCustomersList
  const q = search.toLowerCase().trim()
  return mockCustomersList.filter(
    (c) =>
      c.id.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
  )
}

export const createCustomer = (data) => {
  const newNum = Math.floor(1042 + Math.random() * 50)
  const newCust = {
    id: `C-${newNum}`,
    name: data.name || 'New Customer',
    phone: data.phone || '+91 99999 00000',
    email: data.email || 'customer@gmail.com',
    vehiclesCount: data.vehiclesCount || 1,
    vehicles: data.vehicles || ['Vehicle (MH-01)'],
    visits: 1,
    lastVisit: '17 Aug 2026',
    loyalty: data.loyalty || 'Bronze',
    balance: '₹0',
    numericBalance: 0,
    address: data.address || '',
  }

  mockCustomersList.unshift(newCust)
  return newCust
}
