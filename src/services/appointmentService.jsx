import api from "./api";

export const getAppointments = async (page = 0, size = 20) => {
  const { data } = await api.get(`/appointments?page=${page}&size=${size}`);
  return data.data;
};

export const getAppointment = async (id) => {
  const { data } = await api.get(`/appointments/${id}`);
  return data.data;
};

export const createAppointment = async (payload) => {
  const { data } = await api.post("/appointments", payload);
  return data.data;
};

export const updateAppointment = async (id, payload) => {
  const { data } = await api.put(`/appointments/${id}`, payload);
  return data.data;
};

export const deleteAppointment = async (id) => {
  await api.delete(`/appointments/${id}`);
};
