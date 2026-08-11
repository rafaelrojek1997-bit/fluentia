import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
  @IsEmail() @MaxLength(320) email: string;
  @IsString() @MinLength(12) @MaxLength(128) password: string;
  @IsString() @MaxLength(40) acceptedTermsVersion: string;
  @IsString() @MaxLength(40) acceptedPrivacyVersion: string;
}
export class LoginDto {
  @IsEmail() @MaxLength(320) email: string;
  @IsString() @MaxLength(128) password: string;
}
