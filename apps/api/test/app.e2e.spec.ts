import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { AppModule } from "../src/app.module";
import { configureApplication } from "../src/configure-application";
import { PrismaService } from "../src/infrastructure/prisma/prisma.service";
import { AuthService } from "../src/modules/auth/auth.service";

describe("API application (e2e)", () => {
  let app: INestApplication;
  const auth = {
    register: vi.fn(async () => ({
      user: { id: "5b2f24c9-8bb0-46ee-8eb6-1831e713a92f", email: "learner@example.com", status: "ACTIVE", locale: "pl-PL", timeZone: "Europe/Warsaw" },
      tokens: { accessToken: "signed-access-token", refreshToken: "rotating-refresh-token", expiresIn: 900 }
    })),
    login: vi.fn(), refresh: vi.fn(), logout: vi.fn()
  };

  beforeAll(async () => {
    process.env.DATABASE_URL ??= "postgresql://mentor:mentor@localhost:5432/mentor";
    process.env.JWT_SECRET ??= "test-secret-with-at-least-thirty-two-characters";
    process.env.WEB_ORIGIN ??= "http://localhost:3000";
    const module = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(PrismaService).useValue({ $queryRaw: vi.fn().mockResolvedValue([{ ok: 1 }]) })
      .overrideProvider(AuthService).useValue(auth)
      .compile();
    app = module.createNestApplication();
    configureApplication(app);
    await app.init();
  });

  afterAll(async () => { if (app) await app.close(); });

  it("exposes liveness with production security headers", async () => {
    const response = await request(app.getHttpServer()).get("/api/v1/health/live").expect(200);
    expect(response.body).toEqual({ status: "ok" });
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    expect(response.headers["x-frame-options"]).toBe("SAMEORIGIN");
  });

  it("reports dependency readiness", async () => {
    await request(app.getHttpServer()).get("/api/v1/health/ready").expect(200, { status: "ok", checks: { database: "ok" } });
  });

  it("rejects protected resources without a bearer token", async () => {
    const response = await request(app.getHttpServer()).get("/api/v1/me").expect(401);
    expect(response.type).toBe("application/problem+json");
    expect(response.body.code).toBe("AUTHENTICATION_REQUIRED");
  });

  it("rejects unknown registration fields and malformed input", async () => {
    const response = await request(app.getHttpServer()).post("/api/v1/auth/register").send({ email: "wrong", password: "short", admin: true }).expect(400);
    expect(response.body.code).toBe("REQUEST_FAILED");
    expect(auth.register).not.toHaveBeenCalled();
  });

  it("sets a scoped HttpOnly refresh cookie during registration", async () => {
    const response = await request(app.getHttpServer()).post("/api/v1/auth/register").send({
      email: "learner@example.com", password: "correct horse battery staple",
      acceptedTermsVersion: "2026-08", acceptedPrivacyVersion: "2026-08"
    }).expect(201);
    expect(response.body.accessToken).toBe("signed-access-token");
    expect(response.headers["set-cookie"][0]).toContain("mentor_refresh=rotating-refresh-token");
    expect(response.headers["set-cookie"][0]).toContain("HttpOnly");
    expect(response.headers["set-cookie"][0]).toContain("Path=/api/v1/auth");
  });

  it("returns the caller's correlation identifier in problem details", async () => {
    const response = await request(app.getHttpServer()).get("/api/v1/me").set("x-correlation-id", "e2e-correlation-42").expect(401);
    expect(response.body.correlationId).toBe("e2e-correlation-42");
  });
});
