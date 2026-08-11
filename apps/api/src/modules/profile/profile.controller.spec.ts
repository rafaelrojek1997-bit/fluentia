import { NotFoundException } from "@nestjs/common";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProfileController } from "./profile.controller";

describe("ProfileController", () => {
  let db: any;
  let controller: ProfileController;
  const auth = { id: "user-1", sessionId: "session-1", roles: ["USER"] };

  beforeEach(() => {
    db = { learnerProfile: { findUnique: vi.fn(), upsert: vi.fn() }, learnerCompetency: { findMany: vi.fn() }, learnerMemory: { findMany: vi.fn() } };
    controller = new ProfileController(db, { decrypt: vi.fn(() => "decrypted goal") } as any);
  });

  it("returns and updates only the authenticated learner profile", async () => {
    db.learnerProfile.findUnique.mockResolvedValue({ userId: auth.id, weeklyMinutes: 90 });
    await expect(controller.get(auth)).resolves.toMatchObject({ weeklyMinutes: 90 });
    db.learnerProfile.upsert.mockResolvedValue({ userId: auth.id, weeklyMinutes: 120 });
    await expect(controller.update(auth, { nativeLanguage: "pl", explanationLanguage: "pl", weeklyMinutes: 120, mentorStyle: "supportive", correctionIntensity: 2, interests: ["business"] })).resolves.toMatchObject({ weeklyMinutes: 120 });
    expect(db.learnerProfile.upsert).toHaveBeenCalledWith(expect.objectContaining({ where: { userId: auth.id } }));
  });

  it("returns not found when the learner profile does not exist", async () => {
    db.learnerProfile.findUnique.mockResolvedValue(null);
    await expect(controller.get(auth)).rejects.toBeInstanceOf(NotFoundException);
  });

  it("lists competencies and decrypts memory values", async () => {
    db.learnerCompetency.findMany.mockResolvedValue([{ skill: "SPEAKING" }]);
    await expect(controller.competencies(auth)).resolves.toHaveLength(1);
    db.learnerMemory.findMany.mockResolvedValue([{ id: "m1", valueEncrypted: Uint8Array.of(1), kind: "GOAL" }]);
    await expect(controller.memories(auth)).resolves.toEqual([{ id: "m1", kind: "GOAL", value: "decrypted goal" }]);
  });
});
