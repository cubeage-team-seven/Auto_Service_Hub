import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

/* =========================
   LANDING
========================= */
import LandingPage from "./pages/landing/LandingPage";

/* =========================
   MODULE SELECTION
========================= */
import ModulePage from "./pages/auth/ModulePage";

/* =========================
   AUTH
========================= */
import Login from "./pages/auth/Login";

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
   DEVELOPER
========================= */
import DeveloperDashboard from "./pages/developer/DeveloperDashboard";

/* =========================
   QA ENGINEER
========================= */
import QADashboard from "./pages/qa/QADashboard";

/* =========================
   CUSTOMERS
========================= */
import CustomersPage from "./pages/customers/CustomersPage";

/* =========================
   VEHICLES
========================= */
import VehiclesPage from "./pages/vehicles/VehiclesPage";

/* =========================
   APPOINTMENTS
========================= */
import Appointments from "./pages/developer/appointments";

/* =========================
   JOB CARDS (Developer style)
========================= */
import JobCards from "./pages/developer/job cards";

/* =========================
   MECHANICS
========================= */
import Mechanics from "./pages/developer/mechanics";

/* =========================
   INVENTORY (Developer style)
========================= */
import Inventory from "./pages/developer/inventory";

/* =========================
   PACKAGES
========================= */
import Packages from "./pages/developer/packages";

/* =========================
   BILLING
========================= */
import Billing from "./pages/developer/billing";

/* =========================
   FOLLOW-UP
========================= */
import FollowUp from "./pages/developer/follow-up";

/* =========================
   AI HUB
========================= */
import AIHub from "./pages/developer/ai-hub";

/* =========================
   REPORTS
========================= */
import Reports from "./pages/developer/reports";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LANDING PAGE */}
        <Route path="/" element={<LandingPage />} />

        {/* MODULE SELECTION */}
        <Route path="/modules" element={<ModulePage />} />

        {/* LOGIN PAGE */}
        <Route path="/login" element={<Login />} />

        {/* =========================
            MECHANIC
        ========================= */}
        <Route path="/mechanic" element={<MechanicLogin />} />
        <Route path="/mechanic-dashboard" element={<DashboardPage />} />

        {/* =========================
            INVENTORY
        ========================= */}
        <Route path="/inventory-login" element={<InventoryLogin />} />
        <Route path="/inventory-dashboard" element={<InventoryDashboard />} />
        <Route path="/inventory" element={<InventoryPage />} />

        {/* =========================
            JOB CARDS
        ========================= */}
        <Route path="/job-cards" element={<JobCardListPage />} />
        <Route path="/job-cards/create" element={<JobCardCreatePage />} />
        <Route path="/job-cards/:jobId" element={<JobCardDetailsPage />} />

        {/* =========================
            DEVELOPER
        ========================= */}
        <Route path="/developer" element={<DeveloperDashboard />} />

        {/* =========================
            QA ENGINEER
        ========================= */}
        <Route path="/qa/dashboard" element={<QADashboard />} />

        {/* =========================
            CUSTOMERS
        ========================= */}
        <Route path="/customers" element={<CustomersPage />} />

        {/* =========================
            VEHICLES
        ========================= */}
        <Route path="/vehicles" element={<VehiclesPage />} />

        {/* =========================
            APPOINTMENTS
        ========================= */}
        <Route path="/appointments" element={<Appointments />} />

        {/* =========================
            JOB CARDS (Developer style)
        ========================= */}
        <Route path="/job-cards-dev" element={<JobCards />} />

        {/* =========================
            MECHANICS
        ========================= */}
        <Route path="/mechanics" element={<Mechanics />} />

        {/* =========================
            INVENTORY (Developer style)
        ========================= */}
        <Route path="/inventory-dev" element={<Inventory />} />

        {/* =========================
            PACKAGES
        ========================= */}
        <Route path="/packages" element={<Packages />} />

        {/* =========================
            BILLING
        ========================= */}
        <Route path="/billing" element={<Billing />} />

        {/* =========================
            FOLLOW-UP
        ========================= */}
        <Route path="/follow-up" element={<FollowUp />} />

        {/* =========================
            AI HUB
        ========================= */}
        <Route path="/ai-hub" element={<AIHub />} />

        {/* =========================
            REPORTS
        ========================= */}
        <Route path="/reports" element={<Reports />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
