import api, { extractErrorMessage } from "./api";
import type { Recipe, RecipeInput, RecipeFilters } from "../types";

export async function getAllRecipes(filters: RecipeFilters = {}): Promise<Recipe[]> {
  try {
    const params: RecipeFilters = {};
    if (filters.title) params.title = filters.title;
    if (filters.tag) params.tag = filters.tag;
    if (filters.ingredient) params.ingredient = filters.ingredient;

    const res = await api.get<Recipe[]>("/api/recipes", { params });
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function getRecipe(id: string): Promise<Recipe> {
  try {
    const res = await api.get<Recipe>(`/api/recipes/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function createRecipe(recipeData: RecipeInput): Promise<Recipe> {
  try {
    const res = await api.post<Recipe>("/api/recipes", recipeData);
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function updateRecipe(id: string, recipeData: RecipeInput): Promise<Recipe> {
  try {
    const res = await api.put<Recipe>(`/api/recipes/${id}`, recipeData);
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function deleteRecipe(id: string): Promise<{ message: string }> {
  try {
    const res = await api.delete<{ message: string }>(`/api/recipes/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}