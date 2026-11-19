import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import GarageOwnerJobCards from "../garage-owner/GarageOwnerJobCards";
import "./JobCardListPage.css";

function JobCardListPage() {
  const location = useLocation();
  const { user } = useAuth();
  const role = String(user?.role || "").replace(/^ROLE_/i, "").toUpperCase();
  const canCreate = role !== "MECHANIC";

  return (
    <div className="mechanic-jobcards-page" key={location.pathname}>
      <GarageOwnerJobCards
        allowCreate={canCreate}
        showAppointment
        openCreateOnMount={location.pathname === "/job-cards/create"}
      />
    </div>
  );
}

export default JobCardListPage;
