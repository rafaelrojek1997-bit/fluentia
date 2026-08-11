import { describe, expect, it } from "vitest";
import { validateEnvironment } from "./environment";

const valid = {
  DATABASE_URL: "postgresql://mentor:mentor@localhost:5432/mentor",
  JWT_SECRET: "a-secure-development-secret-at-least-32-characters"
};

describe("validateEnvironment", () => {
  it("applies safe local defaults", () => {
    const environment = validateEnvironment(valid);
    expect(environment.PORT).toBe(3001);
    expect(environment.ACCESS_TOKEN_TTL_SECONDS).toBe(900);
    expect(environment.COOKIE_SECURE).toBe(false);
  });

  it("rejects a weak JWT secret", () => {
    expect(() => validateEnvironment({ ...valid, JWT_SECRET: "short" })).toThrow();
  });

  it("rejects an invalid database URL", () => {
    expect(() => validateEnvironment({ ...valid, DATABASE_URL: "not-a-url" })).toThrow();
  });
});
