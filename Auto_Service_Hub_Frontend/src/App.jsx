import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
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
import MechanicLayout from "./pages/mechanic/MechanicLayout";
import DashboardPage from "./pages/dashboard/DashboardPage";

/* =========================
   INVENTORY
========================= */
import InventoryLogin from "./pages/inventory/InventoryLogin";
import InventoryLayout from "./pages/inventory/InventoryLayout";
import InventoryDashboard from "./pages/inventory/InventoryDashboard"; // NEW
import InventoryPage from "./pages/inventory/InventoryPage";

/* =========================
   JOB CARDS
========================= */
import JobCardListPage from "./pages/jobcards/JobCardListPage";
import JobCardCreatePage from "./pages/jobcards/JobCardCreatePage";
import JobCardDetailsPage from "./pages/jobcards/JobCardDetailsPage";

/* =========================
   CUSTOMERS
========================= */
import CustomerLogin from "./pages/customers/CustomerLogin";
import CustomerDashboard from "./pages/customers/Dashboard";
import Appointments from "./pages/customers/Appointments";

/* =========================
   BILLING
========================= */
import BillingLogin from "./pages/billing/BillingLogin";
import BillingPage from "./pages/billing/BillingPage";

/* =========================
   GARAGE OWNER LOGIN
========================= */
import GarageOwnerLogin from "./pages/garage-owner/GarageOwnerLogin";

/* =========================
   GARAGE OWNER LAYOUT
========================= */
import GarageOwnerLayout from "./pages/garage-owner/GarageOwnerLayout";

/* =========================
   GARAGE OWNER PAGES
========================= */
import GarageOwnerDashboard from "./pages/garage-owner/GarageOwnerDashboard";
import GarageOwnerCustomers from "./pages/garage-owner/GarageOwnerCustomers";
import GarageOwnerVehicles from "./pages/garage-owner/GarageOwnerVehicles";
import GarageOwnerAppointments from "./pages/garage-owner/GarageOwnerAppointments";
import GarageOwnerJobCards from "./pages/garage-owner/GarageOwnerJobCards";
import GarageOwnerMechanics from "./pages/garage-owner/GarageOwnerMechanics";
import GarageOwnerInventory from "./pages/garage-owner/GarageOwnerInventory";
import GarageOwnerBilling from "./pages/garage-owner/GarageOwnerBilling";
import GarageOwnerFollowup from "./pages/garage-owner/GarageOwnerFollowup";
import GarageOwnerAIHub from "./pages/garage-owner/GarageOwnerAIHub";
import GarageOwnerReports from "./pages/garage-owner/GarageOwnerReports";

/* =========================
   PACKAGES
========================= */
import PackagesPage from "./pages/packages/PackagesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= LANDING ================= */}

        <Route path="/" element={<LandingPage />} />

        {/* ================= MODULE SELECTION ================= */}

        <Route path="/modules" element={<ModulePage />} />

        {/* ================= MECHANIC ================= */}

        <Route path="/mechanic" element={<MechanicLogin />} />

        <Route element={<MechanicLayout />}>

          <Route
            path="/mechanic-dashboard"
            element={<DashboardPage />}
          />

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

        </Route>

        {/* ================= INVENTORY LOGIN ================= */}

        <Route
          path="/inventory-login"
          element={<InventoryLogin />}
        />

        {/* ================= INVENTORY MODULE ================= */}

        <Route element={<InventoryLayout />}>

          {/* Dashboard */}

          <Route
            path="/inventory-dashboard"
            element={<InventoryDashboard />}
          />

          {/* Inventory */}

          <Route
            path="/inventory"
            element={<InventoryPage />}
          />

        </Route>

        {/* ================= CUSTOMERS ================= */}

        <Route path="/customers" element={<CustomerLogin />} />

        <Route
          path="/customer-dashboard"
          element={<CustomerDashboard />}
        />

        <Route
          path="/appointments"
          element={<Appointments />}
        />

        {/* ================= BILLING ================= */}

        <Route path="/billing" element={<BillingLogin />} />

        <Route
          path="/billing/dashboard"
          element={<BillingPage />}
        />

        {/* ================= GARAGE OWNER LOGIN ================= */}

        <Route
          path="/garage-owner-login"
          element={<GarageOwnerLogin />}
        />

        {/* ================= GARAGE OWNER MODULE ================= */}

        <Route
          path="/garage-owner"
          element={<GarageOwnerLayout />}
        >

          <Route
            index
            element={<GarageOwnerDashboard />}
          />

          <Route
            path="dashboard"
            element={<GarageOwnerDashboard />}
          />

          <Route
            path="customers"
            element={<GarageOwnerCustomers />}
          />

          <Route
            path="vehicles"
            element={<GarageOwnerVehicles />}
          />

          <Route
            path="appointments"
            element={<GarageOwnerAppointments />}
          />

          <Route
            path="jobcards"
            element={<GarageOwnerJobCards />}
          />

          <Route
            path="mechanics"
            element={<GarageOwnerMechanics />}
          />

          <Route
            path="inventory"
            element={<GarageOwnerInventory />}
          />

          <Route
            path="packages"
            element={<PackagesPage />}
          />

          <Route
            path="billing"
            element={<GarageOwnerBilling />}
          />

          <Route
            path="follow-up"
            element={<GarageOwnerFollowup />}
          />

          <Route
            path="ai-hub"
            element={<GarageOwnerAIHub />}
          />

          <Route
            path="reports"
            element={<GarageOwnerReports />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;