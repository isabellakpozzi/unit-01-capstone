import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRecipe } from "../services/recipeService";
import { useAuth } from "../contexts/AuthContext";
import Breadcrumb from "../components/Breadcrumb";
import type { Recipe } from "../types";
import "./RecipeDetail.css";

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getRecipe(id)
      .then(setRecipe)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load recipe."));
  }, [id]);

  if (error) return <p role="alert" className="page container">{error}</p>;
  if (!recipe) return <p className="page container">Loading...</p>;

  return (
    <div className="page container">
      <Breadcrumb
        items={[
          { label: "Home", to: isAuthenticated ? "/dashboard" : "/" },
          { label: "Recipe List", to: "/recipes" },
          { label: recipe.title },
        ]}
      />

       <div className="recipe-detail-image">
        {recipe.image ? (
          <img src={recipe.image} alt={recipe.title} />
        ) : (
          <div className="recipe-detail-image-placeholder" aria-hidden="true" />
        )}
      </div>

      <h1>{recipe.title}</h1>

      <p>{recipe.description}</p>

      <h2>Ingredients</h2>
      <ul>
        {recipe.ingredients.map((ing, i) => (
          <li key={i}>{ing.quantity} {ing.name}</li>
        ))}
      </ul>

      <h2>Instructions</h2>
      <ol>
        {recipe.instructions
          .sort((a, b) => a.step - b.step)
          .map((inst) => (
            <li key={inst.step}>{inst.description}</li>
          ))}
      </ol>

      <h2>Tags:</h2>
      <div className="recipe-detail-tags">
        {recipe.tags.map((tag) => (
          <span key={tag} className="tag-pill">{tag}</span>
        ))}
      </div>
    </div>
  );
}