import { useEffect, useState } from "react";
import { getAllRecipes } from "../services/recipeService";
import { useAuth } from "../contexts/AuthContext";
import RecipeCard from "../components/RecipeCard";
import Breadcrumb from "../components/Breadcrumb";
import type { Recipe } from "../types";

const SEARCH_DEBOUNCE_MS = 350;

export default function RecipeList() {
  const { isAuthenticated } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchRecipes(searchInput);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  async function fetchRecipes(title: string) {
    setIsLoading(true);
    try {
      const data = await getAllRecipes({ title: title || undefined });
      setRecipes(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load recipes.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="page container">
      <Breadcrumb
        items={[
          { label: "Home", to: isAuthenticated ? "/dashboard" : "/" },
          { label: "Recipe List" },
        ]}
      />
      <h1>Recipe List</h1>
      <input
        type="text"
        placeholder="Search recipes"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        aria-label="Search recipes by title"
      />

      {error && <div className="form-error-banner">{error}</div>}

      {isLoading ? (
        <p className="recipe-list-status">Loading recipes...</p>
      ) : recipes.length === 0 ? (
        <p className="recipe-list-status">
          {searchInput
            ? `No recipes found for "${searchInput}".`
            : "No recipes found."}
        </p>
      ) : (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} variant="public" />
          ))}
        </div>
      )}
    </div>
  );
}