import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/landing/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import BillingPage from './pages/billing/BillingPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import CustomerListPage from './pages/customers/CustomerListPage'

import CustomerPortalDashboard from './pages/customer-portal/CustomerPortalDashboard'
import CustomerVehiclesPage from './pages/customer-portal/CustomerVehiclesPage'
import CustomerBookingPage from './pages/customer-portal/CustomerBookingPage'
import CustomerAppointmentsPage from './pages/customer-portal/CustomerAppointmentsPage'
import CustomerServiceHistoryPage from './pages/customer-portal/CustomerServiceHistoryPage'
import CustomerNotificationsPage from './pages/customer-portal/CustomerNotificationsPage'
import CustomerFeedbackPage from './pages/customer-portal/CustomerFeedbackPage'
import CustomerProfilePage from './pages/customer-portal/CustomerProfilePage'

import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Authentication & Module Selection Flow */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/modules" element={<LoginPage />} />

        {/* Administrative Garage Hub Routes */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/customers" element={<CustomerListPage />} />

        {/* Customer Self-Service Portal Routes */}
        <Route path="/portal" element={<CustomerPortalDashboard />} />
        <Route path="/portal/vehicles" element={<CustomerVehiclesPage />} />
        <Route path="/portal/book" element={<CustomerBookingPage />} />
        <Route path="/portal/appointments" element={<CustomerAppointmentsPage />} />
        <Route path="/portal/history" element={<CustomerServiceHistoryPage />} />
        <Route path="/portal/notifications" element={<CustomerNotificationsPage />} />
        <Route path="/portal/feedback" element={<CustomerFeedbackPage />} />
        <Route path="/portal/profile" element={<CustomerProfilePage />} />

        {/* Fallback Redirect to Landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
