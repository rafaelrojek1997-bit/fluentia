import { validate } from "class-validator";
import { describe, expect, it } from "vitest";
import { LoginDto, RegisterDto } from "./auth.dto";

describe("auth DTO validation", () => {
  it("accepts a complete registration request", async () => {
    const dto = Object.assign(new RegisterDto(), {
      email: "learner@example.com",
      password: "correct horse battery staple",
      acceptedTermsVersion: "2026-08",
      acceptedPrivacyVersion: "2026-08"
    });
    expect(await validate(dto)).toHaveLength(0);
  });

  it("rejects weak passwords and malformed email addresses", async () => {
    const dto = Object.assign(new RegisterDto(), {
      email: "wrong",
      password: "weak",
      acceptedTermsVersion: "2026-08",
      acceptedPrivacyVersion: "2026-08"
    });
    const properties = (await validate(dto)).map(error => error.property);
    expect(properties).toContain("email");
    expect(properties).toContain("password");
  });

  it("rejects malformed login input", async () => {
    const dto = Object.assign(new LoginDto(), { email: "wrong", password: "secret" });
    expect((await validate(dto)).map(error => error.property)).toContain("email");
  });
});
