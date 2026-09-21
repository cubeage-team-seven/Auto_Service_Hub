import api from "./api";

export const getInvoices = async (page = 0, size = 20) => {
  const { data } = await api.get(`/invoices?page=${page}&size=${size}`);
  return data.data;
};

export const getInvoice = async (id) => {
  const { data } = await api.get(`/invoices/${id}`);
  return data.data;
};

export const createInvoice = async (payload) => {
  const { data } = await api.post("/invoices", payload);
  return data.data;
};

export const updateInvoice = async (id, payload) => {
  const { data } = await api.put(`/invoices/${id}`, payload);
  return data.data;
};
