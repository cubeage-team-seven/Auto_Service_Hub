import { fetchWithAuth } from "./api";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "/api/v1" : "http://localhost:8081/api/v1")
).replace(/\/+$/, "");

async function getData(path, options = {}) {
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
    throw new Error(`Unable to reach the mechanic API at ${url}.${detail}`);
  }

  let payload;
  try {
    payload = response.status === 204 ? null : await response.json();
  } catch {
    throw new Error(
      response.ok
        ? `Mechanic API returned invalid JSON (${response.status}) for ${options.method || "GET"} ${url}.`
        : `${options.method || "GET"} ${url} failed with HTTP ${response.status}.`
    );
  }

  if (!response.ok) {
    const message = payload?.message || payload?.error || "No error message was returned.";
    throw new Error(
      `${options.method || "GET"} ${url} failed with HTTP ${response.status}: ${message}`
    );
  }

  if (response.status === 204) return null;
  if (!payload?.success || payload.data === undefined) {
    throw new Error(payload?.message || "Mechanic API returned an unexpected response.");
  }
  return payload.data;
}

async function getPages(path, sort) {
  const results = [];
  for (let pageNumber = 0; ; pageNumber += 1) {
    const page = await getData(
      `${path}?page=${pageNumber}&size=100&sort=${encodeURIComponent(sort)}`
    );
    if (Array.isArray(page)) return page;
    if (!Array.isArray(page?.content)) {
      throw new Error("Mechanic API returned an unexpected page format.");
    }
    results.push(...page.content);
    if (pageNumber + 1 >= (page.totalPages ?? 1) || page.content.length === 0) {
      return results;
    }
  }
}

export const getMechanics = () => getPages("/mechanics", "name,asc");
export const getUnlinkedMechanicProfiles = async () => {
  const profiles = await getData("/mechanics/unlinked-profiles");
  if (!Array.isArray(profiles)) {
    throw new Error("Mechanic API returned an unexpected profile list.");
  }
  return profiles;
};
export const getUnlinkedMechanicAccounts = async () => {
  const accounts = await getData("/mechanics/unlinked-accounts");
  if (!Array.isArray(accounts)) {
    throw new Error("Mechanic API returned an unexpected account list.");
  }
  return accounts;
};
export const associateMechanicUser = (mechanicId, userId) =>
  getData(`/mechanics/${mechanicId}/user`, {
    method: "PUT",
    body: JSON.stringify({ userId: Number(userId) }),
  });
export const getMechanicAttendance = (date) =>
  getData(`/attendance?from=${encodeURIComponent(date)}&to=${encodeURIComponent(date)}`);
export const getMechanicPerformance = (from, to) =>
  getData(`/reports/mechanic-performance?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
export const createMechanic = (mechanic) =>
  getData("/mechanics", { method: "POST", body: JSON.stringify(mechanic) });
export const updateMechanic = (id, mechanic) =>
  getData(`/mechanics/${id}`, { method: "PUT", body: JSON.stringify(mechanic) });