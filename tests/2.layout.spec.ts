import { test, expect } from "@playwright/test";

test.describe("Layout", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should have a jumbotron div with an h1", async ({ page }) => {
    const jumbotron = page.locator(".jumbotron h1");
    await expect(jumbotron).toContainText(/3049C Chat/);
    await expect(jumbotron).toHaveClass(/display-4/);
  });

  test("jumbotron includes an input field for the name", async ({ page }) => {
    const input = page.locator(".jumbotron input#my-name-input");
    await expect(input).toHaveAttribute("type", "text");
    await expect(input).toHaveClass(/form-control/);
  });

  test("page has a field for the message", async ({ page }) => {
    const messageField = page.locator("#my-message-input");
    await expect(messageField).toHaveAttribute("type", "text");
    await expect(messageField).toHaveClass(/form-control/);
  });
});
