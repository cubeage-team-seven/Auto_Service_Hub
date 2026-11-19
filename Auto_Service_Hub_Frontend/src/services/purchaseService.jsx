import { fetchWithAuth } from "./api";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "/api/v1" : "http://localhost:8081/api/v1")
).replace(/\/+$/, "");

/**
 * Purchasing calls (FR-INV-2).
 *
 * Successful calls are wrapped by the backend in ApiResponse<T>
 * ({ success, message, data }). Failures are NOT wrapped - GlobalExceptionHandler
 * returns a bare ApiErrorResponse ({ code, message, correlationId, timestamp }).
 * Both shapes carry a `message`, so one read path handles either.
 */
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
    throw new Error(`Unable to reach the purchase API at ${url}.${detail}`);
  }

  let body = null;
  try {
    body = response.status === 204 ? null : await response.json();
  } catch {
    if (!response.ok) {
      throw new Error(
        `Purchase API request failed (${response.status} ${response.statusText}).`
      );
    }
    throw new Error(`Purchase API returned invalid JSON (${response.status}).`);
  }

  if (!response.ok) {
    const message =
      body?.message ||
      `Purchase API request failed (${response.status} ${response.statusText}).`;

    if (response.status === 401 || response.status === 403) {
      throw new Error(`${message} Sign in with an authorized account and try again.`);
    }

    if (body?.correlationId) {
      throw new Error(`${message} (Reference: ${body.correlationId})`);
    }

    throw new Error(message);
  }

  if (!body?.success || body.data == null) {
    throw new Error(body?.message || "Purchase API returned an unexpected response.");
  }

  return body.data;
}

/**
 * POST /api/v1/purchases
 *
 * Body follows PurchaseRequestDTO exactly: { supplierId, purchaseDate?, items:
 * [{ partId, quantity, unitPrice }] }. The total is calculated server-side from
 * the lines, so no total is ever sent. Returns PurchaseResponseDTO (id,
 * supplierName, purchaseDate, totalAmount, status PENDING, items).
 */
export function createPurchase({ supplierId, purchaseDate, items }) {
  const payload = {
    supplierId: Number(supplierId),
    items: (Array.isArray(items) ? items : []).map((item) => ({
      partId: Number(item.partId),
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
    })),
  };
  if (purchaseDate) payload.purchaseDate = purchaseDate;
  return requestData("/purchases", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
