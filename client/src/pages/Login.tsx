import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Logo from "../components/Logo";
import Button from "../components/Button";
import "../styles/auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Logo />
        <h1 className="auth-heading">Welcome Back!</h1>
        <p className="auth-subtext">Log in to your account to continue.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!error}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!error}
              required
            />
            {error && <p className="form-field-error">{error}</p>}
            {/* TODO: wire up once a password-reset flow/endpoint exists in the backend */}
            <Link to="#" className="forgot-password-link">
              Forgot Password?
            </Link>
          </div>

          <div className="auth-actions">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/signup")}
            >
              Create an Account
            </Button>
          </div>
        </form>

        <p className="auth-footer-link">
          <Link to="/recipes">Explore Recipes without Logging In</Link>
        </p>
      </div>
    </div>
  );
}