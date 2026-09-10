import api from "./api";

export const getJobCards = async (page = 0, size = 20) => {
  const { data } = await api.get(`/job-cards?page=${page}&size=${size}`);
  return data.data;
};

export const getJobCard = async (id) => {
  const { data } = await api.get(`/job-cards/${id}`);
  return data.data;
};

export const createJobCard = async (payload) => {
  const { data } = await api.post("/job-cards", payload);
  return data.data;
};

export const updateJobCard = async (id, payload) => {
  const { data } = await api.put(`/job-cards/${id}`, payload);
  return data.data;
};

export const deleteJobCard = async (id) => {
  await api.delete(`/job-cards/${id}`);
};
