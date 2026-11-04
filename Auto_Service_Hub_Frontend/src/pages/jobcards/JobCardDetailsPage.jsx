import React from "react";
import { useParams } from "react-router-dom";
import JobCardWorkspace from "./JobCardWorkspace";

export default function JobCardDetailsPage() {
  const { jobId } = useParams();
  return <JobCardWorkspace initialJobId={jobId} />;
}
