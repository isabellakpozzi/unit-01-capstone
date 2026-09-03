import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RecipeForm from "../components/RecipeForm";
import { getRecipe, updateRecipe } from "../services/recipeService";
import type { Recipe, RecipeInput } from "../types";

export default function EditRecipe() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    getRecipe(id)
      .then(setRecipe)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load recipe."));
  }, [id]);

  async function handleUpdate(data: RecipeInput) {
    if (!id) return;
    await updateRecipe(id, data);
    navigate("/dashboard", { state: { successMessage: "Your recipe was successfully updated." } });
  }

  if (error) return <p role="alert" className="page container">{error}</p>;
  if (!recipe) return <p className="page container">Loading...</p>;

  return (
    <div className="page container">
      <RecipeForm
        initialRecipe={recipe}
        onSubmit={handleUpdate}
        onCancel={() => navigate("/dashboard")}
        submitLabel="Save"
      />
    </div>
  );
}