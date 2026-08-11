import { ConsentType, PrivacyRequestType } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PrivacyController } from "./privacy.controller";

describe("PrivacyController", () => {
  let db: any;
  let controller: PrivacyController;
  const auth = { id: "user-1", sessionId: "session-1", roles: ["USER"] };

  beforeEach(() => {
    db = {
      consentRecord: { findMany: vi.fn(), create: vi.fn() },
      privacyRequest: { findFirst: vi.fn(), create: vi.fn(), findFirstOrThrow: vi.fn() }
    };
    controller = new PrivacyController(db);
  });

  it("returns only the newest record for each consent type", async () => {
    db.consentRecord.findMany.mockResolvedValue([{ id: "new", type: ConsentType.ANALYTICS }, { id: "old", type: ConsentType.ANALYTICS }, { id: "terms", type: ConsentType.TERMS }]);
    await expect(controller.list(auth)).resolves.toEqual([{ id: "new", type: ConsentType.ANALYTICS }, { id: "terms", type: ConsentType.TERMS }]);
  });

  it("records consent withdrawal with a timestamp", async () => {
    db.consentRecord.create.mockImplementation(async ({ data }: any) => data);
    const result = await controller.set(auth, ConsentType.ANALYTICS, { granted: false, policyVersion: "v1" });
    expect(result.withdrawnAt).toBeInstanceOf(Date);
  });

  it("deduplicates active privacy requests and exposes their status", async () => {
    const existing = { id: "request-1", type: PrivacyRequestType.EXPORT };
    db.privacyRequest.findFirst.mockResolvedValueOnce(existing);
    await expect(controller.request(auth, { type: PrivacyRequestType.EXPORT })).resolves.toBe(existing);
    db.privacyRequest.findFirst.mockResolvedValueOnce(null);
    db.privacyRequest.create.mockResolvedValue({ id: "request-2" });
    await expect(controller.request(auth, { type: PrivacyRequestType.DELETE_ACCOUNT })).resolves.toEqual({ id: "request-2" });
    db.privacyRequest.findFirstOrThrow.mockResolvedValue({ id: "request-2", status: "PENDING" });
    await expect(controller.status(auth, "request-2")).resolves.toMatchObject({ status: "PENDING" });
  });
});
