import React from "react";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

/* =========================
   LANDING
========================= */
import LandingPage from "./pages/landing/LandingPage";

/* =========================
   MODULE SELECTION
========================= */
import ModulePage from "./pages/auth/ModulePage";

/* =========================
   MECHANIC
========================= */
import MechanicLogin from "./pages/mechanic/MechanicLogin";
import DashboardPage from "./pages/dashboard/DashboardPage";

/* =========================
   INVENTORY
========================= */
import InventoryLogin from "./pages/inventory/InventoryLogin";
import InventoryDashboard from "./pages/inventory/InventoryDashboard";
import InventoryPage from "./pages/inventory/InventoryPage";

/* =========================
   JOB CARDS
========================= */
import JobCardListPage from "./pages/jobcards/JobCardListPage";
import JobCardCreatePage from "./pages/jobcards/JobCardCreatePage";
import JobCardDetailsPage from "./pages/jobcards/JobCardDetailsPage";

/* =========================
   CUSTOMER
========================= */
import CustomerLogin from "./pages/customers/CustomerLogin";
import CustomerDashboard from "./pages/customers/Dashboard";
import Appointments from "./pages/customers/Appointments"; // Add Appointments import

/* =========================
    Service Advisor
========================= */

import ServiceAdvisorAppointments from "./pages/Service Advisor/Appointments";
import ServiceAdvisorCustomers from "./pages/Service Advisor/Customers";
import ServiceAdvisorDashboard from "./pages/Service Advisor/Dashboard";
import ServiceAdvisorJobCards from "./pages/Service Advisor/JobCards";
import ServiceAdvisorPackages from "./pages/Service Advisor/Packages";
import ServiceAdvisorLayout from "./pages/Service Advisor/ServiceAdvisorLayout";
import ServiceAdvisorLogin from "./pages/Service Advisor/ServiceAdvisorLogin";
import ServiceAdvisorVehicles from "./pages/Service Advisor/Vehicles";



/* =========================
   BILLING
========================= */
import BillingLogin from "./pages/billing/BillingLogin";
import BillingPage from "./pages/billing/BillingPage";



function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* LANDING PAGE */}
        <Route
          path="/"
          element={<LandingPage />}
        />


        {/* MODULE SELECTION */}
        <Route
          path="/modules"
          element={<ModulePage />}
        />


        {/* =========================
            MECHANIC
        ========================= */}

        <Route
          path="/mechanic"
          element={<MechanicLogin />}
        />

        <Route
          path="/mechanic-dashboard"
          element={<DashboardPage />}
        />


        {/* =========================
            INVENTORY
        ========================= */}

        <Route
          path="/inventory-login"
          element={<InventoryLogin />}
        />

        <Route
          path="/inventory-dashboard"
          element={<InventoryDashboard />}
        />

        <Route
          path="/inventory"
          element={<InventoryPage />}
        />
        
        {/* =========================
            CUSTOMER
        ========================= */}
        <Route
          path="/customers"
          element={<CustomerLogin />}
        />

        {/* Both dashboard routes configured */}
        <Route
          path="/dashboard"
          element={<CustomerDashboard />}
        />
        <Route
          path="/customer-dashboard"
          element={<CustomerDashboard />}
        />

           {/* APPOINTMENTS */}
        <Route
          path="/appointments"
          element={<Appointments />}
        />


        {/* BILLING MODULE ROUTES */}
        <Route path="/billing" element={<BillingLogin />} />
        <Route path="/billing/dashboard" element={<BillingPage />} />
      

        {/* =========================
    Service Advisor
========================= */}

{/* Standalone Login Route */}
<Route 
  path="/service-advisor-login" 
  element={<ServiceAdvisorLogin />} 
/>

{/* Protected Layout & Dashboard Routes */}
<Route 
  path="/service-advisor" 
  element={<ServiceAdvisorLayout />}
>
  <Route index element={<ServiceAdvisorDashboard />} />
  <Route path="dashboard" element={<ServiceAdvisorDashboard />} />
  <Route path="customers" element={<ServiceAdvisorCustomers />} />
  <Route path="vehicles" element={<ServiceAdvisorVehicles />} />
  <Route path="appointments" element={<ServiceAdvisorAppointments />} />
  <Route path="jobcards" element={<ServiceAdvisorJobCards />} />
  <Route path="packages" element={<ServiceAdvisorPackages />} />
</Route>
        {/* =========================
            JOB CARDS
        ========================= */}

        <Route
          path="/job-cards"
          element={<JobCardListPage />}
        />

        <Route
          path="/job-cards/create"
          element={<JobCardCreatePage />}
        />

        <Route
          path="/job-cards/:jobId"
          element={<JobCardDetailsPage />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;