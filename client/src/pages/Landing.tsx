import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="page container">
      <h1>Spoonful</h1>
      <p>Find and share recipes.</p>
      <Link to="/recipes">Explore Recipes</Link>
      <Link to="/login">Login</Link>
    </div>
  );
}