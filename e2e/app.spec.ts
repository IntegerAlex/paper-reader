import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("loads and shows hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Paper Reader")).toBeVisible();
    await expect(page.getByText("Drop a PDF here")).not.toBeVisible();
  });

  test("shows texture gallery", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Classic Matte")).toBeVisible();
    await expect(page.getByText("Whisper Weave")).toBeVisible();
  });

  test("navigates to read page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /open|read|start/i }).first().click();
    await expect(page).toHaveURL(/\/read/);
  });
});

test.describe("Reader page", () => {
  test("shows upload screen when no PDF loaded", async ({ page }) => {
    await page.goto("/read");
    await expect(page.getByText("Choose PDF")).toBeVisible();
    await expect(page.getByText("Paper Reader")).toBeVisible();
  });

  test("has file input for PDF", async ({ page }) => {
    await page.goto("/read");
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
  });
});
