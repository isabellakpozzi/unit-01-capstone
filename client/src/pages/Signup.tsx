import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Logo from "../components/Logo";
import Button from "../components/Button";
import "../styles/auth.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export default function Signup() {
  // The field is labeled "Username" in the design, but it actually collects
  // an email address (the backend User model only has email + password).
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  function validate(): boolean {
    let valid = true;

    if (!EMAIL_REGEX.test(email)) {
      setEmailError("Please use a valid email in your username.");
      valid = false;
    } else {
      setEmailError(null);
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(
        `Please use a password that is at least ${MIN_PASSWORD_LENGTH} characters.`,
      );
      valid = false;
    } else {
      setPasswordError(null);
    }

    return valid;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await signup({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Logo />
        <h1 className="auth-heading">Create an Account</h1>

        {serverError && <div className="form-error-banner">{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="email"
              placeholder="Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!emailError}
              required
            />
            {emailError && <p className="form-field-error">{emailError}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!passwordError}
              required
            />
            {passwordError && <p className="form-field-error">{passwordError}</p>}
          </div>

          <div className="auth-actions">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/login")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}