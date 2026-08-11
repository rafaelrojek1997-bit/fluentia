import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ConsentType, SystemRole, UserStatus } from "@prisma/client";
import { hash, verify } from "argon2";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { PrismaService } from "../../infrastructure/prisma/prisma.service";
import { LoginDto, RegisterDto } from "./auth.dto";

@Injectable()
export class AuthService {
  constructor(private readonly db: PrismaService, private readonly jwt: JwtService, private readonly config: ConfigService) {}
  private normalize(email: string) { return email.trim().toLowerCase().normalize("NFKC"); }
  private tokenHash(token: string) { return createHash("sha256").update(token).digest("hex"); }
  private async issue(userId: string, roles: string[], familyId: string = randomUUID()) {
    const refreshToken = randomBytes(48).toString("base64url");
    const ttlDays = this.config.get<number>("REFRESH_TOKEN_TTL_DAYS") ?? 30;
    const session = await this.db.authSession.create({ data: { userId, refreshTokenHash: this.tokenHash(refreshToken), tokenFamilyId: familyId, expiresAt: new Date(Date.now() + ttlDays * 86_400_000) } });
    const expiresIn = this.config.get<number>("ACCESS_TOKEN_TTL_SECONDS") ?? 900;
    const accessToken = await this.jwt.signAsync({ sub: userId, sid: session.id, roles }, { secret: this.config.getOrThrow("JWT_SECRET"), issuer: this.config.get("JWT_ISSUER"), audience: this.config.get("JWT_AUDIENCE"), expiresIn });
    return { accessToken, refreshToken, expiresIn, sessionId: session.id };
  }
  async register(input: RegisterDto) {
    const emailNormalized = this.normalize(input.email);
    if (await this.db.user.findUnique({ where: { emailNormalized } })) throw new ConflictException({ code: "EMAIL_ALREADY_REGISTERED" });
    const passwordHash = await hash(input.password, { type: 2, memoryCost: 19456, timeCost: 2, parallelism: 1 });
    const user = await this.db.$transaction(async tx => {
      const created = await tx.user.create({ data: { email: input.email.trim(), emailNormalized, passwordHash, status: UserStatus.ACTIVE, emailVerifiedAt: new Date(), roles: { create: { role: SystemRole.USER } }, profile: { create: { nativeLanguage: "pl", explanationLanguage: "pl", weeklyMinutes: 75 } } } });
      await tx.consentRecord.createMany({ data: [{ userId: created.id, type: ConsentType.TERMS, policyVersion: input.acceptedTermsVersion, granted: true, source: "registration" }, { userId: created.id, type: ConsentType.PRIVACY, policyVersion: input.acceptedPrivacyVersion, granted: true, source: "registration" }] });
      return created;
    });
    return { user, tokens: await this.issue(user.id, [SystemRole.USER]) };
  }
  async login(input: LoginDto) {
    const user = await this.db.user.findUnique({ where: { emailNormalized: this.normalize(input.email) }, include: { roles: true } });
    if (!user?.passwordHash || user.status !== UserStatus.ACTIVE || !(await verify(user.passwordHash, input.password))) throw new UnauthorizedException({ code: "INVALID_CREDENTIALS" });
    await this.db.user.update({ where: { id: user.id }, data: { lastSignedInAt: new Date() } });
    return { user, tokens: await this.issue(user.id, user.roles.map(r => r.role)) };
  }
  async refresh(raw: string | undefined) {
    if (!raw) throw new UnauthorizedException({ code: "AUTHENTICATION_REQUIRED" });
    const current = await this.db.authSession.findUnique({ where: { refreshTokenHash: this.tokenHash(raw) }, include: { user: { include: { roles: true } } } });
    if (!current || current.revokedAt || current.expiresAt <= new Date()) throw new UnauthorizedException({ code: "TOKEN_REUSED" });
    await this.db.authSession.update({ where: { id: current.id }, data: { revokedAt: new Date(), revokeReason: "ROTATED" } });
    return { user: current.user, tokens: await this.issue(current.userId, current.user.roles.map(r => r.role), current.tokenFamilyId) };
  }
  async logout(sessionId: string) { await this.db.authSession.updateMany({ where: { id: sessionId, revokedAt: null }, data: { revokedAt: new Date(), revokeReason: "LOGOUT" } }); }
}
