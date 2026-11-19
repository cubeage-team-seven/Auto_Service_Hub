import { fetchWithAuth } from "./api";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "/api/v1" : "http://localhost:8081/api/v1")
).replace(/\/+$/, "");

async function requestData(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  let response;
  try {
    response = await fetchWithAuth(url, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  } catch (error) {
    const detail = error instanceof Error ? ` (${error.message})` : "";
    throw new Error(`Unable to reach the follow-up API at ${url}.${detail}`);
  }

  let body;
  try {
    body = response.status === 204 ? null : await response.json();
  } catch {
    throw new Error(
      response.ok
        ? `Follow-up API returned invalid JSON (${response.status}).`
        : `Follow-up API request failed (${response.status}).`
    );
  }
  if (!response.ok) {
    const message = body?.message || `Follow-up API request failed (${response.status}).`;
    if (response.status === 401 || response.status === 403) {
      throw new Error(`${message} Sign in with an authorized account and try again.`);
    }
    throw new Error(message);
  }
  if (response.status === 204) return null;
  if (!body?.success || body.data === undefined) {
    throw new Error(body?.message || "Follow-up API returned an unexpected response.");
  }
  return body.data;
}

const paramsFor = (values) => {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });
  return params.toString();
};

const sendJson = (method, body) => ({
  method,
  body: JSON.stringify(body),
});

export const getFollowups = (filters = {}) =>
  requestData(`/followups?${paramsFor(filters)}`);
export const getFollowupBucketCounts = async (filters = {}) => {
  const buckets = ["all", "due-today", "upcoming", "overdue", "completed"];
  const pages = await Promise.all(
    buckets.map((bucket) => getFollowups({ ...filters, bucket, page: 0, size: 1 }))
  );
  return Object.fromEntries(
    buckets.map((bucket, index) => [bucket, pages[index].totalElements || 0])
  );
};

export const getFollowupDashboard = () => requestData("/followups/dashboard");
export const getFollowupAssignees = () => requestData("/followups/assignees");
export const createFollowup = (values) =>
  requestData("/followups", sendJson("POST", values));
export const updateFollowup = (id, values) =>
  requestData(`/followups/${id}`, sendJson("PUT", values));
export const completeFollowup = (id) =>
  requestData(`/followups/${id}/complete`, { method: "PATCH" });
export const cancelFollowup = (id) =>
  requestData(`/followups/${id}/cancel`, { method: "PATCH" });
export const rescheduleFollowup = (id, reminderAt) =>
  requestData(`/followups/${id}/reschedule`, sendJson("PATCH", { reminderAt }));
export const getFollowupReminders = (id, page = 0, size = 20) =>
  requestData(`/followups/${id}/reminders?page=${page}&size=${size}&sort=createdAt,desc`);
export const getFollowupMessages = (id, page = 0, size = 20) =>
  requestData(`/followups/${id}/messages?page=${page}&size=${size}&sort=createdAt,desc`);
export const recordFollowupMessage = (id, message) =>
  requestData(`/followups/${id}/messages`, sendJson("POST", message));
export const getFeedback = (query = "", page = 0, size = 50) =>
  requestData(`/feedback?${paramsFor({ q: query, page, size, sort: "createdAt,desc" })}`);
export const createFeedback = (feedback) =>
  requestData("/feedback", sendJson("POST", feedback));