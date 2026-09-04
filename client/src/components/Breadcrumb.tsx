import { Link } from "react-router-dom";
import "./Breadcrumb.css";

interface BreadcrumbItem {
  label: string;
  to?: string; // omit on the last item - it's the current page, not a link
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={index} className="breadcrumb-item">
          {item.to ? (
            <Link to={item.to}>{item.label}</Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
          {index < items.length - 1 && (
            <span className="breadcrumb-separator" aria-hidden="true">
              &gt;
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}