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

        {/* BILLING MODULE ROUTES */}
        <Route path="/billing" element={<BillingLogin />} />
        <Route path="/billing/dashboard" element={<BillingPage />} />
      

        
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