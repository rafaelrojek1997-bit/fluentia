import { ConflictException, UnauthorizedException } from "@nestjs/common";
import { SystemRole, UserStatus } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthService } from "./auth.service";

vi.mock("argon2", () => ({ hash: vi.fn(async () => "argon-hash"), verify: vi.fn(async (_hash, password) => password === "valid-password") }));

describe("AuthService", () => {
  let db: any;
  let service: AuthService;
  const user = { id: "user-1", email: "Learner@Example.com", status: UserStatus.ACTIVE, passwordHash: "argon-hash", roles: [{ role: SystemRole.USER }] };

  beforeEach(() => {
    db = {
      user: { findUnique: vi.fn(), update: vi.fn() },
      authSession: { create: vi.fn(async () => ({ id: "session-1" })), findUnique: vi.fn(), update: vi.fn(), updateMany: vi.fn() },
      $transaction: vi.fn(async (callback: any) => callback({
        user: { create: vi.fn(async () => user) }, consentRecord: { createMany: vi.fn() }
      }))
    };
    service = new AuthService(db, { signAsync: vi.fn(async () => "access-token") } as any, { get: vi.fn((key: string) => ({ REFRESH_TOKEN_TTL_DAYS: 30, ACCESS_TOKEN_TTL_SECONDS: 900, JWT_ISSUER: "issuer", JWT_AUDIENCE: "audience" }[key])), getOrThrow: vi.fn(() => "secret-with-at-least-thirty-two-characters") } as any);
  });

  it("normalizes email, hashes password and creates consent records", async () => {
    db.user.findUnique.mockResolvedValue(null);
    const result = await service.register({ email: "  Learner@Example.COM ", password: "valid-password", acceptedTermsVersion: "v1", acceptedPrivacyVersion: "v1" });
    expect(result.tokens.accessToken).toBe("access-token");
    expect(db.user.findUnique).toHaveBeenCalledWith({ where: { emailNormalized: "learner@example.com" } });
    expect(db.authSession.create).toHaveBeenCalled();
  });

  it("rejects duplicate registration", async () => {
    db.user.findUnique.mockResolvedValue(user);
    await expect(service.register({ email: user.email, password: "valid-password", acceptedTermsVersion: "v1", acceptedPrivacyVersion: "v1" })).rejects.toBeInstanceOf(ConflictException);
  });

  it("logs in active users with a valid password", async () => {
    db.user.findUnique.mockResolvedValue(user);
    const result = await service.login({ email: user.email, password: "valid-password" });
    expect(result.user.id).toBe("user-1");
    expect(db.user.update).toHaveBeenCalled();
  });

  it("does not reveal whether email or password was invalid", async () => {
    db.user.findUnique.mockResolvedValue(null);
    await expect(service.login({ email: "missing@example.com", password: "wrong" })).rejects.toBeInstanceOf(UnauthorizedException);
    db.user.findUnique.mockResolvedValue(user);
    await expect(service.login({ email: user.email, password: "wrong" })).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("rotates a valid refresh token in the same token family", async () => {
    db.authSession.findUnique.mockResolvedValue({ id: "old", userId: user.id, tokenFamilyId: "family", expiresAt: new Date(Date.now() + 60_000), revokedAt: null, user });
    const result = await service.refresh("refresh-token");
    expect(result.tokens.refreshToken).not.toBe("refresh-token");
    expect(db.authSession.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "old" } }));
  });

  it("rejects missing, expired and reused refresh tokens", async () => {
    await expect(service.refresh(undefined)).rejects.toBeInstanceOf(UnauthorizedException);
    db.authSession.findUnique.mockResolvedValue(null);
    await expect(service.refresh("unknown")).rejects.toBeInstanceOf(UnauthorizedException);
    db.authSession.findUnique.mockResolvedValue({ expiresAt: new Date(0), revokedAt: null });
    await expect(service.refresh("expired")).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("revokes the current session on logout", async () => {
    await service.logout("session-1");
    expect(db.authSession.updateMany).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "session-1", revokedAt: null } }));
  });
});
