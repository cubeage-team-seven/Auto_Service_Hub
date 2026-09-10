import api from "./api";

export const getParts = async (page = 0, size = 50) => {
  const { data } = await api.get(`/parts?page=${page}&size=${size}`);
  return data.data;
};

export const getPart = async (id) => {
  const { data } = await api.get(`/parts/${id}`);
  return data.data;
};

export const createPart = async (payload) => {
  const { data } = await api.post("/parts", payload);
  return data.data;
};

export const updatePart = async (id, payload) => {
  const { data } = await api.put(`/parts/${id}`, payload);
  return data.data;
};

export const deletePart = async (id) => {
  await api.delete(`/parts/${id}`);
};
