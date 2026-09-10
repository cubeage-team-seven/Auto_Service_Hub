import api from "./api";

export const getMechanics = async (page = 0, size = 20) => {
  const { data } = await api.get(`/mechanics?page=${page}&size=${size}`);
  return data.data;
};

export const getMechanic = async (id) => {
  const { data } = await api.get(`/mechanics/${id}`);
  return data.data;
};

export const createMechanic = async (payload) => {
  const { data } = await api.post("/mechanics", payload);
  return data.data;
};

export const updateMechanic = async (id, payload) => {
  const { data } = await api.put(`/mechanics/${id}`, payload);
  return data.data;
};
