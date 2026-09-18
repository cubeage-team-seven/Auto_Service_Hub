import React from "react";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import LandingPage from "./pages/landing/LandingPage";
import ModulePage from "./pages/auth/ModulePage";
import LoginPage from "./pages/auth/LoginPage";
import MechanicLogin from "./pages/mechanic/MechanicLogin";
import DashboardPage from "./pages/dashboard/DashboardPage";
import InventoryLogin from "./pages/inventory/InventoryLogin";
import InventoryDashboard from "./pages/inventory/InventoryDashboard";
import InventoryPage from "./pages/inventory/InventoryPage";
import JobCardListPage from "./pages/jobcards/JobCardListPage";
import JobCardCreatePage from "./pages/jobcards/JobCardCreatePage";
import JobCardDetailsPage from "./pages/jobcards/JobCardDetailsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/modules" element={<ModulePage />} />
        <Route path="/mechanic" element={<MechanicLogin />} />
        <Route path="/mechanic-dashboard" element={<DashboardPage />} />
        <Route path="/inventory-login" element={<InventoryLogin />} />
        <Route path="/inventory-dashboard" element={<InventoryDashboard />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/job-cards" element={<JobCardListPage />} />
        <Route path="/job-cards/create" element={<JobCardCreatePage />} />
        <Route path="/job-cards/:jobId" element={<JobCardDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;