import { describe, expect, it } from "vitest";
import { startOfUtcDay } from "./rewards.service";
describe("rewards dates",()=>{it("normalizes UTC day",()=>expect(startOfUtcDay(new Date("2026-08-05T18:30:00Z")).toISOString()).toBe("2026-08-05T00:00:00.000Z"));});
