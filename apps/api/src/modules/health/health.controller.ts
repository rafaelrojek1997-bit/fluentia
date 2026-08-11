import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "../../common/public.decorator";
import { PrismaService } from "../../infrastructure/prisma/prisma.service";
@ApiTags("Health") @Controller("health")
export class HealthController { constructor(private readonly db: PrismaService) {} @Public() @Get("live") live(){return {status:"ok" as const}} @Public() @Get("ready") async ready(){try{await this.db.$queryRaw`SELECT 1`;return {status:"ok" as const,checks:{database:"ok"}}}catch{throw new ServiceUnavailableException({code:"DEPENDENCY_UNAVAILABLE",message:"Database is unavailable"})}} }
