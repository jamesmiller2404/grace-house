"use client";

import { Button, Link, useAuth, useConfig } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import React, { useState } from "react";

/**
 * Custom forgot-password view — registered in payload.config.ts under
 * `admin.components.views.forgot`, which replaces Payload's stock
 * /admin/forgot page (the custom view wins over the built-in one).
 *
 * Why: the stock flow always shows "check your email" regardless of whether
 * the email exists, so a typo sends an editor on a wild goose chase. This
 * form first asks /api/users/check-email (see src/payload/collections/Users.ts)
 * whether the email belongs to a real admin user. When it does not, an error
 * is shown right under the field. Only when a matching account exists does
 * the form post to the stock /api/users/forgot-password endpoint, which
 * sends the reset link via Gmail.
 */

const css = `
.gh-forgot-email {
  background: var(--theme-input-bg);
  border: 1px solid var(--theme-elevation-250);
  border-radius: var(--style-radius-s, 3px);
  color: var(--theme-elevation-800);
  font: inherit;
  font-size: 1rem;
  padding: 10px 15px;
  width: 100%;
}
.gh-forgot-email:focus {
  border-color: var(--theme-elevation-400);
  outline: none;
}
.gh-forgot-error {
  color: var(--theme-error-600);
  margin: 8px 0 0;
}
.gh-forgot-hint {
  color: var(--theme-elevation-500);
  font-size: 0.85rem;
  margin: 12px 0 0;
}
`;

function ForgotPasswordView() {
  const {
    config: {
      admin: {
        routes: { login: loginRoute },
      },
      routes: { admin: adminRoute, api: apiRoute },
    },
  } = useConfig();
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Same behaviour as the stock page when a user is already logged in.
  if (user) {
    return (
      <div className="forgot-password">
        <div className="form-header">
          <h1>Already Logged In</h1>
          <p>To change your password, please go to your account settings.</p>
        </div>
        <Button buttonStyle="secondary" el="link" size="large" to={adminRoute}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;
    const value = email.trim();
    setError("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      // First ask the server whether this email belongs to an admin user —
      // unlike the stock flow, a typo should not produce a success screen.
      const check = await fetch(`${apiRoute}/users/check-email`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      const { exists } = (await check.json()) as { exists?: boolean };
      if (!check.ok || !exists) {
        setError(
          "No admin account uses that email address — check for typos and try again.",
        );
        return;
      }

      const res = await fetch(`${apiRoute}/users/forgot-password`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      if (!res.ok) {
        setError("The reset email could not be sent — please try again.");
        return;
      }
      setSent(true);
    } catch {
      setError("Something went wrong — please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="forgot-password">
      <style>{css}</style>
      {sent ? (
        <div className="forgot-password__form">
          <div className="form-header">
            <h1>Email Sent</h1>
            <p>
              Check your email for a link to reset your password. The link is
              valid for one hour.
            </p>
          </div>
          <div className="forgot-password__form__actions">
            <Link href={formatAdminURL({ adminRoute, path: loginRoute })}>
              Back to Login
            </Link>
          </div>
        </div>
      ) : (
        <form className="forgot-password__form" onSubmit={handleSubmit}>
          <div className="form-header">
            <h1>Forgot Password</h1>
            <p>
              Enter your email address. You will receive a link to reset your
              password.
            </p>
          </div>
          <div className="field-type email">
            <label className="field-label" htmlFor="gh-forgot-email">
              Email Address
            </label>
            <div className="field-type__wrap">
              <input
                id="gh-forgot-email"
                className="gh-forgot-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
                autoFocus
              />
            </div>
            {error ? <p className="gh-forgot-error">{error}</p> : null}
          </div>
          <p className="gh-forgot-hint">
            You will only receive an email if this address belongs to an admin
            user.
          </p>
          <div className="forgot-password__form__actions">
            <Button
              buttonStyle="primary"
              size="large"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
            <Link href={formatAdminURL({ adminRoute, path: loginRoute })}>
              Back to Login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

export default ForgotPasswordView;
