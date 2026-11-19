import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getErrorMessage } from "../services/api";

const normalizeRole = (role) => {
  const normalized = String(role || "").replace(/^ROLE_/i, "").toUpperCase();
  return normalized === "GARAGE_OWNER" ? "OWNER" : normalized;
};

export function useApiLogin(redirectPath, roleRedirectOverrides = {}, expectedRole, workspace) {
  const { login, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event, username, password, rememberMe) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(username.trim(), password, rememberMe, workspace);
      const role = normalizeRole(user.role);
      const expectedRoles = expectedRole
        ? (Array.isArray(expectedRole) ? expectedRole : [expectedRole]).map(normalizeRole)
        : [];
      if (expectedRoles.length && !expectedRoles.includes(role)) {
        logout();
        setError(
          `This account is assigned to ${role || "another role"}, not ${expectedRoles.join(" or ")}. Sign in with an allowed account.`
        );
        return;
      }
      const roleRedirects = {
        ADMIN: "/admin",
        OWNER: "/garage-owner/dashboard",
        MANAGER: "/garage-owner/dashboard",
        GARAGE_OWNER: "/garage-owner/dashboard",
        SERVICE_ADVISOR: "/service-advisor",
        MECHANIC: "/mechanic-dashboard",
        INVENTORY_MANAGER: "/inventory-dashboard",
        BILLING_USER: "/billing/dashboard",
        CUSTOMER: "/customer-dashboard",
        ...roleRedirectOverrides,
      };
      navigate(roleRedirects[role] || redirectPath);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Sign in failed."));
    } finally {
      setLoading(false);
    }
  };

  const submitForm = (event) => {
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") || formData.get("email");
    const password = formData.get("password");
    const rememberMe = formData.get("rememberMe") === "on";
    void submit(event, String(username || ""), String(password || ""), rememberMe);
  };

  return { submit, submitForm, error, loading };
}
