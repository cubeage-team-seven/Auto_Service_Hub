import React, { useEffect, useMemo, useState } from "react";
import {
  cancelFollowup,
  completeFollowup,
  createFeedback,
  createFollowup,
  getFeedback,
  getFollowupAssignees,
  getFollowupBucketCounts,
  getFollowupDashboard,
  getFollowupMessages,
  getFollowupReminders,
  getFollowups,
  recordFollowupMessage,
  updateFollowup,
} from "../../services/followUpService";
import { getCustomers } from "../../services/customerService";
import { getVehicles } from "../../services/vehicleService";
import { getJobCards } from "../../services/jobCardService";
import { FOLLOW_UP_BUCKETS } from "./followup/followUpUtils";
import FollowUpSummaryCards from "./followup/FollowUpSummaryCards";
import FollowUpToolbar from "./followup/FollowUpToolbar";
import FollowUpTable from "./followup/FollowUpTable";
import ScheduleFollowUpModal from "./followup/ScheduleFollowUpModal";
import CommunicationModal from "./followup/CommunicationModal";
import FeedbackPanel from "./followup/FeedbackPanel";
import RetentionPanel from "./followup/RetentionPanel";
import RecordFeedbackModal from "./followup/RecordFeedbackModal";
import "./GarageOwnerFollowup.css";

const PAGE_SIZE = 20;
const toDateKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

const channelLabel = (channel) => ({
  PHONE_CALL: "Phone Call",
  CALL: "Phone Call",
  WHATSAPP: "WhatsApp",
  SMS: "SMS",
  EMAIL: "Email",
  IN_PERSON: "In Person",
}[channel] || channel || "—");

const statusLabel = (status) => ({
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
}[status] || status || "Pending");

function mapFollowup(record, vehicles) {
  const vehicle = vehicles.find((entry) => entry.id === record.vehicleId);
  return {
    ...record,
    recordId: record.id,
    rowId: String(record.id),
    id: `FU-${record.id}`,
    backendStatus: record.status,
    customer: record.customerName || "Customer",
    phone: record.customerPhone || "—",
    vehicle: [record.vehicleMake || vehicle?.make, record.vehicleModel || vehicle?.model]
      .filter(Boolean).join(" ") || "—",
    registration: record.registrationNumber || vehicle?.registrationNo || "—",
    type: record.type || record.reason || "Follow-up",
    channel: channelLabel(record.channel),
    backendChannel: record.channel,
    assignedTo: record.assignedUserName || "Unassigned",
    status: statusLabel(record.status),
    priority: "Normal",
    dueDate: record.dueDate,
    notes: record.reason || "",
  };
}

