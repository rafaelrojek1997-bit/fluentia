import { describe, expect, it } from "vitest";
import { currentWeek } from "./learning-plan.service";
describe("learning plan dates", () => {
  it("returns Monday through Sunday", () => {
    const result = currentWeek(new Date("2026-08-04T18:00:00Z"));
    expect(result.start.toISOString()).toBe("2026-08-03T00:00:00.000Z");
    expect(result.end.toISOString()).toBe("2026-08-09T00:00:00.000Z");
  });
});
