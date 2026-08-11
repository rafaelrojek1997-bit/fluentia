import { MasteryState, ReviewRating } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { normalizeReviewAnswer, reviewSchedule } from "./review.service";

describe("review helpers", () => {
  it("accepts differences in case, spacing and punctuation", () => {
    expect(normalizeReviewAnswer("  I’m learning English! ")).toBe(normalizeReviewAnswer("I'm learning English."));
  });
  it("returns failed answers quickly", () => {
    const now = new Date("2026-08-04T12:00:00Z");
    const result = reviewSchedule(ReviewRating.AGAIN, 3, now);
    expect(result.state).toBe(MasteryState.LAPSED);
    expect(result.dueAt.getTime() - now.getTime()).toBeLessThan(11 * 60 * 1000);
  });
  it("spaces easy answers further than good answers", () => {
    const now = new Date("2026-08-04T12:00:00Z");
    expect(reviewSchedule(ReviewRating.EASY, 1, now).dueAt.getTime()).toBeGreaterThan(reviewSchedule(ReviewRating.GOOD, 1, now).dueAt.getTime());
  });
});
