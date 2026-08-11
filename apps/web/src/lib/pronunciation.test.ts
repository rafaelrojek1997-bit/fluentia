import { describe, expect, it } from "vitest";
import { normalizePronunciation, pronunciationResult } from "./pronunciation";
describe("pronunciation comparison", () => {
  it("ignores punctuation and case", () => {
    expect(normalizePronunciation("Hello, WORLD!")).toBe("hello world");
    expect(pronunciationResult("Hello, world!", "hello world").score).toBe(100);
  });
  it("reports missing words", () => {
    const result = pronunciationResult("Is there anything you would like to add", "is there anything to add");
    expect(result.score).toBeLessThan(100);
    expect(result.missing).toContain("would");
  });
});
