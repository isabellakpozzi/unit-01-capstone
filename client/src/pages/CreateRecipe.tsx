import { useNavigate } from "react-router-dom";
import RecipeForm from "../components/RecipeForm";
import { createRecipe } from "../services/recipeService";
import type { RecipeInput } from "../types";

export default function CreateRecipe() {
  const navigate = useNavigate();

  async function handleCreate(data: RecipeInput) {
    await createRecipe(data);
    navigate("/dashboard", { state: { successMessage: "Your recipe was successfully created." } });
  }

  return (
    <div className="page container">
      <RecipeForm
        onSubmit={handleCreate}
        onCancel={() => navigate("/dashboard")}
        submitLabel="Save"
      />
    </div>
  );
}