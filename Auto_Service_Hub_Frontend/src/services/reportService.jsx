import { fetchWithAuth } from "./api";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "/api/v1" : "http://localhost:8081/api/v1")
).replace(/\/+$/, "");

/* ==================================================================
   REPORTS & ANALYTICS — SRS FR-REP-1 .. FR-REP-8
   ================================================================== */

/**
 * Report slugs, exactly as ReportController and ReportExportController map them.
 *
 * Every report has two endpoints: a JSON one under /reports for the screen and a
 * PDF/Excel one under /reports/export for the download. The export endpoints
 * accept exactly the filters their JSON counterpart accepts and carry exactly the
 * same role guards, so a download can never be narrower, nor more permissive,
 * than the report it mirrors.
 */
export const REPORT_KEYS = {
  DAILY_WORKSHOP: "daily-workshop",
  REVENUE_PAYMENT: "revenue-payment",
  MECHANIC_PERFORMANCE: "mechanic-performance",
  PARTS_USAGE: "parts-usage",
  CUSTOMER_GROWTH: "customer-growth",
  PROFIT_ANALYSIS: "profit-analysis",
};

/** The two formats ReportExportService renders. */
const EXPORT_EXTENSIONS = { pdf: "pdf", xlsx: "xlsx" };
const EXPORT_CONTENT_TYPES = {
  pdf: "application/pdf",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

/**
 * Builds a query string from the filters that are actually set.
 *
 * Blank and nullish values are dropped rather than sent: the repository queries
 * read a null filter as "do not filter on this", but an empty string would arrive
 * as a filter on "" and match nothing at all.
 */
function buildQuery(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      return;
    }
    params.set(key, String(value));
  });

  const query = params.toString();
  return query ? `?${query}` : "";
}

/**
 * Reads one ApiResponse envelope.
 *
 * A 401/403 is surfaced with the HTTP status attached to the Error, so the page
 * can tell "your signed-in role cannot read this report" apart from a genuine
 * failure without having to pattern-match on message text.
 */
async function requestData(path, noun) {
  const url = `${API_BASE_URL}${path}`;
  let response;

  try {
    response = await fetchWithAuth(url);
  } catch (error) {
    // fetchWithAuth throws its own Error when a 401 refresh fails; that is a
    // session problem, not a connectivity one, so it is passed through intact.
    if (!(error instanceof TypeError)) {
      throw error;
    }
    throw new Error(
      `${noun} could not be requested from ${url}. Check that the backend is running.`
    );
  }

  let body;
  try {
    body = response.status === 204 ? null : await response.json();
  } catch {
    throw new Error(
      response.ok
        ? `${noun} returned invalid JSON (${response.status}).`
        : `${noun} request failed (${response.status}).`
    );
  }

  if (!response.ok) {
    const message = body?.message || `${noun} request failed (${response.status}).`;
    const failure = new Error(
      response.status === 401 || response.status === 403
        ? `${message} Sign in with an account whose role may read this report.`
        : message
    );
    failure.status = response.status;
    throw failure;
  }

  if (!body?.success || body.data === undefined) {
    throw new Error(body?.message || `${noun} returned an unexpected response.`);
  }

  return body.data;
}

/* ==================================================================
   JSON REPORTS — /api/v1/reports
   ================================================================== */

/** FR-REP-1: one day's jobs and status breakdown. `date` defaults to today. */
export const getDailyWorkshopReport = (filters = {}) =>
  requestData(
    `/reports/daily-workshop${buildQuery(filters)}`,
    "Daily workshop report"
  );

/** FR-REP-4: invoiced revenue alongside payments actually collected. */
export const getRevenuePaymentReport = (filters = {}) =>
  requestData(`/reports/revenue${buildQuery(filters)}`, "Revenue report");

/** FR-REP-2: one row per mechanic for the period. */
export const getMechanicPerformanceReport = (filters = {}) =>
  requestData(
    `/reports/mechanic-performance${buildQuery(filters)}`,
    "Mechanic performance report"
  );

/** FR-REP-3: parts consumed (OUT movements only) in the period. */
export const getPartsUsageReport = (filters = {}) =>
  requestData(`/reports/parts-usage${buildQuery(filters)}`, "Parts usage report");

/** FR-REP-5: new customers, returning customers and jobs in the period. */
export const getCustomerGrowthReport = (filters = {}) =>
  requestData(
    `/reports/customer-growth${buildQuery(filters)}`,
    "Customer growth report"
  );

/** FR-REP-4: revenue, the cost that exists and the stated limits. */
export const getProfitAnalysisReport = (filters = {}) =>
  requestData(
    `/reports/profit-analysis${buildQuery(filters)}`,
    "Profit analysis report"
  );

/* ==================================================================
   PDF / EXCEL EXPORTS — /api/v1/reports/export
   ================================================================== */

/**
 * The filename is sent as RFC 5987 `filename*=UTF-8''...` by Spring's
 * ContentDisposition builder, and falls back to a quoted `filename="..."`.
 */
