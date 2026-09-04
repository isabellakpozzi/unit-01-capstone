import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";
import Breadcrumb from "../components/Breadcrumb";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="page container">
      <Breadcrumb items={[{ label: "Home", to: "/dashboard" }, { label: "Your Profile" }]} />
      <h1>Your Profile</h1>

      <div className="form-field">
        <label>Email</label>
        <input type="email" value={user?.email ?? ""} disabled />
      </div>

      <div className="dashboard-actions">
        <Button variant="secondary" onClick={handleLogout}>
          Log Out
        </Button>
      </div>

      <p className="recipe-list-status">
        Editing your profile and deleting your account aren't available yet —
        the API doesn't currently have endpoints for updating or deleting a
        user, only signup and login.
      </p>
    </div>
  );
}