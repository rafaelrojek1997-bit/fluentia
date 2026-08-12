import { z } from "zod";

const optionalSecret = z.preprocess(value => value === "" ? undefined : value, z.string().min(20).optional());

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_ISSUER: z.string().default("ai-english-mentor"),
  JWT_AUDIENCE: z.string().default("mentor-clients"),
  ACCESS_TOKEN_TTL_SECONDS: z.coerce.number().int().min(300).max(3600).default(900),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().min(1).max(90).default(30),
  WEB_ORIGIN: z.string().url().default("http://localhost:3000"),
  COOKIE_SECURE: z.enum(["true", "false"]).default("false").transform(v => v === "true"),
  OPENAI_API_KEY: optionalSecret,
  OPENAI_MODEL: z.string().min(1).default("gpt-5-mini"),
  DATA_ENCRYPTION_KEY: optionalSecret
});

export type Environment = z.infer<typeof schema>;
export const validateEnvironment = (values: Record<string, unknown>) => schema.parse(values);
