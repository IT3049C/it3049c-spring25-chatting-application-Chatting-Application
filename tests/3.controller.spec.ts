import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

test.describe("Controller", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("sending a message adds it to the chat div", async ({ page }) => {
    const testerName = faker.person.firstName();
    const randomMessage = faker.lorem.sentence();

    console.log("Generated Name:", testerName);
    console.log("Generated Message:", randomMessage);

    await page.route("**/messages", async (route) => {
      const request = route.request();

      if (request.method() === "POST") {
        const postData = JSON.parse(request.postData() || "{}");
        console.log("POST Request Data:", postData);
        
        expect(postData).toMatchObject({
          sender: testerName,
          text: randomMessage,
          timestamp: expect.any(String)
        });

        await route.fulfill({ status: 201, body: "{}" });
      } 
      
      if (request.method() === "GET") {
        console.log("Intercepted GET request");
        
        await route.fulfill({
          status: 200,
          contentType: "application/json; charset=utf-8",
          body: JSON.stringify([
            {
              id: 1,
              sender: "Yahya Gilany",
              text: "You made it, my friend!",
              timestamp: new Date().toISOString(),
            },
            {
              sender: testerName,
              text: randomMessage,
              timestamp: new Date().toISOString(),
              id: 2,
            },
          ]),
        });
      }
    });

    const nameField = page.locator("#my-name-input");
    const messageField = page.locator("#my-message-input");
    const sendButton = page.locator("#send-button");

    await nameField.fill(testerName);
    await messageField.fill(randomMessage);
    await sendButton.click();

    console.log("Clicked send button");
    await page.waitForTimeout(1000); // Wait for update


    // Wait for the response to ensure the UI updates
    const response = await page.waitForResponse((res) => 
      res.url().includes("/messages") && res.status() === 200
    );

    console.log("Received Response:", await response.json());

    await page.waitForTimeout(1000); // Ensure UI updates before checking

    const messagesDiv = page.locator("#chat");
    await expect(messagesDiv).toContainText(randomMessage);
  });
});