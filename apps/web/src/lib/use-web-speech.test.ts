import { describe, expect, it } from "vitest";
import { cleanSpeechText, formatSpeechTranscript, splitSpeechSegments } from "./use-web-speech";

describe("cleanSpeechText", () => {
  it("removes markdown markers and normalizes whitespace before speech synthesis", () => {
    expect(cleanSpeechText("**Hello**\n\n_My name is Anna._")).toBe("Hello My name is Anna.");
  });

  it("switches between English and Polish voices for bilingual feedback", () => {
    expect(splitSpeechSegments("Good morning.\n\nPo polsku: Dzień dobry.\n\nWhat is your name? — Jak masz na imię?")).toEqual([
      { text: "Good morning.", lang: "en-GB" },
      { text: "Po polsku: Dzień dobry.", lang: "pl-PL" },
      { text: "What is your name?", lang: "en-GB" },
      { text: "Jak masz na imię?", lang: "pl-PL" }
    ]);  });

  it("capitalizes dictated text and adds sentence punctuation", () => {
    expect(formatSpeechTranscript("i would like to start now")).toBe("I would like to start now.");
    expect(formatSpeechTranscript("are you ready?")).toBe("Are you ready?");
  });});
