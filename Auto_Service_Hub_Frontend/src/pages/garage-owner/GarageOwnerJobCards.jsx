import React from "react";
import { useParams } from "react-router-dom";
import JobCardWorkspace from "../jobcards/JobCardWorkspace";

export default function GarageOwnerJobCards() {
  const { jobId } = useParams();
  return <JobCardWorkspace ownerLayout initialJobId={jobId || ""} />;
}
