import { api } from "./api";

export async function login(username, password) {
  const result = await api.post("/auth/login", { username, password });
  if (!result?.accessToken) {
    throw new Error("The server did not return an access token.");
  }

  localStorage.setItem("accessToken", result.accessToken);
  if (result.refreshToken) localStorage.setItem("refreshToken", result.refreshToken);
  const user = {
    username: result.username || username,
    role: String(result.role || "").replace(/^ROLE_/, "").toUpperCase(),
    fullName: result.fullName || "",
  };
  localStorage.setItem("user", JSON.stringify(user));
  return user;
}

export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
}

export function getUser() {
  const serialized = localStorage.getItem("user");
  if (!serialized) return null;

  try {
    const user = JSON.parse(serialized);
    if (!user?.role) {
      logout();
      return null;
    }
    return user;
  } catch {
    logout();
    return null;
  }
}
