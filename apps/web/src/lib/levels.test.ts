import { describe, expect, it } from "vitest";
import { ENGLISH_LEVELS } from "./levels";

describe("English proficiency levels", () => {
  it("covers the complete CEFR progression from A1 to C2", () => {
    expect(ENGLISH_LEVELS.map(level => level.value)).toEqual(["A1", "A2", "B1", "B2", "C1", "C2"]);
    expect(ENGLISH_LEVELS[0].title).toContain("Amator");
    expect(ENGLISH_LEVELS.at(-1)?.title).toContain("Perfekcyjna biegłość");
  });
});
