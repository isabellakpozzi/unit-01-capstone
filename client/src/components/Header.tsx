import { Link } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import "./Header.css";

export default function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="app-header">
      <Link to={isAuthenticated ? "/dashboard" : "/"} className="app-header-logo">
        <Logo />
      </Link>

      <div className="app-header-actions">
        <ThemeToggle />
        <Link
          to={isAuthenticated ? "/profile" : "/login"}
          className="app-header-icon"
          aria-label={isAuthenticated ? "Your profile" : "Log in"}
        >
          <FiUser size={18} />
        </Link>
      </div>
    </header>
  );
}