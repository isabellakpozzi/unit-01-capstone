import SpoonfulLogo from "./Spoonfullogo";
import "./Logo.css";

interface LogoProps {
  withTagline?: boolean;
}

export default function Logo({ withTagline = false }: LogoProps) {
  return (
    <div className="logo">
      <SpoonfulLogo className="logo-svg" />
      {withTagline && <p className="logo-tagline">Recipe Manager</p>}
    </div>
  );
}