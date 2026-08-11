import { createParamDecorator, ExecutionContext } from "@nestjs/common";
export type AuthenticatedUser = { id: string; sessionId: string; roles: string[] };
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): AuthenticatedUser => ctx.switchToHttp().getRequest().user);
