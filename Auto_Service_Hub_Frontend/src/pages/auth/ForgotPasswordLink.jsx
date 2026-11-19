import React from "react";
import { Link } from "react-router-dom";

export default function ForgotPasswordLink({ loginPath, className = "forgot-password-link" }) {
  return (
    <Link
      to="/forgot-password"
      state={{ loginPath }}
      className={className}
    >
      Forgot password?
    </Link>
  );
}
