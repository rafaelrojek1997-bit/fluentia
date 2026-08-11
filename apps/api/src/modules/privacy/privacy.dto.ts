import { ConsentType, PrivacyRequestType } from "@prisma/client";
import { IsBoolean, IsEnum, IsString, MaxLength } from "class-validator";
export class SetConsentDto { @IsBoolean() granted: boolean; @IsString() @MaxLength(40) policyVersion: string; }
export class CreatePrivacyRequestDto { @IsEnum(PrivacyRequestType) type: PrivacyRequestType; }
export { ConsentType };