function GarageOwnerFollowup() {
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [jobCards, setJobCards] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [feedbackTotal, setFeedbackTotal] = useState(0);
  const [feedbackSearch, setFeedbackSearch] = useState("");
  const [dashboard, setDashboard] = useState({
    dueFollowups: 0,
    pendingReminders: 0,
    feedbackReceived: 0,
    messagesSent: 0,
    averageRating: 0,
  });
  const [bucketCounts, setBucketCounts] = useState({});
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [channelFilter, setChannelFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showCommunication, setShowCommunication] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState(null);
  const [editingFollowUp, setEditingFollowUp] = useState(null);
  const [messageHistory, setMessageHistory] = useState([]);
  const [reminderHistory, setReminderHistory] = useState([]);

  const filters = useMemo(() => ({
    bucket: activeTab,
    status: statusFilter === "ALL" ? undefined : statusFilter,
    channel: channelFilter === "ALL" ? undefined : channelFilter,
    type: typeFilter === "ALL" ? undefined : typeFilter,
    q: search.trim() || undefined,
  }), [activeTab, statusFilter, channelFilter, typeFilter, search]);

  useEffect(() => {
    let active = true;
    setOptionsLoading(true);
    Promise.all([
      getCustomers(),
      getVehicles(),
      getJobCards(),
      getFollowupAssignees(),
    ]).then(([customerRows, vehicleRows, jobRows, staffRows]) => {
      if (!active) return;
      setCustomers(customerRows);
      setVehicles(vehicleRows);
      setJobCards(jobRows);
      setAssignees(staffRows);
    }).catch((loadError) => {
      if (active) setError(loadError.message || "Unable to load follow-up options.");
    }).finally(() => {
      if (active) setOptionsLoading(false);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    Promise.all([
      getFollowups({ ...filters, page, size: PAGE_SIZE, sort: "dueDate,asc" }),
      getFollowupBucketCounts({
        status: filters.status,
        channel: filters.channel,
        type: filters.type,
        q: filters.q,
      }),
    ]).then(([result, counts]) => {
      if (!active) return;
      const rows = Array.isArray(result?.content) ? result.content : [];
      setFollowUps(rows.map((entry) => mapFollowup(entry, vehicles)));
      setTotalPages(result.totalPages || 0);
      setTotalElements(result.totalElements || 0);
      setBucketCounts(counts);
    }).catch((loadError) => {
      if (active) setError(loadError.message || "Unable to load follow-ups.");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [filters, page, refreshKey, vehicles]);

  useEffect(() => {
    let active = true;
    getFollowupDashboard()
      .then((stats) => {
        if (!active) return;
        setDashboard(stats);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || "Unable to load dashboard data.");
      });
    return () => { active = false; };
  }, [refreshKey]);

  useEffect(() => {
    let active = true;
    setFeedbackLoading(true);
    getFeedback(feedbackSearch, 0, 50)
      .then((feedbackPage) => {
        if (!active) return;
        setFeedback(feedbackPage?.content || []);
        setFeedbackTotal(feedbackPage?.totalElements || 0);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || "Unable to load feedback.");
      })
      .finally(() => {
        if (active) setFeedbackLoading(false);
      });
    return () => { active = false; };
  }, [feedbackSearch, refreshKey]);

  useEffect(() => {
    setPage(0);
  }, [activeTab, statusFilter, channelFilter, typeFilter, search]);

  const refresh = () => {
    setRefreshKey((current) => current + 1);
  };

  const handleSaveFollowUp = async (values) => {
    const request = {
      customerId: values.customerId,
      vehicleId: values.vehicleId,
      jobCardId: values.jobCardId,
      assignedUserId: values.assignedUserId,
      type: values.type,
      channel: values.channel,
      dueDate: values.dueDate,
      reminderAt: `${values.dueDate}T${values.dueTime}:00`,
      reason: values.reason.trim() || values.type,
      status: editingFollowUp?.backendStatus || "PENDING",
    };
    if (editingFollowUp) {
      await updateFollowup(editingFollowUp.recordId, request);
    } else {
      await createFollowup(request);
    }
    setShowSchedule(false);
    setSuccessMessage(editingFollowUp ? "Follow-up updated." : "Follow-up and reminder scheduled.");
    setEditingFollowUp(null);
    refresh();
    return "";
  };

  const handleComplete = async (entry) => {
    try {
      await completeFollowup(entry.recordId);
      setSuccessMessage(`${entry.id} marked completed.`);
      refresh();
    } catch (actionError) {
      setError(actionError.message || "Unable to complete follow-up.");
    }
  };

  const handleCancel = async (entry) => {
    try {
      await cancelFollowup(entry.recordId);
      setSuccessMessage(`${entry.id} cancelled.`);
      refresh();
    } catch (actionError) {
      setError(actionError.message || "Unable to cancel follow-up.");
    }
  };

  const openCommunication = async (entry) => {
    setSelectedFollowUp(entry);
    setMessageHistory([]);
    setReminderHistory([]);
    setShowCommunication(true);
    try {
      const [historyPage, reminderPage] = await Promise.all([
        getFollowupMessages(entry.recordId),
        getFollowupReminders(entry.recordId),
      ]);
      setMessageHistory(historyPage?.content || []);
      setReminderHistory(reminderPage?.content || []);
    } catch (loadError) {
      setError(loadError.message || "Unable to load communication history.");
    }
  };

  const handleRecordMessage = async (entry, payload) => {
    const id = entry.recordId;
    await recordFollowupMessage(id, payload);
    const updatedHistory = await getFollowupMessages(id);
    setMessageHistory(updatedHistory?.content || []);
    setSuccessMessage("Message recorded; no external message was sent.");
    refresh();
  };

  const handleRecordFeedback = async (values) => {
    await createFeedback(values);
    setShowFeedbackForm(false);
    setSuccessMessage("Customer feedback saved.");
    refresh();
  };

  const activeTabLabel =
    FOLLOW_UP_BUCKETS.find((bucket) => bucket.key === activeTab)?.label || "All Follow-ups";
  const filtersActive =
    Boolean(search.trim()) || statusFilter !== "ALL" ||
    channelFilter !== "ALL" || typeFilter !== "ALL";
  const emptyMessage = loading ? "Loading follow-ups..." : filtersActive
    ? "No follow-ups match the current search or filters."
    : `No ${activeTabLabel.toLowerCase()} found.`;
  const feedbackRating = dashboard.averageRating;

  const retention = useMemo(() => {
    const byCustomer = new Map(customers.map((customer) => [customer.id, {
      id: customer.id,
      customer: customer.name,
      phone: customer.phone,
      loyaltyTier: customer.loyaltyTier || "—",
      visits: 0,
      lastVisit: null,
    }]));
    jobCards.forEach((job) => {
      const customer = byCustomer.get(job.customerId);
      if (!customer || job.status !== "DELIVERED") return;
      customer.visits += 1;
      const date = job.completedDate || job.assignedDate;
      if (date && (!customer.lastVisit || date > customer.lastVisit)) customer.lastVisit = date;
    });
    return [...byCustomer.values()]
      .sort((a, b) => b.visits - a.visits || a.customer.localeCompare(b.customer))
      .map((customer) => ({
        ...customer,
        note: customer.phone || "Customer record",
      }));
  }, [customers, jobCards]);

  const retentionSummary = useMemo(() => retention.reduce((result, entry) => {
    if (entry.visits > 0) result.active += 1;
    else result.newCustomers += 1;
    return result;
  }, { active: 0, atRisk: 0, newCustomers: 0 }), [retention]);

  return (
    <>
      <div className="followup-page">
        <div className="followup-page-top">
          <div className="followup-page-title">
            <div className="followup-eyebrow">— FOLLOW-UP &amp; RETENTION</div>
            <h1>FOLLOW-UP &amp; RETENTION</h1>
            <p>Manage service reminders, customer communication, feedback, and retention.</p>
          </div>
          <div className="followup-page-actions">
            <button type="button" className="followup-action" onClick={() => {
              setSuccessMessage("");
              refresh();
            }} disabled={loading}>
              REFRESH
            </button>
            <button type="button" className="followup-new-button" onClick={() => setShowSchedule(true)}>
              + SCHEDULE FOLLOW-UP
            </button>
          </div>
        </div>

        {error && <div className="followup-feedback followup-feedback-error" role="alert">
          <span>{error}</span><button type="button" onClick={() => setError("")}>Dismiss</button>
        </div>}
        {successMessage && <div className="followup-feedback followup-feedback-success" role="status">
          <span>{successMessage}</span><button type="button" onClick={() => setSuccessMessage("")}>Dismiss</button>
        </div>}

        <FollowUpSummaryCards summary={{
          dueFollowUps: dashboard.dueFollowups,
          pendingReminders: dashboard.pendingReminders,
          feedbackReceived: dashboard.feedbackReceived,
          messagesSent: dashboard.messagesSent,
          averageRatingLabel: dashboard.feedbackReceived
            ? `Average rating ${feedbackRating.toFixed(1)} of 5`
            : "No ratings recorded yet",
        }} />

        <FollowUpToolbar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          bucketCounts={bucketCounts}
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          channelFilter={channelFilter}
          onChannelFilterChange={setChannelFilter}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          resultCount={followUps.length}
          totalCount={totalElements}
          activeTabLabel={activeTabLabel}
        />

        <FollowUpTable
          followUps={followUps}
          todayKey={toDateKey()}
          emptyMessage={emptyMessage}
          loading={loading}
          onOpenCommunication={openCommunication}
          onToggleComplete={handleComplete}
          onCancel={handleCancel}
          onEdit={(entry) => {
            setEditingFollowUp(entry);
            setShowSchedule(true);
          }}
        />
        {totalPages > 1 && <div className="followup-pagination">
          <button type="button" className="followup-action" disabled={page === 0 || loading}
            onClick={() => setPage((current) => Math.max(0, current - 1))}>Previous</button>
          <span>Page {page + 1} of {totalPages}</span>
          <button type="button" className="followup-action" disabled={page + 1 >= totalPages || loading}
            onClick={() => setPage((current) => current + 1)}>Next</button>
        </div>}

        <FeedbackPanel
          feedback={feedback}
          averageRatingValue={feedbackRating}
          totalCount={feedbackTotal}
          search={feedbackSearch}
          onSearchChange={setFeedbackSearch}
          onRecord={() => setShowFeedbackForm(true)}
          loading={feedbackLoading}
        />
        <RetentionPanel retention={retention} summary={retentionSummary} />
      </div>

      <ScheduleFollowUpModal
        open={showSchedule}
        initialFollowup={editingFollowUp}
        customers={customers}
        vehicles={vehicles}
        jobCards={jobCards}
        assignees={assignees}
        optionsLoading={optionsLoading}
        onClose={() => {
          setShowSchedule(false);
          setEditingFollowUp(null);
        }}
        onSave={handleSaveFollowUp}
      />
      <CommunicationModal
        open={showCommunication}
        followUp={selectedFollowUp}
        history={messageHistory}
        reminders={reminderHistory}
        onClose={() => setShowCommunication(false)}
        onSend={handleRecordMessage}
      />
      <RecordFeedbackModal
        open={showFeedbackForm}
        customers={customers}
        jobCards={jobCards.filter((job) => job.status === "DELIVERED")}
        onClose={() => setShowFeedbackForm(false)}
        onSave={handleRecordFeedback}
      />
    </>
  );
}

export default GarageOwnerFollowup;
