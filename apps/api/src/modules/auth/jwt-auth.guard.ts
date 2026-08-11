import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { IS_PUBLIC } from "../../common/public.decorator";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly jwt: JwtService, private readonly config: ConfigService) {}
  async canActivate(context: ExecutionContext) {
    if (this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [context.getHandler(), context.getClass()])) return true;
    const req = context.switchToHttp().getRequest();
    const [kind, token] = String(req.headers.authorization ?? "").split(" ");
    if (kind !== "Bearer" || !token) throw new UnauthorizedException({ code: "AUTHENTICATION_REQUIRED" });
    try {
      const payload = await this.jwt.verifyAsync(token, { secret: this.config.getOrThrow("JWT_SECRET"), issuer: this.config.get("JWT_ISSUER"), audience: this.config.get("JWT_AUDIENCE") });
      req.user = { id: payload.sub, sessionId: payload.sid, roles: payload.roles ?? ["USER"] };
      return true;
    } catch { throw new UnauthorizedException({ code: "AUTHENTICATION_REQUIRED" }); }
  }
}
