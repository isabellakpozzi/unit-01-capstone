import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getAllRecipes, deleteRecipe } from "../services/recipeService";
import RecipeCard from "../components/RecipeCard";
import ConfirmDialog from "../components/ConfirmDialog";
import SuccessBanner from "../components/SuccessBanner";
import Button from "../components/Button";
import type { Recipe } from "../types";

interface LocationState {
  successMessage?: string;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    (location.state as LocationState)?.successMessage ?? null,
  );
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  // Clear the success banner once shown so it doesn't reappear on refresh/nav
  useEffect(() => {
    if (successMessage) {
      window.history.replaceState({}, document.title);
    }
  }, [successMessage]);

  async function fetchMyRecipes() {
    try {
      // getAll has no server-side "mine only" filter, so we filter client-side
      // by matching ownerId against the logged-in user's id.
      const all = await getAllRecipes();
      setRecipes(all.filter((r) => r.ownerId === user?._id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load recipes.");
    }
  }

  async function handleConfirmDelete() {
    if (!recipeToDelete) return;
    try {
      await deleteRecipe(recipeToDelete._id);
      setRecipes((prev) => prev.filter((r) => r._id !== recipeToDelete._id));
      setSuccessMessage("Your recipe was successfully deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete recipe.");
    } finally {
      setRecipeToDelete(null);
    }
  }

  return (
    <div className="page container">
      <div className="dashboard-header">
        <p>Welcome back! Manage your recipes or add a new one.</p>
      </div>

      {successMessage && <SuccessBanner message={successMessage} />}
      {error && <div className="form-error-banner">{error}</div>}

      <h1>Your Recipes</h1>

      {recipes.length === 0 ? (
        <p className="recipe-empty-state">Your recipes will show up here</p>
      ) : (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              variant="owner"
              onEdit={() => navigate(`/recipes/${recipe._id}/edit`)}
              onDelete={() => setRecipeToDelete(recipe)}
            />
          ))}
        </div>
      )}

      <div className="dashboard-actions">
        <Button variant="primary" onClick={() => navigate("/recipes/new")}>
          Create Recipe
        </Button>
        <Button variant="secondary" onClick={() => navigate("/recipes")}>
          Browse Recipes
        </Button>
      </div>

      {recipeToDelete && (
        <ConfirmDialog
          title="Delete recipe?"
          message="Do you want to delete this recipe? This action cannot be undone."
          confirmLabel="Yes, Delete Recipe"
          onConfirm={handleConfirmDelete}
          onCancel={() => setRecipeToDelete(null)}
        />
      )}
    </div>
  );
}