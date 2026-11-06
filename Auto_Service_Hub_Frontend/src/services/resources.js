import { api, getAllPages } from "./api";

export const customersApi = {
  list: () => getAllPages("/customers"),
  get: (id) => api.get(`/customers/${id}`),
  create: (payload) => api.post("/customers", payload),
  update: (id, payload) => api.put(`/customers/${id}`, payload),
  deactivate: (id) => api.patch(`/customers/${id}/deactivate`),
  vehicles: (id) => api.get(`/customers/${id}/vehicles`),
};

export const accessRequestsApi = {
  submit: (payload) => api.post("/access-requests", payload),
};

export const adminApi = {
  users: () => api.get("/admin/users"),
  createUser: (payload) => api.post("/admin/users", payload),
  accessRequests: () => api.get("/admin/access-requests"),
  approveAccessRequest: (id, payload) => api.post(`/admin/access-requests/${id}/approve`, payload),
  rejectAccessRequest: (id, payload) => api.post(`/admin/access-requests/${id}/reject`, payload),
};

export const vehiclesApi = {
  list: () => getAllPages("/vehicles"),
  get: (id) => api.get(`/vehicles/${id}`),
  create: (payload) => api.post("/vehicles", payload),
  update: (id, payload) => api.put(`/vehicles/${id}`, payload),
  serviceHistory: (id) => api.get(`/vehicles/${id}/service-history`),
};

export const appointmentsApi = {
  list: () => getAllPages("/appointments"),
  get: (id) => api.get(`/appointments/${id}`),
  create: (payload) => api.post("/appointments", payload),
  update: (id, payload) => api.put(`/appointments/${id}`, payload),
  delete: (id) => api.delete(`/appointments/${id}`),
};

export const jobCardsApi = {
  list: () => getAllPages("/job-cards"),
  get: (id) => api.get(`/job-cards/${id}`),
  create: (payload) => api.post("/job-cards", payload),
  update: (id, payload) => api.put(`/job-cards/${id}`, payload),
  tasks: (id) => getAllPages(`/job-cards/${id}/tasks`),
  createTask: (id, payload) => api.post(`/job-cards/${id}/tasks`, payload),
};

export const mechanicsApi = {
  list: () => getAllPages("/mechanics"),
  get: (id) => api.get(`/mechanics/${id}`),
  create: (payload) => api.post("/mechanics", payload),
  update: (id, payload) => api.put(`/mechanics/${id}`, payload),
};

export const partsApi = {
  list: () => getAllPages("/parts"),
  lowStock: () => getAllPages("/parts/low-stock"),
  create: (payload) => api.post("/parts", payload),
  update: (id, payload) => api.put(`/parts/${id}`, payload),
  stockMovement: (id, payload) => api.post(`/parts/${id}/stock-movements`, payload),
};

export const invoicesApi = {
  list: () => getAllPages("/invoices"),
  get: (id) => api.get(`/invoices/${id}`),
  create: (payload) => api.post("/invoices", payload),
  update: (id, payload) => api.put(`/invoices/${id}`, payload),
};

export const estimatesApi = {
  list: () => getAllPages("/estimates"),
  create: (payload) => api.post("/estimates", payload),
  update: (id, payload) => api.put(`/estimates/${id}`, payload),
  convert: (id) => api.post(`/estimates/${id}/convert`),
};

export const paymentsApi = {
  list: () => getAllPages("/payments"),
  forInvoice: (id) => getAllPages(`/payments/invoice/${id}`),
  create: (payload) => api.post("/payments", payload),
};

export const servicePackagesApi = {
  list: () => getAllPages("/service-packages"),
  create: (payload) => api.post("/service-packages", payload),
  update: (id, payload) => api.put(`/service-packages/${id}`, payload),
};

export const followupsApi = {
  list: () => getAllPages("/followups"),
  pending: () => getAllPages("/followups/pending"),
  due: () => getAllPages("/followups/due"),
  create: (payload) => api.post("/followups", payload),
  update: (id, payload) => api.put(`/followups/${id}`, payload),
};

export const dashboardApi = {
  summary: () => api.get("/dashboard/summary"),
};

export const reportsApi = {
  get: (name, params) => api.get(`/reports/${name}`, params),
};

export const aiApi = {
  get: (feature, params) => api.get(`/ai/${feature}`, params),
  post: (feature, payload) => api.post(`/ai/${feature}`, payload),
  upload: (feature, formData) => api.upload(`/ai/${feature}`, formData),
};
