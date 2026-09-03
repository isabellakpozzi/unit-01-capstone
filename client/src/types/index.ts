export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Instruction {
  step: number;
  description: string;
}

export interface Recipe {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  tags: string[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export type RecipeInput = Omit<
  Recipe,
  "_id" | "ownerId" | "createdAt" | "updatedAt"
>;

export interface RecipeFilters {
  title?: string;
  tag?: string;
  ingredient?: string;
}

export interface AuthUser {
  _id: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Credentials {
  email: string;
  password: string;
}