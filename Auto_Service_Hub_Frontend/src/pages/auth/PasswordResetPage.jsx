import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  requestPasswordReset,
  resetPassword,
  verifyPasswordResetOtp,
} from "../../services/passwordResetService";
import { useAuth } from "../../hooks/useAuth";
import "./PasswordResetPage.css";

const LOGIN_PATHS = new Set([
  "/garage-owner-login",
  "/service-advisor-login",
  "/mechanic",
  "/inventory-login",
  "/billing",
  "/customers",
  "/admin-login",
  "/developer-login",
]);

const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])[\x21-\x7E]{12,72}$/;

const GENERIC_REQUEST_MESSAGE =
  "If an account exists for this email, password reset instructions will be sent.";

function getErrorMessage(error, fallback) {
  return error instanceof Error && error.message ? error.message : fallback;
}

function PasswordResetPage() {
  const location = useLocation();
  const { logout } = useAuth();
  const requestedLoginPath = location.state?.loginPath;
  const loginPath = LOGIN_PATHS.has(requestedLoginPath)
    ? requestedLoginPath
    : "/modules";

  const [step, setStep] = useState("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [resendUntil, setResendUntil] = useState(0);
  const [resendSeconds, setResendSeconds] = useState(0);

  useEffect(() => {
    if (!resendUntil) return undefined;
    const updateCountdown = () => {
      setResendSeconds(Math.max(0, Math.ceil((resendUntil - Date.now()) / 1000)));
    };
    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(timer);
  }, [resendUntil]);

  const sendOtp = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setBusy(true);
    try {
      await requestPasswordReset(email.trim());
      setStep("verify");
      setNotice(GENERIC_REQUEST_MESSAGE);
      setResendUntil(Date.now() + 60_000);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to process the request. Try again."));
    } finally {
      setBusy(false);
    }
  };

  const resendOtp = async () => {
    setError("");
    setNotice("");
    setBusy(true);
    try {
      await requestPasswordReset(email.trim());
      setNotice(GENERIC_REQUEST_MESSAGE);
      setOtp("");
      setResendUntil(Date.now() + 60_000);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to process the request. Try again."));
    } finally {
      setBusy(false);
    }
  };

  const verifyOtp = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setBusy(true);
    try {
      const token = await verifyPasswordResetOtp(email.trim(), otp.trim());
      if (typeof token !== "string" || token.length < 32) {
        throw new Error("The server did not return valid reset authorization.");
      }
      setResetToken(token);
      setOtp("");
      setStep("reset");
    } catch (requestError) {
      setError(getErrorMessage(requestError, "The reset code is invalid or expired."));
    } finally {
      setBusy(false);
    }
  };

  const submitNewPassword = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    if (!PASSWORD_PATTERN.test(newPassword)) {
      setError(
        "Use 12–72 printable characters with an uppercase letter, a lowercase letter, a number, and a symbol."
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      await resetPassword(email.trim(), resetToken, newPassword, confirmPassword);
      logout();
      setResetToken("");
      setNewPassword("");
      setConfirmPassword("");
      setStep("success");
      setNotice("Your password has been reset successfully.");
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to reset the password. Try again."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="password-reset-page">
      <section className="password-reset-card">
        <Link className="password-reset-back" to={loginPath}>
          ← Back to sign in
        </Link>
        <div className="password-reset-brand">AUTO SERVICE HUB</div>

        {step === "request" && (
          <>
            <h1>Forgot password?</h1>
            <p className="password-reset-description">
              Enter your registered email address. If an account exists, we’ll send a reset code.
            </p>
            <form className="password-reset-form" onSubmit={sendOtp}>
              <label>
                Email address
                <input
                  type="email"
                  autoComplete="email"
                  maxLength={150}
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>
              {error && <p className="password-reset-error" role="alert">{error}</p>}
              <button type="submit" disabled={busy}>
                {busy ? "SENDING..." : "SEND RESET CODE"}
              </button>
            </form>
          </>
        )}

        {step === "verify" && (
          <>
            <h1>Verify your email</h1>
            <p className="password-reset-description">
              Enter the six-digit code if one was sent. Codes expire after 10 minutes.
            </p>
            {notice && <p className="password-reset-notice" role="status">{notice}</p>}
            <form className="password-reset-form" onSubmit={verifyOtp}>
              <label>
                Verification code
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                />
              </label>
              {error && <p className="password-reset-error" role="alert">{error}</p>}
              <button type="submit" disabled={busy || otp.length !== 6}>
                {busy ? "VERIFYING..." : "VERIFY CODE"}
              </button>
            </form>
            <button
              className="password-reset-resend"
              type="button"
              disabled={busy || resendSeconds > 0}
              onClick={resendOtp}
            >
              {resendSeconds > 0 ? `Resend code in ${resendSeconds}s` : "Resend code"}
            </button>
          </>
        )}

        {step === "reset" && (
          <>
            <h1>Set a new password</h1>
            <p className="password-reset-description">
              Choose a strong password you have not used for this account.
            </p>
            <form className="password-reset-form" onSubmit={submitNewPassword}>
              <label>
                New password
                <input
                  type="password"
                  autoComplete="new-password"
                  minLength={12}
                  maxLength={72}
                  required
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                />
              </label>
              <label>
                Confirm new password
                <input
                  type="password"
                  autoComplete="new-password"
                  minLength={12}
                  maxLength={72}
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </label>
              <p className="password-reset-hint">
                12–72 printable characters, including uppercase and lowercase letters, a number, and a symbol.
              </p>
              {error && <p className="password-reset-error" role="alert">{error}</p>}
              <button type="submit" disabled={busy}>
                {busy ? "RESETTING..." : "RESET PASSWORD"}
              </button>
            </form>
          </>
        )}

        {step === "success" && (
          <div className="password-reset-success">
            <h1>Password reset complete</h1>
            <p className="password-reset-notice" role="status">{notice}</p>
            <p>You can now sign in with your new password.</p>
            <Link className="password-reset-primary-link" to={loginPath}>
              Return to sign in
            </Link>
          </div>
        )}

        {step !== "success" && (
          <Link className="password-reset-secondary-link" to={loginPath}>
            Return to sign in
          </Link>
        )}
      </section>
    </main>
  );
}

export default PasswordResetPage;
