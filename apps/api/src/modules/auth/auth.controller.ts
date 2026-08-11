import { Body, Controller, HttpCode, Post, Req, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { CurrentUser, AuthenticatedUser } from "../../common/current-user.decorator";
import { Public } from "../../common/public.decorator";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./auth.dto";

@ApiTags("Auth") @Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService, private readonly config: ConfigService) {}
  private cookie(res: Response, token: string) { res.cookie("mentor_refresh", token, { httpOnly: true, secure: this.config.get("COOKIE_SECURE"), sameSite: "lax", path: "/api/v1/auth", maxAge: (this.config.get<number>("REFRESH_TOKEN_TTL_DAYS") ?? 30) * 86_400_000 }); }
  private view(result: { user: { id: string; email: string | null; status: string; locale: string; timeZone: string }; tokens: { accessToken: string; expiresIn: number } }) { return { accessToken: result.tokens.accessToken, expiresIn: result.tokens.expiresIn, user: { id: result.user.id, email: result.user.email, status: result.user.status, locale: result.user.locale, timeZone: result.user.timeZone } }; }
  @Public() @Post("register") async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) { const result = await this.auth.register(dto); this.cookie(res, result.tokens.refreshToken); return this.view(result); }
  @Public() @HttpCode(200) @Post("login") async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) { const result = await this.auth.login(dto); this.cookie(res, result.tokens.refreshToken); return this.view(result); }
  @Public() @HttpCode(200) @Post("refresh") async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) { const result = await this.auth.refresh(req.cookies?.mentor_refresh); this.cookie(res, result.tokens.refreshToken); return this.view(result); }
  @HttpCode(204) @Post("logout") async logout(@CurrentUser() user: AuthenticatedUser, @Res({ passthrough: true }) res: Response) { await this.auth.logout(user.sessionId); res.clearCookie("mentor_refresh", { path: "/api/v1/auth" }); }
}
