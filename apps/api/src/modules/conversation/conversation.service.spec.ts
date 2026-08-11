import { describe, expect, it } from "vitest";
import { contentHash, redact } from "./conversation.service";

describe("conversation privacy helpers", () => {
  it("redacts common direct identifiers before conversational context is stored", () => {
    expect(redact("Email me at learner@example.com or +49 151 23456789")).toBe("Email me at [email] or [phone]");
  });

  it("creates stable non-reversible content hashes", () => {
    expect(contentHash("hello")).toHaveLength(64);
    expect(contentHash("hello")).toBe(contentHash("hello"));
    expect(contentHash("hello")).not.toBe(contentHash("Hello"));
  });
});
