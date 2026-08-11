import { ServiceUnavailableException } from "@nestjs/common";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { OpenAiAdapter } from "./openai.adapter";

const mocks = vi.hoisted(() => ({ responsesCreate: vi.fn(), moderationCreate: vi.fn() }));
vi.mock("openai", () => ({ default: class { responses = { create: mocks.responsesCreate }; moderations = { create: mocks.moderationCreate }; } }));

const validAnswer = { reply: "Welcome to the meeting.", corrections: [], encouragement: "Good start.", nextQuestion: "What is first on the agenda?" };

describe("OpenAiAdapter", () => {
  beforeEach(() => vi.clearAllMocks());
  const config = (key = "api-key-with-more-than-twenty-characters") => ({ get: vi.fn((name: string) => name === "OPENAI_API_KEY" ? key : name === "OPENAI_MODEL" ? "gpt-test" : undefined) } as any);

  it("fails closed without an API key", async () => {
    const adapter = new OpenAiAdapter(config(""));
    await expect(adapter.moderate("hello")).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  it("maps moderation flags and active categories", async () => {
    mocks.moderationCreate.mockResolvedValue({ results: [{ flagged: true, categories: { hate: true, violence: false } }] });
    await expect(new OpenAiAdapter(config()).moderate("unsafe")).resolves.toEqual({ flagged: true, categories: ["hate"] });
  });

  it("rejects an empty moderation response", async () => {
    mocks.moderationCreate.mockResolvedValue({ results: [] });
    await expect(new OpenAiAdapter(config()).moderate("hello")).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  it("generates and validates schema-constrained mentor output", async () => {
    mocks.responsesCreate.mockResolvedValue({ id: "response-1", output_text: JSON.stringify(validAnswer), usage: { input_tokens: 20, output_tokens: 10 } });
    const result = await new OpenAiAdapter(config()).generateMentorAnswer({ level: "B1", scenario: "business", mentorStyle: "supportive", correctionIntensity: 2, history: [], message: "Hello" });
    expect(result.answer).toEqual(validAnswer);
    expect(result.metadata).toMatchObject({ provider: "OPENAI", model: "gpt-test", requestId: "response-1" });
    expect(mocks.responsesCreate).toHaveBeenCalledWith(expect.objectContaining({ store: false, model: "gpt-test" }));
  });

  it("rejects malformed provider output", async () => {
    mocks.responsesCreate.mockResolvedValue({ output_text: "not-json" });
    await expect(new OpenAiAdapter(config()).generateMentorAnswer({ level: "A2", scenario: "hotel", mentorStyle: "supportive", correctionIntensity: 1, history: [], message: "Hi" })).rejects.toBeInstanceOf(ServiceUnavailableException);
  });
});
