import { test, expect } from "@playwright/test";

function uniqueEmail() {
  return `e2e-${Date.now()}-${Math.floor(Math.random() * 10000)}@example.com`;
}

const PASSWORD = "testpassword123";

test.describe("Authentication", () => {
  test("a new user can sign up and lands on the dashboard", async ({ page }) => {
    const email = uniqueEmail();

    await page.goto("/signup");
    await page.getByLabel("Username").fill(email);
    await page.getByLabel("Password").fill(PASSWORD);
    await page.getByRole("button", { name: "Create Account" }).click();

    await expect(page).toHaveURL("/dashboard");
    await expect(page.getByText("Welcome back!")).toBeVisible();
  });

  test("shows a field-level error for bad login credentials", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("nobody@example.com");
    await page.getByLabel("Password").fill("wrongpassword");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("bad credentials")).toBeVisible();
    // Field-level red border, not a top banner - matches the app's design
    await expect(page.getByLabel("Email")).toHaveAttribute("aria-invalid", "true");
  });

  test("a logged-in user can log in and log out", async ({ page }) => {
    const email = uniqueEmail();

    // Sign up first so there's a real account to log into
    await page.goto("/signup");
    await page.getByLabel("Username").fill(email);
    await page.getByLabel("Password").fill(PASSWORD);
    await page.getByRole("button", { name: "Create Account" }).click();
    await expect(page).toHaveURL("/dashboard");

    // Log out via the Profile page
    await page.getByRole("link", { name: "Your profile" }).click();
    await expect(page).toHaveURL("/profile");
    await page.getByRole("button", { name: "Log Out" }).click();
    await expect(page).toHaveURL("/login");

    // Log back in with the same credentials
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(PASSWORD);
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page).toHaveURL("/dashboard");
  });

  test("redirects an unauthenticated user away from protected routes", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/login");
  });

  test("guests can browse recipes without logging in", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Explore Recipes" }).click();
    await expect(page).toHaveURL("/recipes");
  });
});