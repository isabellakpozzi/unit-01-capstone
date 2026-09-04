import { Link } from "react-router-dom";
import type { Recipe } from "../types";
import { BsPencil, BsTrash3 } from "react-icons/bs";
import "./RecipeCard.css";

interface RecipeCardProps {
  recipe: Recipe;
  variant: "owner" | "public";
  onEdit?: () => void;
  onDelete?: () => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "2-digit",
  });
}

export default function RecipeCard({ recipe, variant, onEdit, onDelete }: RecipeCardProps) {
  return (
    <div className="recipe-card">
      <div className="recipe-card-image">
        {recipe.image ? (
          <img src={recipe.image} alt={recipe.title} />
        ) : (
          <div className="recipe-card-image-placeholder" aria-hidden="true" />
        )}
      </div>

      <div className="recipe-card-body">
        <h2 className="recipe-card-title">{recipe.title}</h2>
        <p className="recipe-card-date">Created on {formatDate(recipe.createdAt)}</p>

        {recipe.tags.length > 0 && (
          <div className="recipe-card-tags">
            {recipe.tags.map((tag) => (
              <span key={tag} className="tag-pill">
                {tag}
              </span>
            ))}
          </div>
        )}

        {variant === "public" && (
          <Link to={`/recipes/${recipe._id}`} className="recipe-card-view-link">
            View Recipe
          </Link>
        )}

        {variant === "owner" && (
          <div className="recipe-card-owner-actions">
            <button
              type="button"
              onClick={onDelete}
              aria-label={`Delete ${recipe.title}`}
              className="icon-button"
            >
              <BsTrash3 />
            </button>
            <button
              type="button"
              onClick={onEdit}
              aria-label={`Edit ${recipe.title}`}
              className="icon-button"
            >
              <BsPencil />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}