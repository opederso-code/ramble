import { test, expect } from "@playwright/test";
test("complete invitation, tour, location, conversation and rerouting flow", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/?screen=entry");
  await page
    .getByRole("button", { name: "Open Kendrick’s tour notification" })
    .click();
  await expect(page.getByText("Your LA tour with Kendrick")).toBeVisible();
  await page
    .getByRole("button", { name: "Grab some food", exact: true })
    .click();
  await expect(
    page.getByText("Fatburger  ·  4 min walk", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Pause narration", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Play narration", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "View Fatburger", exact: true })
    .click();
  await expect(page.getByText("Kendrick’s take")).toBeVisible();
  await page.getByRole("button", { name: "Back to tour", exact: true }).click();
  await expect(
    page.getByText("Crenshaw mural  ·  2 min walk", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Ask Kendrick a question", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Somewhere iconic", exact: true })
    .click();
  await expect(
    page.getByText("Finding a golden hour spot and rerouting…"),
  ).toBeVisible();
  await expect(page.getByText("Route updated", { exact: true })).toBeVisible();
  await expect(page.getByText("On your new route")).toBeVisible();
  expect(errors).toEqual([]);
});
test("saved places persist across reloads and can be removed", async ({
  page,
}) => {
  await page.goto("/?screen=detail");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Saved", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Saved", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Saved", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Save", exact: true }),
  ).toBeVisible();
});
test("guide category filters, empty state, and reset work", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Artists", exact: true }).click();
  await expect(page.getByText("Artists guides")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Select Kendrick Lamar" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Select The Grinch" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Athletes", exact: true }).click();
  await expect(page.getByText("More guides are on the way.")).toBeVisible();
  await page.getByRole("button", { name: "Athletes", exact: true }).click();
  await expect(page.getByText("Suggested Guides")).toBeVisible();
});
test("typed questions and next command work; blank messages do nothing", async ({
  page,
}) => {
  await page.goto("/?screen=conversation");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.getByText("Conversation", { exact: true })).toBeVisible();
  await page
    .getByRole("textbox", { name: "Reply to Kendrick" })
    .fill("What should I eat?");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(
    page.getByText("What should I eat?", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Get the double with chili at Fatburger.", { exact: false }),
  ).toBeVisible();
  await page.getByRole("textbox", { name: "Reply to Kendrick" }).fill("next");
  await page.getByRole("textbox", { name: "Reply to Kendrick" }).press("Enter");
  await expect(
    page.getByText("Crenshaw mural  ·  2 min walk", { exact: true }),
  ).toBeVisible();
});
test("closing a pending conversation cancels its route transition", async ({
  page,
}) => {
  await page.goto("/?screen=conversation");
  await page
    .getByRole("button", { name: "Somewhere iconic", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Close conversation", exact: true })
    .click();
  await page.waitForTimeout(2500);
  await expect(
    page.getByText("Crenshaw mural  ·  2 min walk", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Route updated", { exact: true })).toHaveCount(0);
});
test("all preview screens render locally without broken images or overflow", async ({
  page,
}) => {
  for (const screen of [
    "browse",
    "entry",
    "entry-alt",
    "intro",
    "tour",
    "detail",
    "back",
    "conversation",
    "rerouted",
  ]) {
    await page.goto(`/?screen=${screen}`);
    await expect(page.getByText("9:41", { exact: true })).toBeVisible();
    await page.waitForFunction(() =>
      [...document.images].every(
        (image) => image.complete && image.naturalWidth > 0,
      ),
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    expect(await page.locator("img").count()).toBeGreaterThan(0);
  }
});
test("small viewport preserves composer, detail actions, and navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/?screen=intro");
  await expect(
    page.getByRole("textbox", { name: "Ask Kendrick anything" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Grab some food", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Expand route map", exact: true })
    .click();
  await expect(page.getByText("Your route", { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: "Close overlay", exact: true })
    .click();
  await page
    .getByRole("button", { name: "View Fatburger", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Back to tour", exact: true }),
  ).toBeVisible();
});
