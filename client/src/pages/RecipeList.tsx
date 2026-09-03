import { useEffect, useState } from "react";
import { getAllRecipes } from "../services/recipeService";
import RecipeCard from "../components/RecipeCard";
import type { Recipe } from "../types";

export default function RecipeList() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecipes();
  }, [title]);

  async function fetchRecipes() {
    try {
      const data = await getAllRecipes({ title: title || undefined });
      setRecipes(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load recipes.");
    }
  }

  return (
    <div className="page container">
      <h1>Recipe List</h1>
      <input
        type="text"
        placeholder="Search recipes"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {error && <div className="form-error-banner">{error}</div>}
      {recipes.length === 0 && !error && <p>No recipes found.</p>}
      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} variant="public" />
        ))}
      </div>
    </div>
  );
}