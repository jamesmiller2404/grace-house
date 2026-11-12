import React from "react";

const LoginNotice = () => (
  <div
    role="note"
    style={{
      background: "var(--theme-elevation-50)",
      borderLeft: "3px solid var(--theme-elevation-400)",
      borderRadius: "2px",
      color: "var(--theme-elevation-800)",
      fontSize: "0.875rem",
      lineHeight: 1.5,
      marginBottom: "1.5rem",
      padding: "0.75rem 1rem",
    }}
  >
    <strong>Sign-in security:</strong> After 5 unsuccessful login attempts, your
    account is temporarily locked for 10 minutes. Your sign-in session expires
    after 2 hours, and you will need to log in again.
  </div>
);

export default LoginNotice;
