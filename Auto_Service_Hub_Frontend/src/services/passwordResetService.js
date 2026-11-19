import { api } from "./api";

export function requestPasswordReset(email) {
  return api.post("/auth/forgot-password", { email });
}

export function verifyPasswordResetOtp(email, otp) {
  return api.post("/auth/verify-otp", { email, otp });
}

export function resetPassword(email, resetToken, newPassword, confirmPassword) {
  return api.post("/auth/reset-password", {
    email,
    resetToken,
    newPassword,
    confirmPassword,
  });
}
