import api from "./api";

export const login = async (username, password) => {
  const { data } = await api.post("/auth/login", { username, password });
  const { accessToken } = data.data;
  localStorage.setItem("token", accessToken);
  localStorage.setItem("user", JSON.stringify({ username }));
  return data.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getUser = () => {
  const u = localStorage.getItem("user");
  return u ? JSON.parse(u) : null;
};

export const isAuthenticated = () => !!localStorage.getItem("token");
