import "./Logo.css";

interface LogoProps {
  withTagline?: boolean;
}

export default function Logo({ withTagline = false }: LogoProps) {
  return (
    <div className="logo">
      <div className="logo-mark">
        <span aria-hidden="true"></span>
        <span className="logo-word">Spoonful</span>
      </div>
      {withTagline && <p className="logo-tagline">Recipe Manager</p>}
    </div>
  );
}