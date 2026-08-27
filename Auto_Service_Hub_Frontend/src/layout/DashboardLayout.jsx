import React, { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

export default function DashboardLayout({ children, activeModule = 'Billing Hub' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#080909] text-[#f0f0f0] flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-60 flex flex-col min-h-screen">
        <Header
          activeModule={activeModule}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  )
}
