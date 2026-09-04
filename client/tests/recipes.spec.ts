import { test, expect, type Page } from "@playwright/test";

function uniqueEmail() {
  return `e2e-${Date.now()}-${Math.floor(Math.random() * 10000)}@example.com`;
}

const PASSWORD = "testpassword123";

async function signUpAndLogIn(page: Page) {
  const email = uniqueEmail();
  await page.goto("/signup");
  await page.getByLabel("Username").fill(email);
  await page.getByLabel("Password").fill(PASSWORD);
  await page.getByRole("button", { name: "Create Account" }).click();
  await expect(page).toHaveURL("/dashboard");
}

test.describe("Recipe CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await signUpAndLogIn(page);
  });

  test("a logged-in user can create, view, edit, and delete a recipe", async ({ page }) => {
    // ---- Create ----
    await page.getByRole("button", { name: "Create Recipe" }).click();
    await expect(page).toHaveURL("/recipes/new");

    await page.getByLabel("Title").fill("E2E Test Soup");
    await page.getByLabel("Description").fill("A soup made entirely by a robot.");

    await page.getByLabel("Ingredient 1 quantity").fill("1 can");
    await page.getByLabel("Ingredient 1 name").fill("Chickpeas");

    await page.getByLabel("Instruction step 1").fill("Simmer everything for 20 minutes");

    await page.locator("#tags").fill("vegan");
    await page.keyboard.press("Enter");

    await page.getByRole("button", { name: "Save" }).click();

    await expect(page).toHaveURL("/dashboard");
    await expect(page.getByText("Your recipe was successfully created.")).toBeVisible();
    await expect(page.getByText("E2E Test Soup")).toBeVisible();

    // ---- View ----
    await page.getByText("E2E Test Soup").click();
    await expect(page).toHaveURL(/\/recipes\/[a-f0-9]+$/);
    await expect(page.getByRole("heading", { name: "E2E Test Soup" })).toBeVisible();
    await expect(page.getByText("Chickpeas")).toBeVisible();

    // ---- Edit ----
    await page.goBack();
    await expect(page).toHaveURL("/dashboard");
    await page.getByRole("button", { name: "Edit E2E Test Soup" }).click();
    await expect(page.getByLabel("Title")).toHaveValue("E2E Test Soup");

    await page.getByLabel("Title").fill("E2E Test Soup (Updated)");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page).toHaveURL("/dashboard");
    await expect(page.getByText("Your recipe was successfully updated.")).toBeVisible();
    await expect(page.getByText("E2E Test Soup (Updated)")).toBeVisible();

    // ---- Delete ----
    await page.getByRole("button", { name: "Delete E2E Test Soup (Updated)" }).click();
    await expect(page.getByText("Delete recipe?")).toBeVisible();
    await page.getByRole("button", { name: "Yes, Delete Recipe" }).click();

    await expect(page.getByText("Your recipe was successfully deleted.")).toBeVisible();
    await expect(page.getByText("E2E Test Soup (Updated)")).not.toBeVisible();
  });

  test("deleting a recipe can be cancelled", async ({ page }) => {
    await page.getByRole("button", { name: "Create Recipe" }).click();
    await page.getByLabel("Title").fill("Do Not Delete Me");
    await page.getByLabel("Ingredient 1 quantity").fill("1");
    await page.getByLabel("Ingredient 1 name").fill("Salt");
    await page.getByLabel("Instruction step 1").fill("Add salt");
    await page.getByRole("button", { name: "Save" }).click();

    await page.getByRole("button", { name: "Delete Do Not Delete Me" }).click();
    await page.getByRole("button", { name: "Nevermind" }).click();

    await expect(page.getByText("Delete recipe?")).not.toBeVisible();
    await expect(page.getByText("Do Not Delete Me")).toBeVisible();
  });
});

test.describe("Recipe search", () => {
  test("searching filters the public recipe list", async ({ page }) => {
    // Seed a findable recipe as a logged-in user first
    await signUpAndLogIn(page);
    await page.getByRole("button", { name: "Create Recipe" }).click();
    await page.getByLabel("Title").fill("Unique Searchable Pancakes");
    await page.getByLabel("Ingredient 1 quantity").fill("2 cups");
    await page.getByLabel("Ingredient 1 name").fill("Flour");
    await page.getByLabel("Instruction step 1").fill("Mix and cook");
    await page.getByRole("button", { name: "Save" }).click();

    await page.goto("/recipes");
    await page.getByPlaceholder("Search recipes").fill("Searchable Pancakes");

    // Search is debounced, so wait for the result rather than asserting instantly
    await expect(page.getByText("Unique Searchable Pancakes")).toBeVisible();

    await page.getByPlaceholder("Search recipes").fill("NoRecipeShouldMatchThisString");
    await expect(page.getByText(/No recipes found/)).toBeVisible();
  });
});