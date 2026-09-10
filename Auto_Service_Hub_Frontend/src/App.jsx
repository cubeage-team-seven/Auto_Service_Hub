import { BrowserRouter, Routes, Route } from "react-router-dom";

// =====================
// AUTH
// =====================
import Login from "./pages/auth/Login";
import ModulePage from "./pages/auth/ModulePage";

// =====================
// LANDING
// =====================
import LandingPage from "./pages/landing/LandingPage";

// =====================
// MECHANIC
// =====================
import MechanicLogin from "./pages/mechanic/MechanicLogin";
import DashboardPage from "./pages/dashboard/DashboardPage";

// =====================
// INVENTORY
// =====================
import InventoryLogin from "./pages/inventory/InventoryLogin";
import InventoryDashboard from "./pages/inventory/InventoryDashboard";
import InventoryPage from "./pages/inventory/InventoryPage";

// =====================
// JOB CARDS
// =====================
import JobCardListPage from "./pages/jobcards/JobCardListPage";
import JobCardCreatePage from "./pages/jobcards/JobCardCreatePage";
import JobCardDetailsPage from "./pages/jobcards/JobCardDetailsPage";

// =====================
// DEVELOPER
// =====================
import DeveloperDashboard from "./pages/developer/DeveloperDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =====================
            LANDING
        ===================== */}
        <Route path="/" element={<LandingPage />} />

        {/* =====================
            AUTH / MODULE
        ===================== */}
        <Route path="/login" element={<Login />} />
        <Route path="/module" element={<ModulePage />} />

        {/* =====================
            MECHANIC
        ===================== */}
        <Route path="/mechanic/login" element={<MechanicLogin />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* =====================
            INVENTORY
        ===================== */}
        <Route path="/inventory/login" element={<InventoryLogin />} />
        <Route path="/inventory/dashboard" element={<InventoryDashboard />} />
        <Route path="/inventory" element={<InventoryPage />} />

        {/* =====================
            JOB CARDS
        ===================== */}
        <Route path="/jobcards" element={<JobCardListPage />} />
        <Route path="/jobcards/create" element={<JobCardCreatePage />} />
        <Route
          path="/jobcards/:id"
          element={<JobCardDetailsPage />}
        />

        {/* =====================
            DEVELOPER
        ===================== */}
        <Route
          path="/developer"
          element={<DeveloperDashboard />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;