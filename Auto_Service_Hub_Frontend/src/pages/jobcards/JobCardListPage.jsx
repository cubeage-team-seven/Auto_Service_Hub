import React from "react";
import { useLocation } from "react-router-dom";
import GarageOwnerJobCards from "../garage-owner/GarageOwnerJobCards";
import "./JobCardListPage.css";

function JobCardListPage() {
  const location = useLocation();

  return (
    <div className="mechanic-jobcards-page" key={location.pathname}>
      <GarageOwnerJobCards
        allowCreate
        showAppointment
        openCreateOnMount={location.pathname === "/job-cards/create"}
      />
    </div>
  );
}

export default JobCardListPage;
