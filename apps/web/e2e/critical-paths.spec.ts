import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("http://localhost:3001/api/v1/**", async route => {
    const request = route.request(); const path = new URL(request.url()).pathname;
    const json = (body: unknown, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
    if (path.endsWith("/auth/refresh")) return json({ accessToken: "test-token", expiresIn: 900, user: { id: "user-1", email: "learner@example.com", status: "ACTIVE", locale: "pl-PL", timeZone: "Europe/Warsaw" } });
    if (path.endsWith("/me/consents")) return json([{ type: "AI_PROCESSING", granted: true }]);
    if (path.endsWith("/me/dashboard")) return json({ learner: { name: "Rafał", level: "B1", weeklyMinutes: 75 }, stats: { completedSessions: 3, completedToday: 1, correctionCount: 8, xp: 1240, streakDays: 4, longestStreakDays: 9 }, activeConversation: null, latestFeedback: null });
    if (path.endsWith("/scenarios")) return json([{ id: "scenario-1", slug: "business", title: { en: "Business meeting" }, description: { en: "Practise a meeting." }, supportedLevels: ["A1", "A2", "B1", "B2", "C1", "C2"] }]);
    if (path.endsWith("/conversations") && request.method() === "GET") return json({ items: [{ id: "session-1", status: "ACTIVE", targetLevel: "B1" }], pageInfo: { nextCursor: null, hasNextPage: false } });
    if (path.endsWith("/conversations/session-1") && request.method() === "GET") return json({ id: "session-1", status: "ACTIVE", targetLevel: "B1", turns: [] });
    if (path.endsWith("/conversations") && request.method() === "POST") return json({ id: "session-1", status: "CREATED" }, 201);
    if (path.endsWith("/start")) return json({ id: "session-1", status: "ACTIVE" }, 201);
    if (path.endsWith("/turns")) return json({ userTurnId: "turn-user", mentorTurnId: "turn-mentor", moderated: false, answer: { reply: "Great opening — that sounds natural.", nextQuestion: "What would you like to add to the agenda?", encouragement: "Dobry początek.", corrections: [] } }, 201);
    if (path.endsWith("/finish")) return json({ operationId: "session-1", status: "PENDING" }, 202);
    return json({ code: "NOT_FOUND" }, 404);
  });
  await page.goto("/dashboard");
  await page.evaluate(() => localStorage.removeItem("fluentia-demo-v1"));
  await page.reload();
});

test("dashboard exposes the primary learning navigation", async ({ page }) => {
  await expect(page.getByRole("link", { name: "Fluentia" }).first()).toBeVisible();
  await expect(page.locator('a[href="/conversation"]').first()).toBeVisible();
  await expect(page.locator('a[href="/learning-plan"]').first()).toBeVisible();
  await expect(page.locator("main")).toContainText("1240 XP");
});

test("learner can send an English message through the API contract", async ({ page }) => {
  await page.goto("/conversation");
  await expect(page.getByText(/Rozmowa aktywna|Wznowiona sesja/)).toBeVisible();
  const input = page.locator("textarea"); const message = "I'd like to walk you through today's agenda.";
  await input.fill(message); await page.locator(".chat-input .button.primary").click();
  await expect(page.locator(".message.user")).toContainText(message);
  await expect(page.locator(".message.mentor")).toHaveCount(1);
  await expect(page.locator(".message.mentor")).toContainText("natural");
});

test("keyboard submission works and prevents an empty duplicate", async ({ page }) => {
  await page.goto("/conversation"); await expect(page.getByText(/Rozmowa aktywna|Wznowiona sesja/)).toBeVisible();
  const input = page.locator("textarea"); await input.fill("Thanks for joining us today."); await input.press("Enter");
  await expect(page.locator(".message.user")).toHaveCount(1); await expect(input).toHaveValue("");
  await expect(page.locator(".chat-input .button.primary")).toBeDisabled();
});

test("theme preference can be changed accessibly", async ({ page }) => {
  const toggle = page.locator(".top-actions .icon-btn"); await expect(toggle).toBeVisible(); await toggle.click();
  await expect(page.locator("html")).toHaveClass(/dark/);
});