function parseContentDispositionFilename(header) {
  if (!header) {
    return null;
  }

  const extended = header.match(/filename\*=UTF-8''([^;]+)/i);
  if (extended) {
    try {
      return decodeURIComponent(extended[1].trim());
    } catch {
      return extended[1].trim();
    }
  }

  const quoted = header.match(/filename="([^"]+)"/i);
  if (quoted) {
    return quoted[1];
  }

  const bare = header.match(/filename=([^;]+)/i);
  return bare ? bare[1].trim() : null;
}

async function responseErrorMessage(response) {
  let responseText;
  try {
    responseText = await response.text();
  } catch {
    return `Report export failed (${response.status} ${response.statusText}).`;
  }

  if (!responseText) {
    return `Report export failed (${response.status} ${response.statusText}).`;
  }

  try {
    const body = JSON.parse(responseText);
    if (typeof body === "string") {
      return body;
    }
    return body?.message || body?.error ||
      `Report export failed (${response.status} ${response.statusText}).`;
  } catch {
    const plainText = responseText.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    return plainText.slice(0, 500) ||
      `Report export failed (${response.status} ${response.statusText}).`;
  }
}

function hasBytesAtStart(bytes, signature) {
  return signature.every((byte, index) => bytes[index] === byte);
}

function hasZipEndRecord(bytes) {
  const searchStart = Math.max(0, bytes.length - 65557);
  for (let index = bytes.length - 4; index >= searchStart; index -= 1) {
    if (
      bytes[index] === 0x50 &&
      bytes[index + 1] === 0x4b &&
      bytes[index + 2] === 0x05 &&
      bytes[index + 3] === 0x06
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Downloads one report as PDF or Excel. The caller may pass either the
 * REPORT_KEYS property name or its URL slug.
 *
 * Fetched through the authenticated client rather than pointed at with a plain
 * link, so the request carries the same Bearer token (and the same 401
 * refresh/retry) as every other call in the app.
 *
 * Resolves to `{ blob, filename }`; the caller owns the browser download because
 * it also owns the button state and the success message.
 */
export async function downloadReportExport(reportKey, format, filters = {}) {
  const slug =
    REPORT_KEYS[reportKey] ||
    (Object.values(REPORT_KEYS).includes(reportKey) ? reportKey : null);
  if (!slug) {
    throw new Error(`Unknown report "${reportKey}" cannot be exported.`);
  }

  const extension = EXPORT_EXTENSIONS[format];
  if (!extension) {
    throw new Error(`Unsupported export format "${format}".`);
  }
  const expectedContentType = EXPORT_CONTENT_TYPES[format];

  const url =
    `${API_BASE_URL}/reports/export/${slug}.${extension}` + buildQuery(filters);
  let response;

  try {
    response = await fetchWithAuth(url);
  } catch (error) {
    if (!(error instanceof TypeError)) {
      throw error;
    }
    throw new Error(`Unable to reach the report export endpoint at ${url}.`);
  }

  if (!response.ok) {
    const message = await responseErrorMessage(response);
    if (response.status === 401 || response.status === 403) {
      throw new Error(
        `${message} Sign in with an account whose role may export this report.`
      );
    }

    throw new Error(message);
  }

  const contentType = (response.headers.get("Content-Type") || "")
    .split(";", 1)[0]
    .trim()
    .toLowerCase();
  if (contentType !== expectedContentType) {
    const message =
      contentType.includes("json") ||
      contentType.includes("text") ||
      contentType.includes("html")
        ? await responseErrorMessage(response)
        : `Report export returned ${contentType || "an unknown content type"} instead of ${expectedContentType}.`;
    throw new Error(
      message
    );
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length === 0) {
    throw new Error("The report export returned an empty file.");
  }

  if (format === "pdf") {
    const pdfText = new TextDecoder("ascii").decode(bytes);
    const hasPdfHeader = hasBytesAtStart(bytes, [0x25, 0x50, 0x44, 0x46, 0x2d]);
    const hasPdfPage = /\/Type\s*\/Page\b/.test(pdfText);
    const hasPdfEndMarker = pdfText.lastIndexOf("%%EOF") >= Math.max(0, pdfText.length - 2048);
    if (!hasPdfHeader || !hasPdfPage || !hasPdfEndMarker) {
      throw new Error("The report service returned an invalid or incomplete PDF.");
    }
  } else if (
    !hasBytesAtStart(bytes, [0x50, 0x4b, 0x03, 0x04]) ||
    !hasZipEndRecord(bytes)
  ) {
    throw new Error("The report service returned an invalid Excel workbook.");
  }

  const filenameHeader = parseContentDispositionFilename(
    response.headers.get("Content-Disposition")
  );
  const filename =
    filenameHeader && filenameHeader.toLowerCase().endsWith(`.${extension}`)
      ? filenameHeader
      : `${slug}.${extension}`;
  const blob = new Blob([bytes], { type: expectedContentType });

  return { blob, filename };
}
