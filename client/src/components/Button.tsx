import type { ButtonHTMLAttributes } from "react";
import "./Button.css";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

/**
 * variant="primary"   -> solid green (Login, Create Account, Save, Create Recipe)
 * variant="secondary" -> outlined green (Cancel, "Explore Recipes without Logging In")
 * variant="danger"    -> solid red (Yes, Delete Recipe / Yes, Delete Account)
 */
export default function Button({
  variant = "primary",
  className = "",
  ...rest
}: ButtonProps) {
  return <button className={`btn btn-${variant} ${className}`} {...rest} />;
}