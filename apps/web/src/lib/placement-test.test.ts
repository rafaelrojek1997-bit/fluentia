import { describe, expect, it } from "vitest";
import { answerQuestion, calculateCefr, initialPlacementState, PLACEMENT_QUESTIONS, selectNextQuestion } from "./placement-test";

describe("adaptive placement engine", () => {
  it("starts near B1 and raises difficulty after correct answers", () => {
    const start = initialPlacementState();
    const question = selectNextQuestion(start)!;
    expect(question.difficulty).toBe(2);
    const next = answerQuestion(start, question, question.correct);
    expect(next.ability).toBeGreaterThan(start.ability);
  });

  it("lowers ability after incorrect answers and never repeats questions", () => {
    const start = initialPlacementState();
    const question = selectNextQuestion(start)!;
    const next = answerQuestion(start, question, (question.correct + 1) % question.answers.length);
    expect(next.ability).toBeLessThan(start.ability);
    expect(selectNextQuestion(next)?.id).not.toBe(question.id);
  });

  it("maps the complete ability range to A1-C2", () => {
    expect(calculateCefr({ ...initialPlacementState(), ability: 0 })).toBe("A1");
    expect(calculateCefr({ ...initialPlacementState(), ability: 5 })).toBe("C2");
    expect(new Set(PLACEMENT_QUESTIONS.map(question => question.skill)).size).toBe(4);
  });
});
