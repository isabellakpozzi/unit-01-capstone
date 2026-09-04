import { useState, type FormEvent, type KeyboardEvent } from "react";
import Button from "./Button";
import type { Recipe, RecipeInput, Ingredient } from "../types";
import { BsTrash3 } from "react-icons/bs";
import "./RecipeForm.css";

interface RecipeFormProps {
  initialRecipe?: Recipe; // omit for create, pass for edit (prefills the form)
  onSubmit: (data: RecipeInput) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

const emptyIngredient: Ingredient = { name: "", quantity: "" };

export default function RecipeForm({
  initialRecipe,
  onSubmit,
  onCancel,
  submitLabel,
}: RecipeFormProps) {
  const [title, setTitle] = useState(initialRecipe?.title ?? "");
  const [description, setDescription] = useState(initialRecipe?.description ?? "");
  const [image, setImage] = useState(initialRecipe?.image ?? "");

  const [ingredients, setIngredients] = useState<Ingredient[]>(
    initialRecipe?.ingredients?.length ? initialRecipe.ingredients : [emptyIngredient],
  );

  // Instructions are edited as plain description strings; the step number
  // is always derived from array order, never stored/edited directly.
  const [instructionDescriptions, setInstructionDescriptions] = useState<string[]>(
    initialRecipe?.instructions?.length
      ? initialRecipe.instructions
          .slice()
          .sort((a, b) => a.step - b.step)
          .map((i) => i.description)
      : [""],
  );

  const [tags, setTags] = useState<string[]>(initialRecipe?.tags ?? []);
  const [tagInput, setTagInput] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ---- Ingredient row handlers ----
  function updateIngredient(index: number, field: keyof Ingredient, value: string) {
    setIngredients((prev) =>
      prev.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing)),
    );
  }

  function addIngredientRow() {
    setIngredients((prev) => [...prev, { ...emptyIngredient }]);
  }

  function removeIngredientRow(index: number) {
    setIngredients((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  }

  // ---- Instruction row handlers ----
  function updateInstruction(index: number, value: string) {
    setInstructionDescriptions((prev) =>
      prev.map((desc, i) => (i === index ? value : desc)),
    );
  }

  function addInstructionRow() {
    setInstructionDescriptions((prev) => [...prev, ""]);
  }

  function removeInstructionRow(index: number) {
    setInstructionDescriptions((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== index) : prev,
    );
  }

  function moveInstructionRow(index: number, direction: -1 | 1) {
    setInstructionDescriptions((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  // ---- Tag chip handlers ----
  function commitTagInput() {
    const value = tagInput.trim();
    if (value && !tags.includes(value)) {
      setTags((prev) => [...prev, value]);
    }
    setTagInput("");
  }

  function handleTagKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commitTagInput();
    } else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  }

  function removeTag(index: number) {
    setTags((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const cleanedIngredients = ingredients
      .map((ing) => ({ name: ing.name.trim(), quantity: ing.quantity.trim() }))
      .filter((ing) => ing.name);

    const cleanedInstructions = instructionDescriptions
      .map((desc) => desc.trim())
      .filter(Boolean)
      .map((description, index) => ({ step: index + 1, description }));

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (cleanedIngredients.length === 0) {
      setError("Add at least one ingredient.");
      return;
    }
    if (cleanedInstructions.length === 0) {
      setError("Add at least one instruction step.");
      return;
    }

    setIsSubmitting(true);
    try {
      const finalTags = tagInput.trim() && !tags.includes(tagInput.trim())
        ? [...tags, tagInput.trim()]
        : tags;

      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        image: image.trim(),
        ingredients: cleanedIngredients,
        instructions: cleanedInstructions,
        tags: finalTags,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="recipe-form-card">
      <h1 className="recipe-form-heading">
        {initialRecipe ? "Edit Recipe" : "Create a Recipe"}
      </h1>

      {error && <div className="form-error-banner">{error}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="description">Description</label>
          <input
            id="description"
            type="text"
            placeholder="A short description of the dish"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* ---- Ingredients: repeatable quantity + name rows ---- */}
        <div className="form-field">
          <label>Ingredients</label>
          {ingredients.map((ingredient, index) => (
            <div className="repeatable-row" key={index}>
              <input
                type="text"
                placeholder="Qty (e.g. 1 Tbsp)"
                value={ingredient.quantity}
                onChange={(e) => updateIngredient(index, "quantity", e.target.value)}
                className="repeatable-row-quantity"
                aria-label={`Ingredient ${index + 1} quantity`}
              />
              <input
                type="text"
                placeholder="Ingredient (e.g. Olive Oil)"
                value={ingredient.name}
                onChange={(e) => updateIngredient(index, "name", e.target.value)}
                className="repeatable-row-name"
                aria-label={`Ingredient ${index + 1} name`}
              />
              <button
                type="button"
                className="icon-button"
                onClick={() => removeIngredientRow(index)}
                disabled={ingredients.length === 1}
                aria-label={`Remove ingredient ${index + 1}`}
              >
                ✕
              </button>
            </div>
          ))}
          <button type="button" className="add-row-button" onClick={addIngredientRow}>
            + Add Ingredient
          </button>
        </div>

        {/* ---- Instructions: repeatable, auto-numbered, reorderable ---- */}
        <div className="form-field">
          <label>Instructions</label>
          {instructionDescriptions.map((description, index) => (
            <div className="repeatable-row" key={index}>
              <span className="step-number" aria-hidden="true">
                {index + 1}.
              </span>
              <input
                type="text"
                placeholder={`Step ${index + 1}`}
                value={description}
                onChange={(e) => updateInstruction(index, e.target.value)}
                className="repeatable-row-name"
                aria-label={`Instruction step ${index + 1}`}
              />
              <button
                type="button"
                className="icon-button"
                onClick={() => moveInstructionRow(index, -1)}
                disabled={index === 0}
                aria-label={`Move step ${index + 1} up`}
              >
                ↑
              </button>
              <button
                type="button"
                className="icon-button"
                onClick={() => moveInstructionRow(index, 1)}
                disabled={index === instructionDescriptions.length - 1}
                aria-label={`Move step ${index + 1} down`}
              >
                ↓
              </button>
              <button
                type="button"
                className="icon-button"
                onClick={() => removeInstructionRow(index)}
                disabled={instructionDescriptions.length === 1}
                aria-label={`Remove step ${index + 1}`}
              >
                ✕
              </button>
            </div>
          ))}
          <button type="button" className="add-row-button" onClick={addInstructionRow}>
            + Add Step
          </button>
        </div>

        {/* ---- Tags: chip input ---- */}
        <div className="form-field">
          <label htmlFor="tags">Tags</label>
          <div className="tag-input-wrapper">
            {tags.map((tag, index) => (
              <span key={tag} className="tag-pill tag-pill-removable">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  aria-label={`Remove tag ${tag}`}
                >
                  ✕
                </button>
              </span>
            ))}
            <input
              id="tags"
              type="text"
              placeholder={tags.length === 0 ? "Vegan, Gluten Free, Dinner" : "Add another..."}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={commitTagInput}
              className="tag-input"
            />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="image">Image</label>
          <input
            id="image"
            type="url"
            placeholder="https://example.com/your-photo.jpg"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          {image && (
            <div className="recipe-form-image-preview">
              <img src={image} alt="Recipe preview" />
              <button
                type="button"
                className="icon-button"
                onClick={() => setImage("")}
                aria-label="Remove image"
              >
                <BsTrash3 />
              </button>
            </div>
          )}
        </div>

        <div className="auth-actions">
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}