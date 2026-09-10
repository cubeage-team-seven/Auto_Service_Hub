import api from "./api";

export const getVehicles = async (page = 0, size = 20) => {
  const { data } = await api.get(`/vehicles?page=${page}&size=${size}`);
  return data.data;
};

export const getVehicle = async (id) => {
  const { data } = await api.get(`/vehicles/${id}`);
  return data.data;
};

export const createVehicle = async (payload) => {
  const { data } = await api.post("/vehicles", payload);
  return data.data;
};

export const updateVehicle = async (id, payload) => {
  const { data } = await api.put(`/vehicles/${id}`, payload);
  return data.data;
};
