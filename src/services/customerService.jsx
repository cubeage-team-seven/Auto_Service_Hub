import api from "./api";

export const getCustomers = async (page = 0, size = 20) => {
  const { data } = await api.get(`/customers?page=${page}&size=${size}`);
  return data.data;
};

export const getCustomer = async (id) => {
  const { data } = await api.get(`/customers/${id}`);
  return data.data;
};

export const createCustomer = async (payload) => {
  const { data } = await api.post("/customers", payload);
  return data.data;
};

export const updateCustomer = async (id, payload) => {
  const { data } = await api.put(`/customers/${id}`, payload);
  return data.data;
};

export const deleteCustomer = async (id) => {
  await api.delete(`/customers/${id}`);
};
