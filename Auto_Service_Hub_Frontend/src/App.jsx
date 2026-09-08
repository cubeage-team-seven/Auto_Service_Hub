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

/* =========================
   BILLING LOGIN
========================= */
import BillingLogin from "./pages/billing/BillingLogin";

/* =========================
   DASHBOARD
========================= */
import DashboardPage from "./pages/dashboard/DashboardPage";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =========================
            LANDING
        ========================= */}
        <Route
          path="/"
          element={<LandingPage />}
        />


        {/* =========================
            MODULE SELECTION
        ========================= */}
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

        <Route
          path="/dashboard"
          element={<CustomerDashboard />}
        />

        <Route
          path="/customer-dashboard"
          element={<CustomerDashboard />}
        />


        {/* =========================
            BILLING LOGIN
        ========================= */}
        <Route
          path="/billing"
          element={<BillingLogin />}
        />


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


        {/* =========================
            FALLBACK
        ========================= */}
        <Route
          path="*"
          element={<ModulePage />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;